"""Data persistence with SQLite and CSV backends."""

from __future__ import annotations

import csv
import json
import logging
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Protocol

logger = logging.getLogger(__name__)


class SentimentResult:
    """Sentiment analysis result from LLM."""

    __slots__ = (
        "symbol",
        "sentiment_score",
        "reasoning",
        "key_factors",
        "confidence",
        "analyzed_at",
        "llm_model",
    )

    def __init__(
        self,
        symbol: str,
        sentiment_score: int,
        reasoning: str,
        key_factors: list[str] | None = None,
        confidence: float = 0.0,
        analyzed_at: datetime | None = None,
        llm_model: str = "",
    ) -> None:
        self.symbol = symbol
        self.sentiment_score = sentiment_score
        self.reasoning = reasoning
        self.key_factors = key_factors or []
        self.confidence = confidence
        self.analyzed_at = analyzed_at or datetime.now(tz=timezone.utc)
        self.llm_model = llm_model


class StorageBackend(Protocol):
    def save_sentiment(self, result: SentimentResult) -> None: ...
    def save_market_data(self, data: list[Any]) -> None: ...
    def load_sentiments(self, symbol: str, days: int = 30) -> list[SentimentResult]: ...
    def load_market_data(self, symbol: str, days: int = 30) -> list[dict[str, Any]]: ...


class SQLiteStorage:
    """SQLite-backed storage with auto-created tables."""

    def __init__(self, db_path: Path) -> None:
        self._db_path = db_path
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_tables()

    def _init_tables(self) -> None:
        with sqlite3.connect(self._db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS sentiments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    sentiment_score INTEGER NOT NULL,
                    reasoning TEXT,
                    key_factors TEXT,
                    confidence REAL,
                    analyzed_at TEXT NOT NULL,
                    llm_model TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS market_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    symbol TEXT NOT NULL,
                    source TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    open REAL, high REAL, low REAL, close REAL,
                    volume REAL, change_percent REAL
                )
            """)
            conn.commit()

    def save_sentiment(self, result: SentimentResult) -> None:
        try:
            with sqlite3.connect(self._db_path) as conn:
                conn.execute(
                    """INSERT INTO sentiments
                       (symbol, sentiment_score, reasoning, key_factors, confidence, analyzed_at, llm_model)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (
                        result.symbol,
                        result.sentiment_score,
                        result.reasoning,
                        json.dumps(result.key_factors, ensure_ascii=False),
                        result.confidence,
                        result.analyzed_at.isoformat(),
                        result.llm_model,
                    ),
                )
                conn.commit()
            logger.info("Saved sentiment for %s: score=%d", result.symbol, result.sentiment_score)
        except Exception:
            logger.exception("Failed to save sentiment for %s", result.symbol)

    def save_market_data(self, data: list[Any]) -> None:
        try:
            with sqlite3.connect(self._db_path) as conn:
                for d in data:
                    conn.execute(
                        """INSERT INTO market_data
                           (symbol, source, timestamp, open, high, low, close, volume, change_percent)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        (
                            d.symbol,
                            d.source,
                            d.timestamp.isoformat(),
                            d.open,
                            d.high,
                            d.low,
                            d.close,
                            d.volume,
                            d.change_percent,
                        ),
                    )
                conn.commit()
            logger.info("Saved %d market data rows", len(data))
        except Exception:
            logger.exception("Failed to save market data")

    def load_sentiments(self, symbol: str, days: int = 30) -> list[SentimentResult]:
        try:
            with sqlite3.connect(self._db_path) as conn:
                cursor = conn.execute(
                    """SELECT symbol, sentiment_score, reasoning, key_factors,
                              confidence, analyzed_at, llm_model
                       FROM sentiments
                       WHERE symbol = ?
                       ORDER BY analyzed_at DESC
                       LIMIT ?""",
                    (symbol, days * 10),
                )
                results: list[SentimentResult] = []
                for row in cursor.fetchall():
                    results.append(
                        SentimentResult(
                            symbol=row[0],
                            sentiment_score=row[1],
                            reasoning=row[2] or "",
                            key_factors=json.loads(row[3]) if row[3] else [],
                            confidence=row[4] or 0.0,
                            analyzed_at=datetime.fromisoformat(row[5]),
                            llm_model=row[6] or "",
                        )
                    )
                return results
        except Exception:
            logger.exception("Failed to load sentiments for %s", symbol)
            return []

    def load_market_data(self, symbol: str, days: int = 30) -> list[dict[str, Any]]:
        try:
            with sqlite3.connect(self._db_path) as conn:
                cursor = conn.execute(
                    """SELECT symbol, source, timestamp, open, high, low, close,
                              volume, change_percent
                       FROM market_data
                       WHERE symbol = ?
                       ORDER BY timestamp DESC
                       LIMIT ?""",
                    (symbol, days * 24),
                )
                return [
                    {
                        "symbol": r[0], "source": r[1], "timestamp": r[2],
                        "open": r[3], "high": r[4], "low": r[5], "close": r[6],
                        "volume": r[7], "change_percent": r[8],
                    }
                    for r in cursor.fetchall()
                ]
        except Exception:
            logger.exception("Failed to load market data for %s", symbol)
            return []


class CSVStorage:
    """CSV-file-backed storage. One file per data type."""

    def __init__(self, csv_dir: Path) -> None:
        self._csv_dir = csv_dir
        csv_dir.mkdir(parents=True, exist_ok=True)

    def save_sentiment(self, result: SentimentResult) -> None:
        path = self._csv_dir / "sentiments.csv"
        try:
            write_header = not path.exists()
            with open(path, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                if write_header:
                    writer.writerow([
                        "symbol", "sentiment_score", "reasoning",
                        "key_factors", "confidence", "analyzed_at", "llm_model",
                    ])
                writer.writerow([
                    result.symbol,
                    result.sentiment_score,
                    result.reasoning,
                    json.dumps(result.key_factors, ensure_ascii=False),
                    result.confidence,
                    result.analyzed_at.isoformat(),
                    result.llm_model,
                ])
        except Exception:
            logger.exception("Failed to save sentiment CSV")

    def save_market_data(self, data: list[Any]) -> None:
        path = self._csv_dir / "market_data.csv"
        try:
            write_header = not path.exists()
            with open(path, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                if write_header:
                    writer.writerow([
                        "symbol", "source", "timestamp", "open", "high",
                        "low", "close", "volume", "change_percent",
                    ])
                for d in data:
                    writer.writerow([
                        d.symbol, d.source, d.timestamp.isoformat(),
                        d.open, d.high, d.low, d.close, d.volume, d.change_percent,
                    ])
        except Exception:
            logger.exception("Failed to save market data CSV")

    def load_sentiments(self, symbol: str, days: int = 30) -> list[SentimentResult]:
        path = self._csv_dir / "sentiments.csv"
        if not path.exists():
            return []
        try:
            results: list[SentimentResult] = []
            with open(path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row["symbol"] == symbol:
                        results.append(
                            SentimentResult(
                                symbol=row["symbol"],
                                sentiment_score=int(row["sentiment_score"]),
                                reasoning=row["reasoning"],
                                key_factors=json.loads(row["key_factors"]) if row["key_factors"] else [],
                                confidence=float(row["confidence"]),
                                analyzed_at=datetime.fromisoformat(row["analyzed_at"]),
                                llm_model=row["llm_model"],
                            )
                        )
            return results
        except Exception:
            logger.exception("Failed to load sentiments CSV")
            return []

    def load_market_data(self, symbol: str, days: int = 30) -> list[dict[str, Any]]:
        path = self._csv_dir / "market_data.csv"
        if not path.exists():
            return []
        try:
            results: list[dict[str, Any]] = []
            with open(path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row["symbol"] == symbol:
                        results.append(dict(row))
            return results
        except Exception:
            logger.exception("Failed to load market data CSV")
            return []


def create_storage(config: dict[str, Any]) -> StorageBackend:
    """Factory: create a storage backend from config."""
    storage_config = config.get("storage", {})
    backend = storage_config.get("backend", "sqlite")

    if backend == "sqlite":
        db_path = Path(storage_config.get("sqlite_path", "./data/market_oracle.db"))
        return SQLiteStorage(db_path)

    if backend == "csv":
        csv_dir = Path(storage_config.get("csv_dir", "./data/csv"))
        return CSVStorage(csv_dir)

    raise ValueError(f"Unknown storage backend: {backend}")
