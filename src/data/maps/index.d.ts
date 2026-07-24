import type { MapGeoEntry } from './geo'
import type { MapImageUrls } from './images'
import type { MapConfig } from './configs'

export interface MapEntry {
  geo: MapGeoEntry
  images: MapImageUrls
  config: MapConfig
}

export function getMapEntry(mapId: string): MapEntry | null
export function hasMap(mapId: string): boolean

export { MAP_GEO } from './geo'
export { MAP_IMAGES } from './images'
export { MAP_CONFIGS } from './configs'
