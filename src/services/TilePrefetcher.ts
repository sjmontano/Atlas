/**
 * TILE PREFETCHER — Precarga regional en tiempo idle
 * ===================================================
 *
 * Precarga tiles XYZ de los zooms bajos (z6-z8) durante el tiempo inactivo
 * del navegador (requestIdleCallback). Los tiles quedan en el HTTP cache;
 * cuando MapLibre los solicita, se sirven al instante.
 *
 * ¿Por qué solo z6-z8?
 *   - z6 = 2 tiles, z7 = 6 tiles, z8 = 12 tiles → 20 tiles (~320 KB)
 *   - Son los niveles visibles al cargar el mapa (cubren toda el área).
 *   - z9 en adelante son demasiados tiles para precarga útil (>100).
 *
 * Adaptación del TilePrefetcher de atlas_3.0, simplificado para nuestro
 * pipeline de tiles (un solo source XYZ por mapa, no capas múltiples).
 */

import { useConnectionStore } from '@stores/connectionStore'

export interface TilePrefetchConfig {
  urlTemplate: string
  /** Bounds geográficos [west, south, east, north] */
  bounds: [number, number, number, number]
  minZoom: number
  /** Máximo zoom base a precargar (el resolver lo ajusta según conexión) */
  maxZoom: number
}

/** Calcula maxZoom seguro para prefetch según calidad de conexión */
export function resolveAdaptivePrefetchMaxZoom(baseMaxZoom: number): number | null {
  const capped = Math.min(baseMaxZoom, 8)
  const { isSlow, isOnline } = useConnectionStore.getState()

  if (!isOnline) return null
  if (isSlow) return Math.min(capped, 6) // solo z6 en 2G

  // Conexión normal: hasta z8 (20 tiles, ~320 KB)
  return capped
}

// ── Helpers de coordenadas tile XYZ ─────────────────────────────────────────

function lonToTileX(lon: number, z: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, z))
}

function latToTileY(lat: number, z: number): number {
  const latRad = (lat * Math.PI) / 180
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, z),
  )
}

function buildTileUrls(config: TilePrefetchConfig): string[] {
  const { urlTemplate, bounds, minZoom, maxZoom } = config
  const [west, south, east, north] = bounds
  const urls: string[] = []

  for (let z = minZoom; z <= maxZoom; z++) {
    const n = Math.pow(2, z)
    const xMin = Math.max(0, lonToTileX(west, z))
    const xMax = Math.min(n - 1, lonToTileX(east, z))
    const yMin = Math.max(0, latToTileY(north, z))
    const yMax = Math.min(n - 1, latToTileY(south, z))

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        urls.push(
          urlTemplate
            .replace('{z}', String(z))
            .replace('{x}', String(x))
            .replace('{y}', String(y)),
        )
      }
    }
  }

  return urls
}

// ── Polyfill requestIdleCallback ────────────────────────────────────────────

const scheduleIdle: (
  cb: IdleRequestCallback,
  opts?: IdleRequestOptions,
) => number =
  typeof requestIdleCallback !== 'undefined'
    ? (cb, opts) => requestIdleCallback(cb, opts)
    : (cb) =>
        window.setTimeout(
          () => cb({ timeRemaining: () => 50, didTimeout: false }),
          200,
        ) as unknown as number

const cancelIdle: (id: number) => void =
  typeof cancelIdleCallback !== 'undefined'
    ? (id) => cancelIdleCallback(id)
    : (id) => clearTimeout(id)

/**
 * Precarga tiles durante el tiempo inactivo del navegador.
 *
 * Los tiles se solicitan con prioridad baja vía `fetch()` estándar.
 * El HTTP cache del navegador los almacena; MapLibre los usa cuando
 * el usuario hace zoom dentro de la región.
 *
 * @param config - Configuración de región y zoom a precargar
 * @param delayMs - Retardo antes de empezar (ms). Default 2000 para
 *                  no competir con la carga del mapa.
 * @returns Función de cancelación.
 */
export function prefetchRegionTiles(
  config: TilePrefetchConfig,
  delayMs = 2000,
): () => void {
  const adaptiveMaxZoom = resolveAdaptivePrefetchMaxZoom(config.maxZoom)
  if (adaptiveMaxZoom === null) return () => {}

  const urls = buildTileUrls({ ...config, maxZoom: adaptiveMaxZoom })
  if (urls.length === 0) return () => {}

  let cancelled = false
  let idleHandle: number | null = null
  let index = 0

  const runBatch = (deadline: IdleDeadline) => {
    while (!cancelled && index < urls.length && deadline.timeRemaining() > 5) {
      const url = urls[index]!
      index++
      fetch(url, { cache: 'default' }).catch(() => {
        // Ignorar 404s: el tile puede no existir
      })
    }

    if (!cancelled && index < urls.length) {
      idleHandle = scheduleIdle(runBatch, { timeout: 8000 })
    }
  }

  const startTimer = setTimeout(() => {
    if (!cancelled) {
      idleHandle = scheduleIdle(runBatch, { timeout: 8000 })
    }
  }, delayMs)

  return () => {
    cancelled = true
    clearTimeout(startTimer)
    if (idleHandle !== null) cancelIdle(idleHandle)
  }
}
