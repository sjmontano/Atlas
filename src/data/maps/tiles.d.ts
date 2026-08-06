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

export const MAP_TILES: Readonly<Record<string, MapTilesConfig>>
