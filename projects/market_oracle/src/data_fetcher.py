"""Data fetchers for stocks (yfinance), crypto (ccxt), and news headlines."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import aiohttp
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


@dataclass
class MarketData:
    """Standardized market data point."""

    symbol: str
    source: str  # "yfinance" or "ccxt"
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float
    change_percent: float


@dataclass
class NewsHeadline:
    """Scraped news headline."""

    title: str
    source: str
    url: str
    published_at: datetime | None = None
    snippet: str | None = None


class StockFetcher:
    """Fetches stock data via yfinance. Runs in asyncio.to_thread since yfinance is sync."""

    def __init__(self, symbols: list[str], interval: str = "1d") -> None:
        self._symbols = symbols
        self._interval = interval

    async def fetch(self, period: str = "5d") -> list[MarketData]:
        """Fetch historical OHLCV data for all configured symbols."""
        results: list[MarketData] = []
        for symbol in self._symbols:
            try:
                data = await self._fetch_symbol(symbol, period)
                results.extend(data)
            except Exception:
                logger.exception("Failed to fetch stock data for %s", symbol)
        return results

    async def _fetch_symbol(self, symbol: str, period: str) -> list[MarketData]:
        """Fetch one symbol's data in a thread."""

        def _download() -> list[MarketData]:
            import yfinance as yf

            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=self._interval)
            items: list[MarketData] = []
            for idx, row in hist.iterrows():
                ts = idx.to_pydatetime()
                if ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                prev_close = row.get("Close", 0)
                change_pct = 0.0
                if len(items) > 0 and items[-1].close > 0:
                    change_pct = ((row["Close"] - items[-1].close) / items[-1].close) * 100

                items.append(
                    MarketData(
                        symbol=symbol,
                        source="yfinance",
                        timestamp=ts,
                        open=float(row["Open"]),
                        high=float(row["High"]),
                        low=float(row["Low"]),
                        close=float(row["Close"]),
                        volume=float(row["Volume"]),
                        change_percent=round(change_pct, 4),
                    )
                )
            return items

        return await asyncio.to_thread(_download)

    async def fetch_realtime(self, symbol: str) -> MarketData | None:
        """Fetch the most recent data point for a single symbol."""
        try:
            data = await self._fetch_symbol(symbol, "1d")
            return data[-1] if data else None
        except Exception:
            logger.exception("Failed to fetch realtime data for %s", symbol)
            return None


class CryptoFetcher:
    """Fetches crypto data via ccxt async."""

    def __init__(
        self, exchange_id: str = "binance", symbols: list[str] | None = None
    ) -> None:
        self._exchange_id = exchange_id
        self._symbols = symbols or ["BTC/USDT", "ETH/USDT"]

    async def fetch_ohlcv(
        self, timeframe: str = "1h", limit: int = 100
    ) -> list[MarketData]:
        """Fetch OHLCV candles for all configured symbols."""
        import ccxt.async_support as ccxt_async

        exchange = getattr(ccxt_async, self._exchange_id)({"enableRateLimit": True})
        results: list[MarketData] = []

        try:
            for symbol in self._symbols:
                try:
                    ohlcv = await exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
                    for candle in ohlcv:
                        ts = datetime.fromtimestamp(candle[0] / 1000, tz=timezone.utc)
                        results.append(
                            MarketData(
                                symbol=symbol,
                                source="ccxt",
                                timestamp=ts,
                                open=float(candle[1]),
                                high=float(candle[2]),
                                low=float(candle[3]),
                                close=float(candle[4]),
                                volume=float(candle[5]),
                                change_percent=0.0,
                            )
                        )
                except Exception:
                    logger.exception("Failed to fetch OHLCV for %s", symbol)
        finally:
            await exchange.close()

        return results

    async def fetch_ticker(self, symbol: str) -> MarketData | None:
        """Fetch the latest ticker for a single symbol."""
        import ccxt.async_support as ccxt_async

        exchange = getattr(ccxt_async, self._exchange_id)({"enableRateLimit": True})
        try:
            ticker = await exchange.fetch_ticker(symbol)
            return MarketData(
                symbol=symbol,
                source="ccxt",
                timestamp=datetime.now(tz=timezone.utc),
                open=float(ticker.get("open", 0) or 0),
                high=float(ticker.get("high", 0) or 0),
                low=float(ticker.get("low", 0) or 0),
                close=float(ticker.get("last", 0) or 0),
                volume=float(ticker.get("baseVolume", 0) or 0),
                change_percent=float(ticker.get("percentage", 0) or 0),
            )
        except Exception:
            logger.exception("Failed to fetch ticker for %s", symbol)
            return None
        finally:
            await exchange.close()


class NewsScraper:
    """Scrapes news headlines using aiohttp + BeautifulSoup."""

    DEFAULT_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
    }

    def __init__(
        self, sources: list[dict[str, str]], max_headlines: int = 20
    ) -> None:
        self._sources = sources
        self._max_headlines = max_headlines

    async def fetch_headlines(self) -> list[NewsHeadline]:
        """Fetch headlines from all configured sources concurrently."""
        tasks = [
            self._scrape_source(src["name"], src["url"])
            for src in self._sources
        ]
        results_nested = await asyncio.gather(*tasks, return_exceptions=True)
        headlines: list[NewsHeadline] = []
        for result in results_nested:
            if isinstance(result, Exception):
                logger.error("News scraping error: %s", result)
                continue
            headlines.extend(result)

        return headlines[: self._max_headlines]

    async def _scrape_source(
        self, name: str, url: str
    ) -> list[NewsHeadline]:
        """Scrape headlines from a single news source."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url,
                    headers=self.DEFAULT_HEADERS,
                    timeout=aiohttp.ClientTimeout(total=15),
                ) as resp:
                    if resp.status != 200:
                        logger.warning(
                            "News source %s returned %d", name, resp.status
                        )
                        return []
                    html = await resp.text()

            soup = BeautifulSoup(html, "html.parser")
            headlines: list[NewsHeadline] = []

            # Generic headline extraction: look for common patterns
            for tag in soup.find_all(["h2", "h3", "h4", "a"]):
                text = tag.get_text(strip=True)
                if not text or len(text) < 10:
                    continue

                link = tag.get("href", "")
                if tag.name != "a":
                    a_tag = tag.find("a")
                    if a_tag:
                        link = a_tag.get("href", "")

                if link and not link.startswith("http"):
                    from urllib.parse import urljoin
                    link = urljoin(url, link)

                headlines.append(
                    NewsHeadline(
                        title=text,
                        source=name,
                        url=link or url,
                    )
                )

            logger.info("Scraped %d headlines from %s", len(headlines), name)
            return headlines

        except Exception:
            logger.exception("Failed to scrape %s", name)
            return []
