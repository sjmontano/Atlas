const nodeLayer = (id, name, url, color) => ({
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

export const NODO_SUAREZ = nodeLayer('nodo-suarez', 'Nodo Suárez', '/data/nodos/suarez.geojson', '#ffaf25')
export const NODO_VILLA_RICA = nodeLayer('nodo-villa-rica', 'Nodo Villa Rica', '/data/nodos/villa-rica.geojson', '#ffea2b')
export const NODO_ORIENTE_CALI = nodeLayer('nodo-oriente-cali', 'Nodo Oriente de Cali', '/data/nodos/oriente-cali.geojson', '#81c640')

export const CAP2_VALLE_LAYERS = [NODO_SUAREZ, NODO_VILLA_RICA, NODO_ORIENTE_CALI]
export const CAP2_M_SUAREZ_LAYERS = [NODO_SUAREZ]
export const CAP2_M_VILLA_RICA_LAYERS = [NODO_VILLA_RICA]
export const CAP2_M_ORIENTE_CALI_LAYERS = [NODO_ORIENTE_CALI]
