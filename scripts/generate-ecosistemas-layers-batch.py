#!/usr/bin/env python3
"""
Genera tiles XYZ por capa raster del mapa de ecosistemas (lote).
- Soporta fuentes remotas (Cloudinary) y locales (/assets/...)
- Salida organizada por layer_id:
  public/assets/maps/tiles/layers/chapter1/ecosistemas-layers/{layer_id}/{z}/{x}/{y}.webp
"""

import argparse
import csv
import io
import math
import os
import re
import shutil
import sys
import urllib.request
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

# PGW de referencia (Atlas v17)
# Orden: [a, d, b, e, c, f]
PGW_REFS = {
    "PGW_ECOS_CAPAS": [
        0.0,
        0.000217454076 * 2.03,
        0.000217466863 * 2.03,
        -0.0,
        -77.62,
        1.58,
    ],
    "PGW_ECOS_MAPA_BASE": [
        0.0,
        0.000231853160 * 2.03,
        0.000231866793 * 2.03,
        -0.0,
        -77.717574036785,
        1.505615411172,
    ],
}

# Dimensiones de referencia (ancho, alto) asociadas a cada PGW.
# En v17 las capas de ecosistemas se trabajaban sobre raster portrait ~5846x10394.
PGW_TARGET_DIMS = {
    "PGW_ECOS_CAPAS": (5846, 10394),
    "PGW_ECOS_MAPA_BASE": (5848, 10396),
}

TRANSFORM_NONE = "none"
TRANSFORM_ROTATE_90_CW_MIRROR_H = "rotate90cw_mirrorh"
TRANSFORM_CHOICES = [TRANSFORM_NONE, TRANSFORM_ROTATE_90_CW_MIRROR_H]
FLIP_NONE = "none"
FLIP_HORIZONTAL = "horizontal"
FLIP_VERTICAL = "vertical"
FLIP_BOTH = "both"
FLIP_CHOICES = [FLIP_NONE, FLIP_HORIZONTAL, FLIP_VERTICAL, FLIP_BOTH]


def normalize_rotation_degrees(rotation_degrees: int) -> int:
    if rotation_degrees % 90 != 0:
        raise ValueError("rotation_degrees debe ser multiplo de 90")
    return rotation_degrees % 360


def normalize_flip_mode(flip_mode: str) -> str:
    value = (flip_mode or FLIP_NONE).strip().lower()
    if value not in FLIP_CHOICES:
        raise ValueError(f"flip_mode desconocido: {flip_mode}")
    return value


def legacy_transform_to_rotation_flip(transform_mode: str) -> tuple[int, str]:
    value = (transform_mode or "").strip().lower()
    if not value or value == TRANSFORM_NONE:
        return 0, FLIP_NONE
    if value == TRANSFORM_ROTATE_90_CW_MIRROR_H:
        return 90, FLIP_HORIZONTAL
    raise ValueError(f"transform legacy desconocido: {transform_mode}")


# -----------------------------------------------------------------------------
# Transformaciones geográficas
# -----------------------------------------------------------------------------
def make_inverse_pgw(a, d, b, e, c, f):
    det = a * e - b * d
    if abs(det) < 1e-15:
        raise ValueError("PGW singular")

    def geo_to_pixel(lon, lat):
        dx = lon - c
        dy = lat - f
        px = (e * dx - b * dy) / det
        py = (a * dy - d * dx) / det
        return px, py

    return geo_to_pixel


def make_forward_pgw(a, d, b, e, c, f):
    def pixel_to_geo(x, y):
        lon = a * x + b * y + c
        lat = d * x + e * y + f
        return lon, lat

    return pixel_to_geo


def tile_to_lonlat(z, tx, ty):
    n = 2 ** z
    lon_w = tx / n * 360.0 - 180.0
    lon_e = (tx + 1) / n * 360.0 - 180.0
    lat_n = math.degrees(math.atan(math.sinh(math.pi * (1.0 - 2.0 * ty / n))))
    lat_s = math.degrees(
        math.atan(math.sinh(math.pi * (1.0 - 2.0 * (ty + 1) / n)))
    )
    return lon_w, lat_s, lon_e, lat_n


def lon_to_tx(lon, z):
    return int((lon + 180.0) / 360.0 * 2 ** z)


def lat_to_ty(lat, z):
    lat_r = math.radians(lat)
    return int(
        (1.0 - math.log(math.tan(lat_r) + 1.0 / math.cos(lat_r)) / math.pi)
        / 2.0
        * 2**z
    )


def render_tile(src_img, geo_to_pixel, z, tx, ty, tile_size):
    lon_w, lat_s, lon_e, lat_n = tile_to_lonlat(z, tx, ty)
    src_w, src_h = src_img.size

    corners = {
        "NW": geo_to_pixel(lon_w, lat_n),
        "SW": geo_to_pixel(lon_w, lat_s),
        "SE": geo_to_pixel(lon_e, lat_s),
        "NE": geo_to_pixel(lon_e, lat_n),
    }

    xs = [v[0] for v in corners.values()]
    ys = [v[1] for v in corners.values()]

    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    if max_x < 0 or min_x > src_w or max_y < 0 or min_y > src_h:
        return None

    nw = corners["NW"]
    sw = corners["SW"]
    se = corners["SE"]
    ne = corners["NE"]

    quad_data = (nw[0], nw[1], sw[0], sw[1], se[0], se[1], ne[0], ne[1])

    pad = max(int(abs(max_x - min_x)), int(abs(max_y - min_y)), 10)
    crop_x0 = max(0, int(min_x) - pad)
    crop_y0 = max(0, int(min_y) - pad)
    crop_x1 = min(src_w, int(max_x) + pad)
    crop_y1 = min(src_h, int(max_y) + pad)

    offset_x, offset_y = crop_x0, crop_y0
    adj = (
        quad_data[0] - offset_x,
        quad_data[1] - offset_y,
        quad_data[2] - offset_x,
        quad_data[3] - offset_y,
        quad_data[4] - offset_x,
        quad_data[5] - offset_y,
        quad_data[6] - offset_x,
        quad_data[7] - offset_y,
    )

    try:
        cropped = src_img.crop((crop_x0, crop_y0, crop_x1, crop_y1))
        tile = cropped.transform(
            (tile_size, tile_size),
            Image.Transform.QUAD,
            adj,
            Image.Resampling.BICUBIC,
        )
    except Exception:
        return None

    if tile.mode == "RGBA":
        bbox = tile.getbbox()
    else:
        bbox = tile.convert("RGBA").getbbox()

    if bbox is None:
        return None

    return tile.convert("RGBA")


# -----------------------------------------------------------------------------
# Utilidades de IO
# -----------------------------------------------------------------------------
def sanitize_layer_id(layer_id: str) -> str:
    value = layer_id.strip()
    value = re.sub(r"[^a-zA-Z0-9_-]", "-", value)
    return value


def resolve_local_path(project_root: Path, url_like: str) -> Path:
    url_like = url_like.strip()
    if url_like.startswith("/"):
        return project_root / "public" / url_like.lstrip("/")
    return project_root / url_like


def load_image(project_root: Path, source: str) -> Image.Image:
    source = source.strip()
    if source.startswith("http://") or source.startswith("https://"):
        req = urllib.request.Request(
            source,
            headers={"User-Agent": "AtlasTilesBatch/1.0"},
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = resp.read()
        return Image.open(io.BytesIO(data)).convert("RGBA")

    local_path = resolve_local_path(project_root, source)
    if not local_path.exists():
        raise FileNotFoundError(f"No existe el archivo local: {local_path}")
    return Image.open(local_path).convert("RGBA")


def make_black_background_transparent(
    image: Image.Image,
    threshold: int = 6,
) -> Image.Image:
    rgba = image.convert("RGBA")
    data: list[tuple[int, int, int, int]] = []
    for pixel in rgba.getdata():
        if not isinstance(pixel, tuple) or len(pixel) < 4:
            continue
        r, g, b, a = pixel[:4]
        if r <= threshold and g <= threshold and b <= threshold:
            data.append((r, g, b, 0))
        else:
            data.append((r, g, b, a))
    rgba.putdata(data)
    return rgba


def normalize_image_size_for_pgw(
    image: Image.Image,
    pgw_ref: str,
    rotation_degrees: int = 0,
    force: bool = False,
) -> Image.Image:
    target = PGW_TARGET_DIMS.get(pgw_ref)
    if not target:
        return image

    current_w, current_h = image.size
    target_w, target_h = target

    # Si la imagen rota 90/270°, el objetivo también se invierte.
    if normalize_rotation_degrees(rotation_degrees) in (90, 270):
        target_w, target_h = target_h, target_w

    if (current_w, current_h) == (target_w, target_h):
        return image

    # Si force=False, solo reescala cuando la imagen es más pequeña en ambos ejes.
    should_resize = force or (current_w < target_w and current_h < target_h)
    if not should_resize:
        return image

    return image.resize((target_w, target_h), Image.Resampling.BICUBIC)


def apply_orientation_transform(
    image: Image.Image,
    rotation_degrees: int,
    flip_mode: str,
) -> Image.Image:
    normalized_rotation = normalize_rotation_degrees(rotation_degrees)
    normalized_flip = normalize_flip_mode(flip_mode)

    if normalized_rotation == 90:
        image = image.transpose(Image.Transpose.ROTATE_270)
    elif normalized_rotation == 180:
        image = image.transpose(Image.Transpose.ROTATE_180)
    elif normalized_rotation == 270:
        image = image.transpose(Image.Transpose.ROTATE_90)

    if normalized_flip == FLIP_HORIZONTAL:
        image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    elif normalized_flip == FLIP_VERTICAL:
        image = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    elif normalized_flip == FLIP_BOTH:
        image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        image = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

    return image


def generate_tiles_for_image(
    src_img,
    output_dir: Path,
    min_zoom: int,
    max_zoom: int,
    tile_size: int,
    quality: int,
    pgw: list[float],
    max_tiles_per_layer=None,
    test_zoom=None,
):
    a, d, b, e, c, f = pgw
    pixel_to_geo = make_forward_pgw(a, d, b, e, c, f)
    geo_to_pixel = make_inverse_pgw(a, d, b, e, c, f)

    src_w, src_h = src_img.size
    corners_px = [(0, 0), (src_w, 0), (src_w, src_h), (0, src_h)]
    corners_geo = [pixel_to_geo(x, y) for x, y in corners_px]
    all_lons = [g[0] for g in corners_geo]
    all_lats = [g[1] for g in corners_geo]

    lon_min = min(all_lons)
    lon_max = max(all_lons)
    lat_min = min(all_lats)
    lat_max = max(all_lats)

    z_values = [test_zoom] if test_zoom is not None else range(min_zoom, max_zoom + 1)

    written = 0
    for z in z_values:
        tx_min = max(0, lon_to_tx(lon_min, z))
        tx_max = min(2**z - 1, lon_to_tx(lon_max, z))
        ty_min = max(0, lat_to_ty(lat_max, z))
        ty_max = min(2**z - 1, lat_to_ty(lat_min, z))

        for ty in range(ty_min, ty_max + 1):
            for tx in range(tx_min, tx_max + 1):
                tile = render_tile(src_img, geo_to_pixel, z, tx, ty, tile_size)
                if tile is None:
                    continue

                tile_dir = output_dir / str(z) / str(tx)
                tile_dir.mkdir(parents=True, exist_ok=True)
                tile_path = tile_dir / f"{ty}.webp"
                tile.save(tile_path, "WEBP", quality=quality, method=6, exact=True)
                written += 1

                if max_tiles_per_layer is not None and written >= max_tiles_per_layer:
                    return written

    return written


def main():
    parser = argparse.ArgumentParser(description="Generador batch de tiles para capas ecosistemas")
    parser.add_argument("--input-csv", default="scripts/ecosistemas_layers.csv")
    parser.add_argument(
        "--output-root",
        default="public/assets/maps/tiles/layers/chapter1/ecosistemas-layers",
    )
    parser.add_argument("--min-zoom", type=int, default=7)
    parser.add_argument("--max-zoom", type=int, default=8)
    parser.add_argument("--tile-size", type=int, default=512)
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--only-layer-id", default=None)
    parser.add_argument(
        "--only-category",
        default=None,
        help="Filtro exacto por columna categoria (case-insensitive)",
    )
    parser.add_argument(
        "--only-category-prefix",
        default=None,
        help="Filtro por prefijo de categoria (case-insensitive)",
    )
    parser.add_argument(
        "--test-zoom",
        type=int,
        default=None,
        help="Genera solo un nivel de zoom",
    )
    parser.add_argument(
        "--max-tiles-per-layer",
        type=int,
        default=None,
        help="Limite de tiles por capa para pruebas rapidas",
    )
    parser.add_argument(
        "--rotation-degrees",
        type=int,
        default=None,
        help="Rotacion global en grados (sentido horario, multiplo de 90)",
    )
    parser.add_argument(
        "--flip-mode",
        default=None,
        choices=FLIP_CHOICES,
        help="Flip global: none|horizontal|vertical|both",
    )
    parser.add_argument(
        "--default-pgw-ref",
        default="PGW_ECOS_CAPAS",
        choices=sorted(PGW_REFS.keys()),
        help="PGW por defecto si el CSV no trae columna pgw_ref",
    )
    parser.add_argument(
        "--auto-upscale-to-pgw-ref",
        action="store_true",
        default=True,
        help="Reescala fuentes pequeñas a dimensiones de referencia del PGW",
    )
    parser.add_argument(
        "--force-resize-to-pgw-ref",
        action="store_true",
        default=False,
        help="Reescala siempre al tamaño de referencia del PGW",
    )
    parser.add_argument(
        "--default-transform",
        default=None,
        choices=TRANSFORM_CHOICES,
        help="(Legacy) Transform de compatibilidad: none|rotate90cw_mirrorh",
    )
    args = parser.parse_args()

    default_rotation_degrees = 0
    default_flip_mode = FLIP_NONE

    try:
        if args.default_transform is not None:
            default_rotation_degrees, default_flip_mode = (
                legacy_transform_to_rotation_flip(args.default_transform)
            )

        if args.rotation_degrees is not None:
            default_rotation_degrees = normalize_rotation_degrees(
                args.rotation_degrees
            )

        if args.flip_mode is not None:
            default_flip_mode = normalize_flip_mode(args.flip_mode)
    except ValueError as err:
        print(f"ERROR: {err}")
        sys.exit(1)

    if args.test_zoom is not None and args.test_zoom < 0:
        print("ERROR: --test-zoom debe ser >= 0")
        sys.exit(1)

    if args.max_tiles_per_layer is not None and args.max_tiles_per_layer <= 0:
        print("ERROR: --max-tiles-per-layer debe ser >= 1")
        sys.exit(1)

    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    csv_path = project_root / args.input_csv
    output_root = project_root / args.output_root
    output_root.mkdir(parents=True, exist_ok=True)

    if not csv_path.exists():
        print(f"ERROR: no existe CSV {csv_path}")
        sys.exit(1)

    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if args.only_layer_id:
        rows = [r for r in rows if r.get("layer_id", "").strip() == args.only_layer_id]
        if not rows:
            print(f"No se encontró layer_id={args.only_layer_id}")
            sys.exit(1)

    if args.only_category:
        wanted_category = args.only_category.strip().lower()
        rows = [
            r
            for r in rows
            if r.get("categoria", "").strip().lower() == wanted_category
        ]

    if args.only_category_prefix:
        wanted_prefix = args.only_category_prefix.strip().lower()
        rows = [
            r
            for r in rows
            if r.get("categoria", "").strip().lower().startswith(wanted_prefix)
        ]

    if not rows:
        print("No hay capas para procesar tras aplicar los filtros")
        sys.exit(1)

    print("=" * 72)
    print("Atlas 3.0 - Batch tiles ecosistemas")
    print(f"CSV        : {csv_path}")
    print(f"Output     : {output_root}")
    print(f"Zoom       : {args.min_zoom} -> {args.max_zoom}")
    print(f"Tile size  : {args.tile_size}")
    print(f"Formato    : WEBP")
    print(f"Calidad    : {args.quality}")
    print(f"Capas      : {len(rows)}")
    print(f"Rotacion   : {default_rotation_degrees} grados")
    print(f"Flip       : {default_flip_mode}")
    if args.default_transform is not None:
        print(f"Legacy trf : {args.default_transform}")
    print(f"Filtro cat : {args.only_category or '-'}")
    print(f"Pref cat   : {args.only_category_prefix or '-'}")
    print(f"Test zoom  : {args.test_zoom if args.test_zoom is not None else '-'}")
    print(
        f"Max tiles  : {args.max_tiles_per_layer if args.max_tiles_per_layer is not None else '-'}"
    )
    print("=" * 72)

    total_written = 0
    failed = []

    for i, row in enumerate(rows, start=1):
        layer_id_raw = row.get("layer_id", "").strip()
        source = (row.get("url", "") or row.get("url_raster", "")).strip()
        layer_name = (row.get("etiqueta_menu", "") or row.get("name", layer_id_raw)).strip()
        layer_category = row.get("categoria", "").strip()
        layer_subcategory = row.get("subcategoria", "").strip()
        pgw_ref = row.get("pgw_ref", "").strip() or args.default_pgw_ref
        legacy_transform_mode = row.get("transform", "").strip()
        row_rotation_raw = row.get("rotation_degrees", "").strip()
        row_flip_raw = row.get("flip_mode", "").strip()

        if not layer_id_raw or not source:
            failed.append((layer_id_raw or f"row:{i}", "sin layer_id/url"))
            continue

        layer_id = sanitize_layer_id(layer_id_raw)
        layer_out_dir = output_root / layer_id

        print(f"\n[{i}/{len(rows)}] {layer_name} ({layer_id_raw})")
        if layer_category or layer_subcategory:
            print(f"Grupo : {layer_category} > {layer_subcategory}")
        print(f"PGW   : {pgw_ref}")
        print(f"Fuente: {source}")

        try:
            if pgw_ref not in PGW_REFS:
                raise ValueError(f"pgw_ref desconocido: {pgw_ref}")

            rotation_degrees = default_rotation_degrees
            flip_mode = default_flip_mode

            if legacy_transform_mode:
                rotation_degrees, flip_mode = legacy_transform_to_rotation_flip(
                    legacy_transform_mode
                )

            if row_rotation_raw:
                rotation_degrees = normalize_rotation_degrees(int(row_rotation_raw))

            if row_flip_raw:
                flip_mode = normalize_flip_mode(row_flip_raw)

            print(f"Xform : rot={rotation_degrees} flip={flip_mode}")

            src_img = load_image(project_root, source)
            src_img = make_black_background_transparent(src_img)
            src_img = apply_orientation_transform(src_img, rotation_degrees, flip_mode)

            original_size = src_img.size
            if args.auto_upscale_to_pgw_ref:
                src_img = normalize_image_size_for_pgw(
                    src_img,
                    pgw_ref,
                    rotation_degrees=rotation_degrees,
                    force=args.force_resize_to_pgw_ref,
                )

            if layer_out_dir.exists():
                shutil.rmtree(layer_out_dir)

            if src_img.size != original_size:
                print(
                    f"Imagen: {original_size[0]}x{original_size[1]} -> {src_img.size[0]}x{src_img.size[1]} (reescalada)",
                )
            else:
                print(f"Imagen: {src_img.size[0]}x{src_img.size[1]}")
            written = generate_tiles_for_image(
                src_img,
                layer_out_dir,
                args.min_zoom,
                args.max_zoom,
                args.tile_size,
                args.quality,
                PGW_REFS[pgw_ref],
                max_tiles_per_layer=args.max_tiles_per_layer,
                test_zoom=args.test_zoom,
            )
            total_written += written
            print(f"OK: {written} tiles -> {layer_out_dir}")
        except Exception as err:
            failed.append((layer_id_raw, str(err)))
            print(f"ERROR: {err}")

    print("\n" + "=" * 72)
    print(f"Tiles escritos totales: {total_written}")
    print(f"Capas fallidas: {len(failed)}")
    if failed:
        for layer, reason in failed:
            print(f" - {layer}: {reason}")
    print("=" * 72)

    if failed:
        sys.exit(2)


if __name__ == "__main__":
    main()
