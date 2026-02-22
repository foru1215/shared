"""
LocalCrow Command Sandbox
==========================
3-tier command classification and shell injection prevention.

Tiers:
    GREEN  (safe)    — Read-only / informational commands. Execute immediately.
    YELLOW (confirm) — Write operations. Require user confirmation with 30s timeout.
    RED    (blocked) — Destructive / dangerous commands. Always denied and logged.

Shell injection patterns (;  &&  ||  |  `  $()) are detected and blocked
regardless of the command tier.
"""

from __future__ import annotations

import logging
import re
import shlex
from typing import Optional

logger = logging.getLogger("localcrow.security.sandbox")

# ---------------------------------------------------------------------------
# Command classification tables
# ---------------------------------------------------------------------------

# GREEN tier: safe, read-only commands — execute immediately
_GREEN_COMMANDS: set[str] = {
    "ls", "dir", "cat", "type", "echo",
    "nvidia-smi", "systeminfo",
}

# GREEN tier: git sub-commands that are read-only
_GREEN_GIT_SUBCOMMANDS: set[str] = {"status", "log", "diff"}

# GREEN tier: ollama sub-commands that are read-only
_GREEN_OLLAMA_SUBCOMMANDS: set[str] = {"list"}

# YELLOW tier: write operations requiring confirmation
_YELLOW_COMMANDS: set[str] = {
    "pip", "npm", "mkdir", "cp", "move", "python",
}

# YELLOW tier: git sub-commands that write
_YELLOW_GIT_SUBCOMMANDS: set[str] = {"add", "commit", "push"}

# RED tier: destructive / dangerous — always blocked
_RED_COMMANDS: set[str] = {
    "rm", "del", "format", "reg",
    "shutdown", "taskkill", "eval", "exec",
}

# RED tier: dangerous invocation patterns (checked against raw command string)
_RED_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"\bpowershell\b.*\b-enc\b", re.IGNORECASE),
    re.compile(r"\bcmd\b\s+/c\b", re.IGNORECASE),
    re.compile(r"\bcurl\b.*\|\s*\bsh\b", re.IGNORECASE),
    re.compile(r"\bwget\b.*\|\s*\bsh\b", re.IGNORECASE),
]

# Shell injection detection pattern
_INJECTION_PATTERN: re.Pattern[str] = re.compile(
    r"[;|`]"           # semicolon, pipe, backtick
    r"|&&"             # logical AND chaining
    r"|\|\|"           # logical OR chaining
    r"|\$\("           # command substitution $(...)
)

# Confirmation timeout in seconds
CONFIRM_TIMEOUT_SECONDS: int = 30


class CommandSandbox:
    """3-tier command sandbox with shell injection detection.

    Classifies commands into safe / confirm / blocked tiers and
    detects shell injection attempts in command strings.
    """

    def __init__(self) -> None:
        logger.info("CommandSandbox initialized")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @staticmethod
    def classify(command: str) -> str:
        """Classify a command into a security tier.

        Args:
            command: The raw command string to classify.

        Returns:
            One of ``"safe"``, ``"confirm"``, or ``"blocked"``.
        """
        command = command.strip()
        if not command:
            return "blocked"

        # Check RED patterns first (highest priority)
        for pattern in _RED_PATTERNS:
            if pattern.search(command):
                return "blocked"

        # Parse the base command
        try:
            tokens = shlex.split(command, posix=True)
        except ValueError:
            # Malformed quoting — treat as blocked
            return "blocked"

        if not tokens:
            return "blocked"

        base = tokens[0].lower()

        # Strip path prefix to get the bare executable name
        # e.g. /usr/bin/rm -> rm, C:\Windows\system32\cmd.exe -> cmd
        bare = base.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
        # Remove .exe / .bat / .cmd extension
        for ext in (".exe", ".bat", ".cmd", ".com"):
            if bare.endswith(ext):
                bare = bare[: -len(ext)]
                break

        # RED check
        if bare in _RED_COMMANDS:
            return "blocked"

        # git sub-command routing
        if bare == "git":
            sub = tokens[1].lower() if len(tokens) > 1 else ""
            if sub in _GREEN_GIT_SUBCOMMANDS:
                return "safe"
            if sub in _YELLOW_GIT_SUBCOMMANDS:
                return "confirm"
            # Unknown git sub-command — require confirmation
            return "confirm"

        # ollama sub-command routing
        if bare == "ollama":
            sub = tokens[1].lower() if len(tokens) > 1 else ""
            if sub in _GREEN_OLLAMA_SUBCOMMANDS:
                return "safe"
            return "confirm"

        # GREEN check
        if bare in _GREEN_COMMANDS:
            return "safe"

        # YELLOW check
        if bare in _YELLOW_COMMANDS:
            return "confirm"

        # Unknown commands default to confirm (principle of least privilege)
        return "confirm"

    @staticmethod
    def check_injection(command: str) -> bool:
        """Detect shell injection patterns in a command string.

        Checks for: ``;``, ``&&``, ``||``, ``|``, backticks, ``$()``.

        Args:
            command: The raw command string to inspect.

        Returns:
            True if a shell injection pattern is detected, False otherwise.
        """
        return bool(_INJECTION_PATTERN.search(command))

    def validate(self, command: str) -> tuple[str, Optional[str]]:
        """Validate a command: check for injection, then classify.

        This is the primary entry point for command validation. It first
        checks for shell injection, then classifies the command.

        Args:
            command: The raw command string to validate.

        Returns:
            A tuple of ``(classification, rejection_reason)``.
            ``rejection_reason`` is None if the command is allowed
            (``"safe"`` or ``"confirm"``), or a human-readable string
            explaining why the command was blocked.
        """
        command = command.strip()

        if not command:
            return "blocked", "Empty command"

        # Injection check takes absolute priority
        if self.check_injection(command):
            logger.warning("Shell injection detected in command: %r", command)
            return "blocked", (
                "Shell injection pattern detected. "
                "Chaining operators (;  &&  ||  |  `  $()) are not allowed."
            )

        classification = self.classify(command)

        if classification == "blocked":
            reason = _get_block_reason(command)
            logger.warning("Blocked command: %r — %s", command, reason)
            return "blocked", reason

        return classification, None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_block_reason(command: str) -> str:
    """Generate a human-readable reason for why a command is blocked."""
    for pattern in _RED_PATTERNS:
        if pattern.search(command):
            return f"Matches dangerous pattern: {pattern.pattern}"

    try:
        tokens = shlex.split(command, posix=True)
    except ValueError:
        return "Malformed command (invalid quoting)"

    if tokens:
        bare = tokens[0].lower().rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
        for ext in (".exe", ".bat", ".cmd", ".com"):
            if bare.endswith(ext):
                bare = bare[: -len(ext)]
                break
        if bare in _RED_COMMANDS:
            return f"Command '{bare}' is in the RED (blocked) tier — destructive operations are not allowed"

    return "Command is blocked by security policy"
