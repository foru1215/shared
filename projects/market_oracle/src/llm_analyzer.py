"""LLM-based sentiment analysis for market data."""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .data_fetcher import MarketData, NewsHeadline
from .storage import SentimentResult

logger = logging.getLogger(__name__)

DEFAULT_SYSTEM_PROMPT = """You are a financial market analyst. Analyze the provided market data and news headlines for the given asset/symbol.

Return your analysis as a JSON object with the following structure:
{
    "sentiment_score": <integer 0-100, where 0=extremely bearish, 50=neutral, 100=extremely bullish>,
    "reasoning": "<brief explanation of your analysis>",
    "key_factors": ["<factor1>", "<factor2>", ...],
    "confidence": <float 0.0-1.0, your confidence in this assessment>
}

Be objective and base your analysis on the data provided. Consider price trends, volume changes, and news sentiment together."""


class LLMAnalyzer:
    """Uses Claude or Gemini to produce sentiment scores from market + news data."""

    def __init__(
        self,
        llm_client: Any,  # LLMBackend from shared_lib
        prompt_template_path: Path | None = None,
    ) -> None:
        self._llm = llm_client
        if prompt_template_path and prompt_template_path.exists():
            self._system_prompt = prompt_template_path.read_text(encoding="utf-8")
        else:
            self._system_prompt = DEFAULT_SYSTEM_PROMPT

    async def analyze_symbol(
        self,
        symbol: str,
        market_data: list[MarketData],
        headlines: list[NewsHeadline],
    ) -> SentimentResult:
        """Build prompt with market context + headlines, call LLM, parse JSON response."""
        user_prompt = self._build_prompt(symbol, market_data, headlines)

        try:
            response = await self._llm.generate(
                system_prompt=self._system_prompt,
                user_prompt=user_prompt,
                json_mode=True,
            )
            return self._parse_response(symbol, response)
        except Exception:
            logger.exception("LLM analysis failed for %s", symbol)
            return SentimentResult(
                symbol=symbol,
                sentiment_score=50,
                reasoning="Analysis failed - returning neutral score",
                key_factors=["error"],
                confidence=0.0,
                llm_model="error",
            )

    async def analyze_batch(
        self,
        data_map: dict[str, tuple[list[MarketData], list[NewsHeadline]]],
    ) -> list[SentimentResult]:
        """Analyze multiple symbols sequentially to respect rate limits."""
        results: list[SentimentResult] = []
        for symbol, (market_data, headlines) in data_map.items():
            result = await self.analyze_symbol(symbol, market_data, headlines)
            results.append(result)
        return results

    def _build_prompt(
        self,
        symbol: str,
        market_data: list[MarketData],
        headlines: list[NewsHeadline],
    ) -> str:
        """Format market data and headlines into a structured prompt."""
        sections: list[str] = [f"## Analysis for: {symbol}\n"]

        # Market data section
        if market_data:
            sections.append("### Recent Price Data")
            for d in market_data[-10:]:  # Last 10 data points
                sections.append(
                    f"  {d.timestamp.strftime('%Y-%m-%d %H:%M')} | "
                    f"O:{d.open:.2f} H:{d.high:.2f} L:{d.low:.2f} C:{d.close:.2f} | "
                    f"Vol:{d.volume:,.0f} | Change:{d.change_percent:+.2f}%"
                )

            latest = market_data[-1]
            oldest = market_data[0]
            if oldest.close > 0:
                period_change = ((latest.close - oldest.close) / oldest.close) * 100
                sections.append(f"\nPeriod change: {period_change:+.2f}%")
                sections.append(f"Latest price: {latest.close:.2f}")

        # News headlines section
        if headlines:
            sections.append("\n### Recent News Headlines")
            for h in headlines[:15]:
                sections.append(f"  - [{h.source}] {h.title}")

        sections.append(
            "\nPlease analyze this data and return your sentiment assessment as JSON."
        )
        return "\n".join(sections)

    def _parse_response(self, symbol: str, response: Any) -> SentimentResult:
        """Parse LLM JSON response into SentimentResult."""
        try:
            data = json.loads(response.text)
            return SentimentResult(
                symbol=symbol,
                sentiment_score=max(0, min(100, int(data.get("sentiment_score", 50)))),
                reasoning=str(data.get("reasoning", "")),
                key_factors=data.get("key_factors", []),
                confidence=max(0.0, min(1.0, float(data.get("confidence", 0.5)))),
                analyzed_at=datetime.now(tz=timezone.utc),
                llm_model=response.model,
            )
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            logger.warning("Failed to parse LLM response for %s: %s", symbol, e)
            return SentimentResult(
                symbol=symbol,
                sentiment_score=50,
                reasoning=f"Parse error: {response.text[:200]}",
                key_factors=["parse_error"],
                confidence=0.0,
                analyzed_at=datetime.now(tz=timezone.utc),
                llm_model=getattr(response, "model", "unknown"),
            )
