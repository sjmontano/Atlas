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

export const MAP_CONFIGS: Readonly<Record<string, MapConfig>>
