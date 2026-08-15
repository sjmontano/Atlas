import type { GeojsonLayer } from '../../types/layer.ts'

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

export const NODO_SUAREZ: GeojsonLayer = nodeLayer('nodo-suarez', 'Nodo Suárez', '/data/nodos/suarez.geojson', '#ffaf25')
export const NODO_VILLA_RICA: GeojsonLayer = nodeLayer('nodo-villa-rica', 'Nodo Villa Rica', '/data/nodos/villa-rica.geojson', '#ffea2b')
export const NODO_ORIENTE_CALI: GeojsonLayer = nodeLayer('nodo-oriente-cali', 'Nodo Oriente de Cali', '/data/nodos/oriente-cali.geojson', '#81c640')

export const CAP2_VALLE_LAYERS: GeojsonLayer[] = [NODO_SUAREZ, NODO_VILLA_RICA, NODO_ORIENTE_CALI]
export const CAP2_M_SUAREZ_LAYERS: GeojsonLayer[] = [NODO_SUAREZ]
export const CAP2_M_VILLA_RICA_LAYERS: GeojsonLayer[] = [NODO_VILLA_RICA]
export const CAP2_M_ORIENTE_CALI_LAYERS: GeojsonLayer[] = [NODO_ORIENTE_CALI]
