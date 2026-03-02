"""Notification system supporting Discord Webhook and LINE Notify."""

from __future__ import annotations

import logging
from typing import Any, Protocol

import aiohttp

logger = logging.getLogger(__name__)


class NotifierBackend(Protocol):
    """Protocol for notification backends."""

    async def send(
        self, title: str, message: str, image_url: str | None = None
    ) -> bool: ...


class DiscordWebhookNotifier:
    """Sends rich embed messages to a Discord webhook URL."""

    def __init__(self, webhook_url: str) -> None:
        self._webhook_url = webhook_url

    async def send(
        self, title: str, message: str, image_url: str | None = None
    ) -> bool:
        embed: dict[str, Any] = {
            "title": title,
            "description": message,
            "color": 0x00FF88,
        }
        if image_url:
            embed["image"] = {"url": image_url}

        payload = {"embeds": [embed]}

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self._webhook_url,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=15),
                ) as resp:
                    if resp.status in (200, 204):
                        logger.info("Discord notification sent: %s", title)
                        return True
                    logger.warning(
                        "Discord webhook returned %d: %s",
                        resp.status,
                        await resp.text(),
                    )
                    return False
        except Exception:
            logger.exception("Failed to send Discord notification")
            return False


class LineNotifyNotifier:
    """Sends messages via LINE Notify API token."""

    API_URL = "https://notify-api.line.me/api/notify"

    def __init__(self, token: str) -> None:
        self._token = token

    async def send(
        self, title: str, message: str, image_url: str | None = None
    ) -> bool:
        headers = {"Authorization": f"Bearer {self._token}"}
        data: dict[str, str] = {"message": f"\n{title}\n{message}"}
        if image_url:
            data["imageThumbnail"] = image_url
            data["imageFullsize"] = image_url

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.API_URL,
                    headers=headers,
                    data=data,
                    timeout=aiohttp.ClientTimeout(total=15),
                ) as resp:
                    if resp.status == 200:
                        logger.info("LINE notification sent: %s", title)
                        return True
                    logger.warning(
                        "LINE Notify returned %d: %s",
                        resp.status,
                        await resp.text(),
                    )
                    return False
        except Exception:
            logger.exception("Failed to send LINE notification")
            return False


class DummyNotifier:
    """No-op notifier for testing or when notifications are disabled."""

    async def send(
        self, title: str, message: str, image_url: str | None = None
    ) -> bool:
        logger.info("[DRY-RUN] Notification: %s - %s", title, message)
        return True


def create_notifier(config: dict[str, Any]) -> NotifierBackend:
    """Factory: create a notifier backend from config.

    Expected config structure:
        notification:
          backend: "discord" | "line" | "none"
          discord_webhook_url: "..."
          line_notify_token: "..."
    """
    import os

    notif_config = config.get("notification", {})
    backend = notif_config.get("backend", "none")

    if backend == "discord":
        url = notif_config.get("discord_webhook_url") or os.environ.get(
            "DISCORD_WEBHOOK_URL", ""
        )
        if not url:
            logger.warning("Discord webhook URL not set, using DummyNotifier")
            return DummyNotifier()
        return DiscordWebhookNotifier(url)

    if backend == "line":
        token = notif_config.get("line_notify_token") or os.environ.get(
            "LINE_NOTIFY_TOKEN", ""
        )
        if not token:
            logger.warning("LINE Notify token not set, using DummyNotifier")
            return DummyNotifier()
        return LineNotifyNotifier(token)

    return DummyNotifier()
