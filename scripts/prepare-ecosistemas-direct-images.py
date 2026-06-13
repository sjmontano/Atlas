#!/usr/bin/env python3
"""
Prepara imagenes directas (no tiles) para capas de ecosistemas.
Regla global aplicada a TODAS las capas:
- Rotar 90° horario
- Espejo horizontal
- Normalizar a dimensiones objetivo del mapa base ecosistemas
- Exportar a WebP local por layer_id
"""

import argparse
import csv
import io
import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

TARGET_SIZE = (10394, 5846)  # width, height (landscape ecosistemas mapa base)
DEFAULT_OUTPUT_ROOT = "public/assets/maps/layers/ecosistemas/direct-all"
DEFAULT_INPUT_CSV = "scripts/ecosistemas_layers.csv"


def sanitize_layer_id(layer_id: str) -> str:
    value = layer_id.strip()
    value = re.sub(r"[^a-zA-Z0-9_-]", "-", value)
    return value


def resolve_local_path(project_root: Path, url_like: str) -> Path:
    value = url_like.strip()
    if value.startswith("/"):
        return project_root / "public" / value.lstrip("/")
    return project_root / value


def load_image(project_root: Path, source: str) -> Image.Image:
    source = source.strip()
    if source.startswith("http://") or source.startswith("https://"):
        req = urllib.request.Request(
            source,
            headers={"User-Agent": "AtlasDirectLayers/1.0"},
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = resp.read()
        return Image.open(io.BytesIO(data)).convert("RGBA")

    local_path = resolve_local_path(project_root, source)
    if not local_path.exists():
        raise FileNotFoundError(f"No existe el archivo local: {local_path}")
    return Image.open(local_path).convert("RGBA")


def make_black_background_transparent(image: Image.Image, threshold: int = 6) -> Image.Image:
    rgba = image.convert("RGBA")
    data = []
    for pixel in rgba.getdata():
        r, g, b, a = pixel[:4]
        if r <= threshold and g <= threshold and b <= threshold:
            data.append((r, g, b, 0))
        else:
            data.append((r, g, b, a))
    rgba.putdata(data)
    return rgba


def transform_orientation(image: Image.Image) -> Image.Image:
    rotated = image.transpose(Image.Transpose.ROTATE_270)  # 90° horario
    return rotated.transpose(Image.Transpose.FLIP_LEFT_RIGHT)  # espejo horizontal


def process_image(image: Image.Image, target_size: tuple[int, int]) -> Image.Image:
    image = make_black_background_transparent(image)
    image = transform_orientation(image)
    if image.size != target_size:
        image = image.resize(target_size, Image.Resampling.BICUBIC)
    return image


def main() -> int:
    parser = argparse.ArgumentParser(description="Prepara capas directas ecosistemas")
    parser.add_argument("--input-csv", default=DEFAULT_INPUT_CSV)
    parser.add_argument("--output-root", default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--only-layer-id", default=None)
    parser.add_argument("--only-subcategory", default=None)
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--webp-method", type=int, default=4)
    parser.add_argument("--skip-existing", action="store_true", default=True)
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    csv_path = project_root / args.input_csv
    output_root = project_root / args.output_root
    output_root.mkdir(parents=True, exist_ok=True)

    if not csv_path.exists():
        print(f"ERROR: no existe CSV {csv_path}")
        return 1

    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    if args.only_subcategory:
        rows = [r for r in rows if (r.get("subcategoria", "").strip() == args.only_subcategory)]

    if args.only_layer_id:
        rows = [r for r in rows if (r.get("layer_id", "").strip() == args.only_layer_id)]

    if not rows:
        print("No hay capas para procesar con los filtros actuales")
        return 0

    print("=" * 72)
    print("Atlas 3.0 - Prepare ecosistemas direct images")
    print(f"CSV        : {csv_path}")
    print(f"Output     : {output_root}")
    print(f"Target     : {TARGET_SIZE[0]}x{TARGET_SIZE[1]}")
    print(f"Capas      : {len(rows)}")
    print("Regla      : rotate90cw + mirrorH + resize target")
    print("=" * 72)

    failed: list[tuple[str, str]] = []
    total = 0

    for index, row in enumerate(rows, start=1):
        layer_id_raw = row.get("layer_id", "").strip()
        source = (row.get("url", "") or row.get("url_raster", "")).strip()
        label = (row.get("etiqueta_menu", "") or row.get("name", layer_id_raw)).strip()

        if not layer_id_raw or not source:
            failed.append((layer_id_raw or f"row:{index}", "sin layer_id/url"))
            continue

        layer_id = sanitize_layer_id(layer_id_raw)
        out_path = output_root / f"{layer_id}.webp"

        print(f"\n[{index}/{len(rows)}] {label} ({layer_id})")
        print(f"Fuente: {source}")

        try:
            image = load_image(project_root, source)
            image = process_image(image, TARGET_SIZE)
            if args.skip_existing and out_path.exists():
                print(f"SKIP: {out_path} ya existe")
                total += 1
                continue

            image.save(
                out_path,
                "WEBP",
                quality=args.quality,
                method=args.webp_method,
                exact=True,
            )
            print(f"OK: {out_path} {image.size}")
            total += 1
        except Exception as err:
            failed.append((layer_id_raw, str(err)))
            print(f"ERROR: {err}")

    print("\n" + "=" * 72)
    print(f"Capas procesadas OK: {total}")
    print(f"Capas fallidas    : {len(failed)}")
    if failed:
        for layer, reason in failed:
            print(f" - {layer}: {reason}")
    print("=" * 72)

    return 2 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
