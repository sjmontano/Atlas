import type { PGWData } from './BoundsCalculator'

export interface CalibrationState {
  readonly d: number
  readonly b: number
  readonly c: number
  readonly f: number
  readonly width: number
  readonly height: number
}

export function pgwToState(pgw: PGWData, width: number, height: number): CalibrationState {
  const [, d, b, , c, f] = pgw
  return { d, b, c, f, width, height }
}

export function stateToPGW(state: CalibrationState): PGWData {
  return [0, state.d, state.b, 0, state.c, state.f]
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

export function clampCalibration(state: CalibrationState): CalibrationState {
  return {
    d: clampFinito(state.d, 1e-12, 1),
    b: clampFinito(state.b, 1e-12, 1),
    c: clampFinito(state.c, -180, 180),
    f: clampFinito(state.f, -90, 90),
    width: Math.max(1, Math.round(clampFinito(state.width, 1, 100000))),
    height: Math.max(1, Math.round(clampFinito(state.height, 1, 100000))),
  }
}
