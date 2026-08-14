import type * as maplibregl from 'maplibre-gl'
import type { ExpressionSpecification } from 'maplibre-gl'
import type { Poi, PoiVariant } from '../types/poi.ts'
import { composeArrowIcon, composeGotaIcon } from './poiIcons'

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
const POIS_ICON_LAYER_ID = 'atlas-pois-icon-layer'
const POIS_ARROW_LAYER_ID = 'atlas-pois-arrow-layer'
const ALL_POI_LAYER_IDS = [
  POIS_LAYER_ID,
  POIS_PULSE_LAYER_ID,
  POIS_CIRCLE_LAYER_ID,
  POIS_ICON_LAYER_ID,
  POIS_ARROW_LAYER_ID,
]

const GOTA_ICON_URL = '/assets/interface/icons/line/svg/location.svg'
const GOTA_ICON_ID = 'atlas-poi-gota'
// La gota se dibuja al 70% del diámetro del círculo (radio 15 → alto ~21px).
const GOTA_ICON_HEIGHT = 21

async function loadImage(
  map: maplibregl.Map,
  url: string,
): Promise<HTMLImageElement | ImageBitmap | null> {
  try {
    const res = await map.loadImage(url)
    return res.data
  } catch {
    return null
  }
}

// MapLibre `loadImage` NO soporta SVG. Carga la gota con un <img> nativo y la
// registra como HTMLImageElement; `addImage` la rasteriza vía canvas.
async function loadSvgImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

// Resuelve bajo demanda las imágenes de POI (gota y flechas compuestas) cuando
// MapLibre las necesita al renderizar la capa symbol. Es la vía idiomática para
// imágenes generadas en runtime: evita el error "image could not be loaded".
function setupImageResolver(map: maplibregl.Map, pois: Poi[]): void {
  const arrowById = new Map(
    pois.filter((p) => variantOf(p) === 'arrow' && p.icon).map((p) => [p.id, p]),
  )
  // Deduplicación de cargas en vuelo: MapLibre puede pedir la misma imagen varias
  // veces antes de que la primera promesa se resuelva.
  const pending = new Map<string, Promise<void>>()

  map.setMissingStyleImageResolver(async (id: string) => {
    if (id === GOTA_ICON_ID) {
      const img = await loadSvgImage(GOTA_ICON_URL)
      if (img && !map.hasImage(GOTA_ICON_ID)) {
        map.addImage(GOTA_ICON_ID, composeGotaIcon(img, GOTA_ICON_HEIGHT))
      }
      return
    }

    const poi = arrowById.get(id)
    if (!poi || !poi.icon || map.hasImage(id)) return

    let task = pending.get(id)
    if (!task) {
      const icon = poi.icon
      task = (async () => {
        const img = await loadImage(map, icon)
        if (!img || map.hasImage(id)) return
        try {
          map.addImage(id, composeArrowIcon(img, poi.angle ?? 0))
        } catch {
          // canvas no disponible → se omite la imagen
        }
      })()
      pending.set(id, task)
    }
    await task
    pending.delete(id)
  })
}

const TOOLTIP_BG = '/assets/tooltip/fondo-tooltip.webp'
const POI_BG = '#03103a'
const POI_ICON_BG = '#0081a9'
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

// Color del círculo según variante: gota (icon) → cyan; número → azul oscuro.
const circleColor: ExpressionSpecification = [
  'match',
  ['get', 'variant'],
  'icon',
  POI_ICON_BG,
  POI_BG,
] as ExpressionSpecification

// Escala el tamaño de los markers con el zoom: 80% cuando alejado → 100% al acercar.
// Evita que los POIs se vean desproporcionadamente grandes en vistas lejanas.
// `factor` extra permite multiplicar cada stop (p. ej. el pulso).
const POI_MIN_ZOOM = 6
const POI_MAX_ZOOM = 14
const POI_MIN_SCALE = 0.8

const zoomSize = (
  expr: ExpressionSpecification | number,
  factor: number = 1,
): ExpressionSpecification => {
  const minStop: ExpressionSpecification | number =
    typeof expr === 'number'
      ? expr * POI_MIN_SCALE * factor
      : (['*', POI_MIN_SCALE * factor, expr] as ExpressionSpecification)
  const maxStop: ExpressionSpecification | number =
    typeof expr === 'number' ? expr * factor : (['*', factor, expr] as ExpressionSpecification)
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    POI_MIN_ZOOM,
    minStop,
    POI_MAX_ZOOM,
    maxStop,
  ] as ExpressionSpecification
}

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

    map.setPaintProperty(POIS_PULSE_LAYER_ID, 'circle-radius', zoomSize(sizeMatch(POI_RADIUS, POI_RADIUS_LARGE), scale))
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

function variantOf(poi: Poi): PoiVariant {
  return poi.variant ?? 'number'
}

// Filtros por variante: cada capa sólo renderiza los features de su tipo.
const variantFilter = (variant: PoiVariant): ExpressionSpecification => [
  '==',
  ['get', 'variant'],
  variant,
] as ExpressionSpecification

const notArrowFilter: ExpressionSpecification = [
  '!=',
  ['get', 'variant'],
  'arrow',
] as ExpressionSpecification

function bindPoiEvents(
  map: maplibregl.Map,
  layerIds: string[],
  pois: Poi[],
  onPoiClick: (poi: Poi) => void,
): void {
  for (const layerId of layerIds) {
    map.on('click', layerId, (e) => {
      const feature = e.features?.[0]
      if (feature) {
        const poiId = feature.properties?.id
        const poi = pois.find((p) => p.id === poiId)
        if (poi) onPoiClick(poi)
      }
    })

    map.on('mouseenter', layerId, (e) => {
      map.getCanvas().style.cursor = 'pointer'
      const feature = e.features?.[0]
      if (feature) {
        const poiId = feature.properties?.id
        const poi = pois.find((p) => p.id === poiId)
        if (poi) showTooltip(tooltipHtml(poi))
      }
    })

    map.on('mousemove', layerId, (e) => {
      if (e.lngLat) moveTooltip(map, e.lngLat)
    })

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = ''
      hideTooltip()
    })
  }
}

export function addPois(
  map: maplibregl.Map,
  _mapId: string,
  pois: Poi[],
  onPoiClick: (poi: Poi) => void,
): void {
  removePois(map)

  // Resolver ANTES de añadir capas: MapLibre lo consulta al renderizar un
  // `icon-image` que aún no existe en el sprite.
  setupImageResolver(map, pois)

  const features: GeoJSONFeature[] = pois.map((poi) => {
    const variant = variantOf(poi)
    return {
      type: 'Feature',
      id: poi.id,
      properties: {
        id: poi.id,
        name: poi.name,
        numero: poi.numero,
        popupTitle: poi.popup.title,
        size: poi.size ?? 'normal',
        variant,
        angle: poi.angle ?? 0,
        markerIcon: poi.id,
      },
      geometry: { type: 'Point', coordinates: poi.coords },
    }
  })

  map.addSource(POIS_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })

  const hasNumber = pois.some((p) => variantOf(p) === 'number')
  const hasIcon = pois.some((p) => variantOf(p) === 'icon')
  const hasArrow = pois.some((p) => variantOf(p) === 'arrow')
  const hasDot = hasNumber || hasIcon

  // Círculo y pulso: variantes number e icon (la flecha lleva su propio círculo).
  if (hasDot) {
    map.addLayer({
      id: POIS_PULSE_LAYER_ID,
      type: 'circle',
      source: POIS_SOURCE_ID,
      filter: notArrowFilter,
      paint: {
        'circle-radius': zoomSize(sizeMatch(POI_RADIUS, POI_RADIUS_LARGE)),
        'circle-color': circleColor,
        'circle-opacity': 0.55,
      },
    })

    map.addLayer({
      id: POIS_CIRCLE_LAYER_ID,
      type: 'circle',
      source: POIS_SOURCE_ID,
      filter: notArrowFilter,
      paint: {
        'circle-radius': zoomSize(sizeMatch(POI_RADIUS, POI_RADIUS_LARGE)),
        'circle-color': circleColor,
      },
    })
  }

  if (hasNumber) {
    map.addLayer({
      id: POIS_LAYER_ID,
      type: 'symbol',
      source: POIS_SOURCE_ID,
      filter: variantFilter('number'),
      layout: {
        'text-field': ['to-string', ['get', 'numero']],
        'text-size': zoomSize(sizeMatch(POI_TEXT_SIZE, POI_TEXT_SIZE_LARGE)),
        'text-font': ['Noto Sans Bold'],
      },
      paint: {
        'text-color': '#ffffff',
      },
    })
  }

  if (hasIcon) {
    map.addLayer({
      id: POIS_ICON_LAYER_ID,
      type: 'symbol',
      source: POIS_SOURCE_ID,
      filter: variantFilter('icon'),
      layout: {
        'icon-image': 'atlas-poi-gota',
        'icon-size': zoomSize(1),
        'icon-allow-overlap': true,
      },
    })
  }

  if (hasArrow) {
    map.addLayer({
      id: POIS_ARROW_LAYER_ID,
      type: 'symbol',
      source: POIS_SOURCE_ID,
      filter: variantFilter('arrow'),
      layout: {
        'icon-image': ['get', 'markerIcon'],
        'icon-size': zoomSize(0.24),
        'icon-allow-overlap': true,
        'icon-rotation-alignment': 'viewport',
      },
    })
  }

  if (hasDot) startPulse(map)

  bindPoiEvents(
    map,
    [POIS_LAYER_ID, POIS_ICON_LAYER_ID, POIS_ARROW_LAYER_ID],
    pois,
    onPoiClick,
  )
}

export function removePois(map: maplibregl.Map): void {
  hideTooltip()
  stopPulse()
  try {
    map.setMissingStyleImageResolver(null)
  } catch { /* noop */ }
  for (const id of ALL_POI_LAYER_IDS) {
    try {
      if (map.getLayer(id)) map.removeLayer(id)
    } catch { /* noop */ }
  }
  try {
    if (map.getSource(POIS_SOURCE_ID)) map.removeSource(POIS_SOURCE_ID)
  } catch { /* noop */ }
}
