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
