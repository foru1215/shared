"""Yahoo Auctions Japan scraper implementation."""

from __future__ import annotations

import logging
from typing import Any
from urllib.parse import quote_plus

from .base_site import BaseSiteScraper, ProductListing

logger = logging.getLogger(__name__)


class YahooAuctionScraper(BaseSiteScraper):
    """Scrapes Yahoo Auctions Japan listings."""

    BASE_URL = "https://auctions.yahoo.co.jp"

    async def search(
        self, keyword: str, max_results: int = 20
    ) -> list[ProductListing]:
        """Search Yahoo Auctions, extract auction cards."""
        pw, browser, context = await self._create_browser_context()
        listings: list[ProductListing] = []

        try:
            page = await context.new_page()
            search_url = (
                f"{self.BASE_URL}/search/search?p={quote_plus(keyword)}"
                "&va=&fixed=2&exflg=1&b=1&n=50"
            )
            self.logger.info("Searching Yahoo Auctions: %s", keyword)

            if not await self._safe_goto(page, search_url):
                self.logger.error("Failed to load Yahoo Auctions search page")
                return listings

            await self._random_sleep()

            # Extract auction items
            items = await page.query_selector_all(
                '.Product, [class*="ProductItem"], .cf li'
            )

            for item in items[:max_results]:
                try:
                    listing = await self._parse_auction_item(item)
                    if listing and listing.price > 0:
                        listings.append(listing)
                except Exception:
                    self.logger.debug("Failed to parse Yahoo auction item", exc_info=True)

            self.logger.info(
                "Found %d Yahoo Auction listings for '%s'", len(listings), keyword
            )

        except Exception:
            self.logger.exception("Yahoo Auctions search failed for '%s'", keyword)
        finally:
            await context.close()
            await browser.close()
            await pw.stop()

        return listings

    async def get_product_detail(self, url: str) -> ProductListing | None:
        """Fetch auction detail: current bid, buy-now price."""
        pw, browser, context = await self._create_browser_context()

        try:
            page = await context.new_page()
            if not await self._safe_goto(page, url):
                return None

            await self._random_sleep()

            # Title
            title_el = await page.query_selector("h1.ProductTitle__text, h1")
            title = (await title_el.inner_text()).strip() if title_el else "Unknown"

            # Price - try buy-it-now price first, then current bid
            price = 0
            buy_now_el = await page.query_selector(
                '.ProductDetail__buynow .ProductDetail__price, [class*="bidNow"] [class*="price"]'
            )
            if buy_now_el:
                price_text = await buy_now_el.inner_text()
                price = self._parse_price_text(price_text)

            if price == 0:
                bid_el = await page.query_selector(
                    '.ProductDetail__bid .ProductDetail__price, [class*="currentPrice"]'
                )
                if bid_el:
                    price_text = await bid_el.inner_text()
                    price = self._parse_price_text(price_text)

            # Condition
            condition = "unknown"
            cond_el = await page.query_selector(
                '[class*="Condition"], [class*="condition"]'
            )
            if cond_el:
                cond_text = (await cond_el.inner_text()).strip()
                condition = self._parse_yahoo_condition(cond_text)

            return ProductListing(
                name=title,
                price=price,
                condition=condition,
                url=url,
                source="yahoo",
            )

        except Exception:
            self.logger.exception("Yahoo detail fetch failed for %s", url)
            return None
        finally:
            await context.close()
            await browser.close()
            await pw.stop()

    async def _parse_auction_item(self, item: Any) -> ProductListing | None:
        """Parse a single auction search result item."""
        # Title and link
        link_el = await item.query_selector("a")
        if not link_el:
            return None

        href = await link_el.get_attribute("href") or ""
        url = href if href.startswith("http") else f"{self.BASE_URL}{href}"

        title_el = await item.query_selector(
            '.Product__titleLink, [class*="title"] a, a'
        )
        title = ""
        if title_el:
            title = (await title_el.inner_text()).strip()
        if not title:
            title = (await link_el.get_attribute("title")) or "Unknown"

        # Price
        price = 0
        price_el = await item.query_selector(
            '.Product__priceValue, [class*="price"]'
        )
        if price_el:
            price_text = await price_el.inner_text()
            price = self._parse_price_text(price_text)

        # Image
        img_el = await item.query_selector("img")
        image_url = await img_el.get_attribute("src") if img_el else None

        return ProductListing(
            name=title,
            price=price,
            condition="unknown",
            url=url,
            source="yahoo",
            image_url=image_url,
        )

    @staticmethod
    def _parse_yahoo_condition(text: str) -> str:
        """Map Yahoo Auctions condition text to normalized string."""
        if "新品" in text or "未使用" in text:
            return "new"
        if "未使用に近い" in text:
            return "like_new"
        if "目立った傷や汚れなし" in text:
            return "good"
        if "中古" in text or "傷" in text:
            return "acceptable"
        return "unknown"
