import type { PGWData } from '@services/BoundsCalculator'

export type LayerCategory = 'rivers' | 'ecosystems' | 'boundaries' | 'nodes' | 'conflicts' | 'other'

export interface LayerMetadata {
  id: string
  name: string
  slug: string
  category: LayerCategory
  geometryType: string
  featureCount: number
  description: string
}

export type LayerType = 'raster-pgw' | 'raster-tiles' | 'geojson'

export interface LayerBase {
  id: string
  name: string
  category: LayerCategory
  group?: string
  visibleByDefault?: boolean
  opacity?: number
  order: number
  legend?: {
    swatch?: string
    description?: string
    longText?: string
  }
}

export interface RasterPgwLayer extends LayerBase {
  type: 'raster-pgw'
  image: string
  pgw: PGWData
  width: number
  height: number
}

export interface RasterTilesLayer extends LayerBase {
  type: 'raster-tiles'
  urlTemplate: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
}

export interface GeojsonLayer extends LayerBase {
  type: 'geojson'
  url: string
  geometry: 'fill' | 'line' | 'symbol' | 'circle'
  paint: Record<string, unknown>
}

export type Layer = RasterPgwLayer | RasterTilesLayer | GeojsonLayer

export interface LayerGroup {
  id: string
  name: string
  parent?: string
  order: number
}

export interface LegendItem {
  id: string
  name: string
  swatch: string
  group?: string
  order: number
  description?: string
  longText?: string
}
