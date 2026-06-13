"""
export-geo-layers.py
====================
Exporta los GeoJSON de capas vectoriales desde el dump de MongoDB
(test.geocollections.json) a archivos .json estáticos bajo
public/assets/geo-layers/{slug}.json

El dump MongoDB tiene documentos con estructura:
  { "_id": {...}, "name": "...", "slug": "...", "type": "FeatureCollection", "features": [...], ... }

Uso:
    python scripts/export-geo-layers.py                         # desde raíz del proyecto
    python scripts/export-geo-layers.py --dry-run               # sin escribir
    python scripts/export-geo-layers.py --mongo D:\\otro\\path  # ruta custom al .json
"""

import argparse
import json
import os
import pathlib
import sys

DEFAULT_MONGO = pathlib.Path("..") / "MongoDB" / "test.geocollections.json"
OUTPUT_DIR    = pathlib.Path("public/assets/geo-layers")

def slugify(name: str) -> str:
    """Convierte nombre a slug básico (igual que el script Node)."""
    import unicodedata, re
    s = unicodedata.normalize("NFD", name.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"[^a-z0-9-]", "", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


def main(dry_run: bool = False, mongo_path: pathlib.Path = DEFAULT_MONGO) -> None:
    if not mongo_path.exists():
        print(f"❌ Archivo MongoDB no encontrado: {mongo_path.resolve()}")
        sys.exit(1)

    print(f"📂 Leyendo: {mongo_path.resolve()}")
    raw = mongo_path.read_text(encoding="utf-8")

    # El dump puede ser JSON array o NDJSON (un doc por línea)
    raw = raw.strip()
    if raw.startswith("["):
        docs = json.loads(raw)
    else:
        docs = [json.loads(line) for line in raw.splitlines() if line.strip()]

    print(f"   {len(docs)} documentos encontrados")

    if not dry_run:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    total_out = 0
    errors    = []

    for doc in docs:
        # Normalizar _id de MongoDB (puede ser {"$oid": "..."} o string)
        raw_id = doc.get("_id", {})
        if isinstance(raw_id, dict):
            doc_id = raw_id.get("$oid", str(raw_id))
        else:
            doc_id = str(raw_id)

        name = doc.get("name", "sin-nombre")
        slug = doc.get("slug") or slugify(name)

        # Construir GeoJSON limpio (quitar campos Mongo internos)
        geojson = {
            "id":       doc_id,
            "name":     name,
            "slug":     slug,
            "type":     doc.get("type", "FeatureCollection"),
            "features": doc.get("features", []),
        }
        if "crs" in doc:
            geojson["crs"] = doc["crs"]

        out_path = OUTPUT_DIR / f"{slug}.json"
        json_bytes = json.dumps(geojson, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        kb = len(json_bytes) / 1024

        if not dry_run:
            out_path.write_bytes(json_bytes)
            total_out += len(json_bytes)
            print(f"✅ {slug:<50} {kb:>7.0f} KB")
        else:
            print(f"🔍 {slug:<50} {kb:>7.0f} KB  (dry-run)")

    print()
    if not dry_run:
        print(f"Total exportado: {total_out/1024:.0f} KB  en  {OUTPUT_DIR}/")
    if errors:
        print(f"\n⚠️  {len(errors)} errores: {', '.join(errors)}")
        sys.exit(1)
    else:
        print(f"✅ {len(docs)} capas exportadas sin errores.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--mongo", type=pathlib.Path, default=DEFAULT_MONGO,
                        help="Ruta al archivo test.geocollections.json")
    args = parser.parse_args()
    main(dry_run=args.dry_run, mongo_path=args.mongo)
