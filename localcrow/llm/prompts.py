"""System prompts and tool definitions for LocalCrow.

Provides mode-aware prompt selection and Ollama-compatible tool schemas
for function calling.
"""

from __future__ import annotations

from typing import Any

# ---------------------------------------------------------------------------
# System prompts
# ---------------------------------------------------------------------------

PLANNING_PROMPT: str = """\
You are **LocalCrow**, an AI assistant running directly on the user's local PC.
You communicate in both Japanese and English — match the language the user is \
using, or default to Japanese.

あなたは **LocalCrow** です。ユーザーのローカルPC上で動作するAIアシスタントです。

## Capabilities
- You can execute shell commands on the user's machine via the `execute_command` \
tool.
- You have full access to the local filesystem, installed programs, and system \
utilities.
- You can chain multiple commands to accomplish complex tasks.

## Behaviour Guidelines
1. **Explain before acting** — Always tell the user *what* you are about to do \
and *why* before invoking a tool.
   実行前に何をするか、なぜそれをするかを必ず説明してください。
2. **Be cautious** — Destructive operations (delete, format, overwrite) must be \
confirmed by the user first.
   破壊的な操作はユーザーの確認を得てから実行してください。
3. **Show results** — After a command finishes, summarise the output clearly.
   コマンドの結果を分かりやすくまとめてください。
4. **Error recovery** — If a command fails, explain the error and suggest a fix.
   エラーが発生した場合は原因と対処法を提示してください。
5. **Privacy** — Never send local data to external services unless the user \
explicitly asks.
   ユーザーの明示的な許可なしにデータを外部に送信しないでください。
6. **Step-by-step** — For multi-step tasks, break the work into clear phases and \
report progress after each one.
   複数ステップのタスクは段階的に実行し、各ステップ後に進捗を報告してください。

## Response Format
- Use Markdown formatting for readability.
- Keep explanations concise but thorough.
- When showing file contents or command output, use code blocks.
"""

FAST_PROMPT: str = """\
You are **LocalCrow** (fast mode). Answer briefly and directly. \
No tool usage in this mode. Respond in the same language the user uses \
(default: Japanese).

LocalCrow（高速モード）です。簡潔に回答します。ツールは使いません。
"""

# ---------------------------------------------------------------------------
# Tool definitions (Ollama function-calling format)
# ---------------------------------------------------------------------------

TOOL_DEFINITIONS: list[dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "execute_command",
            "description": (
                "Execute a shell command on the user's local PC and return "
                "its stdout/stderr. Use this to interact with the filesystem, "
                "run programs, install packages, etc."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {
                        "type": "string",
                        "description": (
                            "The shell command to execute "
                            "(e.g. 'ls -la', 'pip install requests')."
                        ),
                    },
                    "reason": {
                        "type": "string",
                        "description": (
                            "A short explanation of why this command is being "
                            "run, shown to the user before execution."
                        ),
                    },
                },
                "required": ["command", "reason"],
            },
        },
    },
]

# ---------------------------------------------------------------------------
# Prompt manager
# ---------------------------------------------------------------------------

_PROMPTS: dict[str, str] = {
    "planning": PLANNING_PROMPT,
    "fast": FAST_PROMPT,
}


class PromptManager:
    """Select system prompts and tool sets based on the active mode."""

    @staticmethod
    def get_system_prompt(mode: str) -> str:
        """Return the system prompt for the given *mode*.

        Recognised modes: ``"planning"``, ``"fast"``.
        Falls back to the planning prompt for unknown modes.
        """
        return _PROMPTS.get(mode, PLANNING_PROMPT)

    @staticmethod
    def get_tools(mode: str) -> list[dict[str, Any]] | None:
        """Return tool definitions for *mode*.

        Tools are only provided in ``"planning"`` mode.  Returns ``None``
        for all other modes so the model does not attempt function calls.
        """
        if mode == "planning":
            return TOOL_DEFINITIONS
        return None
