// ─────────────────────────────────────────────────────────────────────────────
// MAPS — Acceso unificado a datos de mapas
// ─────────────────────────────────────────────────────────────────────────────

import { MAP_GEO } from './geo.js'
import { MAP_IMAGES } from './images.js'
import { MAP_CONFIGS } from './configs.js'

/**
 * Devuelve toda la información de un mapa en un solo objeto.
 *
 * @param {string} mapId - ID del mapa (ej. 'chapter1-ecosistemas')
 * @returns {{ geo: object, images: object, config: object } | null}
 *
 * @example
 * const { geo, images, config } = getMapEntry('chapter1-ecosistemas')
 * const coordinates = calculateImageCoordinates(geo.pgw, geo.width, geo.height)
 */
export function getMapEntry(mapId) {
  const geo = MAP_GEO[mapId]
  const images = MAP_IMAGES[mapId]
  const config = MAP_CONFIGS[mapId]

  if (!geo || !images || !config) {
    return null
  }

  return { geo, images, config }
}

/**
 * Verifica si un mapa existe en los datos.
 */
export function hasMap(mapId) {
  return mapId in MAP_GEO
}

export { MAP_GEO } from './geo.js'
export { MAP_IMAGES } from './images.js'
export { MAP_CONFIGS } from './configs.js'
