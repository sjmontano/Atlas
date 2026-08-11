import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '../types/poi.ts'

interface GeoJSONFeature {
  type: 'Feature'
  id?: string | number
  properties: Record<string, unknown>
  geometry: { type: 'Point'; coordinates: [number, number] }
}

const POIS_SOURCE_ID = 'atlas-pois-source'
const POIS_LAYER_ID = 'atlas-pois-layer'

export function addPois(
  map: maplibregl.Map,
  _mapId: string,
  pois: Poi[],
  onPoiClick: (poi: Poi) => void,
): void {
  removePois(map)

  const features: GeoJSONFeature[] = pois.map((poi) => ({
    type: 'Feature',
    id: poi.id,
    properties: { id: poi.id, name: poi.name, numero: poi.numero, popupTitle: poi.popup.title },
    geometry: { type: 'Point', coordinates: poi.coords },
  }))

  map.addSource(POIS_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })

  map.addLayer({
    id: POIS_LAYER_ID,
    type: 'symbol',
    source: POIS_SOURCE_ID,
    layout: {
      'text-field': ['to-string', ['get', 'numero']],
      'text-size': 14,
      'text-font': ['Open Sans Bold'],
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#1a1a2e',
      'text-halo-width': 2,
    },
  })

  map.on('click', POIS_LAYER_ID, (e) => {
    const feature = e.features?.[0]
    if (feature) {
      const poiId = feature.properties?.id
      const poi = pois.find((p) => p.id === poiId)
      if (poi) onPoiClick(poi)
    }
  })

  map.on('mouseenter', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = ''
  })
}

export function removePois(map: maplibregl.Map): void {
  try {
    if (map.getLayer(POIS_LAYER_ID)) map.removeLayer(POIS_LAYER_ID)
  } catch { /* noop */ }
  try {
    if (map.getSource(POIS_SOURCE_ID)) map.removeSource(POIS_SOURCE_ID)
  } catch { /* noop */ }
}
