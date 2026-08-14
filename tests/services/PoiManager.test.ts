import { describe, it, expect, vi } from 'vitest'
import { addPois, removePois } from '@services/PoiManager'
import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '@types/poi'

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  return {
    getSource: vi.fn((id) => sources.get(id) ?? null),
    getLayer: vi.fn((id) => layers.get(id) ?? null),
    addSource: vi.fn((id, def) => { sources.set(id, def) }),
    addLayer: vi.fn((def) => { layers.set(def.id, def) }),
    removeLayer: vi.fn((id) => { layers.delete(id) }),
    removeSource: vi.fn((id) => { sources.delete(id) }),
    setPaintProperty: vi.fn(),
    getCanvas: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })),
    on: vi.fn(),
    off: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map
}

function stubRaf() {
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
}

const POIS: Poi[] = [
  {
    id: 'p-1',
    name: 'Point A',
    coords: [-77, 2],
    popup: { title: 'A', body: 'Body A' },
    numero: 1,
  },
  {
    id: 'p-2',
    name: 'Point B',
    coords: [-78, 3],
    popup: { title: 'B' },
  },
]

describe('PoiManager', () => {
  beforeEach(() => {
    stubRaf()
  })

  it('addPois creates a single geojson source, symbol layer and circle layers', () => {
    const map = makeMap()
    addPois(map, 'test', POIS, vi.fn())
    expect(map.addSource).toHaveBeenCalledWith(
      'atlas-pois-source',
      expect.objectContaining({ type: 'geojson' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-layer', type: 'symbol' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-circle-layer', type: 'circle' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-pulse-layer', type: 'circle' }),
    )
  })

  it('removePois removes layer and source', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    map._layers.set('atlas-pois-circle-layer', { id: 'atlas-pois-circle-layer' })
    map._layers.set('atlas-pois-pulse-layer', { id: 'atlas-pois-pulse-layer' })
    map._sources.set('atlas-pois-source', { type: 'geojson' })
    removePois(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-circle-layer')
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-pulse-layer')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-pois-source')
  })

  it('addPois removes existing POIs before adding new', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    addPois(map, 'test', POIS, vi.fn())
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
    expect(map.addSource).toHaveBeenCalled()
  })
})
