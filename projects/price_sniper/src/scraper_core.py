"""Orchestrates the full scraping cycle for arbitrage detection."""

from __future__ import annotations

import asyncio
import csv
import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from .comparator import ArbitrageComparator, ArbitrageOpportunity
from .sites.amazon import AmazonJPScraper
from .sites.base_site import ProductListing
from .sites.mercari import MercariScraper
from .sites.yahoo import YahooAuctionScraper

logger = logging.getLogger(__name__)


class ScraperCore:
    """Orchestrates scraping across all sites for a keyword."""

    def __init__(self, config: dict[str, Any], notifier: Any) -> None:
        self.amazon = AmazonJPScraper(config)
        self.mercari = MercariScraper(config)
        self.yahoo = YahooAuctionScraper(config)

        arb_config = config.get("arbitrage", {})
        self.comparator = ArbitrageComparator(
            amazon_fee_percent=arb_config.get("amazon_fee_percent", 10.0),
            shipping_cost=arb_config.get("shipping_cost_yen", 500),
            min_profit_yen=arb_config.get("min_profit_yen", 1000),
            min_profit_percent=arb_config.get("min_profit_percent", 15.0),
        )
        self.notifier = notifier

    async def run_keyword(
        self, keyword: str
    ) -> list[ArbitrageOpportunity]:
        """Full scraping cycle for one keyword."""
        logger.info("=== Scanning keyword: %s ===", keyword)

        # 1. Scrape Amazon for market prices
        amazon_listings = await self.amazon.search(keyword)
        logger.info("Amazon: %d listings", len(amazon_listings))

        # 2. Scrape Mercari + Yahoo concurrently
        mercari_task = self.mercari.search(keyword)
        yahoo_task = self.yahoo.search(keyword)
        mercari_listings, yahoo_listings = await asyncio.gather(
            mercari_task, yahoo_task, return_exceptions=False
        )

        # Handle exceptions from gather
        if isinstance(mercari_listings, Exception):
            logger.error("Mercari scraping failed: %s", mercari_listings)
            mercari_listings = []
        if isinstance(yahoo_listings, Exception):
            logger.error("Yahoo scraping failed: %s", yahoo_listings)
            yahoo_listings = []

        logger.info(
            "Mercari: %d, Yahoo: %d listings",
            len(mercari_listings), len(yahoo_listings),
        )

        # 3. Compare via ArbitrageComparator
        secondary = list(mercari_listings) + list(yahoo_listings)
        opportunities = self.comparator.compare(amazon_listings, secondary)

        # 4. Send notifications for opportunities
        for opp in opportunities:
            alert_msg = self.comparator.format_alert(opp)
            try:
                await self.notifier.send(
                    f"裁定取引アラート: {keyword}", alert_msg
                )
            except Exception:
                logger.exception("Failed to send notification")

        return opportunities

    async def run_all_keywords(
        self, keywords: list[str]
    ) -> dict[str, list[ArbitrageOpportunity]]:
        """Run each keyword sequentially to avoid rate limiting."""
        all_results: dict[str, list[ArbitrageOpportunity]] = {}

        for keyword in keywords:
            try:
                results = await self.run_keyword(keyword)
                all_results[keyword] = results
            except Exception:
                logger.exception("Failed to process keyword: %s", keyword)
                all_results[keyword] = []

        total = sum(len(v) for v in all_results.values())
        logger.info("Total opportunities found: %d", total)
        return all_results

    def save_results_csv(
        self,
        opportunities: list[ArbitrageOpportunity],
        output_path: Path,
    ) -> None:
        """Save opportunities to a CSV file."""
        output_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with open(output_path, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "found_at", "product_name", "source", "source_price",
                    "amazon_price", "gross_profit", "net_profit",
                    "profit_percent", "source_url", "amazon_url",
                ])
                for opp in opportunities:
                    writer.writerow([
                        opp.found_at.isoformat(),
                        opp.source_listing.name[:100],
                        opp.source_listing.source,
                        opp.source_listing.price,
                        opp.amazon_listing.price,
                        opp.gross_profit,
                        opp.net_profit,
                        f"{opp.profit_percent:.1f}",
                        opp.source_listing.url,
                        opp.amazon_listing.url,
                    ])
            logger.info("Saved %d results to %s", len(opportunities), output_path)
        except Exception:
            logger.exception("Failed to save results CSV")
