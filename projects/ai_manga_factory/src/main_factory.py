"""Main entry point for AI Manga Factory batch processing."""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _add_shared_lib_to_path() -> None:
    shared_lib_path = PROJECT_ROOT.parent / "shared_lib"
    if str(shared_lib_path.parent) not in sys.path:
        sys.path.insert(0, str(shared_lib_path.parent))


_add_shared_lib_to_path()


async def run(
    config_data: dict,
    scenario_path: Path,
    dry_run: bool = False,
) -> None:
    """Run the full manga generation pipeline."""
    from shared_lib.logger_setup import setup_logger
    from shared_lib.notifier import create_notifier

    from .comfy_client import ComfyUIClient
    from .output_renamer import OutputRenamer
    from .queue_manager import QueueManager
    from .workflow_modifier import WorkflowModifier

    log = setup_logger("ai_manga_factory", PROJECT_ROOT / "logs")
    log.info("Starting AI Manga Factory...")

    comfy_config = config_data.get("comfyui", {})
    host = comfy_config.get("host", "127.0.0.1")
    port = int(comfy_config.get("port", 8188))

    # Connect to ComfyUI
    client = ComfyUIClient(host=host, port=port)

    if dry_run:
        log.info("[DRY-RUN] Would connect to ComfyUI at %s:%d", host, port)
        log.info("[DRY-RUN] Scenario file: %s", scenario_path)

        import json
        with open(scenario_path, "r", encoding="utf-8") as f:
            scenarios = json.load(f)

        total_jobs = sum(
            len(page.get("panels", []))
            for chapter in scenarios.get("chapters", [])
            for page in chapter.get("pages", [])
        )
        log.info("[DRY-RUN] Total jobs: %d", total_jobs)
        return

    try:
        await client.connect()
        stats = await client.get_system_stats()
        log.info("ComfyUI system stats: %s", stats)

        # Load workflow template
        wf_config = config_data.get("workflow", {})
        template_path = PROJECT_ROOT / wf_config.get(
            "default_template", "workflow_template.json"
        )

        if not template_path.exists():
            log.error("Workflow template not found: %s", template_path)
            log.info("Please place your ComfyUI workflow JSON at: %s", template_path)
            return

        modifier = WorkflowModifier.from_file(template_path)

        # Setup output renamer
        naming_config = config_data.get("naming", {})
        output_dir = Path(comfy_config.get("output_dir", "./output"))
        if not output_dir.is_absolute():
            output_dir = PROJECT_ROOT / output_dir

        renamer = OutputRenamer(
            output_dir=output_dir,
            pattern=naming_config.get("pattern", "page{page:03d}_panel{panel:02d}.png"),
        )

        # Create queue manager from scenarios
        max_concurrent = int(comfy_config.get("max_concurrent_jobs", 2))
        queue_mgr = QueueManager.from_scenarios_file(
            scenario_path, client, modifier, renamer, max_concurrent
        )

        # Run batch processing
        results = await queue_mgr.run()

        # Notify
        notifier = create_notifier(config_data)
        status = queue_mgr.get_status()
        await notifier.send(
            "AI Manga Factory - Batch Complete",
            f"Generated {status['completed']} images, {status['failed']} failed.",
        )

        log.info("Done! Generated %d images in %s", len(results), output_dir)

    finally:
        await client.disconnect()


def main() -> None:
    """CLI entry point."""
    parser = argparse.ArgumentParser(description="AI Manga Factory - ComfyUI Batch Processor")
    parser.add_argument(
        "--scenario", type=str, default="scenarios.json",
        help="Path to scenarios.json file",
    )
    parser.add_argument("--dry-run", action="store_true", help="Validate config without generating")
    args = parser.parse_args()

    from shared_lib.config_loader import ProjectConfig

    config_obj = ProjectConfig(PROJECT_ROOT)
    config_data = config_obj.load()

    scenario_path = Path(args.scenario)
    if not scenario_path.is_absolute():
        scenario_path = PROJECT_ROOT / scenario_path

    asyncio.run(run(config_data, scenario_path, dry_run=args.dry_run))


if __name__ == "__main__":
    main()
