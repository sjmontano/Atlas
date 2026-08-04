import type { PGWData } from './BoundsCalculator'

export interface CalibrationState {
  readonly a: number
  readonly d: number
  readonly b: number
  readonly e: number
  readonly c: number
  readonly f: number
  readonly width: number
  readonly height: number
}

export function pgwToState(pgw: PGWData, width: number, height: number): CalibrationState {
  const [a, d, b, e, c, f] = pgw
  return { a, d, b, e, c, f, width, height }
}

export function stateToPGW(state: CalibrationState): PGWData {
  return [state.a, state.d, state.b, state.e, state.c, state.f]
}

export function shiftOrigin(pgw: PGWData, dLng: number, dLat: number): PGWData {
  const [a, d, b, e, c, f] = pgw
  return [a, d, b, e, c + dLng, f + dLat]
}

export function scaleParam(pgw: PGWData, key: 'd' | 'b', factor: number): PGWData {
  const [a, d, b, e, c, f] = pgw
  if (key === 'd') return [a, d * factor, b, e, c, f]
  return [a, d, b * factor, e, c, f]
}

export function resizeDims(width: number, height: number, dW: number, dH: number): { width: number; height: number } {
  return { width: width + dW, height: height + dH }
}

function clampFinito(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

/**
 * Clampa la magnitud de un coeficiente de escala preservando su signo.
 * Un 0 exacto se conserva (PGW retrato legítimo con A=0/E=0); un signo
 * negativo (rotación real) no se vuelve positivo.
 */
function clampScale(value: number, min = 1e-12, max = 1): number {
  if (!Number.isFinite(value)) return min
  if (value === 0) return 0
  const mag = Math.min(Math.max(Math.abs(value), min), max)
  return value < 0 ? -mag : mag
}

export function clampCalibration(state: CalibrationState): CalibrationState {
  return {
    a: clampScale(state.a),
    d: clampScale(state.d),
    b: clampScale(state.b),
    e: clampScale(state.e),
    c: clampFinito(state.c, -180, 180),
    f: clampFinito(state.f, -90, 90),
    width: Math.max(1, Math.round(clampFinito(state.width, 1, 100000))),
    height: Math.max(1, Math.round(clampFinito(state.height, 1, 100000))),
  }
}
