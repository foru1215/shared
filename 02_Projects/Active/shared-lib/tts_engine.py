"""Text-to-speech abstraction supporting VOICEVOX (local) and gTTS (Google)."""

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path
from typing import Any, Protocol

import aiohttp

logger = logging.getLogger(__name__)


class TTSBackend(Protocol):
    """Protocol for TTS backends."""

    async def synthesize(self, text: str, output_path: Path) -> Path: ...


class VoicevoxTTS:
    """Connects to VOICEVOX engine running locally at localhost:50021."""

    def __init__(
        self,
        host: str = "127.0.0.1",
        port: int = 50021,
        speaker_id: int = 0,
    ) -> None:
        self._base_url = f"http://{host}:{port}"
        self._speaker_id = speaker_id

    async def synthesize(self, text: str, output_path: Path) -> Path:
        """Generate speech audio via VOICEVOX API and save to output_path."""
        try:
            async with aiohttp.ClientSession() as session:
                # Step 1: Create audio query
                async with session.post(
                    f"{self._base_url}/audio_query",
                    params={"text": text, "speaker": self._speaker_id},
                    timeout=aiohttp.ClientTimeout(total=30),
                ) as resp:
                    if resp.status != 200:
                        raise RuntimeError(
                            f"VOICEVOX audio_query failed: {resp.status}"
                        )
                    query = await resp.json()

                # Step 2: Synthesize audio
                async with session.post(
                    f"{self._base_url}/synthesis",
                    params={"speaker": self._speaker_id},
                    json=query,
                    timeout=aiohttp.ClientTimeout(total=60),
                ) as resp:
                    if resp.status != 200:
                        raise RuntimeError(
                            f"VOICEVOX synthesis failed: {resp.status}"
                        )
                    audio_data = await resp.read()

            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(audio_data)
            logger.info("VOICEVOX TTS saved: %s (%d bytes)", output_path, len(audio_data))
            return output_path

        except Exception:
            logger.exception("VOICEVOX TTS failed for text: %s...", text[:50])
            raise


class GoogleTTS:
    """Uses gTTS library for cloud-based TTS. Runs in thread since gTTS is sync."""

    def __init__(self, lang: str = "ja") -> None:
        self._lang = lang

    async def synthesize(self, text: str, output_path: Path) -> Path:
        """Generate speech audio via gTTS and save to output_path."""
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)

            def _generate() -> None:
                from gtts import gTTS

                tts = gTTS(text=text, lang=self._lang)
                tts.save(str(output_path))

            await asyncio.to_thread(_generate)
            logger.info("gTTS saved: %s", output_path)
            return output_path

        except Exception:
            logger.exception("gTTS failed for text: %s...", text[:50])
            raise


def create_tts_engine(config: dict[str, Any]) -> TTSBackend:
    """Factory: create a TTS engine from config.

    Expected config structure:
        tts:
          backend: "voicevox" | "gtts"
          voicevox_host: "127.0.0.1"
          voicevox_port: 50021
          voicevox_speaker_id: 0
          gtts_lang: "ja"
    """
    tts_config = config.get("tts", {})
    backend = tts_config.get("backend", "voicevox")

    if backend == "voicevox":
        return VoicevoxTTS(
            host=tts_config.get("voicevox_host", os.environ.get("VOICEVOX_HOST", "127.0.0.1")),
            port=int(tts_config.get("voicevox_port", os.environ.get("VOICEVOX_PORT", "50021"))),
            speaker_id=int(tts_config.get("voicevox_speaker_id", 0)),
        )

    if backend == "gtts":
        return GoogleTTS(lang=tts_config.get("gtts_lang", "ja"))

    raise ValueError(f"Unknown TTS backend: {backend}")
