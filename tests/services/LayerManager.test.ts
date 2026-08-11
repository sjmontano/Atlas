import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as maplibregl from 'maplibre-gl'
import { sync, addLayer, removeLayer, removeAll, updateLayerPGW } from '@services/LayerManager'
import { useLayerStore } from '@stores/layerStore'
import type { RasterPgwLayer } from '@types/layer'

vi.mock('maplibre-gl', () => ({
  Map: vi.fn(),
}))

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  return {
    getSource: vi.fn((id) => sources.get(id) ?? null),
    getLayer: vi.fn((id) => layers.get(id) ?? null),
    addSource: vi.fn((id, def) => { sources.set(id, def) }),
    addLayer: vi.fn((def, beforeId) => { layers.set(def.id, { ...def, beforeId }) }),
    removeLayer: vi.fn((id) => { layers.delete(id) }),
    removeSource: vi.fn((id) => { sources.delete(id) }),
    setLayoutProperty: vi.fn(),
    setPaintProperty: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    on: vi.fn(),
    off: vi.fn(),
    getCanvas: vi.fn(() => ({ style: {} })),
    getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }) })),
    unproject: vi.fn(() => ({ lng: -77, lat: 2 })),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map
}

const RASTER_LAYER: RasterPgwLayer = {
  id: 'test-layer',
  name: 'Test Layer',
  type: 'raster-pgw',
  category: 'ecosystems',
  image: 'https://example.com/test.webp',
  pgw: [0, 0.001, 0.001, 0, -77, 2],
  width: 1000,
  height: 2000,
  order: 10,
  opacity: 0.8,
  visibleByDefault: true,
}

describe('LayerManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const store = useLayerStore.getState()
    store.resetAll('test')
  })

  describe('addLayer (raster-pgw)', () => {
    it('adds image source and raster layer with bounds', () => {
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(['test-layer']), opacities: {} })
      expect(map.addSource).toHaveBeenCalledWith(
        'atlas-layer-test-layer',
        expect.objectContaining({ type: 'image' }),
      )
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'atlas-layer-test-layer', type: 'raster' }),
        undefined,
      )
    })

    it('sets visibility to none when layer not in visibleLayers', () => {
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(), opacities: {} })
      expect(map.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ layout: { visibility: 'none' } }),
        undefined,
      )
    })

    it('uses calibrated PGW when LAYER_CALIBRATIONS has entry', async () => {
      const { LAYER_CALIBRATIONS } = await import('@data/layers/calibration.js')
      LAYER_CALIBRATIONS['test-layer'] = {
        pgw: [0, 0.002, 0.002, 0, -78, 3],
        width: 500,
        height: 1000,
      }
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(), opacities: {} })
      const coords = (map.addSource as ReturnType<typeof vi.fn>).mock.calls[0][1].coordinates
      expect(coords).toBeDefined()
      expect(coords.length).toBe(4)
      LAYER_CALIBRATIONS['test-layer'] = undefined as unknown as typeof LAYER_CALIBRATIONS[string]
    })
  })

  describe('removeLayer', () => {
    it('removes both layer and source', () => {
      const map = makeMap()
      addLayer(map, RASTER_LAYER, { visibleLayers: new Set(), opacities: {} })
      removeLayer(map, 'test-layer')
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-test-layer')
      expect(map.removeSource).toHaveBeenCalledWith('atlas-layer-test-layer')
    })
  })

  describe('removeAll', () => {
    it('removes all atlas-layer-* sources and layers', () => {
      const map = makeMap()
      map._layers.set('atlas-layer-a', { id: 'atlas-layer-a' })
      map._layers.set('atlas-layer-b', { id: 'atlas-layer-b' })
      map._layers.set('atlas-base-image-layer', { id: 'atlas-base-image-layer' })
      removeAll(map)
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-a')
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-b')
      expect(map.removeLayer).not.toHaveBeenCalledWith('atlas-base-image-layer')
    })
  })

  describe('sync', () => {
    it('adds missing layers and removes stale ones', () => {
      const map = makeMap()
      map._layers.set('atlas-layer-stale', { id: 'atlas-layer-stale' })
      sync(map, 'test', [RASTER_LAYER], [], {
        visibleLayers: new Set(['test-layer']),
        opacities: {},
      })
      expect(map.addSource).toHaveBeenCalledWith(
        'atlas-layer-test-layer',
        expect.objectContaining({ type: 'image' }),
      )
      expect(map.removeLayer).toHaveBeenCalledWith('atlas-layer-stale')
    })
  })

  describe('updateLayerPGW', () => {
    it('calls setCoordinates on the image source', () => {
      const map = makeMap()
      const setCoords = vi.fn()
      map._sources.set('atlas-layer-test-layer', { setCoordinates: setCoords, type: 'image' })
      updateLayerPGW(map, 'test-layer', [0, 0.002, 0.002, 0, -78, 3], 500, 1000)
      expect(setCoords).toHaveBeenCalled()
    })

    it('no-ops if source does not exist', () => {
      const map = makeMap()
      expect(() =>
        updateLayerPGW(map, 'nonexistent', [0, 0.001, 0.001, 0, -77, 2], 1000, 2000),
      ).not.toThrow()
    })
  })
})
