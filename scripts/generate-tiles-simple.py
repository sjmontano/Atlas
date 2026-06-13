#!/usr/bin/env python3
"""
Generate XYZ tiles from a webp/image using PGW georeference data.
Handles rotated images (skewed PGW with non-zero B and D terms).
Uses only Pillow - no GDAL required.

Usage:
    python generate-tiles-simple.py --map formas-paisaje --max-zoom 9
"""

import os
import sys
import math
import argparse
from PIL import Image

# Compatibilidad Pillow >=10 y versiones antiguas para constantes de transform.
PIL_QUAD = getattr(getattr(Image, "Transform", object()), "QUAD", None)
if PIL_QUAD is None:
    PIL_QUAD = getattr(Image, "QUAD", None)
if PIL_QUAD is None:
    raise RuntimeError("No se pudo resolver el modo QUAD de Pillow")

PIL_BICUBIC = getattr(getattr(Image, "Resampling", object()), "BICUBIC", None)
if PIL_BICUBIC is None:
    PIL_BICUBIC = getattr(Image, "BICUBIC", None)
if PIL_BICUBIC is None:
    raise RuntimeError("No se pudo resolver el resampling BICUBIC de Pillow")

# Imágenes cartográficas son grandes por diseño — no son bombas.
Image.MAX_IMAGE_PIXELS = None

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

MAPS_CONFIG = {
    # ─── Formas del Paisaje ──────────────────────────────────────────────────
    "formas-del-paisaje": {
        "image":     r"public\assets\maps\base-images\chapter1\formas-del-paisaje.webp",
        "output":    r"public\assets\maps\tiles\formas-del-paisaje",
        "pgw": [
            0.002102102561,
            0.0,
            0.0,
            -0.002101779729,
            -79.131272642526,
            7.117096885075,
        ],
        "min_zoom": 0,
        "max_zoom": 9,
        "tile_size": 512,
    },

    # ─── Bredunco ────────────────────────────────────────────────────────────
    "bredunco": {
        "image":     r"public\assets\maps\base-images\chapter1\bredunco.webp",
        "output":    r"public\assets\maps\tiles\bredunco",
        "pgw": [
            0.001182047579,
            0.0,
            0.0,
            -0.001181998411,
            -78.907953240108,
            6.387072589706,
        ],
        "min_zoom": 0,
        "max_zoom": 9,
        "tile_size": 512,
    },

    # ─── Mosaicos del Agua ───────────────────────────────────────────────────
    "mosaicos-del-agua": {
        "image":     r"public\assets\maps\base-images\chapter1\mosaicos-del-agua.webp",
        "output":    r"public\assets\maps\tiles\mosaicos-del-agua",
        "pgw": [
            0.000166392514,
            0.0,
            0.0,
            -0.000166382730,
            -76.968456199726,
            3.694959392679,
        ],
        "min_zoom": 0,
        "max_zoom": 12,
        "tile_size": 512,
    },

    # ─── Un Río Cauca, Muchos Mundos ─────────────────────────────────────────
    "un-rio-cauca": {
        "image":     r"public\assets\maps\base-images\chapter1\un-rio-cauca.webp",
        "output":    r"public\assets\maps\tiles\un-rio-cauca",
        "pgw": [
            0.001232559561,
            0.0,
            0.0,
            -0.001232510189,
            -79.451453386908,
            6.911411317278,
        ],
        "min_zoom": 0,
        "max_zoom": 9,
        "tile_size": 512,
    },

    # ─── Introducción — imagen de portada del Atlas ───────────────────────────
    # Imagen fuente: intro.webp (11141×5649 px, landscape)
    # PGW original (portrait rotado, A=0 E=0 B≠0 D≠0):
    #   D=0.001181998411, B=0.001182047579, C=-78.907953240108, F=-0.290036434033
    # Conversión portrait→landscape 90° HORARIO con W_portrait=5649:
    #   A_new = B_old  = 0.001182047579
    #   E_new = -D_old = -0.001181998411
    #   F_new = F_old + D_old × 5649 = -0.290036434033 + 6.677109023739 = 6.387072589706
    "intro": {
        "image":     r"public\assets\maps\base-images\intro.webp",
        "output":    r"public\assets\maps\tiles\intro",
        "pgw": [
            0.001182047579,    # A = B_old : lon/col (hacia el este)
            0.0,               # D: sin skew
            0.0,               # B: sin skew
            -0.001181998411,   # E = -D_old: lat/row (negativo = hacia el sur)
            -78.907953240108,  # C: lon esquina top-left (oeste)
            12.878607862918,   # F exacto anclado al sur original (usar --auto-f-anchor/--auto-f-lat para recalcular)
        ],
        "min_zoom": 0,
        "max_zoom": 9,
        "tile_size": 512,
    },

    # ─── Encuadres Territoriales - DEFINITIVO ────────────────────────────────
    "encuadres": {
        "image":     r"public\assets\maps\base-images\chapter1\encuadres.webp",
        "output":    r"public\assets\maps\tiles\encuadres",
        "pgw": [
            0.002291638125288596,  # A: lon/col (hacia el este)
            0.0,                   # D: sin skew
            0.0,                   # B: sin skew
            -0.002290735360175294, # E: lat/row (negativo = hacia el sur)
            -82.7041078,           # C: lon esquina top-left (oeste)
            -4.6172733,            # F: lat esquina top-left (norte)
        ],
        "min_zoom": 0,
        "max_zoom": 8,
        "tile_size": 512,
    },

    # ─── Ecosistemas ────────────────────────────────────────────────────────
    # PGW original rotado (A=0 E=0 B!=0 D!=0) con factor de rango 2.03.
    # Conversión a PGW estándar sin skew (90° horario):
    #   A = B_old, E = -D_old, C = C_old, F = F_old + D_old * W_portrait
    "ecosistemas": {
        "image":     r"public\assets\maps\base-images\chapter1\ecosistemas.webp",
        "output":    r"public\assets\maps\tiles\ecosistemas",
        "pgw": [
            0.00047068958979,
            0.0,
            0.0,
            -0.0004706619148,
            -77.717574036785,
            4.258046288922,
        ],
        "min_zoom": 0,
        "max_zoom": 10,
        "tile_size": 512,
    },
}

TILE_SIZE = 256

FLIP_NONE = "none"
FLIP_HORIZONTAL = "horizontal"
FLIP_VERTICAL = "vertical"
FLIP_BOTH = "both"
FLIP_CHOICES = [FLIP_NONE, FLIP_HORIZONTAL, FLIP_VERTICAL, FLIP_BOTH]

F_ANCHOR_NORTH = "north"
F_ANCHOR_SOUTH = "south"
F_ANCHOR_CHOICES = [F_ANCHOR_NORTH, F_ANCHOR_SOUTH]

C_ANCHOR_WEST = "west"
C_ANCHOR_EAST = "east"
C_ANCHOR_CENTER = "center"
C_ANCHOR_CHOICES = [C_ANCHOR_WEST, C_ANCHOR_EAST, C_ANCHOR_CENTER]


def normalize_rotation_degrees(rotation_degrees):
    if rotation_degrees % 90 != 0:
        raise ValueError("rotation_degrees debe ser multiplo de 90")
    return rotation_degrees % 360


def normalize_flip_mode(flip_mode):
    value = (flip_mode or FLIP_NONE).strip().lower()
    if value not in FLIP_CHOICES:
        raise ValueError(f"flip_mode desconocido: {flip_mode}")
    return value


def validate_auto_f_options(auto_f_anchor, auto_f_lat):
    has_anchor = auto_f_anchor is not None
    has_lat = auto_f_lat is not None
    if has_anchor != has_lat:
        raise ValueError("--auto-f-anchor y --auto-f-lat deben usarse juntos")


def validate_auto_c_options(auto_c_anchor, auto_c_lon):
    has_anchor = auto_c_anchor is not None
    has_lon = auto_c_lon is not None
    if has_anchor != has_lon:
        raise ValueError("--auto-c-anchor y --auto-c-lon deben usarse juntos")


def compute_f_from_anchor(E, image_height, anchor_mode, anchor_lat):
    if not math.isfinite(anchor_lat):
        raise ValueError("--auto-f-lat debe ser un número finito")

    if abs(E) < 1e-15:
        raise ValueError("No se puede calcular F automáticamente cuando E es 0")

    if anchor_mode == F_ANCHOR_NORTH:
        # Para este modelo (sin skew latitudinal), la latitud norte es F.
        return float(anchor_lat)

    if anchor_mode == F_ANCHOR_SOUTH:
        # lat_south = F + E * H  =>  F = lat_south - E * H
        return float(anchor_lat) - E * image_height

    raise ValueError(f"Modo de anclaje de F desconocido: {anchor_mode}")


def compute_c_from_anchor(A, image_width, anchor_mode, anchor_lon):
    if not math.isfinite(anchor_lon):
        raise ValueError("--auto-c-lon debe ser un número finito")

    if abs(A) < 1e-15:
        raise ValueError("No se puede calcular C automáticamente cuando A es 0")

    if anchor_mode == C_ANCHOR_WEST:
        # En modelo sin skew longitudinal, la longitud oeste es C.
        return float(anchor_lon)

    if anchor_mode == C_ANCHOR_EAST:
        # lon_east = C + A * W  =>  C = lon_east - A * W
        return float(anchor_lon) - A * image_width

    if anchor_mode == C_ANCHOR_CENTER:
        # lon_center = C + A * W / 2  =>  C = lon_center - A * W / 2
        return float(anchor_lon) - (A * image_width / 2.0)

    raise ValueError(f"Modo de anclaje de C desconocido: {anchor_mode}")


def apply_orientation_transform(image, rotation_degrees, flip_mode):
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

# ─────────────────────────────────────────────────────────────────────────────
# PGW inverse transform helpers
# ─────────────────────────────────────────────────────────────────────────────

def make_inverse_pgw(A, D, B, E, C, F):
    """
    Build an inverse PGW function: (lon, lat) → (x, y) in image pixels.

    Forward transform:
        lon = A*x + B*y + C
        lat = D*x + E*y + F

    Inverse (Cramer's rule):
        det = A*E - B*D
        x = (E*(lon - C) - B*(lat - F)) / det
        y = (A*(lat - F) - D*(lon - C)) / det
    """
    det = A * E - B * D
    if abs(det) < 1e-15:
        raise ValueError("PGW matrix is singular – cannot invert transform.")

    def geo_to_pixel(lon, lat):
        dX = lon - C
        dY = lat - F
        px = (E * dX - B * dY) / det   # x = col (horizontal in PIL)
        py = (A * dY - D * dX) / det   # y = row (vertical   in PIL)
        return px, py

    return geo_to_pixel


def make_forward_pgw(A, D, B, E, C, F):
    """Build a forward transform: (x, y) in image pixels → (lon, lat)."""
    def pixel_to_geo(x, y):
        lon = A * x + B * y + C
        lat = D * x + E * y + F
        return lon, lat
    return pixel_to_geo


# ─────────────────────────────────────────────────────────────────────────────
# Slippy-map (Web Mercator / XYZ) helpers
# ─────────────────────────────────────────────────────────────────────────────

def tile_to_lonlat(z, tx, ty):
    """Return (lon_west, lat_south, lon_east, lat_north) for tile (z, tx, ty)."""
    n = 2 ** z
    lon_w = tx / n * 360.0 - 180.0
    lon_e = (tx + 1) / n * 360.0 - 180.0
    lat_n = math.degrees(math.atan(math.sinh(math.pi * (1.0 - 2.0 * ty / n))))
    lat_s = math.degrees(math.atan(math.sinh(math.pi * (1.0 - 2.0 * (ty + 1) / n))))
    return lon_w, lat_s, lon_e, lat_n


def lon_to_tx(lon, z):
    return int((lon + 180.0) / 360.0 * 2 ** z)


def lat_to_ty(lat, z):
    lat_r = math.radians(lat)
    return int((1.0 - math.log(math.tan(lat_r) + 1.0 / math.cos(lat_r)) / math.pi) / 2.0 * 2 ** z)


# ─────────────────────────────────────────────────────────────────────────────
# Tile generation
# ─────────────────────────────────────────────────────────────────────────────

def render_tile(src_img, geo_to_pixel, z, tx, ty, tile_size):
    """
    Render one XYZ tile from the source image.

    Uses PIL MESH transform: maps each tile corner to its source pixel
    position. Accurate enough for zoom 0-9 tiles.

    Returns a PIL Image or None if tile is entirely outside the source.
    """
    lon_w, lat_s, lon_e, lat_n = tile_to_lonlat(z, tx, ty)
    src_w, src_h = src_img.size

    # Source pixel coordinates for the 4 tile corners
    # PIL QUAD expects: (UL, LL, LR, UR) → each as (x, y) in source
    corners = {
        "NW": geo_to_pixel(lon_w, lat_n),  # top-left     of tile
        "SW": geo_to_pixel(lon_w, lat_s),  # bottom-left  of tile
        "SE": geo_to_pixel(lon_e, lat_s),  # bottom-right of tile
        "NE": geo_to_pixel(lon_e, lat_n),  # top-right    of tile
    }

    # Check if any tile corner is inside the source image (rough clip test)
    xs = [v[0] for v in corners.values()]
    ys = [v[1] for v in corners.values()]

    # Tile bounding box in source pixels
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    # Skip if tile doesn't overlap source image at all
    if max_x < 0 or min_x > src_w or max_y < 0 or min_y > src_h:
        return None

    # PIL QUAD data: src coords for each dest corner, in order:
    # (x0,y0)=UL, (x1,y1)=LL, (x2,y2)=LR, (x3,y3)=UR
    NW = corners["NW"]
    SW = corners["SW"]
    SE = corners["SE"]
    NE = corners["NE"]

    quad_data = (
        NW[0], NW[1],   # top-left  of destination
        SW[0], SW[1],   # bot-left  of destination
        SE[0], SE[1],   # bot-right of destination
        NE[0], NE[1],   # top-right of destination
    )

    # Expand source to include some padding so the transform doesn't clip
    pad = max(int(abs(max_x - min_x)), int(abs(max_y - min_y)), 10)
    crop_x0 = max(0, int(min_x) - pad)
    crop_y0 = max(0, int(min_y) - pad)
    crop_x1 = min(src_w, int(max_x) + pad)
    crop_y1 = min(src_h, int(max_y) + pad)

    # Adjust QUAD coordinates relative to crop
    offset_x, offset_y = crop_x0, crop_y0
    adj = (
        quad_data[0] - offset_x, quad_data[1] - offset_y,
        quad_data[2] - offset_x, quad_data[3] - offset_y,
        quad_data[4] - offset_x, quad_data[5] - offset_y,
        quad_data[6] - offset_x, quad_data[7] - offset_y,
    )

    # Crop and transform
    try:
        cropped = src_img.crop((crop_x0, crop_y0, crop_x1, crop_y1))
        tile = cropped.transform(
            (tile_size, tile_size),
            PIL_QUAD,
            adj,
            PIL_BICUBIC,
        )
    except Exception:
        return None

    # If the tile is fully transparent / blank, skip it
    if tile.mode == "RGBA":
        bbox = tile.getbbox()
        if bbox is None:
            return None
    else:
        # Convert to RGBA to check alpha
        tmp = tile.convert("RGBA")
        bbox = tmp.getbbox()
        if bbox is None:
            return None

    return tile.convert("RGBA")


def generate_tiles(
    map_name,
    min_zoom=None,
    max_zoom=None,
    tile_format="webp",
    rotation_degrees=0,
    flip_mode="none",
    auto_f_anchor=None,
    auto_f_lat=None,
    auto_c_anchor=None,
    auto_c_lon=None,
):
    tile_fmt = tile_format.lower().strip()
    tile_ext = "webp" if tile_fmt == "webp" else "png"
    cfg = MAPS_CONFIG.get(map_name)
    if cfg is None:
        print(f"ERROR: Map '{map_name}' not found in MAPS_CONFIG")
        sys.exit(1)

    # Resolve paths relative to project root (script is in /scripts/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    img_path = os.path.join(project_root, cfg["image"])
    out_dir  = os.path.join(project_root, cfg["output"])

    A, D, B, E, C, F = cfg["pgw"]
    z_min = min_zoom if min_zoom is not None else cfg["min_zoom"]
    z_max = max_zoom if max_zoom is not None else cfg["max_zoom"]
    tile_size = cfg.get("tile_size", TILE_SIZE)

    print("=" * 64)
    print(f"  Atlas 2.0 – Tile Generator (no-GDAL)")
    print("=" * 64)
    print(f"  Map    : {map_name}")
    print(f"  Image  : {img_path}")
    print(f"  Output : {out_dir}")
    print(f"  Zoom   : {z_min} -> {z_max}")
    print(f"  Tile   : {tile_size}px")
    print(f"  Format : {tile_ext.upper()}")
    print(f"  Rotate : {normalize_rotation_degrees(rotation_degrees)}°")
    print(f"  Flip   : {normalize_flip_mode(flip_mode)}")
    print("=" * 64)

    if not os.path.isfile(img_path):
        print(f"\nERROR: Image not found: {img_path}")
        sys.exit(1)

    # Load source image once
    print("\nLoading source image...", end=" ", flush=True)
    src_img = Image.open(img_path).convert("RGBA")
    src_img = apply_orientation_transform(src_img, rotation_degrees, flip_mode)
    src_w, src_h = src_img.size
    print(f"{src_w}x{src_h}px")

    if auto_f_anchor is not None:
        if auto_f_lat is None:
            raise ValueError("Falta --auto-f-lat para el cálculo automático de F")

        if abs(D) > 1e-15:
            raise ValueError(
                "El cálculo automático de F requiere D=0 (sin skew latitudinal)"
            )

        anchor_lat = float(auto_f_lat)
        original_f = F
        F = compute_f_from_anchor(E, src_h, auto_f_anchor, anchor_lat)
        est_lat_north = F
        est_lat_south = F + E * src_h

        print("\nAuto-cálculo de F:")
        print(f"  Anchor mode : {auto_f_anchor}")
        print(f"  Anchor lat  : {anchor_lat:.12f}")
        print(f"  F original  : {original_f:.12f}")
        print(f"  F calculado : {F:.12f}")
        print(f"  Lat esperada: {est_lat_south:.6f} -> {est_lat_north:.6f}")

    if auto_c_anchor is not None:
        if auto_c_lon is None:
            raise ValueError("Falta --auto-c-lon para el cálculo automático de C")

        if abs(B) > 1e-15:
            raise ValueError(
                "El cálculo automático de C requiere B=0 (sin skew longitudinal)"
            )

        anchor_lon = float(auto_c_lon)
        original_c = C
        C = compute_c_from_anchor(A, src_w, auto_c_anchor, anchor_lon)
        est_lon_west = C
        est_lon_east = C + A * src_w
        est_lon_center = C + A * src_w / 2.0

        print("\nAuto-cálculo de C:")
        print(f"  Anchor mode : {auto_c_anchor}")
        print(f"  Anchor lon  : {anchor_lon:.12f}")
        print(f"  C original  : {original_c:.12f}")
        print(f"  C calculado : {C:.12f}")
        print(
            f"  Lon esperada: {est_lon_west:.6f} -> {est_lon_east:.6f} (center {est_lon_center:.6f})"
        )

    # Build transforms
    pixel_to_geo = make_forward_pgw(A, D, B, E, C, F)
    geo_to_pixel = make_inverse_pgw(A, D, B, E, C, F)

    # Compute image extent in geographic coordinates
    corners_px = [(0, 0), (src_w, 0), (src_w, src_h), (0, src_h)]
    corners_geo = [pixel_to_geo(x, y) for x, y in corners_px]
    all_lons = [g[0] for g in corners_geo]
    all_lats = [g[1] for g in corners_geo]

    img_lon_min = min(all_lons)
    img_lon_max = max(all_lons)
    img_lat_min = min(all_lats)
    img_lat_max = max(all_lats)

    print(f"\nGeographic extent:")
    print(f"  Longitude: {img_lon_min:.6f} -> {img_lon_max:.6f}")
    print(f"  Latitude : {img_lat_min:.6f} -> {img_lat_max:.6f}")
    print()

    total_tiles = 0
    written_tiles = 0

    for z in range(z_min, z_max + 1):
        # Tile range covering the image extent
        tx_min = max(0, lon_to_tx(img_lon_min, z))
        tx_max = min(2**z - 1, lon_to_tx(img_lon_max, z))
        ty_min = max(0, lat_to_ty(img_lat_max, z))  # note: lat_max → smaller ty
        ty_max = min(2**z - 1, lat_to_ty(img_lat_min, z))

        n_tiles = (tx_max - tx_min + 1) * (ty_max - ty_min + 1)
        total_tiles += n_tiles
        print(f"  Zoom {z:2d}: tiles x=[{tx_min},{tx_max}] y=[{ty_min},{ty_max}]  ({n_tiles} candidates)")

        done = 0
        for ty in range(ty_min, ty_max + 1):
            for tx in range(tx_min, tx_max + 1):
                tile = render_tile(src_img, geo_to_pixel, z, tx, ty, tile_size)
                done += 1

                if tile is None:
                    continue

                # Save tile
                tile_dir = os.path.join(out_dir, str(z), str(tx))
                os.makedirs(tile_dir, exist_ok=True)
                tile_path = os.path.join(tile_dir, f"{ty}.{tile_ext}")
                if tile_fmt == "webp":
                    tile.save(tile_path, "WEBP", quality=82, method=6, exact=True)
                else:
                    tile.save(tile_path, "PNG", optimize=True)
                written_tiles += 1

                if done % 50 == 0 or done == n_tiles:
                    pct = 100 * done / n_tiles
                    print(f"    [{pct:5.1f}%] {done}/{n_tiles} – written {written_tiles}", end="\r")

        print(f"    [100.0%] {n_tiles}/{n_tiles} – written {written_tiles}     ")

    print()
    print(f"Done! {written_tiles} tiles written to: {out_dir}")
    return written_tiles


# ─────────────────────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate XYZ tiles from georeferenced webp (no GDAL).")
    parser.add_argument("--map",      required=True, help="Map name in MAPS_CONFIG")
    parser.add_argument("--min-zoom", type=int, default=None)
    parser.add_argument("--max-zoom", type=int, default=None)
    parser.add_argument("--format",   default="webp", choices=["webp", "png"],
                        help="Output tile format (default: webp)")
    parser.add_argument("--rotation-degrees", type=int, default=0,
                        help="Rotación global en grados (sentido horario, multiplo de 90)")
    parser.add_argument("--flip-mode", default="none", choices=FLIP_CHOICES,
                        help="Flip global: none|horizontal|vertical|both")
    parser.add_argument("--auto-f-anchor", default=None, choices=F_ANCHOR_CHOICES,
                        help="Calcula F automáticamente desde una latitud de anclaje: north|south")
    parser.add_argument("--auto-f-lat", type=float, default=None,
                        help="Latitud objetivo usada por --auto-f-anchor")
    parser.add_argument("--auto-c-anchor", default=None, choices=C_ANCHOR_CHOICES,
                        help="Calcula C automáticamente desde una longitud de anclaje: west|east|center")
    parser.add_argument("--auto-c-lon", type=float, default=None,
                        help="Longitud objetivo usada por --auto-c-anchor")
    args = parser.parse_args()

    try:
        normalize_rotation_degrees(args.rotation_degrees)
        normalize_flip_mode(args.flip_mode)
        validate_auto_f_options(args.auto_f_anchor, args.auto_f_lat)
        validate_auto_c_options(args.auto_c_anchor, args.auto_c_lon)
    except ValueError as err:
        print(f"ERROR: {err}")
        sys.exit(1)

    generate_tiles(
        args.map,
        args.min_zoom,
        args.max_zoom,
        args.format,
        args.rotation_degrees,
        args.flip_mode,
        args.auto_f_anchor,
        args.auto_f_lat,
        args.auto_c_anchor,
        args.auto_c_lon,
    )
