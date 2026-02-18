"""WebSocket and HTTP client for ComfyUI API communication."""

from __future__ import annotations

import json
import logging
import uuid
from typing import Any, AsyncGenerator

import aiohttp

logger = logging.getLogger(__name__)


class ComfyUIClient:
    """Manages WebSocket and HTTP connections to ComfyUI server."""

    def __init__(
        self, host: str = "127.0.0.1", port: int = 8188, client_id: str | None = None
    ) -> None:
        self.client_id = client_id or str(uuid.uuid4())
        self.base_url = f"http://{host}:{port}"
        self.ws_url = f"ws://{host}:{port}/ws?clientId={self.client_id}"
        self._session: aiohttp.ClientSession | None = None

    async def connect(self) -> None:
        """Establish HTTP session and verify server is reachable."""
        self._session = aiohttp.ClientSession()
        try:
            async with self._session.get(
                f"{self.base_url}/system_stats",
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                if resp.status == 200:
                    logger.info("Connected to ComfyUI at %s", self.base_url)
                else:
                    raise ConnectionError(f"ComfyUI returned status {resp.status}")
        except aiohttp.ClientError as e:
            await self.disconnect()
            raise ConnectionError(f"Cannot reach ComfyUI at {self.base_url}: {e}") from e

    async def disconnect(self) -> None:
        """Close HTTP session."""
        if self._session and not self._session.closed:
            await self._session.close()
            self._session = None
            logger.info("Disconnected from ComfyUI")

    def _ensure_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            raise RuntimeError("Not connected. Call connect() first.")
        return self._session

    async def queue_prompt(self, workflow: dict[str, Any]) -> str:
        """POST /prompt with workflow JSON. Returns prompt_id."""
        session = self._ensure_session()
        payload = {"prompt": workflow, "client_id": self.client_id}

        try:
            async with session.post(
                f"{self.base_url}/prompt",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                result = await resp.json()
                if "prompt_id" in result:
                    prompt_id = result["prompt_id"]
                    logger.info("Queued prompt: %s", prompt_id)
                    return prompt_id
                if "error" in result:
                    raise RuntimeError(f"ComfyUI error: {result['error']}")
                raise RuntimeError(f"Unexpected response: {result}")
        except Exception:
            logger.exception("Failed to queue prompt")
            raise

    async def get_history(self, prompt_id: str) -> dict[str, Any]:
        """GET /history/{prompt_id}. Returns execution result."""
        session = self._ensure_session()
        try:
            async with session.get(
                f"{self.base_url}/history/{prompt_id}",
                timeout=aiohttp.ClientTimeout(total=15),
            ) as resp:
                data = await resp.json()
                return data.get(prompt_id, {})
        except Exception:
            logger.exception("Failed to get history for %s", prompt_id)
            raise

    async def get_image(
        self, filename: str, subfolder: str = "", folder_type: str = "output"
    ) -> bytes:
        """GET /view to download a generated image by filename."""
        session = self._ensure_session()
        params = {"filename": filename, "subfolder": subfolder, "type": folder_type}
        try:
            async with session.get(
                f"{self.base_url}/view",
                params=params,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                if resp.status == 200:
                    return await resp.read()
                raise RuntimeError(f"Failed to download image {filename}: status {resp.status}")
        except Exception:
            logger.exception("Failed to get image %s", filename)
            raise

    async def monitor_progress(
        self, prompt_id: str
    ) -> AsyncGenerator[dict[str, Any], None]:
        """WebSocket listener that yields progress events until execution completes.

        Event types: execution_start, executing, progress, execution_complete, execution_error
        """
        session = self._ensure_session()

        try:
            async with session.ws_connect(self.ws_url) as ws:
                async for msg in ws:
                    if msg.type == aiohttp.WSMsgType.TEXT:
                        data = json.loads(msg.data)
                        event_type = data.get("type")
                        event_data = data.get("data", {})

                        # Only process events for our prompt
                        if event_data.get("prompt_id") == prompt_id or event_type == "progress":
                            yield {"type": event_type, "data": event_data}

                            if event_type in ("execution_complete", "execution_error"):
                                return

                    elif msg.type == aiohttp.WSMsgType.ERROR:
                        logger.error("WebSocket error: %s", ws.exception())
                        return

        except Exception:
            logger.exception("WebSocket monitoring failed for %s", prompt_id)
            raise

    async def upload_image(
        self, filepath: str, overwrite: bool = False
    ) -> dict[str, Any]:
        """POST /upload/image for input images."""
        session = self._ensure_session()
        from pathlib import Path

        path = Path(filepath)
        data = aiohttp.FormData()
        data.add_field("image", path.read_bytes(), filename=path.name)
        data.add_field("overwrite", str(overwrite).lower())

        try:
            async with session.post(
                f"{self.base_url}/upload/image",
                data=data,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                return await resp.json()
        except Exception:
            logger.exception("Failed to upload image %s", filepath)
            raise

    async def get_system_stats(self) -> dict[str, Any]:
        """GET /system_stats for GPU memory/queue status."""
        session = self._ensure_session()
        try:
            async with session.get(
                f"{self.base_url}/system_stats",
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                return await resp.json()
        except Exception:
            logger.exception("Failed to get system stats")
            raise

    async def __aenter__(self) -> ComfyUIClient:
        await self.connect()
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.disconnect()
