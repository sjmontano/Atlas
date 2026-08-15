// ─────────────────────────────────────────────────────────────────────────────
// TILES XYZ DE ALTA RESOLUCIÓN
// ============================
//
// Configuración de tiles por mapa. Los tiles se generan con
// `pnpm tiles` (scripts/generate-tiles.mjs) usando GDAL y NO se versionan
// en git (ver .gitignore → public/assets/maps/tiles).
//
// Estructura en public/assets/maps/tiles/:
//   mapas/{mapId}/{z}/{x}/{y}.webp    → tiles de mapas base (urlTemplate)
//   capas/{layerId}/{z}/{x}/{y}.webp  → tiles de capas temáticas (futuro)
//
// Los bounds del source se derivan en runtime desde geo.js (processBounds),
// de modo que los tiles quedan alineados con la capa base ImageSource.
// Aquí solo se define: plantilla de URL, tamaño de tile y rango de zoom
// generado.
// ─────────────────────────────────────────────────────────────────────────────

export interface MapTilesConfig {
  /** Plantilla de URL XYZ (ej. /assets/maps/tiles/mapas/{mapId}/{z}/{x}/{y}.webp) */
  urlTemplate: string
  /** Tamaño del tile en píxeles (256 para GDAL2Tiles) */
  tileSize: number
  /** Zoom mínimo generado */
  minZoom: number
  /** Zoom máximo generado */
  maxZoom: number
  /** Duración del fade de la capa raster (ms) */
  fadeDuration?: number
}

export const MAP_TILES: Readonly<Record<string, MapTilesConfig>> = {
  'chapter1-ecosistemas': {
    urlTemplate: '/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp',
    tileSize: 256,
    minZoom: 6,
    maxZoom: 12,
    fadeDuration: 300,
  },
}
