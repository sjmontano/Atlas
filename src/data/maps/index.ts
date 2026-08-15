// ─────────────────────────────────────────────────────────────────────────────
// MAPS — Acceso unificado a datos de mapas
// ─────────────────────────────────────────────────────────────────────────────

import type { MapGeoEntry } from './geo.ts'
import type { MapImageUrls } from './images.ts'
import type { MapConfig } from './configs.ts'
import type { MapTilesConfig } from './tiles.ts'
import { MAP_GEO } from './geo.ts'
import { MAP_IMAGES } from './images.ts'
import { MAP_CONFIGS } from './configs.ts'
import { MAP_TILES } from './tiles.ts'

export interface MapEntry {
  geo: MapGeoEntry
  images: MapImageUrls
  config: MapConfig
  /** Configuración de tiles XYZ de alta resolución (null si el mapa no tiene) */
  tiles: MapTilesConfig | null
}

/**
 * Devuelve toda la información de un mapa en un solo objeto.
 *
 * @param mapId - ID del mapa (ej. 'chapter1-ecosistemas')
 * @returns {{ geo: object, images: object, config: object, tiles: object | null } | null}
 *
 * @example
 * const { geo, images, config, tiles } = getMapEntry('chapter1-ecosistemas')
 * const coordinates = calculateImageCoordinates(geo.pgw, geo.width, geo.height)
 */
export function getMapEntry(mapId: string): MapEntry | null {
  const geo = MAP_GEO[mapId]
  const images = MAP_IMAGES[mapId]
  const config = MAP_CONFIGS[mapId]

  if (!geo || !images || !config) {
    return null
  }

  return { geo, images, config, tiles: MAP_TILES[mapId] ?? null }
}

/**
 * Verifica si un mapa existe en los datos.
 */
export function hasMap(mapId: string): boolean {
  return mapId in MAP_GEO
}

export { MAP_GEO } from './geo.ts'
export { MAP_IMAGES } from './images.ts'
export { MAP_CONFIGS } from './configs.ts'
export { MAP_TILES } from './tiles.ts'
