import { describe, it, expect } from 'vitest'
import {
  calculateImageCoordinates,
  calculateGeographicBounds,
  calculateCenter,
  validateBounds,
  processBounds,
} from '@services/BoundsCalculator'
import { MAP_GEO } from '@data/maps/geo.js'

// PGW rotado del mapa intro (fuente: geo.js)
const INTRO = MAP_GEO['intro']

describe('BoundsCalculator', () => {
  describe('calculateImageCoordinates', () => {
    it('calcula las 4 esquinas del mapa intro con PGW rotado', () => {
      const [tl, tr, br, bl] = calculateImageCoordinates(
        INTRO.pgw,
        INTRO.width,
        INTRO.height,
      )

      // Valores calculados a mano con la fórmula afín + half-pixel:
      // x0 = C − 0.5·B = −78.907953 − 0.000591 = −78.908544
      // y0 = F − 0.5·D = −0.290036 − 0.000591 = −0.290627
      expect(tl[0]).toBeCloseTo(-78.9085, 3)
      expect(tl[1]).toBeCloseTo(-0.2906, 3)

      // TR: lat sube D·5649 = 6.6771 → y0 + 6.6771 ≈ 6.3865
      expect(tr[0]).toBeCloseTo(-78.9085, 3)
      expect(tr[1]).toBeCloseTo(6.3865, 3)

      // BR: lng sube B·11141 = 13.1692 → x0 + 13.1692 ≈ −65.7393
      expect(br[0]).toBeCloseTo(-65.7393, 3)
      expect(br[1]).toBeCloseTo(6.3865, 3)

      // BL: misma lng que BR, misma lat que TL
      expect(bl[0]).toBeCloseTo(-65.7393, 3)
      expect(bl[1]).toBeCloseTo(-0.2906, 3)
    })

    it('funciona con PGW estándar (sin skew) también', () => {
      // PGW estándar de prueba: A=0.001, E=−0.001, B=D=0
      const coords = calculateImageCoordinates(
        [0.001, 0, 0, -0.001, -76.5, 3.5],
        2000,
        1500,
      )
      const [tl, , br] = coords

      // x0 = −76.5 − 0.0005 = −76.5005
      expect(tl[0]).toBeCloseTo(-76.5005, 4)
      // y0 = 3.5 + 0.0005 = 3.5005
      expect(tl[1]).toBeCloseTo(3.5005, 4)
      // BR: lng = −76.5005 + 2 = −74.5005, lat = 3.5005 − 1.5 = 2.0005
      expect(br[0]).toBeCloseTo(-74.5005, 4)
      expect(br[1]).toBeCloseTo(2.0005, 4)
    })
  })

  describe('calculateGeographicBounds', () => {
    it('devuelve bounds [west, south, east, north] del intro', () => {
      const [west, south, east, north] = calculateGeographicBounds(
        INTRO.pgw,
        INTRO.width,
        INTRO.height,
      )

      expect(west).toBeCloseTo(-78.9085, 3)
      expect(south).toBeCloseTo(-0.2906, 3)
      expect(east).toBeCloseTo(-65.7393, 3)
      expect(north).toBeCloseTo(6.3865, 3)
    })
  })

  describe('calculateCenter', () => {
    it('calcula el centro de unos bounds', () => {
      const center = calculateCenter([-78.9085, -0.2906, -65.7393, 6.3865])
      expect(center[0]).toBeCloseTo(-72.3239, 3)
      expect(center[1]).toBeCloseTo(3.048, 2)
    })
  })

  describe('validateBounds', () => {
    it('valida bounds finitos', () => {
      expect(validateBounds([-78.9, -0.3, -65.7, 6.4])).toBe(true)
    })
    it('rechaza bounds con NaN o Infinity', () => {
      expect(validateBounds([NaN, 0, 1, 2])).toBe(false)
      expect(validateBounds([0, 0, Infinity, 2])).toBe(false)
    })
  })

  describe('processBounds', () => {
    it('procesa el mapa intro completo (convertido de rotado a estándar)', () => {
      const result = processBounds(INTRO.pgw, INTRO.width, INTRO.height)

      expect(result.isValid).toBe(true)
      expect(result.bounds[0]).toBeCloseTo(-78.9085, 3)
      expect(result.bounds[1]).toBeCloseTo(-0.2894, 3)
      expect(result.bounds[2]).toBeCloseTo(-72.2313, 3)
      expect(result.bounds[3]).toBeCloseTo(12.8797, 3)
      expect(result.coordinates).toHaveLength(4)
      expect(result.center[0]).toBeCloseTo(-75.5699, 3)
      expect(result.center[1]).toBeCloseTo(6.2952, 3)
    })

    it('procesa todos los mapas definidos en geo.js sin errores', () => {
      for (const [mapId, geo] of Object.entries(MAP_GEO)) {
        const result = processBounds(geo.pgw, geo.width, geo.height)
        expect(result.isValid, `mapId: ${mapId}`).toBe(true)
        // Colombia/extensión razonable
        expect(result.bounds[0], `west ${mapId}`).toBeGreaterThan(-85)
        expect(result.bounds[2], `east ${mapId}`).toBeLessThan(-60)
        expect(result.bounds[3], `north ${mapId}`).toBeLessThan(16)
      }
    })
  })
})
