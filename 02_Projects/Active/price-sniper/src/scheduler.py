"""Periodic execution scheduler for price scraping."""

from __future__ import annotations

import argparse
import asyncio
import logging
import signal
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent

logger = logging.getLogger(__name__)


def _add_shared_lib_to_path() -> None:
    shared_lib_path = PROJECT_ROOT.parent / "shared_lib"
    if str(shared_lib_path.parent) not in sys.path:
        sys.path.insert(0, str(shared_lib_path.parent))


_add_shared_lib_to_path()


class PriceScheduler:
    """Runs price scraping on a configurable interval."""

    def __init__(
        self,
        config: dict[str, Any],
        keywords: list[str] | None = None,
        interval_minutes: int = 60,
    ) -> None:
        self._config = config
        sched_config = config.get("scheduler", {})
        self._keywords = keywords or sched_config.get("keywords", [])
        self._interval = interval_minutes or sched_config.get("interval_minutes", 60)
        self._running = True

    async def start(self) -> None:
        """Run scraping loop indefinitely. Ctrl+C to stop."""
        logger.info(
            "Scheduler started: %d keywords, interval=%d min",
            len(self._keywords), self._interval,
        )

        while self._running:
            try:
                await self.run_once()
            except Exception:
                logger.exception("Scheduled run failed")

            if self._running:
                logger.info("Next run in %d minutes...", self._interval)
                await asyncio.sleep(self._interval * 60)

    async def run_once(self) -> None:
        """Single scraping run for all keywords."""
        from shared_lib.notifier import create_notifier

        from .scraper_core import ScraperCore

        notifier = create_notifier(self._config)
        scraper = ScraperCore(self._config, notifier)

        logger.info("--- Run started at %s ---", datetime.now(tz=timezone.utc).isoformat())
        results = await scraper.run_all_keywords(self._keywords)

        # Save results
        all_opps = [opp for opps in results.values() for opp in opps]
        if all_opps:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = PROJECT_ROOT / "data" / f"results_{timestamp}.csv"
            scraper.save_results_csv(all_opps, output_path)

        total = sum(len(v) for v in results.values())
        logger.info("--- Run complete: %d opportunities ---", total)

    def stop(self) -> None:
        """Signal the scheduler to stop."""
        self._running = False
        logger.info("Scheduler stopping...")


def main() -> None:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description="Price Sniper - Arbitrage Bot")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    parser.add_argument("--dry-run", action="store_true", help="Validate config only")
    parser.add_argument(
        "--keywords", nargs="*", default=None,
        help="Override keywords from config",
    )
    parser.add_argument(
        "--interval", type=int, default=None,
        help="Override interval (minutes)",
    )
    args = parser.parse_args()

    from shared_lib.config_loader import ProjectConfig
    from shared_lib.logger_setup import setup_logger

    config_obj = ProjectConfig(PROJECT_ROOT)
    config = config_obj.load()

    setup_logger("price_sniper", PROJECT_ROOT / "logs")

    if args.dry_run:
        sched_config = config.get("scheduler", {})
        keywords = args.keywords or sched_config.get("keywords", [])
        logger.info("[DRY-RUN] Config loaded successfully")
        logger.info("[DRY-RUN] Keywords: %s", keywords)
        logger.info("[DRY-RUN] Interval: %d min", args.interval or sched_config.get("interval_minutes", 60))
        return

    scheduler = PriceScheduler(
        config,
        keywords=args.keywords,
        interval_minutes=args.interval or 0,
    )

    if args.once:
        asyncio.run(scheduler.run_once())
    else:
        # Handle graceful shutdown
        loop = asyncio.new_event_loop()

        def _shutdown() -> None:
            scheduler.stop()

        try:
            if sys.platform != "win32":
                loop.add_signal_handler(signal.SIGINT, _shutdown)
                loop.add_signal_handler(signal.SIGTERM, _shutdown)
        except NotImplementedError:
            pass  # Windows doesn't support add_signal_handler in all cases

        try:
            loop.run_until_complete(scheduler.start())
        except KeyboardInterrupt:
            logger.info("Interrupted by user")
        finally:
            loop.close()


if __name__ == "__main__":
    main()
