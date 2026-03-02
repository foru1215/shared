"""Load, parse, and modify ComfyUI workflow JSON files."""

from __future__ import annotations

import copy
import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class WorkflowModifier:
    """Loads and modifies ComfyUI workflow JSON templates.

    ComfyUI workflows are JSON dicts where keys are node IDs (strings)
    and values are node definitions with 'class_type' and 'inputs'.
    """

    def __init__(self, template: dict[str, Any]) -> None:
        self._template = template

    @classmethod
    def from_file(cls, path: Path) -> WorkflowModifier:
        """Load a workflow template from a JSON file."""
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        logger.info("Loaded workflow template from %s (%d nodes)", path, len(data))
        return cls(data)

    def find_nodes_by_class(self, class_type: str) -> list[str]:
        """Find all node IDs matching the given class_type.

        Example: find_nodes_by_class("KSampler") returns ["3", "7"]
        """
        return [
            node_id
            for node_id, node in self._template.items()
            if isinstance(node, dict) and node.get("class_type") == class_type
        ]

    def set_positive_prompt(self, node_id: str, text: str) -> None:
        """Set the text input of a CLIPTextEncode node (positive prompt)."""
        self._set_input(node_id, "text", text)

    def set_negative_prompt(self, node_id: str, text: str) -> None:
        """Set the text input of a CLIPTextEncode node (negative prompt)."""
        self._set_input(node_id, "text", text)

    def set_seed(self, node_id: str, seed: int) -> None:
        """Set the seed of a KSampler node. -1 means random."""
        import random

        actual_seed = seed if seed >= 0 else random.randint(0, 2**63 - 1)
        self._set_input(node_id, "seed", actual_seed)
        logger.debug("Set seed for node %s: %d", node_id, actual_seed)

    def set_image_size(self, node_id: str, width: int, height: int) -> None:
        """Set width and height on an EmptyLatentImage node."""
        self._set_input(node_id, "width", width)
        self._set_input(node_id, "height", height)

    def set_checkpoint(self, node_id: str, model_name: str) -> None:
        """Set the checkpoint model on a CheckpointLoaderSimple node."""
        self._set_input(node_id, "ckpt_name", model_name)

    def set_output_prefix(self, node_id: str, prefix: str) -> None:
        """Set the filename_prefix on a SaveImage node."""
        self._set_input(node_id, "filename_prefix", prefix)

    def _set_input(self, node_id: str, key: str, value: Any) -> None:
        """Set an input value on a specific node."""
        node = self._template.get(node_id)
        if node is None:
            logger.warning("Node %s not found in workflow", node_id)
            return
        if "inputs" not in node:
            node["inputs"] = {}
        node["inputs"][key] = value

    def to_dict(self) -> dict[str, Any]:
        """Return the current workflow as a dict."""
        return self._template

    def clone(self) -> WorkflowModifier:
        """Deep-copy the workflow for safe parallel modification."""
        return WorkflowModifier(copy.deepcopy(self._template))
