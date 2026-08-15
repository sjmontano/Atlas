import type { PGWData } from '@services/BoundsCalculator'
import type { Layer, LayerGroup } from './layer'
import type { Poi } from './poi'

export type { Layer, LayerGroup } from './layer'
export type { Poi } from './poi'

export interface MapGeoEntry {
  /** PGW formato rotado [A, D, B, E, C, F] con A=0, E=0 */
  readonly pgw: PGWData
  readonly width: number
  readonly height: number
}

export interface MapImageUrls {
  base: string
  full: string
  placeholder: string
}

export interface MapConfig {
  initialZoom: number
  minZoom: number
  maxZoom: number
  initialBearing: number
  useTransformConstrain: boolean
  viewportMaxBounds: null | { west: number; south: number; east: number; north: number }
  dragPan: boolean
  scrollZoom: boolean
}

export interface MapTilesConfig {
  urlTemplate: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
}

export interface MapContent {
  mapId: string
  geo: MapGeoEntry
  images: MapImageUrls
  config: MapConfig
  tiles?: MapTilesConfig | null
  layers?: Layer[]
  groups?: LayerGroup[]
  pois?: Poi[]
}
