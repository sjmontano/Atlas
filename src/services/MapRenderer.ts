/**
 * 🗺️ MAP RENDERER
 * ================
 *
 * Construye un mapa MapLibre georreferenciado completo:
 *
 *   1. processBounds: PGW → coordenadas + bounds + centro
 *   2. Instancia MapLibre con estilo en blanco + bearing −90
 *   3. fitBounds con bearing: muestra la imagen completa en el viewport
 *   4. transformConstrain: restricción de cámara bearing-aware
 *   5. Carga progresiva: ImageSource con placeholder → upgrade a full
 *
 * Servicio puro (sin React). La orquestación por mapa vive en useMap.
 */

import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { processBounds, expandBounds, type PGWData, type BoundsResult, type ImageCoordinates, type GeographicBounds } from './BoundsCalculator'
import { createBearingAwareConstrain } from './TransformConstrain'
import { logger } from './MapLogger'
import { useMapStore } from '@stores/mapStore'
import type { MapEntry } from '@data/maps'

maplibregl.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs')

const CATEGORY = 'MapRenderer'

const TILES_SOURCE_ID = 'atlas-tiles'
const TILES_LAYER_ID = 'atlas-tiles-layer'

/** Estilo en blanco: fondo oscuro del tema, sin fuentes externas */
const BLANK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#03091e' },
    },
  ],
}

const IMAGE_SOURCE_ID = 'atlas-base-image'
const IMAGE_LAYER_ID = 'atlas-base-image-layer'
/**
 * Margen del viewportMaxBounds alrededor de la imagen (50% por lado).
 * Generoso a propósito: el constrain calcula un minZoom para que el viewport
 * quepa dentro del vmb; un margen amplio evita que ese minZoom recorte la
 * imagen al zoom inicial de config (lección: constrain es dependiente del
 * tamaño del canvas).
 */
const VMB_EXPAND_FACTOR = 0.5

/**
 * Span mínimo (en coordenadas Mercator 0..1) para que un polígono se considere
 * no degenerado. MapLibre v6 calcula en `ImageSource.setCoordinates` el tile
 * central con `zoom = floor(-log2(span))`; si las 4 esquinas quedan casi en el
 * mismo punto el zoom explota (>25) y `CanonicalTileID` lanza "outside of
 * bounds". 2^-25 → zoom 25, el máximo permitido.
 */
const MIN_MERCATOR_SPAN = 2 ** -25

function resolveTileCacheSize(): number {
  if (typeof navigator === 'undefined') return 400
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  const hw = navigator.hardwareConcurrency ?? 4

  if (conn?.saveData || conn?.effectiveType === 'slow-2g') return 110
  if (conn?.effectiveType === '2g' || conn?.effectiveType === '3g') return 160
  if (hw <= 4) return 220
  return 400
}

/** Convierte las 4 esquinas a Mercator y comprueba que el span no colapse. */
function isNonDegenerate(coordinates: ImageCoordinates): boolean {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [lng, lat] of coordinates) {
    const x = (lng + 180) / 360
    const s = Math.sin((lat * Math.PI) / 180)
    const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return Math.max(maxX - minX, maxY - minY) >= MIN_MERCATOR_SPAN
}

export interface MapController {
  map: maplibregl.Map
  updateBounds(pgw: PGWData, width: number, height: number): BoundsResult
}

export interface BuildMapResult {
  map: maplibregl.Map
  destroy: () => void
  controller: MapController
}

export interface BuildOptions {
  /** Modo bajo consumo: reduce decodificación paralela y fade de tiles */
  lowPowerMode?: boolean
}

/**
 * Construye el mapa georreferenciado en el contenedor dado.
 * Resuelve cuando el mapa terminó de cargar (evento 'load').
 */
export async function buildGeoreferencedMap(
  container: HTMLElement,
  mapId: string,
  entry: MapEntry,
  opts?: BuildOptions,
): Promise<BuildMapResult> {
  const { geo, images, config } = entry

  logger.trace(CATEGORY, 'build:start', { mapId })

  // ── 1. PGW → coordenadas + bounds ───────────────────────────────────────
  const { bounds, coordinates, center, isValid } = processBounds(
    geo.pgw,
    geo.width,
    geo.height,
  )

  if (!isValid) {
    throw new Error(`Bounds inválidos para el mapa: ${mapId}`)
  }

  if (!images.full) {
    throw new Error(`Sin imagen disponible para el mapa: ${mapId}`)
  }

  const vmb = expandBounds(bounds, VMB_EXPAND_FACTOR)
  logger.debug(CATEGORY, 'build:bounds', { mapId, bounds, center, vmb })

  // ── 2. Instancia MapLibre ───────────────────────────────────────────────
  const mapOptions: maplibregl.MapOptions = {
    container,
    style: BLANK_STYLE,
    center,
    zoom: config.initialZoom,
    bearing: config.initialBearing,
    minZoom: config.minZoom,
    // Si hay tiles de mayor zoom que la imagen base, permitir zoom hasta el
    // nivel de tiles para aprovechar la resolución extra.
    maxZoom: Math.max(config.maxZoom, entry.tiles?.maxZoom ?? config.maxZoom),
    dragPan: config.dragPan,
    scrollZoom: config.scrollZoom,
    dragRotate: false,
    touchZoomRotate: false,
    keyboard: false,
    doubleClickZoom: config.scrollZoom,
    attributionControl: false,
    // Evita re-fetch de tiles en caché (nuestros tiles son Cache-Control: immutable)
    refreshExpiredTiles: false,
    // Cache adaptativa: menor presión de memoria y menos requests en equipos
    // modestos / conexión lenta (rescatado de atlas_3.0)
    maxTileCacheSize: resolveTileCacheSize(),
  }

  if (config.useTransformConstrain) {
    mapOptions.transformConstrain = createBearingAwareConstrain(
      () => container,
      vmb,
      config.initialBearing,
    )
  }

  const map = new maplibregl.Map(mapOptions)

  // Límite de descargas/decodificaciones simultáneas de imágenes
  // (ver FACETA_2_TILES_PLAN.md §2.3.1).
  // lowPowerMode: 2 en paralelo para equipos Celeron/A4 con GPU integrada.
  // normal: 4 en paralelo (equilibrio entre velocidad y presión de recursos).
  maplibregl.config.MAX_PARALLEL_IMAGE_REQUESTS = opts?.lowPowerMode ? 2 : 4

  await new Promise<void>((resolve, reject) => {
    map.once('load', () => resolve())
    map.once('error', (e) =>
      reject(e.error instanceof Error ? e.error : new Error(String(e))),
    )
  })

  logger.trace(CATEGORY, 'map:loaded', { mapId })

  const canvas = container.querySelector('canvas')
  logger.info(CATEGORY, `canvas-dimensions [${mapId}]`, {
    containerW: container.clientWidth,
    containerH: container.clientHeight,
    canvasW: canvas?.width,
    canvasH: canvas?.height,
    offsetW: canvas?.offsetWidth,
    offsetH: canvas?.offsetHeight,
    display: canvas ? getComputedStyle(canvas).display : 'no-canvas',
  })

  map.on('error', (e) => {
    logger.warn(CATEGORY, `MapLibre error [${mapId}]`, {
      message: e.error instanceof Error ? e.error.message : String(e.error),
    })
  })

  // ── 3. Encuadre inicial: centro + zoom de config (comportamiento v17) ───
  map.jumpTo({
    center,
    zoom: config.initialZoom,
    bearing: config.initialBearing,
  })
  logger.trace(CATEGORY, 'map:jumpTo', {
    mapId,
    zoom: config.initialZoom,
    bearing: config.initialBearing,
  })

  // ── 4. Imagen base: placeholder primero (carga instantánea) ─────────────
  map.on('data', (e) => {
    if (e.dataType === 'source' && e.sourceId === IMAGE_SOURCE_ID) {
      logger.trace(CATEGORY, `base:source-event [${mapId}]`, { type: e.type, sourceDataType: e.sourceDataType, isSourceLoaded: e.isSourceLoaded })
    }
  })

  map.addSource(IMAGE_SOURCE_ID, {
    type: 'image',
    url: images.placeholder,
    coordinates,
  })
  logger.info(CATEGORY, `base:source-added [${mapId}]`, {
    placeholder: images.placeholder.slice(0, 60),
    coords: coordinates.map(([lng, lat]) => `${lng.toFixed(4)},${lat.toFixed(4)}`),
  })

  map.addLayer({
    id: IMAGE_LAYER_ID,
    type: 'raster',
    source: IMAGE_SOURCE_ID,
    // Sin fade en la capa base: no tiene tiles hijo, y evita el doble-fade
    // con la capa de tiles al hacer zoom (ver FACETA_2_TILES_PLAN.md §1).
    paint: { 'raster-fade-duration': 0 },
  })
  logger.trace(CATEGORY, 'base:placeholder', {
    mapId,
    placeholder: images.placeholder.slice(0, 80),
  })

  // ── 5. Tiles XYZ de alta resolución (inmediatos, sobre placeholder) ──────
  // Los tiles se agregan SIN esperar la imagen full. El placeholder (w_1024)
  // ya da un mapa reconocible, y los tiles aportan detalle a z6-z8.
  // Esto evita el bloqueo de 10-20s que causaba `await preloadImage(full)`
  // en conexiones lentas (Slow 4G / 2G rural).
  addTilesLayer(map, mapId, entry, bounds, opts)

  // ── 6. Upgrade a imagen completa (asíncrono, no bloquea) ─────────────────
  // Se dispara en background. Cuando termina, actualiza el ImageSource
  // de forma transparente (el usuario ve la transición placeholder→full).
  // Si falla, el placeholder + tiles ya son funcionales.
  if (images.full !== images.placeholder) {
    logger.trace(CATEGORY, 'full:preload-start', { mapId })
    const t0 = performance.now()
    preloadImage(images.full)
      .then(() => {
        if (map.getSource(IMAGE_SOURCE_ID)) {
          const source = map.getSource(IMAGE_SOURCE_ID) as maplibregl.ImageSource
          source.updateImage({ url: images.full, coordinates })
          logger.info(CATEGORY, `Imagen completa cargada: ${mapId}`, {
            ms: Math.round(performance.now() - t0),
          })
        }
      })
      .catch((err) => {
        logger.warn(CATEGORY, `No se pudo cargar imagen full: ${mapId}`, err)
      })
  }

  const style = map.getStyle()
  logger.info(CATEGORY, `style-dump [${mapId}]`, {
    sources: Object.keys(style.sources),
    layers: style.layers.map((l) => ({ id: l.id, type: l.type, source: (l as { source?: string }).source })),
    loadedSources: Object.keys(style.sources).map((id) => `${id}=${map.isSourceLoaded(id)}`),
  })

  logger.info(CATEGORY, `Mapa construido: ${mapId}`, { bounds, center })

  const controller: MapController = {
    map,
    updateBounds(pgw: PGWData, width: number, height: number): BoundsResult {
      const result = processBounds(pgw, width, height)
      const source = map.getSource(IMAGE_SOURCE_ID) as maplibregl.ImageSource | undefined
      if (source && isNonDegenerate(result.coordinates)) {
        source.setCoordinates(result.coordinates)
      }
      return result
    },
  }

  return {
    map,
    controller,
    destroy: () => {
      logger.trace(CATEGORY, 'map:destroy', { mapId })
      try {
        const style = map.getStyle()
        if (style?.layers) {
          for (const layer of style.layers) {
            try { map.removeLayer(layer.id) } catch { /* noop */ }
          }
        }
        if (style?.sources) {
          for (const id of Object.keys(style.sources)) {
            try {
              if (map.getSource(id)) { map.removeSource(id) }
            } catch { /* noop */ }
          }
        }
      } catch { /* noop */ }
      try { map.remove() } catch { /* noop */ }
    },
  }
}

/**
 * Añade la capa de tiles XYZ de alta resolución sobre la imagen base.
 *
 * Los tiles aportan nitidez extra en zooms altos (generados con
 * scripts/generate-tiles.mjs). Los bounds del source son el footprint
 * derivado de geo.js, garantizando alineación con la capa base ImageSource.
 */
export function addTilesLayer(
  map: maplibregl.Map,
  mapId: string,
  entry: MapEntry,
  bounds: GeographicBounds,
  opts?: BuildOptions,
): void {
  const tiles = entry.tiles
  if (!tiles) {
    useMapStore.getState().setTilesStatus('idle')
    return
  }

  useMapStore.getState().setTilesStatus('loading')

  if (!map.getSource(TILES_SOURCE_ID)) {
    map.addSource(TILES_SOURCE_ID, {
      type: 'raster',
      tiles: [tiles.urlTemplate],
      tileSize: tiles.tileSize,
      minzoom: tiles.minZoom,
      maxzoom: tiles.maxZoom,
      bounds,
      scheme: 'xyz',
    })
    logger.info(CATEGORY, 'Source de tiles agregado', {
      urlTemplate: tiles.urlTemplate,
      zoomRange: `${tiles.minZoom}-${tiles.maxZoom}`,
    })
  }

  if (!map.getLayer(TILES_LAYER_ID)) {
    map.addLayer({
      id: TILES_LAYER_ID,
      type: 'raster',
      source: TILES_SOURCE_ID,
      paint: {
        // lowPowerMode: sin transición de fade para ahorrar GPU
        'raster-fade-duration': opts?.lowPowerMode ? 0 : tiles.fadeDuration ?? 300,
      },
    })
  }

  // ── Telemetría de tiles (nivel info) ────────────────────────────────────
  // Registra cada request/carga/aborto/error del source XYZ y detecta
  // duplicados (misma coord pedida 2+ veces sin ser cargada/abortada).
  // Si ningún tile carga en 15s Y se solicitaron tiles → modo degraded.
  // Solo se dispara si nRequested > 0 (tiles realmente pedidos); el primer
  // tile:loaded lo desactiva inmediatamente. Tiempo extendido a 15s porque
  // en Slow 4G los tiles pueden tardar >8s sin ser caída de conexión.
  const inFlight = new Set<string>()
  let nRequested = 0
  let nLoaded = 0
  let nAborted = 0
  let nFailed = 0
  let nDuplicates = 0
  let summarized = false

  let tilesTimedOut = false
  let tilesTimer: ReturnType<typeof setTimeout> | null = null

  if (typeof window !== 'undefined') {
    tilesTimer = setTimeout(() => {
      if (nRequested > 0 && nLoaded === 0 && !tilesTimedOut) {
        tilesTimedOut = true
        useMapStore.getState().setTilesStatus('degraded')
        logger.warn(CATEGORY, `Tiles no cargaron en 15s: ${mapId} — mapa básico sin tiles`)
      }
    }, 15000)
  }

  const tileKey = (e: maplibregl.MapSourceDataEvent): string | null => {
    const c = e.coord
    return c ? `${c.canonical.z}/${c.canonical.x}/${c.canonical.y}` : null
  }

  const onSourceEvent = (e: maplibregl.MapSourceDataEvent): void => {
    if (e.dataType !== 'source' || e.sourceId !== TILES_SOURCE_ID) return

    if (e.type === 'dataloading') {
      const key = tileKey(e)
      nRequested++
      if (key) {
        logger.info(CATEGORY, 'tile:request', { key })
        if (inFlight.has(key)) {
          nDuplicates++
          logger.info(CATEGORY, 'tile:duplicate', { key })
        }
        inFlight.add(key)
      }
    } else if (e.type === 'data' && e.sourceDataType === 'content') {
      const key = tileKey(e)
      nLoaded++
      inFlight.delete(key ?? '')
      if (tilesTimer) {
        clearTimeout(tilesTimer)
        tilesTimer = null
      }
      if (nLoaded === 1) {
        useMapStore.getState().setTilesStatus('ready')
      }
      logger.info(CATEGORY, 'tile:loaded', { key })
    } else if (e.type === 'dataabort') {
      const key = tileKey(e)
      nAborted++
      inFlight.delete(key ?? '')
      logger.info(CATEGORY, 'tile:aborted', { key })
    } else if (e.type === 'data' && e.sourceDataType === 'idle' && !summarized) {
      summarized = true
      logger.info(CATEGORY, `Tiles resumen: ${mapId}`, {
        requested: nRequested,
        loaded: nLoaded,
        aborted: nAborted,
        failed: nFailed,
        duplicates: nDuplicates,
        inFlight: inFlight.size,
      })
    }
  }

  map.on('dataloading', onSourceEvent)
  map.on('data', onSourceEvent)
  map.on('dataabort', onSourceEvent)
  map.on('error', (e) => {
    const err = e.error as { sourceId?: string; tileID?: unknown } | undefined
    if (err?.sourceId === TILES_SOURCE_ID) {
      nFailed++
      logger.warn(CATEGORY, 'tile:error', {
        sourceId: err.sourceId,
        tileID: err.tileID,
        message: e.error instanceof Error ? e.error.message : String(e.error),
      })
    }
  })
}

const preloadPromises = new Map<string, Promise<void>>()
const preloadedImages = new Map<string, HTMLImageElement>()

/** Precarga una imagen en background (para el upgrade placeholder → full).
 *  Deduplica solicitudes en vuelo con un Map de promesas pendientes
 *  (crítico en StrictMode donde el effect se ejecuta 2 veces seguidas
 *  y la primera build inicia el preload antes de ser descartada). */
async function preloadImage(url: string): Promise<void> {
  const existing = preloadedImages.get(url)
  if (existing?.complete && existing.naturalWidth > 0) {
    return
  }

  const pending = preloadPromises.get(url)
  if (pending) return pending

  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      preloadedImages.set(url, img)
      preloadPromises.delete(url)
      resolve()
    }
    img.onerror = () => {
      preloadPromises.delete(url)
      reject(new Error(`Error cargando imagen: ${url}`))
    }
    img.src = url
  })

  preloadPromises.set(url, promise)
  return promise
}
