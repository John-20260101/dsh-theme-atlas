#!/usr/bin/env python3
"""Re-encode the render set so the repository and the npm tarball stay small.

Renders are produced as PNG by `scripts/shots.mjs` (lossless while iterating),
then this script writes the shipped files:

  assets/screenshots/*.png  -> .jpg, quality 86, 4:4:4 chroma  (text stays crisp)
  assets/keyart/*.png       -> .jpg, quality 84, 4:2:0
  assets/icon-*.png         -> palette-quantised PNG (flat art, no visible loss)

Run with --dry-run to print the table without touching files, --keep to keep the
PNG renders next to the JPEGs.
"""
from __future__ import annotations

import argparse
import io
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "assets" / "screenshots"
KEYART = ROOT / "assets" / "keyart"
ICONS = [ROOT / "assets" / "icon-1024.png", ROOT / "assets" / "icon-512.png", ROOT / "assets" / "icon-180.png"]
def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def save_jpeg(image: Image.Image, destination: Path, quality: int, subsampling: int) -> int:
    buffer = io.BytesIO()
    image.convert("RGB").save(
        buffer,
        "JPEG",
        quality=quality,
        subsampling=subsampling,
        optimize=True,
        progressive=True,
    )
    destination.write_bytes(buffer.getvalue())
    return buffer.tell()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--keep", action="store_true", help="keep the source PNG next to the JPEG")
    args = parser.parse_args()

    rows: list[tuple[str, float, float]] = []

    # 1. screenshots: text-heavy, keep chroma at 4:4:4
    for source in sorted(SHOTS.glob("*.png")):
        before = kb(source)
        destination = source.with_suffix(".jpg")
        if not args.dry_run:
            with Image.open(source) as image:
                quality = 86 if source.name.startswith(("01", "02", "03", "04", "05", "06", "07", "08")) else 86
                size = save_jpeg(image, destination, quality, 0)
            if not args.keep:
                source.unlink()
        else:
            size = before
        rows.append((f"screenshots/{destination.name}", before, size / 1024))

    # 2. key art: photographic or gradient posters
    for source in sorted(KEYART.glob("*.png")):
        before = kb(source)
        destination = source.with_suffix(".jpg")
        if not args.dry_run:
            with Image.open(source) as image:
                size = save_jpeg(image, destination, 84, 1)
            if not args.keep:
                source.unlink()
        else:
            size = before
        rows.append((f"keyart/{destination.name}", before, size / 1024))

    # 3. icons: flat geometry, palette works and keeps transparency
    for icon in ICONS:
        if not icon.exists():
            continue
        before = kb(icon)
        if not args.dry_run:
            with Image.open(icon) as image:
                quantised = image.convert("RGBA").quantize(colors=256, method=Image.Quantize.FASTOCTREE)
                quantised.save(icon, optimize=True)
        rows.append((f"icons/{icon.name}", before, kb(icon)))

    total_before = sum(row[1] for row in rows)
    total_after = sum(row[2] for row in rows)
    width = max(len(row[0]) for row in rows)
    for name, before, after in rows:
        print(f"{name:{width}}  {before:8.0f}K -> {after:7.0f}K")
    print(f"\n{'total':{width}}  {total_before:8.0f}K -> {total_after:7.0f}K  ({(1 - total_after / total_before) * 100:.0f}% smaller)")


if __name__ == "__main__":
    main()
