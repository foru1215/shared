"""Abstract base class for marketplace scrapers with stealth configuration."""

from __future__ import annotations

import asyncio
import logging
import random
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from playwright.async_api import BrowserContext, Page, async_playwright

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
]


@dataclass
class ProductListing:
    """Standardized product listing from any marketplace."""

    name: str
    price: int  # JPY
    condition: str  # "new", "like_new", "good", "acceptable", "unknown"
    url: str
    source: str  # "amazon", "mercari", "yahoo"
    image_url: str | None = None
    seller: str | None = None
    scraped_at: datetime | None = None

    def __post_init__(self) -> None:
        if self.scraped_at is None:
            self.scraped_at = datetime.now(tz=timezone.utc)


class BaseSiteScraper(ABC):
    """Abstract base for all marketplace scrapers with stealth Playwright setup."""

    def __init__(self, config: dict[str, Any]) -> None:
        self.config = config
        self.logger = logging.getLogger(self.__class__.__name__)
        scraping = config.get("scraping", {})
        self._headless = scraping.get("headless", True)
        self._min_sleep = scraping.get("min_sleep", 2.0)
        self._max_sleep = scraping.get("max_sleep", 5.0)
        self._max_retries = scraping.get("max_retries", 3)
        self._timeout = scraping.get("timeout", 30) * 1000  # ms

    @abstractmethod
    async def search(
        self, keyword: str, max_results: int = 20
    ) -> list[ProductListing]:
        """Search for products by keyword."""
        ...

    @abstractmethod
    async def get_product_detail(self, url: str) -> ProductListing | None:
        """Fetch detail for a single product URL."""
        ...

    async def _create_browser_context(self) -> tuple[Any, Any, BrowserContext]:
        """Create Playwright browser context with stealth settings.

        Returns (playwright, browser, context) tuple. Caller must close all three.
        """
        pw = await async_playwright().start()
        browser = await pw.chromium.launch(headless=self._headless)

        viewport_w = random.randint(1280, 1920)
        viewport_h = random.randint(720, 1080)

        context = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": viewport_w, "height": viewport_h},
            locale="ja-JP",
            timezone_id="Asia/Tokyo",
        )

        # Disable webdriver detection
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        """)

        return pw, browser, context

    async def _random_sleep(self) -> None:
        """Sleep for a random duration between min_sleep and max_sleep."""
        duration = random.uniform(self._min_sleep, self._max_sleep)
        await asyncio.sleep(duration)

    async def _safe_goto(self, page: Page, url: str) -> bool:
        """Navigate with timeout and retry. Returns True on success."""
        for attempt in range(self._max_retries):
            try:
                await page.goto(url, timeout=self._timeout, wait_until="domcontentloaded")
                return True
            except Exception as e:
                self.logger.warning(
                    "Navigation attempt %d/%d failed for %s: %s",
                    attempt + 1, self._max_retries, url, e,
                )
                if attempt < self._max_retries - 1:
                    await self._random_sleep()
        return False

    @staticmethod
    def _parse_price_text(text: str) -> int:
        """Convert price text like '¥1,234' or '1,234円' to int 1234."""
        import re

        cleaned = re.sub(r"[^\d]", "", text)
        return int(cleaned) if cleaned else 0
