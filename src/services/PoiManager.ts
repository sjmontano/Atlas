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

const TOOLTIP_BG = '/assets/tooltip/fondo-tooltip.webp'

let tooltipEl: HTMLDivElement | null = null

function getTooltip(): HTMLDivElement {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.display = 'none'
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.zIndex = '10000'
    tooltipEl.style.whiteSpace = 'nowrap'
    tooltipEl.style.fontFamily = "'Noto Sans', sans-serif"
    document.body.appendChild(tooltipEl)
  }
  return tooltipEl
}

function showTooltip(html: string): void {
  const el = getTooltip()
  el.innerHTML = html
  el.style.display = 'block'
}

function moveTooltip(map: maplibregl.Map, lngLat: maplibregl.LngLat): void {
  const el = getTooltip()
  const canvas = map.getCanvas()
  const rect = canvas.getBoundingClientRect()
  const point = map.project(lngLat)
  const elRect = el.getBoundingClientRect()
  const left = rect.left + point.x - elRect.width / 2
  const top = rect.top + point.y - elRect.height - 12
  el.style.left = `${left}px`
  el.style.top = `${top}px`
}

function hideTooltip(): void {
  const el = getTooltip()
  el.style.display = 'none'
}

function tooltipHtml(poi: Poi): string {
  const subtitle = poi.capa
    ? `<div style="position:relative;z-index:2;font-size:12px;color:white;">${poi.capa}</div>`
    : ''
  return `
    <div style="position:relative;display:inline-block;padding:6px 18px;text-align:center;">
      <img src="${TOOLTIP_BG}" alt="" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;border-radius:6px;" />
      <div style="position:relative;z-index:2;font-size:16px;color:white;">${poi.name}</div>
      ${subtitle}
    </div>`
}

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
      'text-font': ['Noto Sans Bold'],
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

  map.on('mouseenter', POIS_LAYER_ID, (e) => {
    map.getCanvas().style.cursor = 'pointer'
    const feature = e.features?.[0]
    if (feature) {
      const poiId = feature.properties?.id
      const poi = pois.find((p) => p.id === poiId)
      if (poi) showTooltip(tooltipHtml(poi))
    }
  })

  map.on('mousemove', POIS_LAYER_ID, (e) => {
    if (e.lngLat) moveTooltip(map, e.lngLat)
  })

  map.on('mouseleave', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = ''
    hideTooltip()
  })
}

export function removePois(map: maplibregl.Map): void {
  hideTooltip()
  try {
    if (map.getLayer(POIS_LAYER_ID)) map.removeLayer(POIS_LAYER_ID)
  } catch { /* noop */ }
  try {
    if (map.getSource(POIS_SOURCE_ID)) map.removeSource(POIS_SOURCE_ID)
  } catch { /* noop */ }
}
