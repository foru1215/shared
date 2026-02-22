"""Main Discord Bot client for LocalCrow.

Extends ``discord.Client`` with an application-command tree, LLM streaming,
tool-call execution with a confirm flow, attachment handling, lockdown
persistence, and full audit logging.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import tempfile
import time
from pathlib import Path
from typing import Any

import discord
from discord import app_commands

from .embeds import (
    command_preview_embed,
    command_result_embed,
    error_embed,
    llm_response_embed,
    lockdown_embed,
)
from .views import ConfirmView

from ..security.auth import AuthManager
from ..security.audit import AuditLogger
from ..security.rate_limiter import RateLimiter
from ..llm.ollama_client import OllamaClient
from ..llm.context import ConversationContext
from ..llm.prompts import PromptManager
from ..agent.executor import CommandExecutor
from ..agent.scheduler import ScheduleManager
from ..agent.watcher import FileWatcher
from ..agent.screenshot import ScreenshotCapture

logger = logging.getLogger("localcrow.bot.client")

# Path for persistent lockdown state.
_DATA_DIR = Path(__file__).resolve().parent.parent / "data"
_LOCKDOWN_FILE = _DATA_DIR / "lockdown.json"

# Streaming cadence constants.
_STREAM_EDIT_INTERVAL_SECS: float = 0.5
_STREAM_EDIT_TOKEN_THRESHOLD: int = 50

# Image file extensions that cannot be read as text.
_IMAGE_EXTENSIONS = frozenset({
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".tiff", ".ico", ".svg",
})


class LocalCrowBot(discord.Client):
    """Core Discord client for the LocalCrow agent system.

    Parameters
    ----------
    intents:
        Discord gateway intents.
    auth:
        Manages user/channel whitelisting.
    audit:
        Audit-trail logger.
    rate_limiter:
        Per-user rate limiter.
    ollama:
        Async Ollama chat client.
    context:
        Conversation-history manager (per-user).
    prompts:
        System-prompt preset manager.
    executor:
        Shell-command executor with sandbox & classification.
    scheduler:
        APScheduler-based cron job manager.
    watcher:
        File-system change watcher.
    screenshot:
        Desktop screenshot capture utility.
    lockdown_passphrase:
        Passphrase required to unlock the bot from lockdown.
    default_model:
        Default Ollama model name.
    default_mode:
        Default prompt mode (e.g. "planning", "fast").
    """

    def __init__(
        self,
        *,
        intents: discord.Intents,
        auth: AuthManager,
        audit: AuditLogger,
        rate_limiter: RateLimiter,
        ollama: OllamaClient,
        prompts: PromptManager,
        context: ConversationContext,
        executor: CommandExecutor,
        scheduler: ScheduleManager,
        watcher: FileWatcher,
        screenshot: ScreenshotCapture,
        lockdown_passphrase: str,
        default_model: str,
        default_mode: str,
    ) -> None:
        super().__init__(intents=intents)

        # Sub-system references -------------------------------------------
        self.auth = auth
        self.audit = audit
        self.rate_limiter = rate_limiter
        self.ollama = ollama
        self.context = context
        self.prompts = prompts
        self.executor = executor
        self.scheduler = scheduler
        self.watcher = watcher
        self.screenshot = screenshot
        self.lockdown_passphrase = lockdown_passphrase

        # Command tree (application / slash commands) ----------------------
        self.tree = app_commands.CommandTree(self)

        # Internal state ---------------------------------------------------
        self._current_model: str = default_model
        self._current_mode: str = default_mode
        self._start_time: float = time.monotonic()
        self._cancel_event: asyncio.Event = asyncio.Event()
        self._lockdown: bool = self._load_lockdown()

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def current_model(self) -> str:
        return self._current_model

    @current_model.setter
    def current_model(self, value: str) -> None:
        self._current_model = value

    @property
    def current_mode(self) -> str:
        return self._current_mode

    @current_mode.setter
    def current_mode(self, value: str) -> None:
        self._current_mode = value

    @property
    def start_time(self) -> float:
        """Monotonic timestamp of when the bot started."""
        return self._start_time

    @property
    def is_locked_down(self) -> bool:
        return self._lockdown

    # ------------------------------------------------------------------
    # Lockdown persistence
    # ------------------------------------------------------------------

    def _load_lockdown(self) -> bool:
        """Load lockdown state from disk."""
        try:
            if _LOCKDOWN_FILE.exists():
                data = json.loads(_LOCKDOWN_FILE.read_text(encoding="utf-8"))
                return bool(data.get("lockdown", False))
        except Exception:
            logger.exception("Failed to read lockdown state")
        return False

    def set_lockdown(self, active: bool) -> None:
        """Persist lockdown state to disk and update in-memory flag."""
        self._lockdown = active
        try:
            _DATA_DIR.mkdir(parents=True, exist_ok=True)
            _LOCKDOWN_FILE.write_text(
                json.dumps({"lockdown": active}),
                encoding="utf-8",
            )
        except Exception:
            logger.exception("Failed to persist lockdown state")

    # ------------------------------------------------------------------
    # Cancel support (for /stop)
    # ------------------------------------------------------------------

    def request_cancel(self) -> None:
        self._cancel_event.set()

    def reset_cancel(self) -> None:
        self._cancel_event.clear()

    @property
    def cancel_requested(self) -> bool:
        return self._cancel_event.is_set()

    # ------------------------------------------------------------------
    # Lifecycle events
    # ------------------------------------------------------------------

    async def setup_hook(self) -> None:
        """Called once after login, before the bot starts receiving events."""
        # Import commands cog here to avoid circular imports.
        from .commands import LocalCrowCommands
        cog = LocalCrowCommands(self)
        self.tree.add_command(cog)  # type: ignore[arg-type]
        logger.info("Command cog registered.")

    async def on_ready(self) -> None:
        assert self.user is not None
        logger.info("Logged in as %s (ID: %s)", self.user, self.user.id)

        # Sync slash commands with Discord.
        try:
            synced = await self.tree.sync()
            logger.info("Synced %d application commands.", len(synced))
        except Exception:
            logger.exception("Failed to sync commands.")

        await self.change_presence(
            activity=discord.Activity(
                type=discord.ActivityType.watching,
                name="your PC",
            ),
        )
        self._start_time = time.monotonic()
        self.audit.log(
            user_id="system",
            action="bot_ready",
            result=f"Logged in as {self.user}",
        )

    # ------------------------------------------------------------------
    # Message handler
    # ------------------------------------------------------------------

    async def on_message(self, message: discord.Message) -> None:  # noqa: C901
        # 1. Ignore bot messages.
        if message.author.bot:
            return

        # 2. Auth check (user whitelist + channel restriction).
        if not self.auth.check_access(
            user_id=message.author.id,
            channel_id=message.channel.id,
        ):
            return  # silently ignore

        # 3. Rate-limit check.
        allowed, reason = self.rate_limiter.check(message.author.id, "llm")
        if not allowed:
            await message.channel.send(
                embed=error_embed("Rate Limited", reason),
            )
            return

        # 4. Lockdown check.
        if self._lockdown:
            await message.channel.send(embed=lockdown_embed())
            return

        # 5. Process attachments (download to temp, add content to message).
        attachment_texts: list[str] = []
        if message.attachments:
            attachment_texts = await self._handle_attachments(message)

        # 6-9. Forward to LLM, stream response, handle tool calls.
        try:
            await self._process_llm(message, attachment_texts)
        except Exception as exc:
            logger.exception("Unhandled error in LLM pipeline")
            await message.channel.send(
                embed=error_embed("Something went wrong", str(exc)),
            )

        # 10. Audit log.
        self.audit.log(
            user_id=str(message.author.id),
            action="message",
            result=f"#{message.channel}: {message.content[:200]}",
        )

    # ------------------------------------------------------------------
    # Attachment handling
    # ------------------------------------------------------------------

    async def _handle_attachments(self, message: discord.Message) -> list[str]:
        """Download attachments to a temp directory and return text content.

        Text files are read and their content is returned. Image files
        are noted by filename only. Other binary files are noted by name.
        """
        texts: list[str] = []
        for attachment in message.attachments:
            try:
                tmp_dir = tempfile.mkdtemp(prefix="localcrow_")
                dest = os.path.join(tmp_dir, attachment.filename)
                await attachment.save(dest)

                ext = Path(dest).suffix.lower()
                if ext in _IMAGE_EXTENSIONS:
                    # Cannot read image content as text; note the filename.
                    texts.append(f"[Image attachment: {attachment.filename}]")
                else:
                    # Attempt to read as text.
                    try:
                        content = Path(dest).read_text(encoding="utf-8", errors="replace")
                        texts.append(
                            f"[File: {attachment.filename}]\n```\n{content}\n```"
                        )
                    except Exception:
                        texts.append(f"[Binary attachment: {attachment.filename}]")
            except Exception:
                logger.exception("Failed to download attachment %s", attachment.filename)
        return texts

    # ------------------------------------------------------------------
    # Fallback tool-call parser
    # ------------------------------------------------------------------

    @staticmethod
    def _try_parse_tool_call_from_text(text: str) -> dict[str, Any] | None:
        """Extract an execute_command tool call from plain-text LLM output.

        qwen2.5-coder:14b often outputs JSON as text in ``content`` instead
        of using the ``tool_calls`` API field.  Handles nested JSON shapes
        that regex-based parsers fail on.

        Supported shapes::

            {"execute_command": "Get-Date"}
            {"execute_command": {"command": "Get-Date", "reason": "..."}}
            {"command": "Get-Date", "reason": "..."}

        Returns a tool-call dict in the same shape as Ollama's ``tool_calls``
        entries, or ``None`` if no valid call is found.
        """

        def _extract_first_json(s: str) -> dict[str, Any] | None:
            """Find the first balanced ``{...}`` in *s* and JSON-parse it."""
            start = s.find("{")
            if start == -1:
                return None
            depth = 0
            in_string = False
            escape = False
            for i, ch in enumerate(s[start:], start):
                if escape:
                    escape = False
                    continue
                if ch == "\\" and in_string:
                    escape = True
                    continue
                if ch == '"':
                    in_string = not in_string
                    continue
                if in_string:
                    continue
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(s[start : i + 1])
                        except (json.JSONDecodeError, ValueError):
                            return None
            return None

        # Prefer JSON found inside a fenced code block, fall back to bare text.
        code_block = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        search_text = code_block.group(1) if code_block else text
        data = _extract_first_json(search_text)
        if data is None and code_block:
            # Code block content wasn't valid JSON — search the whole text.
            data = _extract_first_json(text)
        if data is None:
            return None

        # Normalise the different JSON shapes the model might produce.
        execute_cmd = data.get("execute_command")
        if isinstance(execute_cmd, dict):
            # {"execute_command": {"command": "...", "reason": "..."}}
            command = str(execute_cmd.get("command", ""))
            reason = str(execute_cmd.get("reason", data.get("reason", "")))
        elif isinstance(execute_cmd, str):
            # {"execute_command": "cmd"}
            command = execute_cmd
            reason = str(data.get("reason", ""))
        else:
            # {"command": "cmd", "reason": "..."}
            command = str(data.get("command", ""))
            reason = str(data.get("reason", ""))

        if not command:
            return None

        return {
            "function": {
                "name": "execute_command",
                "arguments": {"command": command, "reason": reason},
            }
        }

    @staticmethod
    def _extract_all_tool_calls_from_text(text: str) -> list[dict[str, Any]]:
        """Return every execute_command call embedded in *text*.

        Scans the full text for balanced JSON objects and converts each one
        that contains an ``execute_command`` (or ``command``) key into a
        tool-call dict.  Used to handle multi-step responses where the model
        outputs several JSON blocks in a single message.
        """
        calls: list[dict[str, Any]] = []
        pos = 0
        while pos < len(text):
            start = text.find("{", pos)
            if start == -1:
                break

            # Walk to the matching closing brace.
            depth = 0
            in_string = False
            escape = False
            end = -1
            for i, ch in enumerate(text[start:], start):
                if escape:
                    escape = False
                    continue
                if ch == "\\" and in_string:
                    escape = True
                    continue
                if ch == '"':
                    in_string = not in_string
                    continue
                if in_string:
                    continue
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        end = i
                        break

            if end == -1:
                break

            try:
                data = json.loads(text[start : end + 1])
                execute_cmd = data.get("execute_command")
                if isinstance(execute_cmd, dict):
                    command = str(execute_cmd.get("command", ""))
                    reason = str(execute_cmd.get("reason", data.get("reason", "")))
                elif isinstance(execute_cmd, str):
                    command = execute_cmd
                    reason = str(data.get("reason", ""))
                else:
                    command = str(data.get("command", ""))
                    reason = str(data.get("reason", ""))

                if command:
                    calls.append({
                        "function": {
                            "name": "execute_command",
                            "arguments": {"command": command, "reason": reason},
                        }
                    })
            except (json.JSONDecodeError, ValueError):
                pass

            pos = end + 1

        return calls

    # ------------------------------------------------------------------
    # LLM pipeline
    # ------------------------------------------------------------------

    async def _process_llm(
        self,
        message: discord.Message,
        attachment_texts: list[str],
    ) -> None:
        """Stream an LLM response to the channel, handling tool calls."""
        self.reset_cancel()

        # Build user message content, including any attachment text.
        user_content = message.content
        if attachment_texts:
            user_content += "\n\n" + "\n\n".join(attachment_texts)

        self.context.add_message(message.author.id, role="user", content=user_content)

        # Update system prompt for current mode then get full message list.
        system_prompt = self.prompts.get_system_prompt(self._current_mode)
        self.context.set_system_prompt(system_prompt)
        messages = self.context.get_messages(message.author.id)

        # Get tools for current mode.
        tools = self.prompts.get_tools(self._current_mode)
        has_tools = tools is not None

        collected = ""
        token_count = 0
        last_edit: float = 0.0
        sent_message: discord.Message | None = None

        if has_tools:
            # Planning mode: send a placeholder immediately so the raw JSON
            # the model emits is NEVER shown to the user.  Content is buffered
            # silently; only the final natural-language answer (or an error) is
            # displayed once the tool-call / follow-up pipeline is complete.
            sent_message = await message.channel.send(
                embed=llm_response_embed(
                    "_処理中..._", self._current_model, self._current_mode,
                ),
            )

        async with message.channel.typing():
            async for chunk in self.ollama.chat(
                model=self._current_model,
                messages=messages,
                tools=tools,
                stream=True,
                cancel_event=self._cancel_event,
            ):
                if self.cancel_requested:
                    collected += "\n\n*[Generation cancelled]*"
                    break

                # Mid-stream proper tool_calls field (may arrive before text).
                if "tool_calls" in chunk:
                    await self._handle_tool_calls(
                        chunk["tool_calls"], message, collected,
                        status_message=sent_message,
                    )
                    return  # tool-call branch takes over

                collected += chunk.get("content", "")
                token_count += 1

                if not has_tools:
                    # Fast mode: no tools → no JSON risk → stream live to Discord.
                    now = time.monotonic()
                    should_edit = (
                        (now - last_edit) >= _STREAM_EDIT_INTERVAL_SECS
                        or token_count % _STREAM_EDIT_TOKEN_THRESHOLD == 0
                    )
                    if sent_message is None:
                        sent_message = await message.channel.send(
                            embed=llm_response_embed(
                                collected, self._current_model, self._current_mode,
                            ),
                        )
                        last_edit = now
                    elif should_edit:
                        await self._safe_edit(sent_message, collected)
                        last_edit = now

        # Fallback: qwen2.5-coder:14b emits JSON as plain text instead of
        # using the tool_calls API field.  Extract every command block and
        # execute them, then produce one natural-language reply.
        if has_tools and collected and not self.cancel_requested:
            all_calls = self._extract_all_tool_calls_from_text(collected)
            if all_calls:
                await self._handle_tool_calls(
                    all_calls, message, "",
                    status_message=sent_message,
                )
                return

        # No tool calls — display the collected response.
        if collected:
            if sent_message is not None:
                await self._safe_edit(sent_message, collected)
            else:
                await self._send_split(message.channel, collected)
            self.context.add_message(message.author.id, role="assistant", content=collected)
        elif has_tools and sent_message is not None:
            # Empty response in planning mode — remove the dangling placeholder.
            try:
                await sent_message.delete()
            except discord.HTTPException:
                pass

    # ------------------------------------------------------------------
    # Tool-call handling
    # ------------------------------------------------------------------

    async def _handle_tool_calls(
        self,
        tool_calls: list[dict[str, Any]],
        message: discord.Message,
        partial_response: str,
        status_message: discord.Message | None = None,
    ) -> None:
        """Execute tool calls returned by the LLM.

        Two-phase design
        ----------------
        Phase 1 — Execute every command and accumulate results in context.
                   No follow-up is generated between commands.
        Phase 2 — After *all* commands have run, call the LLM once with an
                   explicit instruction to answer in natural language only.
                   The result overwrites *status_message* (or is sent as a
                   new message when *status_message* is ``None``).

        This prevents the model from emitting another round of JSON when it
        still has tools available, and ensures the user sees exactly one
        clean reply.
        """
        # ── Phase 1: run every command ────────────────────────────────────
        if status_message is not None:
            await self._safe_edit(status_message, "_処理中..._")

        executed_any = False
        for call in tool_calls:
            func_info = call.get("function", {})
            command: str = func_info.get("arguments", {}).get("command", "")
            reason: str = func_info.get("arguments", {}).get("reason", "")
            if not command:
                continue

            result = await self.executor.execute(
                command=command,
                user_id=message.author.id,
                reason=reason,
            )
            status = result.get("status", "error")
            classification = result.get("classification", "safe")
            exec_reason = result.get("reason", "")

            if status == "blocked":
                await message.channel.send(
                    embed=command_preview_embed(command, classification, exec_reason),
                )
                self.audit.log(
                    user_id=str(message.author.id),
                    action="command_blocked",
                    command=command,
                    classification=classification,
                    result=f"Blocked: {exec_reason}",
                )
                continue

            if status == "pending_confirm":
                approved = await self._confirm_flow(
                    message, command, classification, exec_reason,
                )
                if not approved:
                    self.audit.log(
                        user_id=str(message.author.id),
                        action="command_denied",
                        command=command,
                        classification=classification,
                        result="User denied",
                    )
                    continue
                result = await self.executor.confirm_execute(
                    command=command,
                    user_id=message.author.id,
                )

            self.audit.log(
                user_id=str(message.author.id),
                action="command_exec",
                command=command,
                classification=result.get("classification", "safe"),
                result=result.get("status", "executed"),
            )

            # Record assistant tool-call request then the tool result so
            # Ollama sees the correct role sequence.
            self.context.add_tool_call(
                user_id=message.author.id,
                tool_call=call,
            )
            self.context.add_tool_result(
                user_id=message.author.id,
                tool_name="execute_command",
                result=json.dumps(result),
            )
            executed_any = True

        if not executed_any:
            return

        # ── Phase 2: one natural-language follow-up for all results ───────
        system_prompt = self.prompts.get_system_prompt(self._current_mode)
        self.context.set_system_prompt(system_prompt)
        base_messages = self.context.get_messages(message.author.id)

        # Append a one-shot instruction to force plain-text output.
        # This message is NOT saved to self.context so it does not pollute
        # future turns.
        followup_messages = base_messages + [
            {
                "role": "user",
                "content": (
                    "上記のコマンド実行結果をもとに、ユーザーへの回答を日本語の自然な文章で答えてください。"
                    "JSONやコードブロックは使わず、結果の内容だけを伝えてください。"
                ),
            }
        ]

        followup = ""
        self.reset_cancel()
        async with message.channel.typing():
            async for chunk in self.ollama.chat(
                model=self._current_model,
                messages=followup_messages,
                tools=None,   # no tools → forces natural language
                stream=True,
                cancel_event=self._cancel_event,
            ):
                if self.cancel_requested:
                    followup += "\n\n*[Generation cancelled]*"
                    break
                followup += chunk.get("content", "")

        if followup:
            if status_message is not None:
                await self._safe_edit(status_message, followup)
            else:
                await self._send_split(message.channel, followup)
            self.context.add_message(
                message.author.id, role="assistant", content=followup,
            )

    async def _confirm_flow(
        self,
        message: discord.Message,
        command: str,
        classification: str,
        reason: str,
    ) -> bool:
        """Present a confirm-tier command to the user and wait for approval."""
        future: asyncio.Future[bool] = asyncio.get_running_loop().create_future()

        async def on_confirm() -> None:
            if not future.done():
                future.set_result(True)

        async def on_cancel() -> None:
            if not future.done():
                future.set_result(False)

        view = ConfirmView(
            author_id=message.author.id,
            on_confirm=on_confirm,
            on_cancel=on_cancel,
            timeout=30.0,
        )

        await message.channel.send(
            embed=command_preview_embed(command, classification, reason),
            view=view,
        )

        try:
            return await asyncio.wait_for(future, timeout=35.0)
        except asyncio.TimeoutError:
            return False

    # ------------------------------------------------------------------
    # Message utilities
    # ------------------------------------------------------------------

    async def _safe_edit(self, msg: discord.Message, content: str) -> None:
        """Edit a message with an LLM response embed, swallowing errors."""
        try:
            await msg.edit(
                embed=llm_response_embed(content, self._current_model, self._current_mode),
            )
        except discord.HTTPException:
            logger.debug("Failed to edit streaming message (likely deleted).")

    async def _send_split(
        self,
        channel: discord.abc.Messageable,
        text: str,
    ) -> None:
        """Send text to a channel, auto-splitting at 2000-char boundaries."""
        while text:
            chunk = text[:2000]
            text = text[2000:]
            if text:
                # Try to split at a newline for readability.
                last_nl = chunk.rfind("\n")
                if last_nl > 1500:
                    text = chunk[last_nl:] + text
                    chunk = chunk[:last_nl]
            await channel.send(
                embed=llm_response_embed(chunk, self._current_model, self._current_mode),
            )
