export type PGWData = readonly [number, number, number, number, number, number]

export interface MapDimensions {
  width: number
  height: number
}

export interface MapConfig {
  id: string
  name: string
  description: string
  imagePath: string
  lowResImagePath?: string
  dimensions: MapDimensions
  pgwData: PGWData
  chapter?: number
  territory?: string
}

export interface MapLayers {
  placeholder: string
  mainImage: string
  tilesUrl: string | null
  dimensions: MapDimensions
}

export interface Bounds {
  west: number
  south: number
  east: number
  north: number
}

export interface ViewportMaxBounds {
  west: number
  south: number
  east: number
  north: number
}

export interface MapSettings {
  initialZoom: number
  minZoom: number
  maxZoom: number
  initialBearing: number
  useTransformConstrain: boolean
  viewportMaxBounds: ViewportMaxBounds | null
  dragPan: boolean
  scrollZoom: boolean
}
