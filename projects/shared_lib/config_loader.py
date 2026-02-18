"""Unified configuration loading from .env and config.yaml."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv


class ConfigError(Exception):
    """Raised when a required configuration value is missing."""


class ProjectConfig:
    """Loads and validates project configuration from .env and config.yaml.

    .env holds secrets (API keys, webhook URLs).
    config.yaml holds non-secret settings (thresholds, intervals, paths).
    Environment variables take precedence over config.yaml values.
    """

    def __init__(self, project_root: Path) -> None:
        self._project_root = project_root
        self._data: dict[str, Any] = {}
        self._loaded = False

    def load(self) -> dict[str, Any]:
        """Load .env and config.yaml, merge them. Returns the merged dict."""
        env_path = self._project_root / ".env"
        yaml_path = self._project_root / "config.yaml"

        if env_path.exists():
            load_dotenv(env_path, override=True)

        yaml_data: dict[str, Any] = {}
        if yaml_path.exists():
            with open(yaml_path, "r", encoding="utf-8") as f:
                yaml_data = yaml.safe_load(f) or {}

        self._data = yaml_data
        self._loaded = True
        return self._data

    def get(self, key: str, default: Any = None) -> Any:
        """Get a config value. Checks env vars first, then yaml (dot-notation supported).

        Examples:
            config.get("CLAUDE_API_KEY")          -> os.environ check, then yaml
            config.get("llm.backend", "claude")   -> yaml nested lookup
        """
        if not self._loaded:
            self.load()

        env_val = os.environ.get(key)
        if env_val is not None:
            return env_val

        env_val = os.environ.get(key.upper())
        if env_val is not None:
            return env_val

        parts = key.split(".")
        current: Any = self._data
        for part in parts:
            if isinstance(current, dict):
                current = current.get(part)
            else:
                return default
            if current is None:
                return default
        return current

    def require(self, key: str) -> Any:
        """Get a config value, raise ConfigError if missing."""
        val = self.get(key)
        if val is None:
            raise ConfigError(f"Required config key '{key}' is not set.")
        return val

    @property
    def project_root(self) -> Path:
        return self._project_root

    @property
    def data(self) -> dict[str, Any]:
        if not self._loaded:
            self.load()
        return self._data
