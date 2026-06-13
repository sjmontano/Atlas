#!/usr/bin/env python3
"""
Conversor de imagenes a WebP para Atlas.

Objetivo:
- Generar una imagen principal WebP de alta calidad.
- Generar una imagen preview optimizada para redes lentas (3G/4G low),
  manteniendo buena apariencia sin zoom.

Salidas por defecto por cada entrada:
- principal: <nombre>.webp
- preview:   <nombre>-preview.webp

Dependencias:
- Python 3.10+
- Pillow (PIL)

Formatos de entrada soportados:
- PNG, TIFF/TIF, JPG/JPEG, WEBP, BMP

Ejemplos:
- python scripts/convert-to-webp.py imagen.png
- python scripts/convert-to-webp.py carpeta/ --target-kb 80 --min-kb 50 --max-kb 100
"""

from __future__ import annotations

import argparse
import io
import os
import re
import sys
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
WEBP_MAX_DIM = 16383
SUPPORTED_EXTENSIONS = {".png", ".tif", ".tiff", ".jpg", ".jpeg", ".webp", ".bmp"}

MAIN_QUALITY = 92
MAIN_METHOD = 6

PREVIEW_WIDTH = 1400
PREVIEW_METHOD = 6
PREVIEW_MIN_QUALITY = 52
PREVIEW_MAX_QUALITY = 84

RESAMPLE_LANCZOS = Image.Resampling.LANCZOS


def slugify(stem: str) -> str:
    stem = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", stem)
    stem = re.sub(r"[\s_]+", "-", stem)
    stem = re.sub(r"-+", "-", stem)
    return stem.strip("-").lower()


def ensure_webp_limits(img: Image.Image) -> Image.Image:
    """Ajusta dimensiones para cumplir el limite duro del formato WebP."""
    w, h = img.size
    if w <= WEBP_MAX_DIM and h <= WEBP_MAX_DIM:
        return img
    scale = min(WEBP_MAX_DIM / w, WEBP_MAX_DIM / h)
    new_w, new_h = int(w * scale), int(h * scale)
    return img.resize((new_w, new_h), RESAMPLE_LANCZOS)


def normalize_mode(img: Image.Image) -> Image.Image:
    """Normaliza el modo de color para encoder WebP (RGB/RGBA)."""
    if img.mode in ("RGBA", "LA") or "transparency" in img.info:
        return img.convert("RGBA")
    return img.convert("RGB")


def to_kb(num_bytes: int) -> float:
    return num_bytes / 1024.0


def save_webp_bytes(img: Image.Image, quality: int, method: int, lossless: bool = False) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=quality, method=method, lossless=lossless)
    return buf.getvalue()


def optimize_preview_bytes(img: Image.Image, target_kb: int, min_kb: int, max_kb: int) -> tuple[bytes, int]:
    """
    Encuentra la mejor calidad posible dentro del rango de tamano esperado.
    Prioriza calidad maxima <= max_kb; si no cabe, usa el menor tamano posible.
    """
    lo = PREVIEW_MIN_QUALITY
    hi = PREVIEW_MAX_QUALITY
    best_fit: tuple[bytes, int] | None = None
    smallest_over: tuple[bytes, int] | None = None

    while lo <= hi:
        q = (lo + hi) // 2
        data = save_webp_bytes(img, quality=q, method=PREVIEW_METHOD, lossless=False)
        kb = to_kb(len(data))

        if min_kb <= kb <= max_kb:
            best_fit = (data, q)
            lo = q + 1
            continue

        if kb < min_kb:
            # Se puede subir calidad
            best_fit = (data, q)
            lo = q + 1
            continue

        # kb > max_kb
        if smallest_over is None or len(data) < len(smallest_over[0]):
            smallest_over = (data, q)
        hi = q - 1

    if best_fit is not None:
        return best_fit

    # Fallback: elegir la muestra mas cercana al objetivo
    if smallest_over is not None:
        return smallest_over

    data = save_webp_bytes(img, quality=PREVIEW_MIN_QUALITY, method=PREVIEW_METHOD, lossless=False)
    return data, PREVIEW_MIN_QUALITY


def fit_preview_to_budget(img: Image.Image, target_kb: int, min_kb: int, max_kb: int) -> tuple[bytes, int, tuple[int, int]]:
    """
    Ajusta preview para cumplir presupuesto de red:
    1) busca mejor calidad dentro de rango de KB
    2) si aun excede max_kb, baja resolucion progresivamente
    """
    work = img
    min_width = 640

    while True:
        data, quality = optimize_preview_bytes(work, target_kb, min_kb, max_kb)
        kb = to_kb(len(data))
        if kb <= max_kb or work.width <= min_width:
            return data, quality, work.size

        next_w = max(min_width, int(work.width * 0.85))
        ratio = next_w / work.width
        next_h = max(1, int(work.height * ratio))
        work = work.resize((next_w, next_h), RESAMPLE_LANCZOS)


def collect_images(inputs: Iterable[str]) -> list[Path]:
    """Recolecta imagenes validas desde archivos o carpetas (no recursivo)."""
    out: list[Path] = []
    for item in inputs:
        p = Path(item).resolve()
        if not p.exists():
            continue
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS:
            out.append(p)
        elif p.is_dir():
            for f in sorted(p.iterdir()):
                if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS:
                    out.append(f)
    return out


def convert_one(src: Path, out_dir: Path, target_kb: int, min_kb: int, max_kb: int, overwrite: bool) -> tuple[Path, Path]:
    """Convierte una imagen a principal+preview en WebP."""
    out_dir.mkdir(parents=True, exist_ok=True)

    stem = slugify(src.stem)
    main_path = out_dir / f"{stem}.webp"
    preview_path = out_dir / f"{stem}-preview.webp"

    with Image.open(src) as raw:
        img = ImageOps.exif_transpose(raw)

        # Principal
        if main_path.exists() and not overwrite:
            pass
        else:
            main_img = ensure_webp_limits(normalize_mode(img.copy()))
            main_img.save(main_path, format="WEBP", quality=MAIN_QUALITY, method=MAIN_METHOD, lossless=False)

        # Preview
        if preview_path.exists() and not overwrite:
            pass
        else:
            prev = img.copy()
            if prev.width > PREVIEW_WIDTH:
                ratio = PREVIEW_WIDTH / prev.width
                prev = prev.resize((PREVIEW_WIDTH, max(1, int(prev.height * ratio))), RESAMPLE_LANCZOS)
            prev = ensure_webp_limits(normalize_mode(prev))
            data, quality, final_size = fit_preview_to_budget(prev, target_kb, min_kb, max_kb)
            preview_path.write_bytes(data)
            print(
                f"preview {preview_path.name}: q={quality}, {to_kb(len(data)):.1f} KB, "
                f"{final_size[0]}x{final_size[1]}"
            )

    return main_path, preview_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Convierte imagenes a WebP (principal + preview optimizada)")
    parser.add_argument("inputs", nargs="+", help="Archivos o carpetas")
    parser.add_argument("--out", type=str, default=None, help="Carpeta de salida")
    parser.add_argument("--target-kb", type=int, default=80, help="Tamano objetivo preview en KB")
    parser.add_argument("--min-kb", type=int, default=50, help="Tamano minimo deseado preview en KB")
    parser.add_argument("--max-kb", type=int, default=100, help="Tamano maximo preview en KB")
    parser.add_argument("--overwrite", action="store_true", help="Sobrescribir archivos existentes")
    args = parser.parse_args()

    images = collect_images(args.inputs)
    if not images:
        print("No se encontraron imagenes validas.")
        return 1

    if args.min_kb > args.max_kb:
        print("Error: --min-kb no puede ser mayor que --max-kb")
        return 1

    print(f"Procesando {len(images)} imagen(es)...")

    for src in images:
        out_dir = Path(args.out).resolve() if args.out else src.parent
        main_path, preview_path = convert_one(
            src=src,
            out_dir=out_dir,
            target_kb=args.target_kb,
            min_kb=args.min_kb,
            max_kb=args.max_kb,
            overwrite=args.overwrite,
        )
        main_size = os.path.getsize(main_path) if main_path.exists() else 0
        prev_size = os.path.getsize(preview_path) if preview_path.exists() else 0
        print(
            f"ok {src.name} -> {main_path.name} ({to_kb(main_size):.1f} KB), "
            f"{preview_path.name} ({to_kb(prev_size):.1f} KB)"
        )

    print("Listo.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
