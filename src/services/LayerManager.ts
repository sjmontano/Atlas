import type * as maplibregl from 'maplibre-gl'
import { processBounds, type PGWData, type ImageCoordinates } from './BoundsCalculator'
import { LAYER_CALIBRATIONS } from '@data/layers/calibration.js'
import type { Layer, RasterPgwLayer } from '../types/layer.ts'
import { logger } from './MapLogger'

const CATEGORY = 'LayerManager'
const SOURCE_PREFIX = 'atlas-layer-'
const POIS_LAYER_ID = 'atlas-pois-layer'

interface StoreSnapshot {
  visibleLayers: Set<string>
  opacities: Record<string, number>
}

function sourceId(layerId: string): string {
  return `${SOURCE_PREFIX}${layerId}`
}

function isDegenerate(coords: ImageCoordinates): boolean {
  let minX = Infinity; let minY = Infinity
  let maxX = -Infinity; let maxY = -Infinity
  for (const [lng, lat] of coords) {
    const x = (lng + 180) / 360
    const s = Math.sin((lat * Math.PI) / 180)
    const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return Math.max(maxX - minX, maxY - minY) < 2 ** -25
}

function getBeforeId(map: maplibregl.Map, layerOrder: number, allLayers: Layer[]): string | undefined {
  const sorted = allLayers
    .filter((l) => l.order > layerOrder)
    .sort((a, b) => a.order - b.order)
  for (const l of sorted) {
    if (map.getLayer(sourceId(l.id))) return sourceId(l.id)
  }
  return POIS_LAYER_ID
}

export function addLayer(
  map: maplibregl.Map,
  layer: Layer,
  store: StoreSnapshot,
  allLayers?: Layer[],
): void {
  const sid = sourceId(layer.id)

  if (map.getSource(sid)) return

  const calib = LAYER_CALIBRATIONS[layer.id]
  const pgw: PGWData = calib ? calib.pgw : (layer as RasterPgwLayer).pgw
  const width = calib ? calib.width : (layer as RasterPgwLayer).width
  const height = calib ? calib.height : (layer as RasterPgwLayer).height
  const visible = store.visibleLayers.has(layer.id)
  const opacity = store.opacities[layer.id] ?? layer.opacity ?? 1

  if (layer.type === 'raster-pgw') {
    const { coordinates } = processBounds(pgw, width, height)
    if (isDegenerate(coordinates)) {
      logger.warn(CATEGORY, `Skipping degenerate layer: ${layer.id}`)
      return
    }

    map.addSource(sid, {
      type: 'image',
      url: layer.image,
      coordinates,
    })

    map.addLayer(
      {
        id: sid,
        type: 'raster',
        source: sid,
        paint: { 'raster-opacity': opacity, 'raster-fade-duration': 0 },
        layout: { visibility: visible ? 'visible' : 'none' },
      },
      allLayers ? getBeforeId(map, layer.order, allLayers) : undefined,
    )
  }

  logger.info(CATEGORY, `Layer added: ${layer.id}`)
}

export function removeLayer(map: maplibregl.Map, layerId: string): void {
  const sid = sourceId(layerId)
  try {
    if (map.getLayer(sid)) map.removeLayer(sid)
  } catch { /* noop */ }
  try {
    if (map.getSource(sid)) map.removeSource(sid)
  } catch { /* noop */ }
}

export function removeAll(map: maplibregl.Map): void {
  const style = map.getStyle()
  if (!style?.layers) return
  for (const l of style.layers) {
    if (l.id.startsWith(SOURCE_PREFIX)) {
      try { map.removeLayer(l.id) } catch { /* noop */ }
    }
  }
  if (style?.sources) {
    for (const id of Object.keys(style.sources)) {
      if (id.startsWith(SOURCE_PREFIX)) {
        try { map.removeSource(id) } catch { /* noop */ }
      }
    }
  }
}

export function updateLayerPGW(
  map: maplibregl.Map,
  layerId: string,
  pgw: PGWData,
  width: number,
  height: number,
): void {
  const sid = sourceId(layerId)
  const source = map.getSource(sid) as maplibregl.ImageSource | undefined
  if (!source) return
  const { coordinates } = processBounds(pgw, width, height)
  if (!isDegenerate(coordinates)) {
    source.setCoordinates(coordinates)
  }
}

export function sync(
  map: maplibregl.Map,
  _mapId: string,
  layers: Layer[],
  _groups: unknown,
  store: StoreSnapshot,
): void {
  const currentIds = new Set<string>()
  const style = map.getStyle()
  if (style?.layers) {
    for (const l of style.layers) {
      if (l.id.startsWith(SOURCE_PREFIX)) {
        currentIds.add(l.id.slice(SOURCE_PREFIX.length))
      }
    }
  }

  const desiredIds = new Set(layers.map((l) => l.id))

  for (const id of currentIds) {
    if (!desiredIds.has(id)) {
      removeLayer(map, id)
    }
  }

  for (const layer of layers) {
    if (!currentIds.has(layer.id)) {
      if (layer.visibleByDefault || store.visibleLayers.has(layer.id)) {
        addLayer(map, layer, store, layers)
      }
    } else {
      const sid = sourceId(layer.id)
      const visible = store.visibleLayers.has(layer.id)
      if (map.getLayer(sid)) {
        map.setLayoutProperty(sid, 'visibility', visible ? 'visible' : 'none')
      }
      const opacity = store.opacities[layer.id] ?? layer.opacity ?? 1
      if (map.getLayer(sid)) {
        map.setPaintProperty(sid, 'raster-opacity', opacity)
      }
    }
  }
}
