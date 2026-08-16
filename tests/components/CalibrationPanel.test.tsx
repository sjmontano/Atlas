import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.hoisted(() => {
  vi.stubEnv('VITE_DEV_TOOLS', 'true')
})

import { render, screen, fireEvent, act } from '@testing-library/react'
import { CalibrationPanel } from '@components/calibration/CalibrationPanel'
import { useLayerStore } from '@stores/layerStore'
import { processBounds } from '@services/BoundsCalculator'

vi.mock('maplibre-gl', () => ({ default: {} }))

vi.mock('@content', () => ({
  getMapContent: vi.fn(() => ({
    geo: { pgw: [0, 0.001, 0.001, 0, -77, 2], width: 1000, height: 2000 },
    images: { placeholder: '', full: '' },
    config: { initialZoom: 5, initialBearing: -90, minZoom: 3, maxZoom: 8, dragPan: true, scrollZoom: true, useTransformConstrain: false },
    layers: [
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
    ],
  })),
}))

describe('CalibrationPanel multi-layer', () => {
  beforeEach(() => {
    localStorage.clear()
    useLayerStore.getState().resetAll('test')
  })

  function makeDragController() {
    const listeners: Record<string, (e: unknown) => void> = {}
    const canvas = {
      style: {} as Record<string, string>,
      setPointerCapture: vi.fn(),
      addEventListener: (name: string, fn: (e: unknown) => void) => { listeners[name] = fn },
      removeEventListener: vi.fn(),
    }
    const sources: Record<string, { setCoordinates: ReturnType<typeof vi.fn> }> = {
      'atlas-layer-layer-x': { setCoordinates: vi.fn() },
    }
    const ctrl = {
      map: {
        getSource: vi.fn((id: string) => sources[id] ?? undefined),
        getLayer: vi.fn(() => undefined),
        getStyle: vi.fn(() => ({ layers: [], sources: {} })),
        on: vi.fn(),
        off: vi.fn(),
        getCanvas: vi.fn(() => canvas),
        getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })),
        unproject: vi.fn(([x, y]: [number, number]) => ({ lng: x / 1000, lat: y / 1000 })),
        dragPan: { disable: vi.fn(), enable: vi.fn() },
      },
      updateBounds: vi.fn(() => ({ coordinates: [[-77, 2]], bounds: [-77, 1, -76, 2] })),
      updateViewportMargin: vi.fn(),
    }
    return { ctrl, listeners, sources }
  }

  it('shows target selector with Mapa base selected by default', () => {
    const ctrl = { map: { getSource: vi.fn(), getLayer: vi.fn(), getStyle: vi.fn(() => ({ layers: [], sources: {} })), on: vi.fn(), off: vi.fn(), getCanvas: vi.fn(() => ({})), getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })), unproject: vi.fn(() => ({ lng: 0, lat: 0 })), dragPan: { disable: vi.fn(), enable: vi.fn() } }, updateBounds: vi.fn(() => ({ coordinates: [[-77,2],[-76,2],[-76,1],[-77,1]], bounds: [-77,1,-76,2], center: [-76.5,1.5], isValid: true })), updateViewportMargin: vi.fn() }
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    expect(screen.getByText('🗺 Mapa base')).toBeDefined()
  })

  it('switches to layers mode when button clicked', () => {
    useLayerStore.getState().toggleLayer('layer-x')
    const ctrl = { map: { getSource: vi.fn(), getLayer: vi.fn(), getStyle: vi.fn(() => ({ layers: [], sources: {} })), on: vi.fn(), off: vi.fn(), getCanvas: vi.fn(() => ({})), getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })), unproject: vi.fn(() => ({ lng: 0, lat: 0 })), dragPan: { disable: vi.fn(), enable: vi.fn() } }, updateBounds: vi.fn(() => ({ coordinates: [[-77,2],[-76,2],[-76,1],[-77,1]], bounds: [-77,1,-76,2], center: [-76.5,1.5], isValid: true })), updateViewportMargin: vi.fn() }
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    const layersBtn = screen.getByText(/📐 Capas/)
    fireEvent.click(layersBtn!)
    expect(useLayerStore.getState().visibleLayers.has('layer-x')).toBe(true)
    expect(screen.getByText(/1\/1/)).toBeDefined()
  })

  it('drags the layer (Mover) by shifting layer origin, not the base map', () => {
    useLayerStore.getState().toggleLayer('layer-x')
    const { ctrl, listeners } = makeDragController()
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    fireEvent.click(screen.getByText(/📐 Capas/))
    fireEvent.click(screen.getByText(/↕ Mover/))
    ctrl.updateBounds.mockClear()

    act(() => {
      listeners.pointerdown?.({ pointerId: 1, clientX: 0, clientY: 0 })
      listeners.pointermove?.({ pointerId: 1, clientX: 0, clientY: 100 })
    })

    expect(ctrl.updateBounds).not.toHaveBeenCalled()
    expect(ctrl.map.getSource('atlas-layer-layer-x')?.setCoordinates).toHaveBeenCalled()
  })

  it('resets layer to its original coordinates', () => {
    useLayerStore.getState().toggleLayer('layer-x')
    const { ctrl, listeners } = makeDragController()
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    fireEvent.click(screen.getByText(/📐 Capas/))
    fireEvent.click(screen.getByText(/↕ Mover/))
    ctrl.updateBounds.mockClear()

    act(() => {
      listeners.pointerdown?.({ pointerId: 1, clientX: 0, clientY: 0 })
      listeners.pointermove?.({ pointerId: 1, clientX: 0, clientY: 100 })
    })

    const source = ctrl.map.getSource('atlas-layer-layer-x')
    const draggedCoords = source!!.setCoordinates.mock.calls.at(-1)?.[0]

    act(() => {
      fireEvent.click(screen.getByTitle('Reset a valores originales de geo.js'))
    })

    const lastCoords = source!!.setCoordinates.mock.calls.at(-1)?.[0]
    const original = processBounds([0, 0.001, 0.001, 0, -77, 2], 100, 200).coordinates
    expect(draggedCoords).not.toEqual(original)
    expect(lastCoords).toEqual(original)
  })
})
