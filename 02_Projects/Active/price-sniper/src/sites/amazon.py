"""Amazon JP scraper implementation."""

from __future__ import annotations

import logging
from typing import Any
from urllib.parse import quote_plus

from .base_site import BaseSiteScraper, ProductListing

logger = logging.getLogger(__name__)


class AmazonJPScraper(BaseSiteScraper):
    """Scrapes Amazon.co.jp product listings."""

    BASE_URL = "https://www.amazon.co.jp"

    async def search(
        self, keyword: str, max_results: int = 20
    ) -> list[ProductListing]:
        """Search Amazon JP, extract product cards from search results page."""
        pw, browser, context = await self._create_browser_context()
        listings: list[ProductListing] = []

        try:
            page = await context.new_page()
            search_url = self._build_search_url(keyword)
            self.logger.info("Searching Amazon JP: %s", keyword)

            if not await self._safe_goto(page, search_url):
                self.logger.error("Failed to load Amazon search page")
                return listings

            await self._random_sleep()

            # Extract product cards
            cards = await page.query_selector_all(
                '[data-component-type="s-search-result"]'
            )

            for card in cards[:max_results]:
                try:
                    listing = await self._parse_search_card(card)
                    if listing and listing.price > 0:
                        listings.append(listing)
                except Exception:
                    self.logger.debug("Failed to parse a product card", exc_info=True)

            self.logger.info(
                "Found %d Amazon listings for '%s'", len(listings), keyword
            )

        except Exception:
            self.logger.exception("Amazon search failed for '%s'", keyword)
        finally:
            await context.close()
            await browser.close()
            await pw.stop()

        return listings

    async def get_product_detail(self, url: str) -> ProductListing | None:
        """Fetch individual product page for price, condition, seller."""
        pw, browser, context = await self._create_browser_context()

        try:
            page = await context.new_page()
            if not await self._safe_goto(page, url):
                return None

            await self._random_sleep()

            title_el = await page.query_selector("#productTitle")
            title = (await title_el.inner_text()).strip() if title_el else "Unknown"

            price = 0
            price_el = await page.query_selector(".a-price .a-offscreen")
            if price_el:
                price_text = await price_el.inner_text()
                price = self._parse_price_text(price_text)

            return ProductListing(
                name=title,
                price=price,
                condition="new",
                url=url,
                source="amazon",
            )

        except Exception:
            self.logger.exception("Amazon detail fetch failed for %s", url)
            return None
        finally:
            await context.close()
            await browser.close()
            await pw.stop()

    async def _parse_search_card(self, card: Any) -> ProductListing | None:
        """Parse a single search result card element."""
        # Title
        title_el = await card.query_selector(
            "h2 a span, .a-size-medium.a-color-base.a-text-normal"
        )
        if not title_el:
            return None
        title = (await title_el.inner_text()).strip()

        # URL
        link_el = await card.query_selector("h2 a")
        href = await link_el.get_attribute("href") if link_el else ""
        url = f"{self.BASE_URL}{href}" if href and not href.startswith("http") else href or ""

        # Price
        price = 0
        price_el = await card.query_selector(".a-price .a-offscreen")
        if price_el:
            price_text = await price_el.inner_text()
            price = self._parse_price_text(price_text)

        # Image
        img_el = await card.query_selector("img.s-image")
        image_url = await img_el.get_attribute("src") if img_el else None

        return ProductListing(
            name=title,
            price=price,
            condition="new",
            url=url,
            source="amazon",
            image_url=image_url,
        )

    def _build_search_url(self, keyword: str, page: int = 1) -> str:
        encoded = quote_plus(keyword)
        return f"{self.BASE_URL}/s?k={encoded}&page={page}"
