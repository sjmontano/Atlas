/**
 * 🧭 TRANSFORM CONSTRAIN BEARING-AWARE
 * =====================================
 *
 * Crea una TransformConstrainFunction que restringe el viewport de MapLibre
 * considerando el bearing del mapa. Reemplaza a setMaxBounds, que es
 * bearing-blind (siempre clampea LON con viewport WIDTH y LAT con HEIGHT,
 * sin importar la rotación).
 *
 * Con bearing = ±90° los ejes de pantalla están intercambiados:
 *   - Ancho de pantalla W  ↔ eje LATITUD  (sur → norte)
 *   - Alto de pantalla H   ↔ eje LONGITUD (oeste → este)
 *
 * La función se ejecuta PRE-render en cada frame: recibe el centro y zoom
 * propuestos y devuelve los permitidos. No hay loop de feedback.
 *
 * Port de `createBearingAwareConstrain()` (atlas_3.0 `useAtlasMap.ts:100-183`),
 * validado en producción con bearing=-90 en los 7 mapas del Capítulo 1.
 */

import { LngLat } from 'maplibre-gl'
import type { TransformConstrainFunction } from 'maplibre-gl'
import type { GeographicBounds } from './BoundsCalculator'

export interface CanvasSizeProvider {
  (): { clientWidth: number; clientHeight: number }
}

/**
 * @param getCanvas - Devuelve el elemento contenedor del mapa (para leer W/H)
 * @param vmb - viewportMaxBounds [west, south, east, north]
 * @param bearing - Bearing del mapa en grados (ej. -90)
 */
export function createBearingAwareConstrain(
  getCanvas: CanvasSizeProvider,
  vmb: GeographicBounds,
  bearing: number,
): TransformConstrainFunction {
  const [west, south, east, north] = vmb
  const normalized = ((bearing % 360) + 360) % 360
  const isQuarterTurn = normalized === 90 || normalized === 270

  const latSpan = north - south
  const lonSpan = east - west

  return (lngLat: LngLat, zoom: number) => {
    const canvas = getCanvas()
    const W = canvas.clientWidth
    const H = canvas.clientHeight

    // ── Paso A: minZoom bearing-aware ────────────────────────────────────
    // dpp(z) = 360 / (512 · 2^z). Para que el viewport quepa en el bound:
    //   W · dpp(z) <= span  →  z >= log2(W · 360 / (512 · span))
    let minZoom: number
    if (isQuarterTurn) {
      const minZoomW = latSpan > 0 ? Math.log2((W * 360) / (512 * latSpan)) : 0
      const minZoomH = lonSpan > 0 ? Math.log2((H * 360) / (512 * lonSpan)) : 0
      minZoom = Math.max(minZoomW, minZoomH)
    } else {
      const minZoomW = lonSpan > 0 ? Math.log2((W * 360) / (512 * lonSpan)) : 0
      const minZoomH = latSpan > 0 ? Math.log2((H * 360) / (512 * latSpan)) : 0
      minZoom = Math.max(minZoomW, minZoomH)
    }

    // ── Paso B: clampear zoom ANTES de calcular dpp ──────────────────────
    const clampedZoom = Math.max(minZoom, zoom)

    // ── Paso C: dpp con zoom ya corregido ────────────────────────────────
    const dpp = 360 / (512 * Math.pow(2, clampedZoom))

    // ── Paso D: clampear centro (restar half-extent del viewport) ────────
    let clampedLng = lngLat.lng
    let clampedLat = lngLat.lat

    if (isQuarterTurn) {
      // bearing ±90°: pantalla W ↔ eje lat, pantalla H ↔ eje lon
      const halfLat = (W / 2) * dpp
      const halfLon = (H / 2) * dpp
      const minLat = south + halfLat
      const maxLat = north - halfLat
      const minLon = west + halfLon
      const maxLon = east - halfLon
      clampedLat =
        minLat <= maxLat
          ? Math.max(minLat, Math.min(maxLat, clampedLat))
          : (south + north) / 2
      clampedLng =
        minLon <= maxLon
          ? Math.max(minLon, Math.min(maxLon, clampedLng))
          : (west + east) / 2
    } else {
      // bearing 0/180: pantalla W ↔ eje lon, pantalla H ↔ eje lat
      const halfLon = (W / 2) * dpp
      const halfLat = (H / 2) * dpp
      const minLon = west + halfLon
      const maxLon = east - halfLon
      const minLat = south + halfLat
      const maxLat = north - halfLat
      clampedLng =
        minLon <= maxLon
          ? Math.max(minLon, Math.min(maxLon, clampedLng))
          : (west + east) / 2
      clampedLat =
        minLat <= maxLat
          ? Math.max(minLat, Math.min(maxLat, clampedLat))
          : (south + north) / 2
    }

    // Guardrail: coordenadas siempre válidas
    clampedLat = Math.max(-89.9, Math.min(89.9, clampedLat))
    clampedLng = Math.max(-179.9, Math.min(179.9, clampedLng))

    return {
      center: new LngLat(clampedLng, clampedLat),
      zoom: clampedZoom,
    }
  }
}
