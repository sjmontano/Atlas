import { describe, it, expect } from 'vitest'
import {
  pgwToState,
  stateToPGW,
  shiftOrigin,
  scaleParam,
  clampCalibration,
  type CalibrationState,
} from '@services/MapCalibration'
import { processBounds } from '@services/BoundsCalculator'
import type { PGWData } from '@services/BoundsCalculator'

const PGW_INTRO: PGWData = [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033]
const W_INTRO = 5649
const H_INTRO = 11141

describe('MapCalibration', () => {
  describe('pgwToState', () => {
    it('extrae d, b, c, f y dimensiones del PGW rotado', () => {
      const state = pgwToState(PGW_INTRO, W_INTRO, H_INTRO)
      expect(state.d).toBeCloseTo(0.001181998411, 10)
      expect(state.b).toBeCloseTo(0.001182047579, 10)
      expect(state.c).toBe(-78.907953240108)
      expect(state.f).toBe(-0.290036434033)
      expect(state.width).toBe(W_INTRO)
      expect(state.height).toBe(H_INTRO)
    })

    it('mantiene A=0 y E=0 implícitos (no en el estado)', () => {
      const pgw: PGWData = [0, 0.01, 0.02, 0, -75, 3.5]
      const state = pgwToState(pgw, 100, 200)
      expect(state.d).toBe(0.01)
      expect(state.b).toBe(0.02)
      expect(state.c).toBe(-75)
      expect(state.f).toBe(3.5)
    })
  })

  describe('stateToPGW', () => {
    it('reconstruye PGW rotado desde CalibrationState', () => {
      const state: CalibrationState = { d: 0.005, b: 0.003, c: -74, f: 4, width: 1000, height: 2000 }
      const pgw = stateToPGW(state)
      expect(pgw).toEqual([0, 0.005, 0.003, 0, -74, 4])
    })

    it('round-trip con pgwToState preserva valores', () => {
      const state = pgwToState(PGW_INTRO, W_INTRO, H_INTRO)
      const pgw = stateToPGW(state)
      expect(pgw[1]).toBeCloseTo(state.d, 10)
      expect(pgw[2]).toBeCloseTo(state.b, 10)
      expect(pgw[4]).toBe(state.c)
      expect(pgw[5]).toBe(state.f)
      expect(pgw[0]).toBe(0)
      expect(pgw[3]).toBe(0)
    })
  })

  describe('shiftOrigin', () => {
    it('desplaza C y F por el delta dado', () => {
      const shifted = shiftOrigin(PGW_INTRO, 0.5, -0.3)
      expect(shifted[4]).toBeCloseTo(-78.907953240108 + 0.5, 10)
      expect(shifted[5]).toBeCloseTo(-0.290036434033 - 0.3, 10)
    })

    it('no modifica A, D, B, E', () => {
      const shifted = shiftOrigin(PGW_INTRO, 1, 2)
      expect(shifted[0]).toBe(PGW_INTRO[0])
      expect(shifted[1]).toBe(PGW_INTRO[1])
      expect(shifted[2]).toBe(PGW_INTRO[2])
      expect(shifted[3]).toBe(PGW_INTRO[3])
    })
  })

  describe('scaleParam', () => {
    it('multiplica D por el factor', () => {
      const scaled = scaleParam(PGW_INTRO, 'd', 2)
      expect(scaled[1]).toBeCloseTo(PGW_INTRO[1] * 2, 10)
      expect(scaled[2]).toBe(PGW_INTRO[2])
    })

    it('multiplica B por el factor', () => {
      const scaled = scaleParam(PGW_INTRO, 'b', 1.5)
      expect(scaled[2]).toBeCloseTo(PGW_INTRO[2] * 1.5, 10)
      expect(scaled[1]).toBe(PGW_INTRO[1])
    })

    it('no modifica A, E, C, F', () => {
      const scaled = scaleParam(PGW_INTRO, 'd', 1.2)
      expect(scaled[0]).toBe(PGW_INTRO[0])
      expect(scaled[3]).toBe(PGW_INTRO[3])
      expect(scaled[4]).toBe(PGW_INTRO[4])
      expect(scaled[5]).toBe(PGW_INTRO[5])
    })
  })

  describe('clampCalibration', () => {
    it('pasa valores finitos sin cambios', () => {
      const state: CalibrationState = { d: 0.001, b: 0.002, c: -75, f: 3, width: 5000, height: 10000 }
      const clamped = clampCalibration(state)
      expect(clamped).toEqual(state)
    })

    it('redondea width y height a enteros positivos', () => {
      const state: CalibrationState = { d: 0.001, b: 0.002, c: -75, f: 3, width: 5000.7, height: -10 }
      const clamped = clampCalibration(state)
      expect(clamped.width).toBe(5001)
      expect(clamped.height).toBe(1)
    })

    it('limita d y b a valores positivos finitos', () => {
      const state: CalibrationState = { d: -0.01, b: Infinity, c: -75, f: 3, width: 100, height: 100 }
      const clamped = clampCalibration(state)
      expect(clamped.d).toBe(1e-12)
      expect(clamped.b).toBe(1e-12)
    })

    it('limita c entre -180 y 180', () => {
      const state: CalibrationState = { d: 0.001, b: 0.002, c: -200, f: 100, width: 100, height: 100 }
      const clamped = clampCalibration(state)
      expect(clamped.c).toBe(-180)
      expect(clamped.f).toBe(90)
    })
  })

  describe('integration con processBounds', () => {
    it('stateToPGW produce un PGW válido detectado como rotado', () => {
      const state = pgwToState(PGW_INTRO, W_INTRO, H_INTRO)
      const pgw = stateToPGW(state)
      const result = processBounds(pgw, state.width, state.height)
      expect(result.isValid).toBe(true)
      expect(result.coordinates).toHaveLength(4)
      expect(result.bounds).toHaveLength(4)
    })

    it('después de nudge pequeño los bounds siguen válidos', () => {
      const state = pgwToState(PGW_INTRO, W_INTRO, H_INTRO)
      const nudged: CalibrationState = {
        ...state,
        d: state.d * 1.001,
        b: state.b * 0.999,
        c: state.c + 0.01,
        f: state.f - 0.005,
        width: state.width + 10,
        height: state.height - 10,
      }
      const pgw = stateToPGW(clampCalibration(nudged))
      const result = processBounds(pgw, nudged.width, nudged.height)
      expect(result.isValid).toBe(true)
      expect(result.coordinates).toHaveLength(4)
    })
  })
})
