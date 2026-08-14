import type * as maplibregl from 'maplibre-gl'
import type { ExpressionSpecification } from 'maplibre-gl'
import type { Poi } from '../types/poi.ts'

interface GeoJSONFeature {
  type: 'Feature'
  id?: string | number
  properties: Record<string, unknown>
  geometry: { type: 'Point'; coordinates: [number, number] }
}

const POIS_SOURCE_ID = 'atlas-pois-source'
const POIS_LAYER_ID = 'atlas-pois-layer'
const POIS_CIRCLE_LAYER_ID = 'atlas-pois-circle-layer'
const POIS_PULSE_LAYER_ID = 'atlas-pois-pulse-layer'

const TOOLTIP_BG = '/assets/tooltip/fondo-tooltip.webp'
const POI_BG = '#03103a'
const POI_RADIUS = 15
const POI_RADIUS_LARGE = 21
const POI_TEXT_SIZE = 14
const POI_TEXT_SIZE_LARGE = 20
const PULSE_DURATION_MS = 2200
const PULSE_MAX_SCALE = 1.9

// Expresión data-driven: radio (o tamaño de texto) según el tamaño del POI.
const sizeMatch = (base: number, large: number): ExpressionSpecification => [
  'match',
  ['get', 'size'],
  'large',
  large,
  base,
] as ExpressionSpecification

let tooltipEl: HTMLDivElement | null = null
let pulseRaf: number | null = null

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

function stopPulse(): void {
  if (pulseRaf !== null) {
    cancelAnimationFrame(pulseRaf)
    pulseRaf = null
  }
}

function startPulse(map: maplibregl.Map): void {
  stopPulse()

  // 1. Evitar que MapLibre intente animar/suavizar el salto de regreso
  try {
    map.setPaintProperty(POIS_PULSE_LAYER_ID, 'circle-radius-transition', { duration: 0 })
    map.setPaintProperty(POIS_PULSE_LAYER_ID, 'circle-opacity-transition', { duration: 0 })
  } catch { /* por si la capa aún no está lista */ }

  const start = performance.now()

  const tick = (now: number) => {
    if (!map.getLayer(POIS_PULSE_LAYER_ID)) {
      pulseRaf = null
      return
    }

    const t = ((now - start) % PULSE_DURATION_MS) / PULSE_DURATION_MS

    // 2. Curva Ease-Out: crece rápido al nacer y se frena suavemente al expandirse
    const easeOut = 1 - Math.pow(1 - t, 2)
    const scale = 1 + (PULSE_MAX_SCALE - 1) * easeOut

    // 3. Opacidad con Fade-In (nace invisible) + Fade-Out (muere invisible)
    let opacity = 0
    if (t < 0.15) {
      // Del 0% al 15% del tiempo: Nace en 0 y sube suavemente a 0.55
      opacity = 0.55 * (t / 0.15)
    } else {
      // Del 15% al 100% del tiempo: Se desvanece de 0.55 a 0
      opacity = 0.55 * (1 - (t - 0.15) / 0.85)
    }

    map.setPaintProperty(POIS_PULSE_LAYER_ID, 'circle-radius', [
      '*',
      sizeMatch(POI_RADIUS, POI_RADIUS_LARGE),
      scale,
    ] as ExpressionSpecification)
    map.setPaintProperty(POIS_PULSE_LAYER_ID, 'circle-opacity', opacity)

    pulseRaf = requestAnimationFrame(tick)
  }

  pulseRaf = requestAnimationFrame(tick)
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
    properties: { id: poi.id, name: poi.name, numero: poi.numero, popupTitle: poi.popup.title, size: poi.size ?? 'normal' },
    geometry: { type: 'Point', coordinates: poi.coords },
  }))

  map.addSource(POIS_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })

  map.addLayer({
    id: POIS_PULSE_LAYER_ID,
    type: 'circle',
    source: POIS_SOURCE_ID,
    paint: {
      'circle-radius': sizeMatch(POI_RADIUS, POI_RADIUS_LARGE),
      'circle-color': POI_BG,
      'circle-opacity': 0.55,
    },
  })

  map.addLayer({
    id: POIS_CIRCLE_LAYER_ID,
    type: 'circle',
    source: POIS_SOURCE_ID,
    paint: {
      'circle-radius': sizeMatch(POI_RADIUS, POI_RADIUS_LARGE),
      'circle-color': POI_BG,
    },
  })

  map.addLayer({
    id: POIS_LAYER_ID,
    type: 'symbol',
    source: POIS_SOURCE_ID,
    layout: {
      'text-field': ['to-string', ['get', 'numero']],
      'text-size': sizeMatch(POI_TEXT_SIZE, POI_TEXT_SIZE_LARGE),
      'text-font': ['Noto Sans Bold'],
    },
    paint: {
      'text-color': '#ffffff',
    },
  })

  startPulse(map)

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
  stopPulse()
  for (const id of [POIS_LAYER_ID, POIS_PULSE_LAYER_ID, POIS_CIRCLE_LAYER_ID]) {
    try {
      if (map.getLayer(id)) map.removeLayer(id)
    } catch { /* noop */ }
  }
  try {
    if (map.getSource(POIS_SOURCE_ID)) map.removeSource(POIS_SOURCE_ID)
  } catch { /* noop */ }
}
