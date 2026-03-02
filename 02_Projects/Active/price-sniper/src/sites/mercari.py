"""Mercari scraper implementation."""

from __future__ import annotations

import logging
from typing import Any
from urllib.parse import quote_plus

from .base_site import BaseSiteScraper, ProductListing

logger = logging.getLogger(__name__)

CONDITION_MAP = {
    "新品、未使用": "new",
    "未使用に近い": "like_new",
    "目立った傷や汚れなし": "good",
    "やや傷や汚れあり": "acceptable",
    "傷や汚れあり": "acceptable",
    "全体的に状態が悪い": "acceptable",
}


class MercariScraper(BaseSiteScraper):
    """Scrapes Mercari listings."""

    BASE_URL = "https://jp.mercari.com"

    async def search(
        self, keyword: str, max_results: int = 20
    ) -> list[ProductListing]:
        """Search Mercari for active listings."""
        pw, browser, context = await self._create_browser_context()
        listings: list[ProductListing] = []

        try:
            page = await context.new_page()
            search_url = f"{self.BASE_URL}/search?keyword={quote_plus(keyword)}&status=on_sale"
            self.logger.info("Searching Mercari: %s", keyword)

            if not await self._safe_goto(page, search_url):
                self.logger.error("Failed to load Mercari search page")
                return listings

            await self._random_sleep()

            # Wait for product grid to load
            try:
                await page.wait_for_selector(
                    '[data-testid="item-cell"], li[data-testid="search-result"]',
                    timeout=10000,
                )
            except Exception:
                self.logger.warning("Mercari search results did not load in time")
                return listings

            # Extract product items
            items = await page.query_selector_all(
                '[data-testid="item-cell"], li[data-testid="search-result"]'
            )

            for item in items[:max_results]:
                try:
                    listing = await self._parse_item(item)
                    if listing and listing.price > 0:
                        listings.append(listing)
                except Exception:
                    self.logger.debug("Failed to parse Mercari item", exc_info=True)

            self.logger.info(
                "Found %d Mercari listings for '%s'", len(listings), keyword
            )

        except Exception:
            self.logger.exception("Mercari search failed for '%s'", keyword)
        finally:
            await context.close()
            await browser.close()
            await pw.stop()

        return listings

    async def get_product_detail(self, url: str) -> ProductListing | None:
        """Fetch individual Mercari listing detail."""
        pw, browser, context = await self._create_browser_context()

        try:
            page = await context.new_page()
            if not await self._safe_goto(page, url):
                return None

            await self._random_sleep()

            title_el = await page.query_selector("h1")
            title = (await title_el.inner_text()).strip() if title_el else "Unknown"

            price = 0
            price_el = await page.query_selector(
                '[data-testid="price"], .item-price'
            )
            if price_el:
                price_text = await price_el.inner_text()
                price = self._parse_price_text(price_text)

            # Condition
            condition = "unknown"
            condition_el = await page.query_selector(
                '[data-testid="商品の状態"], .item-condition'
            )
            if condition_el:
                cond_text = (await condition_el.inner_text()).strip()
                condition = self._parse_condition(cond_text)

            return ProductListing(
                name=title,
                price=price,
                condition=condition,
                url=url,
                source="mercari",
            )

        except Exception:
            self.logger.exception("Mercari detail fetch failed for %s", url)
            return None
        finally:
            await context.close()
            await browser.close()
            await pw.stop()

    async def _parse_item(self, item: Any) -> ProductListing | None:
        """Parse a single search result item."""
        # Title and link
        link_el = await item.query_selector("a")
        if not link_el:
            return None

        href = await link_el.get_attribute("href") or ""
        url = f"{self.BASE_URL}{href}" if href and not href.startswith("http") else href

        name_el = await item.query_selector(
            '[data-testid="thumbnail-item-name"], span[class*="itemName"]'
        )
        name = (await name_el.inner_text()).strip() if name_el else ""

        if not name:
            aria = await link_el.get_attribute("aria-label")
            name = aria or "Unknown"

        # Price
        price = 0
        price_el = await item.query_selector(
            '[data-testid="thumbnail-item-price"], span[class*="price"]'
        )
        if price_el:
            price_text = await price_el.inner_text()
            price = self._parse_price_text(price_text)

        # Image
        img_el = await item.query_selector("img")
        image_url = await img_el.get_attribute("src") if img_el else None

        return ProductListing(
            name=name,
            price=price,
            condition="unknown",  # Condition not visible in search results
            url=url,
            source="mercari",
            image_url=image_url,
        )

    @staticmethod
    def _parse_condition(condition_text: str) -> str:
        """Map Japanese condition labels to normalized strings."""
        for jp_label, en_label in CONDITION_MAP.items():
            if jp_label in condition_text:
                return en_label
        return "unknown"
