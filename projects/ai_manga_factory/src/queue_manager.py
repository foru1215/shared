"""Async job queue for ComfyUI batch processing, keeping GPU saturated."""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .comfy_client import ComfyUIClient
from .output_renamer import OutputRenamer
from .workflow_modifier import WorkflowModifier

logger = logging.getLogger(__name__)


@dataclass
class GenerationJob:
    """Represents a single image generation job."""

    job_id: str
    page: int
    panel: int
    positive_prompt: str
    negative_prompt: str
    seed: int = -1
    checkpoint: str | None = None
    width: int = 1024
    height: int = 1024
    status: str = "pending"  # pending, queued, running, completed, failed
    error: str | None = None


class QueueManager:
    """Manages async generation job queue for ComfyUI batch processing.

    Uses asyncio.Semaphore to limit concurrent GPU jobs, ensuring
    the GPU is always busy but never overloaded.
    """

    def __init__(
        self,
        client: ComfyUIClient,
        modifier: WorkflowModifier,
        renamer: OutputRenamer,
        max_concurrent: int = 2,
    ) -> None:
        self._client = client
        self._modifier = modifier
        self._renamer = renamer
        self._semaphore = asyncio.Semaphore(max_concurrent)
        self._jobs: list[GenerationJob] = []
        self._results: dict[str, Path] = {}

    @classmethod
    def from_scenarios_file(
        cls,
        path: Path,
        client: ComfyUIClient,
        modifier: WorkflowModifier,
        renamer: OutputRenamer,
        max_concurrent: int = 2,
    ) -> QueueManager:
        """Parse scenarios.json and populate the job queue."""
        with open(path, "r", encoding="utf-8") as f:
            scenarios = json.load(f)

        manager = cls(client, modifier, renamer, max_concurrent)

        job_count = 0
        for chapter in scenarios.get("chapters", []):
            for page_data in chapter.get("pages", []):
                page_num = page_data["page"]
                for panel_idx, panel in enumerate(page_data.get("panels", []), start=1):
                    job_count += 1
                    job = GenerationJob(
                        job_id=f"job_{job_count:04d}",
                        page=page_num,
                        panel=panel_idx,
                        positive_prompt=panel["positive_prompt"],
                        negative_prompt=panel["negative_prompt"],
                        seed=panel.get("seed", -1),
                        checkpoint=panel.get("checkpoint"),
                        width=panel.get("width", 1024),
                        height=panel.get("height", 1024),
                    )
                    manager._jobs.append(job)

        logger.info("Loaded %d jobs from %s", len(manager._jobs), path)
        return manager

    async def run(self) -> dict[str, Path]:
        """Process all jobs concurrently up to max_concurrent limit. Returns results."""
        logger.info("Starting batch processing of %d jobs", len(self._jobs))

        tasks = [self._process_job(job) for job in self._jobs]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for job, result in zip(self._jobs, results):
            if isinstance(result, Exception):
                job.status = "failed"
                job.error = str(result)
                logger.error("Job %s failed: %s", job.job_id, result)
            elif isinstance(result, Path):
                self._results[job.job_id] = result

        status = self.get_status()
        logger.info(
            "Batch complete: %d completed, %d failed out of %d total",
            status["completed"],
            status["failed"],
            len(self._jobs),
        )
        return self._results

    async def _process_job(self, job: GenerationJob) -> Path:
        """Submit one job, monitor progress, download and rename output."""
        async with self._semaphore:
            job.status = "running"
            logger.info(
                "Processing %s: page=%d panel=%d", job.job_id, job.page, job.panel
            )

            try:
                # Prepare workflow
                wf = self._modifier.clone()

                # Find and modify nodes
                ksampler_nodes = wf.find_nodes_by_class("KSampler")
                clip_nodes = wf.find_nodes_by_class("CLIPTextEncode")
                latent_nodes = wf.find_nodes_by_class("EmptyLatentImage")
                save_nodes = wf.find_nodes_by_class("SaveImage")

                # Set prompts (assume first two CLIPTextEncode are positive/negative)
                if len(clip_nodes) >= 2:
                    wf.set_positive_prompt(clip_nodes[0], job.positive_prompt)
                    wf.set_negative_prompt(clip_nodes[1], job.negative_prompt)
                elif len(clip_nodes) == 1:
                    wf.set_positive_prompt(clip_nodes[0], job.positive_prompt)

                # Set seed
                if ksampler_nodes:
                    wf.set_seed(ksampler_nodes[0], job.seed)

                # Set image size
                if latent_nodes:
                    wf.set_image_size(latent_nodes[0], job.width, job.height)

                # Set output prefix
                if save_nodes:
                    wf.set_output_prefix(save_nodes[0], f"manga_{job.job_id}")

                # Set checkpoint if specified
                if job.checkpoint:
                    ckpt_nodes = wf.find_nodes_by_class("CheckpointLoaderSimple")
                    if ckpt_nodes:
                        wf.set_checkpoint(ckpt_nodes[0], job.checkpoint)

                # Queue the prompt
                prompt_id = await self._client.queue_prompt(wf.to_dict())
                job.status = "queued"

                # Monitor progress
                async for event in self._client.monitor_progress(prompt_id):
                    event_type = event["type"]
                    if event_type == "progress":
                        value = event["data"].get("value", 0)
                        max_val = event["data"].get("max", 0)
                        if max_val > 0:
                            logger.debug(
                                "%s progress: %d/%d", job.job_id, value, max_val
                            )
                    elif event_type == "execution_error":
                        raise RuntimeError(
                            f"Execution error: {event['data'].get('exception_message', 'unknown')}"
                        )

                # Get generated image from history
                history = await self._client.get_history(prompt_id)
                outputs = history.get("outputs", {})

                # Find the SaveImage node's output
                image_data: bytes | None = None
                for node_id, node_output in outputs.items():
                    images = node_output.get("images", [])
                    if images:
                        img_info = images[0]
                        image_data = await self._client.get_image(
                            img_info["filename"],
                            img_info.get("subfolder", ""),
                            img_info.get("type", "output"),
                        )
                        break

                if image_data is None:
                    raise RuntimeError("No image output found in history")

                # Save and rename
                output_path = self._renamer.save_image_data(
                    image_data, job.page, job.panel
                )

                job.status = "completed"
                logger.info(
                    "Completed %s -> %s", job.job_id, output_path.name
                )
                return output_path

            except Exception as e:
                job.status = "failed"
                job.error = str(e)
                logger.exception("Job %s failed", job.job_id)
                raise

    def get_status(self) -> dict[str, int]:
        """Returns counts: {pending, queued, running, completed, failed}."""
        counts: dict[str, int] = {
            "pending": 0, "queued": 0, "running": 0, "completed": 0, "failed": 0,
        }
        for job in self._jobs:
            counts[job.status] = counts.get(job.status, 0) + 1
        return counts
