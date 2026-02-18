"""Unified LLM interface supporting Claude API (Anthropic) and Gemini API (Google)."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Protocol

logger = logging.getLogger(__name__)


@dataclass
class LLMResponse:
    """Standardized response from any LLM backend."""

    text: str
    model: str
    usage: dict[str, int] = field(default_factory=dict)


class LLMBackend(Protocol):
    """Protocol for LLM backends."""

    async def generate(
        self, system_prompt: str, user_prompt: str, json_mode: bool = False
    ) -> LLMResponse: ...


class ClaudeClient:
    """Wrapper around anthropic.AsyncAnthropic."""

    def __init__(
        self, api_key: str, model: str = "claude-sonnet-4-20250514"
    ) -> None:
        import anthropic

        self._client = anthropic.AsyncAnthropic(api_key=api_key)
        self._model = model

    async def generate(
        self, system_prompt: str, user_prompt: str, json_mode: bool = False
    ) -> LLMResponse:
        try:
            kwargs: dict[str, Any] = {
                "model": self._model,
                "max_tokens": 4096,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}],
            }

            response = await self._client.messages.create(**kwargs)
            text = response.content[0].text

            if json_mode:
                text = self._extract_json(text)

            return LLMResponse(
                text=text,
                model=self._model,
                usage={
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                },
            )
        except Exception:
            logger.exception("Claude API call failed")
            raise

    @staticmethod
    def _extract_json(text: str) -> str:
        """Extract JSON from response text that may contain markdown code fences."""
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            lines = lines[1:]  # remove opening fence
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines)
        json.loads(text)  # validate
        return text


class GeminiClient:
    """Wrapper around google.generativeai."""

    def __init__(
        self, api_key: str, model: str = "gemini-2.0-flash"
    ) -> None:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        self._model_name = model
        self._genai = genai

    async def generate(
        self, system_prompt: str, user_prompt: str, json_mode: bool = False
    ) -> LLMResponse:
        import asyncio

        try:
            model = self._genai.GenerativeModel(
                self._model_name,
                system_instruction=system_prompt,
            )

            gen_config: dict[str, Any] = {}
            if json_mode:
                gen_config["response_mime_type"] = "application/json"

            response = await asyncio.to_thread(
                model.generate_content,
                user_prompt,
                generation_config=gen_config if gen_config else None,
            )

            text = response.text or ""
            usage: dict[str, int] = {}
            if hasattr(response, "usage_metadata") and response.usage_metadata:
                usage = {
                    "input_tokens": getattr(
                        response.usage_metadata, "prompt_token_count", 0
                    ),
                    "output_tokens": getattr(
                        response.usage_metadata, "candidates_token_count", 0
                    ),
                }

            return LLMResponse(text=text, model=self._model_name, usage=usage)
        except Exception:
            logger.exception("Gemini API call failed")
            raise


def create_llm_client(config: dict[str, Any]) -> LLMBackend:
    """Factory: create an LLM client from config.

    Expected config structure:
        llm:
          backend: "claude" | "gemini"
          model: "claude-sonnet-4-20250514"  (optional)
    """
    llm_config = config.get("llm", {})
    backend = llm_config.get("backend", "claude")
    model = llm_config.get("model")

    if backend == "claude":
        api_key = os.environ.get("CLAUDE_API_KEY", "")
        if not api_key:
            raise ValueError("CLAUDE_API_KEY environment variable is not set")
        kwargs: dict[str, Any] = {"api_key": api_key}
        if model:
            kwargs["model"] = model
        return ClaudeClient(**kwargs)

    if backend == "gemini":
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        kwargs = {"api_key": api_key}
        if model:
            kwargs["model"] = model
        return GeminiClient(**kwargs)

    raise ValueError(f"Unknown LLM backend: {backend}")
