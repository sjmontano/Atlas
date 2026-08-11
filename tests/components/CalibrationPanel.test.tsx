import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.hoisted(() => {
  vi.stubEnv('VITE_DEV_TOOLS', 'true')
})

import { render, screen, fireEvent } from '@testing-library/react'
import { CalibrationPanel } from '@components/calibration/CalibrationPanel'
import { useLayerStore } from '@stores/layerStore'

vi.mock('maplibre-gl', () => ({ default: {} }))

vi.mock('@data/maps', () => ({
  getMapEntry: vi.fn(() => ({
    geo: { pgw: [0, 0.001, 0.001, 0, -77, 2], width: 1000, height: 2000 },
    images: { placeholder: '', full: '' },
    config: { initialZoom: 5, initialBearing: -90, minZoom: 3, maxZoom: 8, dragPan: true, scrollZoom: true, useTransformConstrain: false },
  })),
}))

vi.mock('@data/layers', () => ({
  getMapLayers: vi.fn(() => [
    {
      id: 'layer-x',
      name: 'Layer X',
      type: 'raster-pgw',
      category: 'ecosystems',
      order: 1,
      pgw: [0, 0.001, 0.001, 0, -77, 2],
      width: 100,
      height: 200,
      image: '',
    },
  ]),
}))

describe('CalibrationPanel multi-layer', () => {
  beforeEach(() => {
    useLayerStore.getState().resetAll('test')
  })

  it('shows target selector with Mapa base selected by default', () => {
    const ctrl = { map: { getSource: vi.fn(), getLayer: vi.fn(), getStyle: vi.fn(() => ({ layers: [], sources: {} })), on: vi.fn(), off: vi.fn(), getCanvas: vi.fn(() => ({})), getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })), unproject: vi.fn(() => ({ lng: 0, lat: 0 })), dragPan: { disable: vi.fn(), enable: vi.fn() } }, updateBounds: vi.fn(() => ({ coordinates: [[-77,2],[-76,2],[-76,1],[-77,1]], bounds: [-77,1,-76,2], center: [-76.5,1.5], isValid: true })) }
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    expect(screen.getByText('🗺 Mapa base')).toBeDefined()
  })

  it('switches to layers mode when button clicked', () => {
    useLayerStore.getState().setCalibrationSelection(['layer-x'])
    const ctrl = { map: { getSource: vi.fn(), getLayer: vi.fn(), getStyle: vi.fn(() => ({ layers: [], sources: {} })), on: vi.fn(), off: vi.fn(), getCanvas: vi.fn(() => ({})), getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })), unproject: vi.fn(() => ({ lng: 0, lat: 0 })), dragPan: { disable: vi.fn(), enable: vi.fn() } }, updateBounds: vi.fn(() => ({ coordinates: [[-77,2],[-76,2],[-76,1],[-77,1]], bounds: [-77,1,-76,2], center: [-76.5,1.5], isValid: true })) }
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    const layersBtn = screen.getByText(/📐 Capas/)
    fireEvent.click(layersBtn!)
    expect(useLayerStore.getState().selectedForCalibration.size).toBe(1)
  })
})
