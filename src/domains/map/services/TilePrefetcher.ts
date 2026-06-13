/**
 * 🔄 TILE PREFETCHER — Precarga regional en tiempo idle
 * ======================================================
 *
 * Precarga tiles XYZ de una región geográfica durante el tiempo inactivo
 * del navegador (requestIdleCallback). Los tiles quedan en el HTTP cache
 * del navegador; cuando MapLibre los solicita, se sirven al instante.
 *
 * CUÁNDO SÍ AYUDA:
 *   - Zoom 0-7 de una región pequeña (~90 tiles): < 1.5 MB total
 *   - Conexiones lentas o intermitentes (offline-first)
 *
 * CUÁNDO NO SE USA:
 *   - Vecinos de tile (MapLibre ya carga un buffer de 1 tile automáticamente)
 *   - Zoom > 7 (demasiados tiles para precargar utílmente)
 *   - Vector tiles (no aplica: el mapa base es raster)
 */

export interface RegionalPrefetchConfig {
  /** URL template, e.g. "/assets/maps/tiles/map/{z}/{x}/{y}.webp" */
  urlTemplate: string;
  /** Bounds geográficos [west, south, east, north] */
  bounds: [number, number, number, number];
  /** Zoom mínimo (default: 0) */
  minZoom?: number;
  /**
   * Zoom máximo a precargar.
   * Mantener ≤ 7 — más allá hay demasiados tiles para precarga útil.
   */
  maxZoom: number;
}

type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformationLike {
  effectiveType?: EffectiveConnectionType;
  saveData?: boolean;
}

function getNetworkInformation(): NetworkInformationLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;
}

/**
 * Calcula maxZoom de prefetch en funcion de conectividad.
 * Retorna null cuando conviene desactivar prefetch.
 */
export function resolveAdaptivePrefetchMaxZoom(
  baseMaxZoom: number,
): number | null {
  const conn = getNetworkInformation();
  const capped = Math.min(baseMaxZoom, 7);

  if (!conn) return capped;
  if (conn.saveData) return Math.min(capped, 3);

  switch (conn.effectiveType) {
    case "slow-2g":
      return null;
    case "2g":
      return Math.min(capped, 3);
    case "3g":
      return Math.min(capped, 5);
    case "4g":
    default:
      return capped;
  }
}

// ─── Helpers de coordenadas tile XYZ ─────────────────────────────────────────

function lonToTileX(lon: number, z: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, z));
}

function latToTileY(lat: number, z: number): number {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, z),
  );
}

function buildTileUrls(config: RegionalPrefetchConfig): string[] {
  const { urlTemplate, bounds, minZoom = 0, maxZoom } = config;
  const [west, south, east, north] = bounds;
  const urls: string[] = [];

  for (let z = minZoom; z <= maxZoom; z++) {
    const n = Math.pow(2, z);
    const xMin = Math.max(0, lonToTileX(west, z));
    const xMax = Math.min(n - 1, lonToTileX(east, z));
    const yMin = Math.max(0, latToTileY(north, z)); // north → índice y menor
    const yMax = Math.min(n - 1, latToTileY(south, z));

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        urls.push(
          urlTemplate
            .replace("{z}", String(z))
            .replace("{x}", String(x))
            .replace("{y}", String(y)),
        );
      }
    }
  }

  return urls;
}

// ─── Polyfill requestIdleCallback (Safari < 16.4) ────────────────────────────

const scheduleIdle: (
  cb: IdleRequestCallback,
  opts?: IdleRequestOptions,
) => number =
  typeof requestIdleCallback !== "undefined"
    ? (cb, opts) => requestIdleCallback(cb, opts)
    : (cb) =>
        window.setTimeout(
          () => cb({ timeRemaining: () => 50, didTimeout: false }),
          200,
        ) as unknown as number;

const cancelIdle: (id: number) => void =
  typeof cancelIdleCallback !== "undefined"
    ? (id) => cancelIdleCallback(id)
    : (id) => clearTimeout(id);

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Precarga tiles de una región durante el tiempo inactivo del navegador.
 *
 * Los tiles se solicitan con prioridad baja vía `fetch()` estándar.
 * El HTTP cache del navegador los almacena; MapLibre los usa cuando
 * el usuario hace zoom dentro de la región.
 *
 * @param config - Configuración de la región y zoom a precargar
 * @param delayMs - Retardo inicial antes de empezar (ms). Default: 2000ms
 *                  para no competir con la carga del mapa.
 * @returns Función de cancelación. Llamar al desmontar el componente.
 *
 * @example
 * ```ts
 * const cancel = prefetchRegionTiles({
 *   urlTemplate: '/assets/maps/tiles/formas-paisaje-90/{z}/{x}/{y}.webp',
 *   bounds: [-79.13, 0, -66.44, 7.12],
 *   maxZoom: 7,
 * });
 * return () => cancel();
 * ```
 */
export function prefetchRegionTiles(
  config: RegionalPrefetchConfig,
  delayMs = 2000,
): () => void {
  const urls = buildTileUrls(config);

  if (urls.length === 0) return () => {};

  let cancelled = false;
  let idleHandle: number | null = null;
  let index = 0;

  const runBatch = (deadline: IdleDeadline) => {
    // Procesar todos los tiles disponibles mientras haya tiempo idle (> 5ms)
    while (!cancelled && index < urls.length && deadline.timeRemaining() > 5) {
      const url = urls[index++];
      // fetch() con cache:'default' rellena el HTTP cache del navegador.
      // Los tiles ya presentes no se vuelven a solicitar al servidor.
      fetch(url, { cache: "default" }).catch(() => {
        // Ignorar 404s en silencio: el tile puede no existir (blancos de mapa)
      });
    }

    if (!cancelled && index < urls.length) {
      idleHandle = scheduleIdle(runBatch, { timeout: 8000 });
    }
  };

  // Retraso inicial: dar tiempo al mapa para renderizarse completamente
  const startTimer = setTimeout(() => {
    if (!cancelled) {
      idleHandle = scheduleIdle(runBatch, { timeout: 8000 });
    }
  }, delayMs);

  return () => {
    cancelled = true;
    clearTimeout(startTimer);
    if (idleHandle !== null) cancelIdle(idleHandle);
  };
}

/**
 * Cuenta cuántos tiles cubre una configuración de prefetch.
 * Útil para estimar el impacto en red antes de activar el prefetch.
 */
export function countPrefetchTiles(
  config: Omit<RegionalPrefetchConfig, "urlTemplate">,
): number {
  return buildTileUrls({ ...config, urlTemplate: "{z}/{x}/{y}" }).length;
}
