import type { GeojsonLayer } from '../../../types/layer'

const nodeLayer = (id: string, name: string, url: string, color: string): GeojsonLayer => ({
  id,
  name,
  category: 'nodes',
  type: 'geojson',
  url,
  geometry: 'fill',
  paint: { 'fill-color': color, 'fill-opacity': 0.4 },
  order: 10,
  opacity: 0.4,
  visibleByDefault: true,
  legend: { swatch: color, description: name },
})

export const LAYERS: GeojsonLayer[] = [
  nodeLayer('nodo-villa-rica', 'Nodo Villa Rica', '/data/nodos/villa-rica.geojson', '#ffea2b'),
]
