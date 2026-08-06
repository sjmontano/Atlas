import type { MapGeoEntry } from './geo'
import type { MapImageUrls } from './images'
import type { MapConfig } from './configs'
import type { MapTilesConfig } from './tiles'

export interface MapEntry {
  geo: MapGeoEntry
  images: MapImageUrls
  config: MapConfig
  /** Configuración de tiles XYZ de alta resolución (null si el mapa no tiene) */
  tiles: MapTilesConfig | null
}

export function getMapEntry(mapId: string): MapEntry | null
export function hasMap(mapId: string): boolean

export { MAP_GEO } from './geo'
export { MAP_IMAGES } from './images'
export { MAP_CONFIGS } from './configs'
export { MAP_TILES } from './tiles'
