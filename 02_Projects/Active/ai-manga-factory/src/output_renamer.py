"""Rename ComfyUI output images to structured naming convention."""

from __future__ import annotations

import logging
import shutil
from pathlib import Path

logger = logging.getLogger(__name__)


class OutputRenamer:
    """Renames raw ComfyUI output files to structured manga page/panel names."""

    def __init__(
        self,
        output_dir: Path,
        pattern: str = "page{page:03d}_panel{panel:02d}.png",
    ) -> None:
        self._output_dir = output_dir
        self._pattern = pattern
        output_dir.mkdir(parents=True, exist_ok=True)

    def rename_single(self, file: Path, page: int, panel: int) -> Path:
        """Rename a single file to the structured name and move to output_dir."""
        new_name = self._pattern.format(page=page, panel=panel)
        dest = self._output_dir / new_name

        if file == dest:
            return dest

        if dest.exists():
            logger.warning("Destination already exists, overwriting: %s", dest)

        shutil.move(str(file), str(dest))
        logger.info("Renamed %s -> %s", file.name, new_name)
        return dest

    def rename_batch(
        self, files: list[Path], page: int, start_panel: int = 1
    ) -> list[Path]:
        """Rename a list of files for a given page, starting from start_panel."""
        results: list[Path] = []
        for i, file in enumerate(files):
            panel = start_panel + i
            dest = self.rename_single(file, page, panel)
            results.append(dest)
        return results

    def organize_by_chapter(self, chapter_name: str) -> Path:
        """Create a chapter subdirectory and return its path."""
        chapter_dir = self._output_dir / chapter_name
        chapter_dir.mkdir(parents=True, exist_ok=True)
        return chapter_dir

    def save_image_data(
        self, image_data: bytes, page: int, panel: int
    ) -> Path:
        """Save raw image bytes with the structured name."""
        new_name = self._pattern.format(page=page, panel=panel)
        dest = self._output_dir / new_name
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(image_data)
        logger.info("Saved image: %s (%d bytes)", new_name, len(image_data))
        return dest
