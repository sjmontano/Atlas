### Task 4: LayerManager — Pure service + test

**Files:**
- Create: `src/services/LayerManager.ts`
- Create: `tests/services/LayerManager.test.ts`

**Interfaces:**
- Consumes: `Layer`, `LayerGroup` types (Task 1), `useLayerStore` (Task 2), `LAYER_CALIBRATIONS` (Task 3), `processBounds`, `PGWData` from BoundsCalculator
- Produces: `sync(map, mapId, layers, groups, storeState): void`, `addLayer(map, layer, state): void`, `updateLayerPGW(map, layerId, pgw, w, h): void`, `removeLayer(map, layerId): void`, `removeAll(map): void`

- [ ] **Step 1: Write the failing test**

Create `tests/services/LayerManager.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as maplibregl from 'maplibre-gl'
import { sync, addLayer, removeLayer, removeAll, updateLayerPGW } from '@services/LayerManager'
import { useLayerStore } from '@stores/layerStore'
import { processBounds } from '@services/BoundsCalculator'
import type { Layer, RasterPgwLayer } from '@types/layer'

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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- tests/services/LayerManager.test.ts
```

- [ ] **Step 3: Create `src/services/LayerManager.ts`**

```ts
import type * as maplibregl from 'maplibre-gl'
import { processBounds, type PGWData, type GeographicBounds, type ImageCoordinates } from './BoundsCalculator'
import { LAYER_CALIBRATIONS } from '@data/layers/calibration.js'
import type { Layer, RasterPgwLayer, RasterTilesLayer } from '@types/layer'
import { logger } from './MapLogger'

const CATEGORY = 'LayerManager'
const SOURCE_PREFIX = 'atlas-layer-'
const POIS_LAYER_ID = 'atlas-pois-layer'

interface StoreSnapshot {
  visibleLayers: Set<string>
  opacities: Record<string, number>
}

function sourceId(layerId: string): string {
  return `${SOURCE_PREFIX}${layerId}`
}

function isDegenerate(coords: ImageCoordinates): boolean {
  let minX = Infinity; let minY = Infinity
  let maxX = -Infinity; let maxY = -Infinity
  for (const [lng, lat] of coords) {
    const x = (lng + 180) / 360
    const s = Math.sin((lat * Math.PI) / 180)
    const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return Math.max(maxX - minX, maxY - minY) < 2 ** -25
}

function getBeforeId(map: maplibregl.Map, layerOrder: number, allLayers: Layer[]): string | undefined {
  const sorted = allLayers
    .filter((l) => l.order > layerOrder)
    .sort((a, b) => a.order - b.order)
  for (const l of sorted) {
    if (map.getLayer(sourceId(l.id))) return sourceId(l.id)
  }
  return POIS_LAYER_ID
}

export function addLayer(
  map: maplibregl.Map,
  layer: Layer,
  store: StoreSnapshot,
  allLayers?: Layer[],
): void {
  const sid = sourceId(layer.id)

  if (map.getSource(sid)) return

  const calib = LAYER_CALIBRATIONS[layer.id]
  const pgw: PGWData = calib ? calib.pgw : (layer as RasterPgwLayer).pgw
  const width = calib ? calib.width : (layer as RasterPgwLayer).width
  const height = calib ? calib.height : (layer as RasterPgwLayer).height
  const visible = store.visibleLayers.has(layer.id)
  const opacity = store.opacities[layer.id] ?? layer.opacity ?? 1

  if (layer.type === 'raster-pgw') {
    const { coordinates } = processBounds(pgw, width, height)
    if (isDegenerate(coordinates)) {
      logger.warn(CATEGORY, `Skipping degenerate layer: ${layer.id}`)
      return
    }

    map.addSource(sid, {
      type: 'image',
      url: layer.image,
      coordinates,
    })

    map.addLayer(
      {
        id: sid,
        type: 'raster',
        source: sid,
        paint: { 'raster-opacity': opacity, 'raster-fade-duration': 0 },
        layout: { visibility: visible ? 'visible' : 'none' },
      },
      allLayers ? getBeforeId(map, layer.order, allLayers) : undefined,
    )
  }

  logger.info(CATEGORY, `Layer added: ${layer.id}`)
}

export function removeLayer(map: maplibregl.Map, layerId: string): void {
  const sid = sourceId(layerId)
  try {
    if (map.getLayer(sid)) map.removeLayer(sid)
  } catch { /* noop */ }
  try {
    if (map.getSource(sid)) map.removeSource(sid)
  } catch { /* noop */ }
}

export function removeAll(map: maplibregl.Map): void {
  const style = map.getStyle()
  if (!style?.layers) return
  for (const l of style.layers) {
    if (l.id.startsWith(SOURCE_PREFIX)) {
      try { map.removeLayer(l.id) } catch { /* noop */ }
    }
  }
  if (style?.sources) {
    for (const id of Object.keys(style.sources)) {
      if (id.startsWith(SOURCE_PREFIX)) {
        try { map.removeSource(id) } catch { /* noop */ }
      }
    }
  }
}

export function updateLayerPGW(
  map: maplibregl.Map,
  layerId: string,
  pgw: PGWData,
  width: number,
  height: number,
): void {
  const sid = sourceId(layerId)
  const source = map.getSource(sid) as maplibregl.ImageSource | undefined
  if (!source) return
  const { coordinates } = processBounds(pgw, width, height)
  if (!isDegenerate(coordinates)) {
    source.setCoordinates(coordinates)
  }
}

export function sync(
  map: maplibregl.Map,
  mapId: string,
  layers: Layer[],
  _groups: unknown,
  store: StoreSnapshot,
): void {
  const currentIds = new Set<string>()
  const style = map.getStyle()
  if (style?.layers) {
    for (const l of style.layers) {
      if (l.id.startsWith(SOURCE_PREFIX)) {
        currentIds.add(l.id.slice(SOURCE_PREFIX.length))
      }
    }
  }

  const desiredIds = new Set(layers.map((l) => l.id))

  for (const id of currentIds) {
    if (!desiredIds.has(id)) {
      removeLayer(map, id)
    }
  }

  for (const layer of layers) {
    if (!currentIds.has(layer.id)) {
      if (layer.visibleByDefault || store.visibleLayers.has(layer.id)) {
        addLayer(map, layer, store, layers)
      }
    } else {
      const sid = sourceId(layer.id)
      const visible = store.visibleLayers.has(layer.id)
      if (map.getLayer(sid)) {
        map.setLayoutProperty(sid, 'visibility', visible ? 'visible' : 'none')
      }
      const opacity = store.opacities[layer.id] ?? layer.opacity ?? 1
      if (map.getLayer(sid)) {
        map.setPaintProperty(sid, 'raster-opacity', opacity)
      }
    }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- tests/services/LayerManager.test.ts
```

Expected: all tests pass (8 test cases).

- [ ] **Step 5: Commit**

```bash
git add src/services/LayerManager.ts tests/services/LayerManager.test.ts
git commit -m "feat: add LayerManager service with sync, addLayer, updateLayerPGW"
```

---


