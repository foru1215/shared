"""Visualization dashboard and main entry point for Market Oracle."""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _add_shared_lib_to_path() -> None:
    """Ensure shared_lib is importable."""
    shared_lib_path = PROJECT_ROOT.parent / "shared_lib"
    if str(shared_lib_path.parent) not in sys.path:
        sys.path.insert(0, str(shared_lib_path.parent))


_add_shared_lib_to_path()


class DashboardBuilder:
    """Builds interactive charts from stored data."""

    def __init__(self, storage: Any, backend: str = "plotly") -> None:
        self._storage = storage
        self._backend = backend

    def sentiment_timeline(self, symbol: str, days: int = 30) -> Any:
        """Line chart: sentiment score over time for a symbol."""
        sentiments = self._storage.load_sentiments(symbol, days)
        if not sentiments:
            logger.warning("No sentiment data for %s", symbol)
            return None

        dates = [s.analyzed_at for s in reversed(sentiments)]
        scores = [s.sentiment_score for s in reversed(sentiments)]

        if self._backend == "plotly":
            import plotly.graph_objects as go

            fig = go.Figure()
            fig.add_trace(go.Scatter(x=dates, y=scores, mode="lines+markers", name="Sentiment"))
            fig.add_hline(y=50, line_dash="dash", line_color="gray", annotation_text="Neutral")
            fig.update_layout(
                title=f"Sentiment Timeline: {symbol}",
                xaxis_title="Date",
                yaxis_title="Sentiment Score (0-100)",
                yaxis_range=[0, 100],
            )
            return fig
        else:
            import matplotlib.pyplot as plt

            fig, ax = plt.subplots(figsize=(12, 6))
            ax.plot(dates, scores, marker="o", linewidth=2)
            ax.axhline(y=50, color="gray", linestyle="--", alpha=0.5, label="Neutral")
            ax.set_title(f"Sentiment Timeline: {symbol}")
            ax.set_xlabel("Date")
            ax.set_ylabel("Sentiment Score (0-100)")
            ax.set_ylim(0, 100)
            ax.legend()
            return fig

    def price_vs_sentiment(self, symbol: str, days: int = 30) -> Any:
        """Dual-axis chart: price on left, sentiment on right."""
        sentiments = self._storage.load_sentiments(symbol, days)
        market_rows = self._storage.load_market_data(symbol, days)

        if not sentiments and not market_rows:
            logger.warning("No data for %s", symbol)
            return None

        if self._backend == "plotly":
            import plotly.graph_objects as go
            from plotly.subplots import make_subplots

            fig = make_subplots(specs=[[{"secondary_y": True}]])

            if market_rows:
                from datetime import datetime as dt

                m_dates = [r["timestamp"] for r in reversed(market_rows)]
                m_prices = [float(r["close"]) for r in reversed(market_rows)]
                fig.add_trace(
                    go.Scatter(x=m_dates, y=m_prices, name="Price", line=dict(color="blue")),
                    secondary_y=False,
                )

            if sentiments:
                s_dates = [s.analyzed_at for s in reversed(sentiments)]
                s_scores = [s.sentiment_score for s in reversed(sentiments)]
                fig.add_trace(
                    go.Scatter(x=s_dates, y=s_scores, name="Sentiment", line=dict(color="orange")),
                    secondary_y=True,
                )

            fig.update_layout(title=f"Price vs Sentiment: {symbol}")
            fig.update_yaxes(title_text="Price", secondary_y=False)
            fig.update_yaxes(title_text="Sentiment (0-100)", range=[0, 100], secondary_y=True)
            return fig
        else:
            import matplotlib.pyplot as plt

            fig, ax1 = plt.subplots(figsize=(12, 6))
            ax2 = ax1.twinx()

            if market_rows:
                m_dates = [r["timestamp"] for r in reversed(market_rows)]
                m_prices = [float(r["close"]) for r in reversed(market_rows)]
                ax1.plot(m_dates, m_prices, "b-", label="Price")

            if sentiments:
                s_dates = [s.analyzed_at for s in reversed(sentiments)]
                s_scores = [s.sentiment_score for s in reversed(sentiments)]
                ax2.plot(s_dates, s_scores, "r-", label="Sentiment")
                ax2.set_ylim(0, 100)

            ax1.set_xlabel("Date")
            ax1.set_ylabel("Price", color="blue")
            ax2.set_ylabel("Sentiment (0-100)", color="red")
            fig.suptitle(f"Price vs Sentiment: {symbol}")
            return fig

    def multi_symbol_heatmap(self, symbols: list[str], days: int = 7) -> Any:
        """Heatmap: symbols x dates, colored by sentiment score."""
        if self._backend == "plotly":
            import plotly.graph_objects as go

            z_data: list[list[int]] = []
            y_labels: list[str] = []
            x_labels: list[str] = []

            for symbol in symbols:
                sentiments = self._storage.load_sentiments(symbol, days)
                if sentiments:
                    y_labels.append(symbol)
                    scores = [s.sentiment_score for s in reversed(sentiments[:days])]
                    z_data.append(scores)
                    if not x_labels:
                        x_labels = [
                            s.analyzed_at.strftime("%m/%d")
                            for s in reversed(sentiments[:days])
                        ]

            if not z_data:
                return None

            fig = go.Figure(
                data=go.Heatmap(z=z_data, x=x_labels, y=y_labels, colorscale="RdYlGn", zmin=0, zmax=100)
            )
            fig.update_layout(title="Sentiment Heatmap")
            return fig
        return None

    def serve_dashboard(self, symbols: list[str], port: int = 8050) -> None:
        """Launch an interactive Dash web dashboard."""
        if self._backend != "plotly":
            logger.info("Matplotlib backend: saving charts as PNG files")
            output_dir = PROJECT_ROOT / "output"
            output_dir.mkdir(exist_ok=True)
            for symbol in symbols:
                fig = self.sentiment_timeline(symbol)
                if fig:
                    fig.savefig(output_dir / f"sentiment_{symbol}.png", dpi=150, bbox_inches="tight")
                fig2 = self.price_vs_sentiment(symbol)
                if fig2:
                    fig2.savefig(output_dir / f"price_vs_sentiment_{symbol}.png", dpi=150, bbox_inches="tight")
            logger.info("Charts saved to %s", output_dir)
            return

        import dash
        from dash import dcc, html

        app = dash.Dash(__name__)
        charts: list[Any] = []

        for symbol in symbols:
            fig1 = self.sentiment_timeline(symbol)
            if fig1:
                charts.append(dcc.Graph(figure=fig1))
            fig2 = self.price_vs_sentiment(symbol)
            if fig2:
                charts.append(dcc.Graph(figure=fig2))

        heatmap = self.multi_symbol_heatmap(symbols)
        if heatmap:
            charts.append(dcc.Graph(figure=heatmap))

        app.layout = html.Div([
            html.H1("Market Oracle Dashboard"),
            *charts,
        ])

        logger.info("Starting dashboard on http://localhost:%d", port)
        app.run(debug=False, port=port)


async def run_analysis(config: dict[str, Any], dry_run: bool = False) -> None:
    """Run full analysis pipeline: fetch data -> analyze -> store."""
    from shared_lib.config_loader import ProjectConfig
    from shared_lib.llm_client import create_llm_client
    from shared_lib.logger_setup import setup_logger
    from shared_lib.notifier import create_notifier

    from .data_fetcher import CryptoFetcher, NewsScraper, StockFetcher
    from .storage import create_storage

    log = setup_logger("market_oracle", PROJECT_ROOT / "logs")
    log.info("Starting Market Oracle analysis...")

    storage = create_storage(config)

    # Fetch stock data
    stock_symbols = config.get("stocks", {}).get("symbols", [])
    stock_fetcher = StockFetcher(
        stock_symbols, config.get("stocks", {}).get("interval", "1d")
    )
    stock_data = await stock_fetcher.fetch()
    log.info("Fetched %d stock data points", len(stock_data))

    if stock_data:
        storage.save_market_data(stock_data)

    # Fetch crypto data
    crypto_config = config.get("crypto", {})
    crypto_fetcher = CryptoFetcher(
        exchange_id=crypto_config.get("exchange", "binance"),
        symbols=crypto_config.get("symbols", []),
    )
    try:
        crypto_data = await crypto_fetcher.fetch_ohlcv(
            timeframe=crypto_config.get("timeframe", "1h"), limit=24
        )
        log.info("Fetched %d crypto data points", len(crypto_data))
        if crypto_data:
            storage.save_market_data(crypto_data)
    except Exception:
        log.exception("Crypto fetch failed (exchange may be unavailable)")
        crypto_data = []

    # Fetch news
    news_config = config.get("news", {})
    news_scraper = NewsScraper(
        sources=news_config.get("sources", []),
        max_headlines=news_config.get("max_headlines", 20),
    )
    headlines = await news_scraper.fetch_headlines()
    log.info("Fetched %d news headlines", len(headlines))

    if dry_run:
        log.info("[DRY-RUN] Skipping LLM analysis")
        return

    # LLM Analysis
    try:
        llm_client = create_llm_client(config)
    except ValueError as e:
        log.warning("LLM not configured, skipping analysis: %s", e)
        return

    from .llm_analyzer import LLMAnalyzer

    analyzer = LLMAnalyzer(llm_client)

    # Build data map: symbol -> (market_data, headlines)
    all_symbols = stock_symbols + crypto_config.get("symbols", [])
    all_data = stock_data + crypto_data

    for symbol in all_symbols:
        symbol_data = [d for d in all_data if d.symbol == symbol]
        result = await analyzer.analyze_symbol(symbol, symbol_data, headlines)
        storage.save_sentiment(result)
        log.info(
            "Sentiment for %s: score=%d, confidence=%.2f",
            symbol, result.sentiment_score, result.confidence,
        )

    # Notify
    notifier = create_notifier(config)
    await notifier.send(
        "Market Oracle Analysis Complete",
        f"Analyzed {len(all_symbols)} symbols. Check dashboard for details.",
    )


def main() -> None:
    """Entry point: parse args, run analysis or dashboard."""
    parser = argparse.ArgumentParser(description="Market Oracle - Sentiment Analysis")
    parser.add_argument("--analyze", action="store_true", help="Run analysis pipeline")
    parser.add_argument("--serve", action="store_true", help="Launch dashboard")
    parser.add_argument("--dry-run", action="store_true", help="Fetch data only, skip LLM")
    parser.add_argument("--port", type=int, default=8050, help="Dashboard port")
    args = parser.parse_args()

    from shared_lib.config_loader import ProjectConfig

    config_obj = ProjectConfig(PROJECT_ROOT)
    config = config_obj.load()

    if args.analyze or args.dry_run:
        asyncio.run(run_analysis(config, dry_run=args.dry_run))

    if args.serve:
        storage = __import__("src.storage", fromlist=["create_storage"]).create_storage(config)
        dash_config = config.get("dashboard", {})
        builder = DashboardBuilder(storage, backend=dash_config.get("backend", "plotly"))
        all_symbols = (
            config.get("stocks", {}).get("symbols", [])
            + config.get("crypto", {}).get("symbols", [])
        )
        builder.serve_dashboard(all_symbols, port=args.port or dash_config.get("port", 8050))

    if not args.analyze and not args.serve and not args.dry_run:
        parser.print_help()
