import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addPois, removePois } from '@services/PoiManager'
import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '@types/poi'

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  const images = new Map()
  const map = {
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
    hasImage: vi.fn((id) => images.has(id)),
    addImage: vi.fn((id, img) => { images.set(id, img) }),
    loadImage: vi.fn(async () => ({ data: {} })),
    setMissingStyleImageResolver: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    _sources: sources,
    _layers: layers,
    _images: images,
  }
  return map as unknown as maplibregl.Map
}

function stubRaf() {
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
}

const NUMBER_POIS: Poi[] = [
  { id: 'p-1', name: 'Point A', coords: [-77, 2], popup: { title: 'A' }, numero: 1, variant: 'number' },
]

const ICON_POIS: Poi[] = [
  { id: 'p-2', name: 'Nodo Suárez', coords: [-76.675, 2.966], popup: { title: 'Suárez' }, variant: 'icon' },
]

const ARROW_POIS: Poi[] = [
  {
    id: 'p-3',
    name: 'ASOYOGE',
    coords: [-76.686, 2.93],
    popup: { title: 'ASOYOGE' },
    icon: 'https://example.com/photo.webp',
    angle: 330,
    variant: 'arrow',
  },
]

describe('PoiManager variants', () => {
  beforeEach(() => {
    stubRaf()
  })

  it('number variant: crea capas circle + symbol de número', () => {
    const map = makeMap()
    addPois(map, 'test', NUMBER_POIS, vi.fn())
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-layer', type: 'symbol' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-circle-layer', type: 'circle' }),
    )
  })

  it('icon variant: crea capa symbol con icon-image de gota', () => {
    const map = makeMap()
    addPois(map, 'test', ICON_POIS, vi.fn())
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-icon-layer', type: 'symbol' }),
    )
  })

  it('arrow variant: crea capa symbol con icon-image data-driven', () => {
    const map = makeMap()
    addPois(map, 'test', ARROW_POIS, vi.fn())
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-arrow-layer', type: 'symbol' }),
    )
  })

  it('registra el resolver de imágenes faltantes (gota y flechas)', () => {
    const map = makeMap()
    addPois(map, 'test', ARROW_POIS, vi.fn())
    expect(map.setMissingStyleImageResolver).toHaveBeenCalledWith(expect.any(Function))
  })

  it('removePois limpia el resolver de imágenes', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    removePois(map)
    expect(map.setMissingStyleImageResolver).toHaveBeenCalledWith(null)
  })

  it('arrow variant: no crea capa circle ni symbol de número', () => {
    const map = makeMap()
    addPois(map, 'test', ARROW_POIS, vi.fn())
    expect(map.addLayer).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-layer' }),
    )
    expect(map.addLayer).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-circle-layer' }),
    )
  })

  it('asigna feature properties variant y angle', () => {
    const map = makeMap()
    addPois(map, 'test', ARROW_POIS, vi.fn())
    const sourceDef = map._sources.get('atlas-pois-source')
    const feat = sourceDef.data.features[0]
    expect(feat.properties.variant).toBe('arrow')
    expect(feat.properties.angle).toBe(330)
    expect(feat.properties.markerIcon).toBe('p-3')
  })

  it('escala circle-radius e icon-size con el zoom (interpolate mín/máx)', () => {
    const map = makeMap()
    addPois(map, 'test', ICON_POIS, vi.fn())

    const circle = map._layers.get('atlas-pois-circle-layer')
    expect(circle.paint['circle-radius'][0]).toBe('interpolate')
    expect(circle.paint['circle-radius'][1][0]).toBe('linear')

    const icon = map._layers.get('atlas-pois-icon-layer')
    expect(icon.layout['icon-size'][0]).toBe('interpolate')
  })

  it('escala icon-size de flecha con el zoom', () => {
    const map = makeMap()
    addPois(map, 'test', ARROW_POIS, vi.fn())
    const arrow = map._layers.get('atlas-pois-arrow-layer')
    expect(arrow.layout['icon-size'][0]).toBe('interpolate')
  })

  it('flecha usa alineación viewport (imagen interna no rota con el bearing del mapa)', () => {
    const map = makeMap()
    addPois(map, 'test', ARROW_POIS, vi.fn())
    const arrow = map._layers.get('atlas-pois-arrow-layer')
    expect(arrow.layout['icon-rotation-alignment']).toBe('viewport')
  })

  it('escala text-size del número con el zoom', () => {
    const map = makeMap()
    addPois(map, 'test', NUMBER_POIS, vi.fn())
    const symbol = map._layers.get('atlas-pois-layer')
    expect(symbol.layout['text-size'][0]).toBe('interpolate')
  })

  it('removePois elimina las capas de las 3 variantes', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    map._layers.set('atlas-pois-circle-layer', { id: 'atlas-pois-circle-layer' })
    map._layers.set('atlas-pois-pulse-layer', { id: 'atlas-pois-pulse-layer' })
    map._layers.set('atlas-pois-icon-layer', { id: 'atlas-pois-icon-layer' })
    map._layers.set('atlas-pois-arrow-layer', { id: 'atlas-pois-arrow-layer' })
    map._sources.set('atlas-pois-source', { type: 'geojson' })
    removePois(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-arrow-layer')
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-icon-layer')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-pois-source')
  })
})
