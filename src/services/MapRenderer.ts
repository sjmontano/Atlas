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
import { processBounds, expandBounds } from './BoundsCalculator'
import { createBearingAwareConstrain } from './TransformConstrain'
import { logger } from './MapLogger'
import type { MapEntry } from '@data/maps'

const CATEGORY = 'MapRenderer'

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

export interface BuildMapResult {
  map: maplibregl.Map
  destroy: () => void
}

/**
 * Construye el mapa georreferenciado en el contenedor dado.
 * Resuelve cuando el mapa terminó de cargar (evento 'load').
 */
export async function buildGeoreferencedMap(
  container: HTMLElement,
  mapId: string,
  entry: MapEntry,
): Promise<BuildMapResult> {
  const { geo, images, config } = entry

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

  // ── 2. Instancia MapLibre ───────────────────────────────────────────────
  const mapOptions: maplibregl.MapOptions = {
    container,
    style: BLANK_STYLE,
    center,
    zoom: config.initialZoom,
    bearing: config.initialBearing,
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
    dragPan: config.dragPan,
    scrollZoom: config.scrollZoom,
    dragRotate: false,
    touchZoomRotate: false,
    keyboard: false,
    doubleClickZoom: config.scrollZoom,
    attributionControl: false,
  }

  if (config.useTransformConstrain) {
    mapOptions.transformConstrain = createBearingAwareConstrain(
      () => container,
      vmb,
      config.initialBearing,
    )
  }

  const map = new maplibregl.Map(mapOptions)

  await new Promise<void>((resolve, reject) => {
    map.once('load', () => resolve())
    map.once('error', (e) =>
      reject(e.error instanceof Error ? e.error : new Error(String(e))),
    )
  })

  // ── 3. Encuadre inicial: centro + zoom de config (comportamiento v17) ───
  map.jumpTo({
    center,
    zoom: config.initialZoom,
    bearing: config.initialBearing,
  })

  // ── 4. Imagen base: placeholder primero (carga instantánea) ─────────────
  map.addSource(IMAGE_SOURCE_ID, {
    type: 'image',
    url: images.placeholder,
    coordinates,
  })

  map.addLayer({
    id: IMAGE_LAYER_ID,
    type: 'raster',
    source: IMAGE_SOURCE_ID,
    paint: { 'raster-fade-duration': 300 },
  })

  // ── 5. Upgrade a imagen completa cuando esté lista ──────────────────────
  if (images.full !== images.placeholder) {
    preloadImage(images.full)
      .then(() => {
        if (map.getSource(IMAGE_SOURCE_ID)) {
          const source = map.getSource(IMAGE_SOURCE_ID) as maplibregl.ImageSource
          source.updateImage({ url: images.full, coordinates })
          logger.info(CATEGORY, `Imagen completa cargada: ${mapId}`)
        }
      })
      .catch((err) => {
        logger.warn(CATEGORY, `No se pudo cargar imagen full: ${mapId}`, err)
      })
  }

  logger.info(CATEGORY, `Mapa construido: ${mapId}`, { bounds, center })

  return {
    map,
    destroy: () => {
      map.remove()
    },
  }
}

/** Precarga una imagen en background (para el upgrade placeholder → full) */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Error cargando imagen: ${url}`))
    img.src = url
  })
}
