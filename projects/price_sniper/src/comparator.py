"""Compare Amazon reference prices against secondary market listings."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from .sites.base_site import ProductListing

logger = logging.getLogger(__name__)


@dataclass
class ArbitrageOpportunity:
    """A profitable price discrepancy between Amazon and a secondary market."""

    amazon_listing: ProductListing  # Market price reference (sell here)
    source_listing: ProductListing  # Secondary market (buy here)
    gross_profit: int  # amazon_price - source_price
    net_profit: int  # After fees and shipping
    profit_percent: float
    found_at: datetime


class ArbitrageComparator:
    """Finds profitable arbitrage opportunities between Amazon and secondary markets."""

    def __init__(
        self,
        amazon_fee_percent: float = 10.0,
        shipping_cost: int = 500,
        min_profit_yen: int = 1000,
        min_profit_percent: float = 15.0,
    ) -> None:
        self._amazon_fee_pct = amazon_fee_percent
        self._shipping_cost = shipping_cost
        self._min_profit_yen = min_profit_yen
        self._min_profit_pct = min_profit_percent

    def compare(
        self,
        amazon_listings: list[ProductListing],
        secondary_listings: list[ProductListing],
    ) -> list[ArbitrageOpportunity]:
        """Cross-compare listings, return profitable opportunities sorted by net_profit desc.

        Strategy: For each secondary listing, find Amazon listings of similar products
        and calculate potential profit from buying on secondary market and selling on Amazon.
        """
        if not amazon_listings or not secondary_listings:
            return []

        # Build a simple name-based lookup for Amazon prices
        # Use the highest Amazon price per product name keyword set
        opportunities: list[ArbitrageOpportunity] = []

        for source in secondary_listings:
            best_match = self._find_best_amazon_match(source, amazon_listings)
            if best_match is None:
                continue

            net_profit, profit_pct = self._calculate_profit(
                best_match.price, source.price
            )

            if net_profit >= self._min_profit_yen and profit_pct >= self._min_profit_pct:
                opportunities.append(
                    ArbitrageOpportunity(
                        amazon_listing=best_match,
                        source_listing=source,
                        gross_profit=best_match.price - source.price,
                        net_profit=net_profit,
                        profit_percent=profit_pct,
                        found_at=datetime.now(tz=timezone.utc),
                    )
                )

        opportunities.sort(key=lambda x: x.net_profit, reverse=True)
        logger.info("Found %d arbitrage opportunities", len(opportunities))
        return opportunities

    def _find_best_amazon_match(
        self, source: ProductListing, amazon_listings: list[ProductListing]
    ) -> ProductListing | None:
        """Find the best matching Amazon listing by name similarity.

        Uses simple keyword overlap scoring.
        """
        source_words = set(self._normalize_name(source.name).split())
        if len(source_words) < 2:
            return None

        best_match: ProductListing | None = None
        best_score = 0

        for amazon in amazon_listings:
            amazon_words = set(self._normalize_name(amazon.name).split())
            overlap = len(source_words & amazon_words)
            total = len(source_words | amazon_words)
            score = overlap / total if total > 0 else 0

            # Require at least 30% word overlap and source must be cheaper
            if score > 0.3 and score > best_score and source.price < amazon.price:
                best_score = score
                best_match = amazon

        return best_match

    def _calculate_profit(
        self, amazon_price: int, source_price: int
    ) -> tuple[int, float]:
        """Returns (net_profit_yen, profit_percent) after deducting fees and shipping.

        Net profit = Amazon price - Amazon fees - Source price - Shipping
        """
        amazon_fee = int(amazon_price * self._amazon_fee_pct / 100)
        net_profit = amazon_price - amazon_fee - source_price - self._shipping_cost
        profit_pct = (net_profit / source_price * 100) if source_price > 0 else 0.0
        return net_profit, round(profit_pct, 2)

    def format_alert(self, opportunity: ArbitrageOpportunity) -> str:
        """Format human-readable alert message for notification."""
        return (
            f"💰 裁定取引チャンス!\n"
            f"商品: {opportunity.source_listing.name[:80]}\n"
            f"仕入先: {opportunity.source_listing.source} ¥{opportunity.source_listing.price:,}\n"
            f"販売先: Amazon ¥{opportunity.amazon_listing.price:,}\n"
            f"純利益: ¥{opportunity.net_profit:,} ({opportunity.profit_percent:.1f}%)\n"
            f"仕入URL: {opportunity.source_listing.url}\n"
            f"Amazon: {opportunity.amazon_listing.url}"
        )

    @staticmethod
    def _normalize_name(name: str) -> str:
        """Normalize product name for comparison."""
        import re

        name = name.lower()
        # Remove common noise words and special characters
        name = re.sub(r"[【】\[\]()（）「」『』]", " ", name)
        name = re.sub(r"\s+", " ", name).strip()
        return name
