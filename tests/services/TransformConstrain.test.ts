import { describe, it, expect } from 'vitest'
import { LngLat } from 'maplibre-gl'
import { createBearingAwareConstrain } from '@services/TransformConstrain'
import type { GeographicBounds } from '@services/BoundsCalculator'

// Bounds de prueba (similares al mapa intro)
const VMB: GeographicBounds = [-78.9, -0.29, -65.74, 6.39]

// Canvas de escritorio
const getCanvas = () => ({ clientWidth: 1920, clientHeight: 1080 })

describe('TransformConstrain', () => {
  describe('createBearingAwareConstrain con bearing −90', () => {
    const constrain = createBearingAwareConstrain(getCanvas, VMB, -90)

    it('no altera un centro dentro de los bounds', () => {
      // Con zoom 10 el viewport es pequeño y el centro queda libre
      const result = constrain(new LngLat(-72, 3), 10)
      expect(result.center.lng).toBeCloseTo(-72, 5)
      expect(result.center.lat).toBeCloseTo(3, 5)
    })

    it('clampea un centro fuera de los bounds al hacer zoom in', () => {
      // zoom 8 con 1920×1080: el centro debe quedar dentro de
      // lat [south+halfLat, north−halfLat], lng [west+halfLon, east−halfLon]
      const result = constrain(new LngLat(-78.5, 6.3), 8)

      const dpp = 360 / (512 * 2 ** 8)
      const halfLat = (1920 / 2) * dpp
      const halfLon = (1080 / 2) * dpp

      expect(result.center.lat).toBeGreaterThanOrEqual(-0.29 + halfLat - 1e-9)
      expect(result.center.lat).toBeLessThanOrEqual(6.39 - halfLat + 1e-9)
      expect(result.center.lng).toBeGreaterThanOrEqual(-78.9 + halfLon - 1e-9)
      expect(result.center.lng).toBeLessThanOrEqual(-65.74 - halfLon + 1e-9)
    })

    it('eleva el zoom a minZoom si es demasiado bajo', () => {
      // Con bearing −90 y 1920×1080, el minZoom para que el viewport
      // quepa en los bounds es ≈ 7.66 (limitado por latSpan en W)
      const result = constrain(new LngLat(-72, 3), 2)
      expect(result.zoom).toBeGreaterThan(6)
    })

    it('es idempotente: clampear dos veces no mueve el centro', () => {
      const first = constrain(new LngLat(-78.5, 6.3), 8)
      const second = constrain(first.center, first.zoom)

      expect(second.center.lng).toBeCloseTo(first.center.lng, 6)
      expect(second.center.lat).toBeCloseTo(first.center.lat, 6)
      expect(second.zoom).toBeCloseTo(first.zoom, 6)
    })
  })

  describe('createBearingAwareConstrain con bearing 0', () => {
    const constrain = createBearingAwareConstrain(getCanvas, VMB, 0)

    it('no altera un centro dentro de los bounds', () => {
      const result = constrain(new LngLat(-72, 3), 10)
      expect(result.center.lng).toBeCloseTo(-72, 5)
      expect(result.center.lat).toBeCloseTo(3, 5)
    })

    it('usa los ejes normales (W↔lon, H↔lat)', () => {
      const result = constrain(new LngLat(-79, 7), 8)

      const dpp = 360 / (512 * 2 ** 8)
      const halfLon = (1920 / 2) * dpp
      const halfLat = (1080 / 2) * dpp

      expect(result.center.lng).toBeGreaterThanOrEqual(-78.9 + halfLon - 1e-9)
      expect(result.center.lat).toBeLessThanOrEqual(6.39 - halfLat + 1e-9)
    })
  })
})
