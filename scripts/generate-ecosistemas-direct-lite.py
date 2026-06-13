#!/usr/bin/env python3
"""
Generate lightweight direct raster images for ecosistemas layers.

Input folder:
  public/assets/maps/layers/ecosistemas/direct-all

Output folder:
  public/assets/maps/layers/ecosistemas/direct-lite

These files keep the same geospatial extent (only pixel dimensions change),
so they can be used with the same bounds in MapLibre image sources.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None


def to_kb(size_bytes: int) -> float:
    return size_bytes / 1024.0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate lightweight direct images for ecosistemas layers",
    )
    parser.add_argument(
        "--input-dir",
        default="public/assets/maps/layers/ecosistemas/direct-all",
        help="Source folder with full-size layer images",
    )
    parser.add_argument(
        "--output-dir",
        default="public/assets/maps/layers/ecosistemas/direct-lite",
        help="Destination folder for lightweight images",
    )
    parser.add_argument(
        "--target-width",
        type=int,
        default=3200,
        help="Output width in pixels (height keeps aspect ratio)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=64,
        help="WebP quality for lite images",
    )
    parser.add_argument(
        "--method",
        type=int,
        default=5,
        help="WebP encoding method (0-6)",
    )
    parser.add_argument(
        "--only-layer-id",
        default=None,
        help="Optional single layer id (without extension)",
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    input_dir = (project_root / args.input_dir).resolve()
    output_dir = (project_root / args.output_dir).resolve()

    if not input_dir.exists():
        print(f"ERROR: input folder does not exist: {input_dir}")
        return 1

    output_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(input_dir.glob("*.webp"))
    if args.only_layer_id:
        files = [p for p in files if p.stem == args.only_layer_id]

    if not files:
        print("No images found with the current filters")
        return 0

    print("=" * 72)
    print("Atlas 3.0 - Generate ecosistemas direct-lite")
    print(f"Input       : {input_dir}")
    print(f"Output      : {output_dir}")
    print(f"Target width: {args.target_width}")
    print(f"Quality     : {args.quality}")
    print(f"Method      : {args.method}")
    print(f"Layers      : {len(files)}")
    print("=" * 72)

    total_before = 0
    total_after = 0

    for index, src in enumerate(files, start=1):
        dst = output_dir / src.name

        with Image.open(src) as img:
            rgba = img.convert("RGBA")
            width, height = rgba.size
            total_before += src.stat().st_size

            if width > args.target_width:
                scale = args.target_width / float(width)
                target_height = max(1, int(height * scale))
                resized = rgba.resize((args.target_width, target_height), Image.Resampling.LANCZOS)
            else:
                resized = rgba

            resized.save(
                dst,
                "WEBP",
                quality=args.quality,
                method=args.method,
                exact=True,
            )

        after_size = dst.stat().st_size
        total_after += after_size
        reduction_pct = 0.0
        if src.stat().st_size > 0:
            reduction_pct = (1 - after_size / src.stat().st_size) * 100.0

        print(
            f"[{index}/{len(files)}] {src.name}: "
            f"{to_kb(src.stat().st_size):.1f} KB -> {to_kb(after_size):.1f} KB "
            f"({reduction_pct:.1f}% smaller)",
        )

    total_reduction = 0.0
    if total_before > 0:
        total_reduction = (1 - total_after / total_before) * 100.0

    print("=" * 72)
    print(
        "Total: "
        f"{to_kb(total_before):.1f} KB -> {to_kb(total_after):.1f} KB "
        f"({total_reduction:.1f}% smaller)",
    )
    print("Done.")
    print("=" * 72)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
