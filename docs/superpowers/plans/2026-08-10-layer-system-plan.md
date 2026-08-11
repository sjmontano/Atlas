# Layer System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete layer system (menu, multi-layer calibration, POIs) with ecosistemas pilot — 7 composite overlays on `chapter1-ecosistemas`.

**Architecture:** Types → data files → Zustand store → pure services (LayerManager, PoiManager) → React components (LayerMenu, PoiModal, CalibrationPanel extension) → AtlasMap integration. Each layer is a MapLibre raster source with independent PGW; z-order is deterministic via `order` field and `beforeId` insertion.

**Tech Stack:** React 19 + TypeScript strict + MapLibre GL 6 + Zustand 5 + Vite 8 + Vitest 4 + jsdom + CSS Modules

## Global Constraints

- Data files use `.js` with `.d.ts` alongside (hybrid rule)
- Never modify `atlas_front/atlas_frontend_v17/`
- No comments unless architecturally significant
- Source IDs prefixed: `atlas-layer-{id}`, `atlas-pois-layer`
- PGW format throughout: `[A, D, B, E, C, F]`
- Dev tools gated behind `VITE_DEV_TOOLS=true`
- Test pattern: vitest + jsdom + @testing-library/react, files in `tests/`

---

### Task 1: Types — Extend `layer.ts` + Create `poi.ts`

**Files:**
- Modify: `src/types/layer.ts`
- Create: `src/types/poi.ts`

**Interfaces:**
- Consumes: (none — foundation)
- Produces: `LayerType`, `LayerBase`, `RasterPgwLayer`, `RasterTilesLayer`, `GeojsonLayer`, `LayerGroup`, `Layer` (union), `Poi`

- [ ] **Step 1: Rewrite `src/types/layer.ts`**

```ts
import type { PGWData } from '@services/BoundsCalculator'

export type LayerCategory = 'rivers' | 'ecosystems' | 'boundaries' | 'nodes' | 'conflicts' | 'other'

export interface LayerMetadata {
  id: string
  name: string
  slug: string
  category: LayerCategory
  geometryType: string
  featureCount: number
  description: string
}

export type LayerType = 'raster-pgw' | 'raster-tiles' | 'geojson'

export interface LayerBase {
  id: string
  name: string
  category: LayerCategory
  group?: string
  visibleByDefault?: boolean
  opacity?: number
  order: number
  legend?: {
    swatch?: string
    description?: string
    longText?: string
  }
}

export interface RasterPgwLayer extends LayerBase {
  type: 'raster-pgw'
  image: string
  pgw: PGWData
  width: number
  height: number
}

export interface RasterTilesLayer extends LayerBase {
  type: 'raster-tiles'
  urlTemplate: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
}

export interface GeojsonLayer extends LayerBase {
  type: 'geojson'
  url: string
  geometry: 'fill' | 'line' | 'symbol' | 'circle'
  paint: Record<string, unknown>
}

export type Layer = RasterPgwLayer | RasterTilesLayer | GeojsonLayer

export interface LayerGroup {
  id: string
  name: string
  parent?: string
  order: number
}
```

- [ ] **Step 2: Create `src/types/poi.ts`**

```ts
export interface Poi {
  id: string
  numero?: number
  name: string
  coords: [number, number]
  capa?: string
  popup: {
    title: string
    body?: string
    image?: string
    audio?: string
  }
  angle?: number
  icon?: string
}
```

- [ ] **Step 3: Run typecheck to verify**

```bash
pnpm typecheck
```

Expected: passes (no consumers yet, but types must compile).

- [ ] **Step 4: Commit**

```bash
git add src/types/layer.ts src/types/poi.ts
git commit -m "feat: extend layer types and add Poi type"
```

---

### Task 2: layerStore — Extend store + persistence + test

**Files:**
- Modify: `src/stores/layerStore.js`
- Create: `src/stores/layerStore.d.ts`
- Create: `tests/stores/layerStore.test.ts`

**Interfaces:**
- Consumes: (none — store is foundation)
- Produces: `useLayerStore()` → `{ visibleLayers: Set<string>, opacities: Record<string, number>, activeCategories: Set<string>, selectedForCalibration: Set<string>, expandedGroups: Record<string, boolean>, toggleLayer(id), setLayerOpacity(id, opacity), setLayerGroupVisible(groupId, visible), toggleCalibrationSelection(id), setCalibrationSelection(ids), clearCalibrationSelection(), toggleGroupExpanded(groupId), resetAll(mapId) }`

- [ ] **Step 1: Write the failing test**

Create `tests/stores/layerStore.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLayerStore } from '@stores/layerStore'

function getState() {
  return useLayerStore.getState()
}

describe('layerStore', () => {
  beforeEach(() => {
    localStorage.clear()
    getState().resetAll('test-map')
  })

  describe('toggleLayer', () => {
    it('adds layer id to visibleLayers on first toggle', () => {
      getState().toggleLayer('layer-a')
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
    })

    it('removes layer id on second toggle', () => {
      getState().toggleLayer('layer-a')
      getState().toggleLayer('layer-a')
      expect(getState().visibleLayers.has('layer-a')).toBe(false)
    })

    it('preserves other visible layers', () => {
      getState().toggleLayer('layer-a')
      getState().toggleLayer('layer-b')
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
      expect(getState().visibleLayers.has('layer-b')).toBe(true)
    })
  })

  describe('setLayerOpacity', () => {
    it('sets opacity for a layer', () => {
      getState().setLayerOpacity('layer-a', 0.5)
      expect(getState().opacities['layer-a']).toBe(0.5)
    })

    it('updates existing opacity', () => {
      getState().setLayerOpacity('layer-a', 0.5)
      getState().setLayerOpacity('layer-a', 0.8)
      expect(getState().opacities['layer-a']).toBe(0.8)
    })
  })

  describe('setLayerGroupVisible', () => {
    it('activates all provided layer ids when visible=true', () => {
      getState().setLayerGroupVisible('g1', true, ['layer-a', 'layer-b'])
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
      expect(getState().visibleLayers.has('layer-b')).toBe(true)
    })

    it('deactivates all provided layer ids when visible=false', () => {
      getState().toggleLayer('layer-a')
      getState().toggleLayer('layer-b')
      getState().setLayerGroupVisible('g1', false, ['layer-a', 'layer-b'])
      expect(getState().visibleLayers.has('layer-a')).toBe(false)
      expect(getState().visibleLayers.has('layer-b')).toBe(false)
    })
  })

  describe('calibration selection', () => {
    it('toggleCalibrationSelection adds and removes', () => {
      getState().toggleCalibrationSelection('layer-a')
      expect(getState().selectedForCalibration.has('layer-a')).toBe(true)
      getState().toggleCalibrationSelection('layer-a')
      expect(getState().selectedForCalibration.has('layer-a')).toBe(false)
    })

    it('setCalibrationSelection replaces the set', () => {
      getState().toggleCalibrationSelection('layer-a')
      getState().setCalibrationSelection(['layer-b', 'layer-c'])
      expect(getState().selectedForCalibration.has('layer-a')).toBe(false)
      expect(getState().selectedForCalibration.has('layer-b')).toBe(true)
      expect(getState().selectedForCalibration.has('layer-c')).toBe(true)
    })

    it('clearCalibrationSelection empties the set', () => {
      getState().toggleCalibrationSelection('layer-a')
      getState().clearCalibrationSelection()
      expect(getState().selectedForCalibration.size).toBe(0)
    })
  })

  describe('expandedGroups', () => {
    it('toggleGroupExpanded toggles boolean', () => {
      getState().toggleGroupExpanded('g1')
      expect(getState().expandedGroups['g1']).toBe(true)
      getState().toggleGroupExpanded('g1')
      expect(getState().expandedGroups['g1']).toBe(false)
    })
  })

  describe('persistence', () => {
    it('persists visibleLayers to localStorage on change', () => {
      getState().resetAll('map-1')
      getState().toggleLayer('layer-a')
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.v).toContain('layer-a')
    })

    it('persists opacities to localStorage on change', () => {
      getState().resetAll('map-1')
      getState().setLayerOpacity('layer-a', 0.3)
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.o['layer-a']).toBe(0.3)
    })

    it('resetAll loads persisted state for the given mapId', () => {
      localStorage.setItem('atlas:layers:map-1', JSON.stringify({ v: ['layer-a'], o: { 'layer-a': 0.5 } }))
      getState().resetAll('map-1')
      expect(getState().visibleLayers.has('layer-a')).toBe(true)
      expect(getState().opacities['layer-a']).toBe(0.5)
    })

    it('resetAll clears state when no persisted data exists', () => {
      getState().toggleLayer('layer-a')
      getState().resetAll('fresh-map')
      expect(getState().visibleLayers.size).toBe(0)
      expect(Object.keys(getState().opacities).length).toBe(0)
    })

    it('does not persist selectedForCalibration', () => {
      getState().resetAll('map-1')
      getState().toggleCalibrationSelection('layer-a')
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.sc).toBeUndefined()
    })

    it('does not persist expandedGroups', () => {
      getState().resetAll('map-1')
      getState().toggleGroupExpanded('g1')
      const stored = JSON.parse(localStorage.getItem('atlas:layers:map-1')!)
      expect(stored.eg).toBeUndefined()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- tests/stores/layerStore.test.ts
```

Expected: tests fail (new store methods don't exist yet).

- [ ] **Step 3: Rewrite `src/stores/layerStore.js`**

```js
import { create } from 'zustand'

const STORAGE_PREFIX = 'atlas:layers:'

let currentMapId = null
let unsub = null

function loadPersisted(mapId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + mapId)
    if (!raw) return { v: [], o: {} }
    const data = JSON.parse(raw)
    return { v: data.v ?? [], o: data.o ?? {} }
  } catch {
    return { v: [], o: {} }
  }
}

function persist(state, mapId) {
  if (!mapId) return
  const payload = { v: [...state.visibleLayers], o: { ...state.opacities } }
  localStorage.setItem(STORAGE_PREFIX + mapId, JSON.stringify(payload))
}

export const useLayerStore = create((set, get) => ({
  visibleLayers: new Set(),
  opacities: {},
  activeCategories: new Set(),
  selectedForCalibration: new Set(),
  expandedGroups: {},

  toggleLayer: (layerId) =>
    set((state) => {
      const next = new Set(state.visibleLayers)
      if (next.has(layerId)) {
        next.delete(layerId)
      } else {
        next.add(layerId)
      }
      const newState = { visibleLayers: next }
      persist({ ...state, ...newState }, currentMapId)
      return newState
    }),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => {
      const opacities = { ...state.opacities, [layerId]: opacity }
      const newState = { opacities }
      persist({ ...state, ...newState }, currentMapId)
      return newState
    }),

  setLayerGroupVisible: (groupId, visible, layerIds) =>
    set((state) => {
      const next = new Set(state.visibleLayers)
      for (const id of layerIds) {
        if (visible) {
          next.add(id)
        } else {
          next.delete(id)
        }
      }
      const newState = { visibleLayers: next }
      persist({ ...state, ...newState }, currentMapId)
      return newState
    }),

  setActiveCategories: (categories) => set({ activeCategories: new Set(categories) }),

  toggleCalibrationSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedForCalibration)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selectedForCalibration: next }
    }),

  setCalibrationSelection: (ids) =>
    set({ selectedForCalibration: new Set(ids) }),

  clearCalibrationSelection: () =>
    set({ selectedForCalibration: new Set() }),

  toggleGroupExpanded: (groupId) =>
    set((state) => ({
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: !state.expandedGroups[groupId],
      },
    })),

  resetAll: (mapId) => {
    if (unsub) { unsub(); unsub = null }
    currentMapId = mapId
    const persisted = loadPersisted(mapId)
    set({
      visibleLayers: new Set(persisted.v),
      opacities: persisted.o,
      activeCategories: new Set(),
      selectedForCalibration: new Set(),
      expandedGroups: {},
    })
    unsub = useLayerStore.subscribe((state) => {
      persist(state, currentMapId)
    })
  },
}))
```

- [ ] **Step 4: Create `src/stores/layerStore.d.ts`**

```ts
export interface LayerStoreState {
  visibleLayers: Set<string>
  opacities: Record<string, number>
  activeCategories: Set<string>
  selectedForCalibration: Set<string>
  expandedGroups: Record<string, boolean>
  toggleLayer: (layerId: string) => void
  setLayerOpacity: (layerId: string, opacity: number) => void
  setLayerGroupVisible: (groupId: string, visible: boolean, layerIds: string[]) => void
  setActiveCategories: (categories: string[]) => void
  toggleCalibrationSelection: (id: string) => void
  setCalibrationSelection: (ids: string[]) => void
  clearCalibrationSelection: () => void
  toggleGroupExpanded: (groupId: string) => void
  resetAll: (mapId: string) => void
}

export const useLayerStore: {
  (): LayerStoreState
  getState: () => LayerStoreState
  subscribe: (listener: (state: LayerStoreState) => void) => () => void
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test -- tests/stores/layerStore.test.ts
```

Expected: all 12 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/stores/layerStore.js src/stores/layerStore.d.ts tests/stores/layerStore.test.ts
git commit -m "feat: extend layerStore with calibration selection, groups, persistence"
```

---

### Task 3: Data files — Shared sub-capas, groups, per-map, index, calibration, POIs

**Files:**
- Create: `src/data/layers/shared/ecosistemas.js` + `.d.ts`
- Create: `src/data/layers/groups/ecosistemas.js` + `.d.ts`
- Create: `src/data/layers/chapter1-ecosistemas.js` + `.d.ts`
- Create: `src/data/layers/calibration.js` + `.d.ts`
- Create: `src/data/layers/index.js` + `.d.ts`
- Create: `src/data/pois/bredunco.js` + `.d.ts`
- Create: `src/data/pois/index.js` + `.d.ts`

**Interfaces:**
- Consumes: `Layer`, `LayerGroup` types from Task 1
- Produces:
  - `ECOSYSTEMS_LAYERS: Layer[]` (29 individual sub-capas)
  - `ECOSYSTEMS_GROUPS: LayerGroup[]` (8 groups per official classification)
  - `LAYERS = { 'chapter1-ecosistemas': Layer[] }`
  - `LAYER_GROUPS = { 'chapter1-ecosistemas': LayerGroup[] }`
  - `getMapLayers(mapId): Layer[] | null`
  - `getLayerGroups(mapId): LayerGroup[] | null`
  - `LAYER_CALIBRATIONS: Record<string, { pgw: PGWData, width: number, height: number }>`
  - `POIS = { 'chapter1-bredunco': Poi[] }`
  - `getPois(mapId): Poi[] | null`

- [ ] **Step 1: Create `src/data/layers/shared/ecosistemas.js`**

```js
const ECOSYSTEMS_PGW = [0, 0.000441431774, 0.000441457732, 0, -77.621312825, 1.602929017]
const ECOSYSTEMS_DIMS = [1462, 2599]

const CDN = 'https://res.cloudinary.com/dvluvxfvn/image/upload'
const LOW = '/assets/img/Capas/ecosistemas/webp/low'

const layer = (id, name, url) => ({
  id: `ecosistemas-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: url,
  pgw: ECOSYSTEMS_PGW,
  width: ECOSYSTEMS_DIMS[0],
  height: ECOSYSTEMS_DIMS[1],
  opacity: 0.8,
  order: 0,
  visibleByDefault: false,
})

export const ECOSYSTEMS_LAYERS = [
  layer('agriculturaMixta', 'Agricultura mixta', `${CDN}/v1752614823/geoImages/ehxtmyhan6sxciwzeqq8.webp`),
  layer('aguaSuperficial', 'Agua superficial', `${CDN}/v1752615018/geoImages/uw21wuzdbrqiefckuf4d.webp`),
  layer('altoAndinos', 'Alto andinos', `${CDN}/v1752615317/geoImages/nsxeretli1c7vs11x6kc.webp`),
  layer('arbustal', 'Arbustal', `${CDN}/v1752616024/geoImages/jmzub122jv4yei2hpchp.webp`),
  layer('areasInundacion', 'Áreas de inundación', `${CDN}/v1752616054/geoImages/g6pgktggt7ni6xiyhupw.webp`),
  layer('bosqueFragmentado', 'Bosque fragmentado', `${CDN}/v1752616546/geoImages/gsvasgqvuszn6hz18ap4.webp`),
  layer('bosqueNiebla', 'Bosque de niebla', `${CDN}/v1752616666/geoImages/ccrcbspmilcmwnttnijk.webp`),
  layer('ganaderia', 'Ganadería', `${CDN}/v1752620553/geoImages/gtwqfz5u1o3kmbtl33a4.webp`),
  layer('glaciaresNivales', 'Glaciares y nivales', `${CDN}/v1752620635/geoImages/fucpwcprswkntuimp3ln.webp`),
  layer('herbazalPastos', 'Herbazal y pastos', `${CDN}/v1752620752/geoImages/ab8fmppquopvzo4t9ime.webp`),
  layer('humedales', 'Humedales', `${CDN}/v1752620855/geoImages/zabqishlczt4jhzan583.webp`),
  layer('humedosTropicales', 'Húmedos tropicales', `${LOW}/humedos-tropicales-low.webp`),
  layer('inundables', 'Inundables', `${LOW}/inundables-low.webp`),
  layer('laguna', 'Laguna', `${LOW}/laguna-low.webp`),
  layer('llanuraMareal', 'Llanura mareal', `${LOW}/llanura-mareal-low.webp`),
  layer('manglar', 'Manglar', `${LOW}/manglar-low.webp`),
  layer('monocultivos', 'Monocultivos', `${LOW}/monocultivos-low.webp`),
  layer('pantanoParamo', 'Pantano de páramo', `${LOW}/pantano-paramo-low.webp`),
  layer('Paramo', 'Páramo', `${LOW}/paramo-low.webp`),
  layer('playas', 'Playas', `${LOW}/playas-low.webp`),
  layer('regeneracionVegetal', 'Vegetación en regeneración', `${LOW}/regeneracion-vegetal-low.webp`),
  layer('rocasExpuestas', 'Rocas expuestas', `${LOW}/rocas-expuestas-low.webp`),
  layer('secosTropicales', 'Secos tropicales', `${LOW}/secos-tropicales-low.webp`),
  layer('sedimentosSubmarinos', 'Sedimentos submarinos', `${LOW}/sedimentos-submarinos-low.webp`),
  layer('subandinos', 'Subandinos', `${LOW}/subandinos-low.webp`),
  layer('subxerofitico', 'Subxerofítico', `${LOW}/subxerofitico-low.webp`),
  layer('xerofitico', 'Xerofítico', `${LOW}/xerofitico-low.webp`),
  layer('zonaPantanosa', 'Zona pantanosa', `${LOW}/zona-pantanosa-low.webp`),
  layer('zonaUrbanaIndustrial', 'Zona urbana industrial', `${LOW}/zona-urbana-industrial-low.webp`),
  layer('sinInformacion', 'Sin información', `${LOW}/sin-informacion-low.webp`),
]
```

- [ ] **Step 2: Create `src/data/layers/shared/ecosistemas.d.ts`**

```ts
import type { Layer } from '@types/layer'
export const ECOSYSTEMS_LAYERS: Layer[]
```

- [ ] **Step 3: Create `src/data/layers/groups/ecosistemas.js`**

```js
const g = (id, name, order) => ({ id, name, order })

export const ECOSYSTEMS_GROUPS = [
  g('eco-1.1', '1.1 Litoral y aguas poco profundas', 1),
  g('eco-1.2', '1.2 Vegetación de baja altura', 2),
  g('eco-1.3', '1.3 Bosques', 3),
  g('eco-1.4', '1.4 Altas cumbres', 4),
  g('eco-2.1', '2.1 Intervenciones moderadas', 5),
  g('eco-2.2', '2.2 Agricultura y ganadería', 6),
  g('eco-2.3', '2.3 Intervenciones severas', 7),
  g('eco-3', '3 Sin información', 8),
]
```

- [ ] **Step 4: Create `src/data/layers/groups/ecosistemas.d.ts`**

```ts
import type { LayerGroup } from '@types/layer'
export const ECOSYSTEMS_GROUPS: LayerGroup[]
```

- [ ] **Step 5: Create `src/data/layers/chapter1-ecosistemas.js`**

```js
import { ECOSYSTEMS_LAYERS } from './shared/ecosistemas.js'

const COMPOSITE_BASE = '/assets/maps/capas/ecosistemas'
const COMPOSITE_PGW = [0.000441457732, 0, 0, -0.000441431774, -77.623835249, 6.140675060]
const COMPOSITE_W = 1462
const COMPOSITE_H = 2599

const compositeLayer = (id, name, group, order, swatch) => ({
  id: `eco-composite-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: `${COMPOSITE_BASE}/${id}.webp`,
  pgw: COMPOSITE_PGW,
  width: COMPOSITE_W,
  height: COMPOSITE_H,
  opacity: 0.8,
  visibleByDefault: true,
  order,
  group,
  legend: { swatch, description: name },
})

export const CHAPTER1_ECOSYSTEMS_LAYERS = [
  compositeLayer('1.1_de_litoral_aguas', '1.1 Litoral y aguas', 'eco-1.1', 100, '#2b83ba'),
  compositeLayer('1.2_vegetacion_baja', '1.2 Vegetación baja', 'eco-1.2', 200, '#abdda4'),
  compositeLayer('1.3_bosques', '1.3 Bosques', 'eco-1.3', 300, '#1a9641'),
  compositeLayer('1.4_altas_cumbres', '1.4 Altas cumbres', 'eco-1.4', 400, '#d7191c'),
  compositeLayer('2.1_intervencion_moderada', '2.1 Intervención moderada', 'eco-2.1', 500, '#fdae61'),
  compositeLayer('2.3_intervencion_severa', '2.3 Intervención severa', 'eco-2.3', 600, '#a6cee3'),
  compositeLayer('3_sin_informacion', '3 Sin información', 'eco-3', 700, '#d9d9d9'),
]
```

- [ ] **Step 6: Create `src/data/layers/chapter1-ecosistemas.d.ts`**

```ts
import type { Layer } from '@types/layer'
export const CHAPTER1_ECOSYSTEMS_LAYERS: Layer[]
```

- [ ] **Step 7: Create `src/data/layers/index.js`**

```js
import { CHAPTER1_ECOSYSTEMS_LAYERS } from './chapter1-ecosistemas.js'
import { ECOSYSTEMS_GROUPS } from './groups/ecosistemas.js'

export const LAYERS = {
  'chapter1-ecosistemas': CHAPTER1_ECOSYSTEMS_LAYERS,
}

export const LAYER_GROUPS = {
  'chapter1-ecosistemas': ECOSYSTEMS_GROUPS,
}

export function getMapLayers(mapId) {
  return LAYERS[mapId] ?? null
}

export function getLayerGroups(mapId) {
  return LAYER_GROUPS[mapId] ?? null
}
```

- [ ] **Step 8: Create `src/data/layers/index.d.ts`**

```ts
import type { Layer, LayerGroup } from '@types/layer'
export const LAYERS: Record<string, Layer[]>
export const LAYER_GROUPS: Record<string, LayerGroup[]>
export function getMapLayers(mapId: string): Layer[] | null
export function getLayerGroups(mapId: string): LayerGroup[] | null
```

- [ ] **Step 9: Create `src/data/layers/calibration.js`**

```js
export const LAYER_CALIBRATIONS = {}
```

- [ ] **Step 10: Create `src/data/layers/calibration.d.ts`**

```ts
import type { PGWData } from '@services/BoundsCalculator'
export const LAYER_CALIBRATIONS: Record<string, { pgw: PGWData, width: number, height: number }>
```

- [ ] **Step 11: Create `src/data/pois/bredunco.js`**

```js
export const BREDUNCO_POIS = [
  {
    id: 'poi-bredunco-torre',
    numero: 1,
    name: 'Torre de Bredunco',
    coords: [-78.02, 2.35],
    capa: 'bredunco',
    popup: { title: 'Torre de Bredunco', body: 'Torre de vigilancia comunitaria en Bredunco.' },
  },
  {
    id: 'poi-bredunco-casa',
    numero: 2,
    name: 'Casa comunal',
    coords: [-78.01, 2.34],
    capa: 'bredunco',
    popup: { title: 'Casa comunal de Bredunco', body: 'Centro de reuniones comunitarias.' },
  },
]
```

- [ ] **Step 12: Create `src/data/pois/bredunco.d.ts`**

```ts
import type { Poi } from '@types/poi'
export const BREDUNCO_POIS: Poi[]
```

- [ ] **Step 13: Create `src/data/pois/index.js`**

```js
import { BREDUNCO_POIS } from './bredunco.js'

export const POIS = {
  'chapter1-bredunco': BREDUNCO_POIS,
}

export function getPois(mapId) {
  return POIS[mapId] ?? null
}
```

- [ ] **Step 14: Create `src/data/pois/index.d.ts`**

```ts
import type { Poi } from '@types/poi'
export const POIS: Record<string, Poi[]>
export function getPois(mapId: string): Poi[] | null
```

- [ ] **Step 15: Run typecheck to verify**

```bash
pnpm typecheck
```

- [ ] **Step 16: Commit**

```bash
git add src/data/layers/ src/data/pois/
git commit -m "feat: add layer data files (shared, groups, per-map, calibration, pois)"
```

---

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

### Task 5: POI system — PoiManager + PoiModal + test

**Files:**
- Create: `src/services/PoiManager.ts`
- Create: `src/components/map/PoiModal.tsx` + `.module.css`
- Create: `tests/services/PoiManager.test.ts`

**Interfaces:**
- Consumes: `Poi` type (Task 1), POI data (Task 3)
- Produces: `addPois(map, mapId, pois, onPoiClick): void`, `removePois(map): void`, `<PoiModal poi={Poi} onClose={() => void} />`

- [ ] **Step 1: Write the failing PoiManager test**

Create `tests/services/PoiManager.test.ts`:

```ts
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
    on: vi.fn(),
    off: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map
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
  it('addPois creates a single geojson source and symbol layer', () => {
    const map = makeMap()
    addPois(map, 'test', POIS, vi.fn())
    expect(map.addSource).toHaveBeenCalledWith(
      'atlas-pois-source',
      expect.objectContaining({ type: 'geojson' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-layer', type: 'symbol' }),
    )
  })

  it('removePois removes layer and source', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    map._sources.set('atlas-pois-source', { type: 'geojson' })
    removePois(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- tests/services/PoiManager.test.ts
```

- [ ] **Step 3: Create `src/services/PoiManager.ts`**

```ts
import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '@types/poi'

const POIS_SOURCE_ID = 'atlas-pois-source'
const POIS_LAYER_ID = 'atlas-pois-layer'

export function addPois(
  map: maplibregl.Map,
  _mapId: string,
  pois: Poi[],
  onPoiClick: (poi: Poi) => void,
): void {
  removePois(map)

  const features: GeoJSON.Feature[] = pois.map((poi) => ({
    type: 'Feature',
    id: poi.id,
    properties: { id: poi.id, name: poi.name, numero: poi.numero, popupTitle: poi.popup.title },
    geometry: { type: 'Point', coordinates: poi.coords },
  }))

  map.addSource(POIS_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })

  map.addLayer({
    id: POIS_LAYER_ID,
    type: 'symbol',
    source: POIS_SOURCE_ID,
    layout: {
      'text-field': ['to-string', ['get', 'numero']],
      'text-size': 14,
      'text-font': ['Open Sans Bold'],
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#1a1a2e',
      'text-halo-width': 2,
    },
  })

  map.on('click', POIS_LAYER_ID, (e) => {
    const feature = e.features?.[0]
    if (feature) {
      const poiId = feature.properties?.id
      const poi = pois.find((p) => p.id === poiId)
      if (poi) onPoiClick(poi)
    }
  })

  map.on('mouseenter', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = ''
  })
}

export function removePois(map: maplibregl.Map): void {
  try {
    if (map.getLayer(POIS_LAYER_ID)) map.removeLayer(POIS_LAYER_ID)
  } catch { /* noop */ }
  try {
    if (map.getSource(POIS_SOURCE_ID)) map.removeSource(POIS_SOURCE_ID)
  } catch { /* noop */ }
}
```

- [ ] **Step 4: Create `src/components/map/PoiModal.tsx`**

```tsx
import type { Poi } from '@types/poi'
import styles from './PoiModal.module.css'

interface Props {
  poi: Poi
  onClose: () => void
}

export function PoiModal({ poi, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2 className={styles.title}>{poi.popup.title}</h2>
        {poi.popup.body && <p className={styles.body}>{poi.popup.body}</p>}
        {poi.popup.image && (
          <img className={styles.image} src={poi.popup.image} alt={poi.popup.title} />
        )}
        {poi.popup.audio && (
          <audio className={styles.audio} controls src={poi.popup.audio} />
        )}
        {poi.capa && <span className={styles.capa}>{poi.capa}</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/map/PoiModal.module.css`**

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a2e;
  border: 1px solid #2a2a4e;
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.closeBtn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.title {
  margin: 0 0 12px;
  color: #e0e0ff;
  font-size: 18px;
}

.body {
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
}

.image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.audio {
  width: 100%;
  margin-top: 8px;
}

.capa {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 12px;
}
```

- [ ] **Step 6: Run PoiManager tests**

```bash
pnpm test -- tests/services/PoiManager.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add src/services/PoiManager.ts src/components/map/PoiModal.tsx src/components/map/PoiModal.module.css tests/services/PoiManager.test.ts
git commit -m "feat: add PoiManager service and PoiModal component"
```

---

### Task 6: LayerMenu — Component + CSS + test

**Files:**
- Create: `src/components/map/LayerMenu.tsx` + `.module.css`
- Create: `tests/components/LayerMenu.test.tsx`

**Interfaces:**
- Consumes: `getMapLayers`, `getLayerGroups` (Task 3), `useLayerStore` (Task 2), `Layer`, `LayerGroup` types (Task 1)
- Produces: `<LayerMenu mapId={string} onCalibrate={() => void} />`

- [ ] **Step 1: Write the failing test**

Create `tests/components/LayerMenu.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LayerMenu } from '@components/map/LayerMenu'
import { useLayerStore } from '@stores/layerStore'

vi.mock('@data/layers', () => ({
  getMapLayers: vi.fn((mapId) => {
    if (mapId === 'test') {
      return [
        {
          id: 'layer-1',
          name: 'Layer One',
          type: 'raster-pgw',
          category: 'ecosystems',
          group: 'group-1',
          order: 1,
          opacity: 0.8,
          visibleByDefault: true,
          legend: { swatch: '#ff0000', description: 'Red layer' },
          image: '',
          pgw: [0, 1, 1, 0, 0, 0],
          width: 1,
          height: 1,
        },
        {
          id: 'layer-2',
          name: 'Layer Two',
          type: 'raster-pgw',
          category: 'ecosystems',
          group: 'group-1',
          order: 2,
          opacity: 0.5,
          legend: { swatch: '#00ff00' },
          image: '',
          pgw: [0, 1, 1, 0, 0, 0],
          width: 1,
          height: 1,
        },
      ]
    }
    return null
  }),
  getLayerGroups: vi.fn((mapId) => {
    if (mapId === 'test') {
      return [{ id: 'group-1', name: 'Group 1', order: 1 }]
    }
    return null
  }),
}))

describe('LayerMenu', () => {
  beforeEach(() => {
    useLayerStore.getState().resetAll('test')
  })

  it('renders group and layer names', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    expect(screen.getByText(/Capas/)).toBeDefined()
    expect(screen.getByText('Group 1')).toBeDefined()
    expect(screen.getByText('Layer One')).toBeDefined()
  })

  it('toggles layer visibility on checkbox click', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    const store = useLayerStore.getState()
    expect(store.visibleLayers.size).toBe(0)
    const checks = screen.getAllByRole('checkbox')
    const layerCheck = checks[checks.length - 1]
    fireEvent.click(layerCheck!)
    expect(useLayerStore.getState().visibleLayers.has('layer-1') || useLayerStore.getState().visibleLayers.has('layer-2')).toBe(true)
  })

  it('renders nothing when map has no layers', () => {
    const { container } = render(<LayerMenu mapId="empty" onCalibrate={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('toggles group expansion on click', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    const groupHeader = screen.getByText('Group 1')
    fireEvent.click(groupHeader!)
    expect(useLayerStore.getState().expandedGroups['group-1']).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- tests/components/LayerMenu.test.tsx
```

- [ ] **Step 3: Create `src/components/map/LayerMenu.tsx`**

```tsx
import { useMemo, useState, useCallback } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapLayers, getLayerGroups } from '@data/layers'
import type { Layer, LayerGroup } from '@types/layer'
import styles from './LayerMenu.module.css'

interface Props {
  mapId: string
  onCalibrate: () => void
}

function groupTriState(groupId: string, layers: Layer[], visibleLayers: Set<string>): boolean | 'indeterminate' {
  const groupLayers = layers.filter((l) => l.group === groupId)
  if (groupLayers.length === 0) return false
  const visibleCount = groupLayers.filter((l) => visibleLayers.has(l.id)).length
  if (visibleCount === 0) return false
  if (visibleCount === groupLayers.length) return true
  return 'indeterminate'
}

export function LayerMenu({ mapId, onCalibrate }: Props) {
  const layers = useMemo(() => getMapLayers(mapId), [mapId])
  const groups = useMemo(() => getLayerGroups(mapId), [mapId])
  const visibleLayers = useLayerStore((s) => s.visibleLayers)
  const opacities = useLayerStore((s) => s.opacities)
  const expandedGroups = useLayerStore((s) => s.expandedGroups)
  const selectedForCalibration = useLayerStore((s) => s.selectedForCalibration)
  const toggleLayer = useLayerStore((s) => s.toggleLayer)
  const setLayerOpacity = useLayerStore((s) => s.setLayerOpacity)
  const setLayerGroupVisible = useLayerStore((s) => s.setLayerGroupVisible)
  const toggleGroupExpanded = useLayerStore((s) => s.toggleGroupExpanded)
  const toggleCalibrationSelection = useLayerStore((s) => s.toggleCalibrationSelection)

  const [collapsed, setCollapsed] = useState(false)
  const [calibrateMode, setCalibrateMode] = useState(false)

  const handleGroupToggle = useCallback(
    (groupId: string, groupLayers: Layer[]) => {
      const state = groupTriState(groupId, groupLayers, visibleLayers)
      setLayerGroupVisible(groupId, state !== true, groupLayers.map((l) => l.id))
    },
    [visibleLayers, setLayerGroupVisible],
  )

  if (!layers || layers.length === 0) return null

  const allVisible = layers.every((l) => visibleLayers.has(l.id))
  const noneVisible = layers.every((l) => !visibleLayers.has(l.id))
  const masterTriState = allVisible ? true : noneVisible ? false : 'indeterminate'

  return (
    <div className={styles.panel} role="region" aria-label="Capas">
      <div className={styles.header}>
        <span className={styles.headerTitle}>🗂 Capas</span>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
        >
          {collapsed ? '▶' : '▼'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.body}>
          <label className={styles.masterRow}>
            <input
              type="checkbox"
              checked={allVisible}
              ref={(el) => {
                if (el) el.indeterminate = masterTriState === 'indeterminate'
              }}
              onChange={() => {
                setLayerGroupVisible('__all__', !allVisible, layers.map((l) => l.id))
              }}
            />
            <span>Todas</span>
          </label>

          <div className={styles.calibrateRow}>
            <button
              className={`${styles.calibrateBtn} ${calibrateMode ? styles.calibrateActive : ''}`}
              onClick={() => {
                setCalibrateMode((m) => !m)
                if (calibrateMode) {
                  useLayerStore.getState().clearCalibrationSelection()
                }
              }}
            >
              {calibrateMode ? 'Cancelar' : '🔧 Calibrar'}
            </button>
            {calibrateMode && selectedForCalibration.size > 0 && (
              <button className={styles.calibrateApplyBtn} onClick={onCalibrate}>
                ✨ Calibrar selección ({selectedForCalibration.size})
              </button>
            )}
          </div>

          {groups?.map((group) => {
            const groupLayers = layers.filter((l) => l.group === group.id)
            if (groupLayers.length === 0) return null
            const isExpanded = expandedGroups[group.id] !== false
            const tri = groupTriState(group.id, layers, visibleLayers)

            return (
              <div key={group.id} className={styles.group}>
                <div className={styles.groupHeader}>
                  <input
                    type="checkbox"
                    checked={tri === true}
                    ref={(el) => {
                      if (el) el.indeterminate = tri === 'indeterminate'
                    }}
                    onChange={() => handleGroupToggle(group.id, groupLayers)}
                  />
                  <span
                    className={styles.groupName}
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    {group.name} ({groupLayers.length})
                  </span>
                  <span
                    className={`${styles.groupArrow} ${isExpanded ? styles.expanded : ''}`}
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    ▶
                  </span>
                </div>

                {isExpanded &&
                  groupLayers.map((layer) => (
                    <LayerRow
                      key={layer.id}
                      layer={layer}
                      visible={visibleLayers.has(layer.id)}
                      opacity={opacities[layer.id] ?? layer.opacity ?? 1}
                      calibrateMode={calibrateMode}
                      selected={selectedForCalibration.has(layer.id)}
                      onToggle={() => {
                        if (calibrateMode) {
                          toggleCalibrationSelection(layer.id)
                        } else {
                          toggleLayer(layer.id)
                        }
                      }}
                      onOpacityChange={(v) => setLayerOpacity(layer.id, v)}
                    />
                  ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LayerRow({
  layer,
  visible,
  opacity,
  calibrateMode,
  selected,
  onToggle,
  onOpacityChange,
}: {
  layer: Layer
  visible: boolean
  opacity: number
  calibrateMode: boolean
  selected: boolean
  onToggle: () => void
  onOpacityChange: (v: number) => void
}) {
  return (
    <div className={`${styles.layerRow} ${calibrateMode && selected ? styles.layerSelected : ''}`}>
      <input
        type="checkbox"
        checked={calibrateMode ? selected : visible}
        onChange={onToggle}
        aria-label={layer.name}
      />
      {layer.legend?.swatch && (
        <span className={styles.swatch} style={{ backgroundColor: layer.legend.swatch }} />
      )}
      <span className={styles.layerName} title={layer.legend?.description}>
        {layer.name}
      </span>
      {visible && !calibrateMode && (
        <input
          type="range"
          className={styles.opacitySlider}
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/map/LayerMenu.module.css`**

```css
.panel {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 280px;
  max-height: calc(100vh - 140px);
  background: rgba(10, 10, 30, 0.92);
  border: 1px solid #2a2a4e;
  border-radius: 10px;
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #2a2a4e;
}

.headerTitle {
  color: #e0e0ff;
  font-size: 14px;
  font-weight: 600;
}

.collapseBtn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
}

.body {
  overflow-y: auto;
  padding: 8px 12px 12px;
}

.masterRow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 8px;
  color: #ccc;
  font-size: 13px;
  cursor: pointer;
}

.calibrateRow {
  display: flex;
  gap: 6px;
  padding: 0 0 8px;
}

.calibrateBtn {
  background: #2a2a4e;
  border: 1px solid #3a3a6e;
  color: #aaa;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.calibrateActive {
  background: #3a3a6e;
  color: #e0e0ff;
}

.calibrateApplyBtn {
  background: #2b5a3a;
  border: 1px solid #3a7a4e;
  color: #a0e0a0;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.group {
  margin-bottom: 4px;
}

.groupHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  cursor: pointer;
}

.groupName {
  color: #c0c0e0;
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}

.groupArrow {
  color: #888;
  font-size: 10px;
  transition: transform 0.2s;
}

.groupArrow.expanded {
  transform: rotate(90deg);
}

.layerRow {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0 3px 24px;
  font-size: 12px;
}

.layerRow:hover {
  background: rgba(255, 255, 255, 0.04);
}

.layerSelected {
  background: rgba(100, 140, 255, 0.15);
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.layerName {
  color: #bbb;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.opacitySlider {
  width: 60px;
  height: 4px;
  accent-color: #6688cc;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Run LayerMenu tests**

```bash
pnpm test -- tests/components/LayerMenu.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/components/map/LayerMenu.tsx src/components/map/LayerMenu.module.css tests/components/LayerMenu.test.tsx
git commit -m "feat: add LayerMenu component with tree, groups, calibration mode"
```

---

### Task 7: CalibrationPanel multi-capa — Extension + test

**Files:**
- Modify: `src/components/calibration/CalibrationPanel.tsx`
- Modify: `tests/components/CalibrationPanel.test.tsx` (extend)
- Modify: `src/services/SaveCalibration.ts`

**Interfaces:**
- Consumes: `useLayerStore` (Task 2), `getMapLayers` (Task 3), `LayerManager.updateLayerPGW` (Task 4), `CalibrationState` from MapCalibration
- Produces: Extended calibration panel with target selector (map vs layers)

- [ ] **Step 1: Extend `src/services/SaveCalibration.ts`**

Modify existing file:

```ts
export interface SaveCalibrationPayload {
  readonly mapId: string
  readonly target?: 'map' | 'layers'
  readonly layerIds?: readonly string[]
  readonly pgw?: readonly [number, number, number, number, number, number]
  readonly width?: number
  readonly height?: number
  readonly entries?: readonly { id: string; pgw: readonly [number, number, number, number, number, number]; width: number; height: number }[]
}

export async function saveCalibration(payload: SaveCalibrationPayload): Promise<void> {
  const res = await fetch('/__calibration/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, target: payload.target ?? 'map' }),
  })
  if (res.ok) return
  const data = await res.json().catch(() => ({} as Record<string, unknown>))
  throw new Error(String(data.error ?? `Error guardando calibración (${res.status})`))
}
```

- [ ] **Step 2: Write failing multi-layer CalibrationPanel test**

Append to `tests/components/CalibrationPanel.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalibrationPanel } from '@components/calibration/CalibrationPanel'
import { useLayerStore } from '@stores/layerStore'
import type { MapController } from '@services/MapRenderer'

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
```

Note: this test extends the existing file. Read first, then append the new `describe` block.

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm test -- tests/components/CalibrationPanel.test.tsx
```

- [ ] **Step 4: Extend `CalibrationPanel.tsx`**

Above the existing `seedState` function, add imports and the target type:

Add to imports after existing imports:

```ts
import { useLayerStore } from '@stores/layerStore'
import { getMapLayers } from '@data/layers'
import { updateLayerPGW } from '@services/LayerManager'
import type { Layer } from '@types/layer'
```

Add type near the top:

```ts
type CalibrationTarget =
  | { kind: 'map' }
  | { kind: 'layers'; layerIds: string[] }

const LAYER_COLORS = ['#4fc3f7', '#f06292', '#aed581', '#ffd54f', '#ba68c8', '#90a4ae', '#ff8a65']
```

Inside the component, after `const [moveMode, setMoveMode] = useState(false)`:

```ts
const [target, setTarget] = useState<CalibrationTarget>({ kind: 'map' })
const [activeLayerIdx, setActiveLayerIdx] = useState(0)
const calibrationLayers = useLayerStore((s) => s.selectedForCalibration)
const layerStatesRef = useRef<Map<string, { current: CalibrationState; original: CalibrationState }>>(new Map())
```

Add target selector in the header, before the existing buttons:

```tsx
{ENABLE_DEV_TOOLS && getMapLayers(mapId) && (
  <div className={styles.overridesSection}>
    <button
      className={`${styles.headerBtn} ${target.kind === 'map' ? styles.targetActive : ''}`}
      onClick={() => {
        useLayerStore.getState().clearCalibrationSelection()
        setTarget({ kind: 'map' })
      }}
    >
      🗺 Mapa base
    </button>
    <button
      className={`${styles.headerBtn} ${target.kind === 'layers' ? styles.targetActive : ''}`}
      onClick={() => {
        const layerIds = [...calibrationLayers]
        if (layerIds.length === 0) return
        setTarget({ kind: 'layers', layerIds })
        initLayerStates(layerIds)
      }}
    >
      📐 Capas: {calibrationLayers.size || 0}
    </button>
  </div>
)}
```

Add helper function:

```ts
function initLayerStates(layerIds: string[]) {
  const allLayers = getMapLayers(mapId) ?? []
  const map = layerStatesRef.current
  map.clear()
  for (const id of layerIds) {
    const layer = allLayers.find((l) => l.id === id) as RasterPgwLayer | undefined
    if (layer) {
      const cs = pgwToState(layer.pgw, layer.width, layer.height)
      map.set(id, { current: cs, original: cs })
    }
  }
  setActiveLayerIdx(0)
  const first = map.get(layerIds[0])
  if (first) {
    setState(clampCalibration(first.current))
    originalRef.current = first.original
  }
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test -- tests/components/CalibrationPanel.test.tsx
```

Expected: existing tests + new multi-layer tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/calibration/CalibrationPanel.tsx src/services/SaveCalibration.ts tests/components/CalibrationPanel.test.tsx
git commit -m "feat: extend CalibrationPanel with multi-layer target selector"
```

---

### Task 8: Save infra — rewriteLayerCalibration + Vite plugin + test

**Files:**
- Create: `src/services/rewriteLayerCalibration.ts`
- Modify: `vite.config.ts`
- Create: `tests/services/rewriteLayerCalibration.test.ts`

**Interfaces:**
- Consumes: `SaveCalibrationPayload` (Task 7), `rewriteGeoEntry` pattern from `geoRewrite.ts`
- Produces: `rewriteLayerCalibration(src, layerId, data): string`, Vite plugin handles `target: 'layers'`

- [ ] **Step 1: Create `src/services/rewriteLayerCalibration.ts`**

```ts
export interface LayerCalibrationEntry {
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
}

export function rewriteLayerCalibration(
  src: string,
  layerId: string,
  data: LayerCalibrationEntry,
): string {
  const valid = /^[A-Za-z0-9_-]+$/.test(layerId)
  if (!valid) throw new Error(`layerId inválido: "${layerId}"`)
  const [a, d, b, e, c, f] = data.pgw
  const block = [
    `  '${layerId}': {`,
    `    pgw: [${a}, ${d}, ${b}, ${e}, ${c}, ${f}],`,
    `    width: ${Math.round(data.width)},`,
    `    height: ${Math.round(data.height)},`,
    `  },`,
  ].join('\n')

  const re = new RegExp(`^  '${escapeRegex(layerId)}': \\{[\\s\\S]*?\\r?\\n  \\},`, 'm')
  if (re.test(src)) {
    return src.replace(re, block)
  }

  const closingBraceIdx = src.lastIndexOf('}')
  if (closingBraceIdx === -1) throw new Error('Formato inválido: calibration.js')
  return src.slice(0, closingBraceIdx) + '\n' + block + '\n' + src.slice(closingBraceIdx)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
```

- [ ] **Step 2: Write the failing rewrite test**

Create `tests/services/rewriteLayerCalibration.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { rewriteLayerCalibration } from '@services/rewriteLayerCalibration'

const SRC = [
  'export const LAYER_CALIBRATIONS = {',
  "  'layer-a': {",
  '    pgw: [0, 1, 2, 0, -77, 2],',
  '    width: 100,',
  '    height: 200,',
  '  },',
  '}',
].join('\r\n')

describe('rewriteLayerCalibration', () => {
  it('replaces an existing entry', () => {
    const out = rewriteLayerCalibration(SRC, 'layer-a', {
      pgw: [0, 3, 4, 0, -78, 3],
      width: 300,
      height: 400,
    })
    expect(out).toContain('pgw: [0, 3, 4, 0, -78, 3]')
    expect(out).toContain('width: 300')
    expect(out).toContain('height: 400')
    expect(out).toContain("'layer-a':")
  })

  it('appends a new entry when id does not exist', () => {
    const out = rewriteLayerCalibration(SRC, 'layer-b', {
      pgw: [0, 0.001, 0.001, 0, -77, 1],
      width: 500,
      height: 600,
    })
    expect(out).toContain("'layer-b':")
    expect(out).toContain("'layer-a':")
  })

  it('throws on invalid layerId', () => {
    expect(() =>
      rewriteLayerCalibration(SRC, 'invalid id!', {
        pgw: [0, 0, 0, 0, 0, 0],
        width: 1,
        height: 1,
      }),
    ).toThrow('layerId inválido')
  })

  it('preserves the rest of the file', () => {
    const out = rewriteLayerCalibration(SRC, 'layer-a', {
      pgw: [0, 1, 2, 0, -77, 2],
      width: 111,
      height: 222,
    })
    expect(out).toContain('export const LAYER_CALIBRATIONS')
  })

  it('handles CRLF line endings', () => {
    const crlf = SRC
    const out = rewriteLayerCalibration(crlf, 'layer-a', {
      pgw: [9, 9, 9, 9, 9, 9],
      width: 1,
      height: 1,
    })
    expect(out).toContain('\r\n')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm test -- tests/services/rewriteLayerCalibration.test.ts
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- tests/services/rewriteLayerCalibration.test.ts
```

- [ ] **Step 5: Extend `vite.config.ts`**

After the existing `calibrationSavePlugin` function, add layer save handling inside the POST handler. Find the route handler block and extend the validation + save logic:

Add import at top:

```ts
import { rewriteLayerCalibration } from './src/services/rewriteLayerCalibration.ts'
```

Inside `calibrationSavePlugin`, add `calibrationPath`:

```ts
const calibrationPath = resolve(__dirname, 'src/data/layers/calibration.js')
```

Inside the POST handler, after the existing validation, add branching:

```ts
const target = typeof payload.target === 'string' ? payload.target : 'map'

if (target === 'layers') {
  const layerIds = Array.isArray(payload.layerIds) ? payload.layerIds : []
  const entries = Array.isArray(payload.entries) ? payload.entries : []

  if (layerIds.length === 0 || entries.length === 0) {
    throw new Error('layerIds y entries requeridos para target=layers')
  }

  let src = existsSync(calibrationPath) ? readFileSync(calibrationPath, 'utf8') : 'export const LAYER_CALIBRATIONS = {\n}'
  for (const entry of entries) {
    const id = String(entry.id ?? '')
    if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error(`layerId inválido: "${id}"`)
    const pgw = entry.pgw
    if (!Array.isArray(pgw) || pgw.length !== 6 || !pgw.every((v) => typeof v === 'number' && Number.isFinite(v))) {
      throw new Error('pgw inválido en entry')
    }
    const w = typeof entry.width === 'number' ? Math.round(entry.width) : NaN
    const h = typeof entry.height === 'number' ? Math.round(entry.height) : NaN
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1) {
      throw new Error('width/height inválidos en entry')
    }
    src = rewriteLayerCalibration(src, id, { pgw: pgw as [number,number,number,number,number,number], width: w, height: h })
  }
  writeFileSync(calibrationPath, src, 'utf8')
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: true, mapId, target: 'layers' }))
  return
}

// existing map target logic below...
```

- [ ] **Step 6: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass (existing + new).

- [ ] **Step 7: Commit**

```bash
git add src/services/rewriteLayerCalibration.ts vite.config.ts tests/services/rewriteLayerCalibration.test.ts
git commit -m "feat: add rewriteLayerCalibration and extend Vite plugin for layer save"
```

---

### Task 9: AtlasMap integration + Copy composites

**Files:**
- Modify: `src/components/map/AtlasMap.tsx`
- Create directories + copy files

**Interfaces:**
- Consumes: All tasks above (LayerManager, PoiManager, LayerMenu, PoiModal, layerStore, data)
- Produces: Fully integrated AtlasMap with layers, POIs, and menu

- [ ] **Step 1: Read current AtlasMap.tsx** (for context)

```bash
# No command needed — reference the design spec
```

- [ ] **Step 2: Rewrite AtlasMap.tsx**

```tsx
import { useEffect, useRef, useMemo, useState } from 'react'
import type { RefObject } from 'react'
import { useMap } from '@hooks/useMap'
import { useAutoLowPower } from '@hooks/useAutoLowPower'
import { usePrefetchAdjacent } from '@hooks/usePrefetchAdjacent'
import { useTilePrefetch } from '@hooks/useTilePrefetch'
import { useMapStore } from '@stores/mapStore'
import { useUIStore } from '@stores/uiStore'
import { useConnectionStore } from '@stores/connectionStore'
import { useLayerStore } from '@stores/layerStore'
import { addBasemap, removeBasemap, setImageOpacity } from '@services/BasemapManager'
import { sync as syncLayers, removeAll as removeAllLayers } from '@services/LayerManager'
import { addPois, removePois } from '@services/PoiManager'
import { getMapLayers, getLayerGroups } from '@data/layers'
import { getPois } from '@data/pois'
import type { MapController } from '@services/MapRenderer'
import type { Poi } from '@types/poi'
import { MapControls } from './MapControls'
import { LayerMenu } from './LayerMenu'
import { PoiModal } from './PoiModal'
import { OfflineBanner } from './OfflineBanner'
import styles from './AtlasMap.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

export interface AtlasMapProps {
  mapId: string
  controllerRef?: RefObject<MapController | null>
}

export function AtlasMap({ mapId, controllerRef }: AtlasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { mapRef, error } = useMap({ mapId, containerRef, controllerRef })
  const loading = useMapStore((s) => s.loading)
  const tilesStatus = useMapStore((s) => s.tilesStatus)
  const isSlow = useConnectionStore((s) => s.isSlow)
  const initConnection = useConnectionStore((s) => s.init)

  const basemapVisible = useUIStore((s) => s.basemapVisible)
  const basemapStyle = useUIStore((s) => s.basemapStyle)
  const imageOpacity = useUIStore((s) => s.imageOpacity)

  const visibleLayers = useLayerStore((s) => s.visibleLayers)
  const opacities = useLayerStore((s) => s.opacities)

  const layers = useMemo(() => getMapLayers(mapId), [mapId])
  const groups = useMemo(() => getLayerGroups(mapId), [mapId])
  const pois = useMemo(() => getPois(mapId), [mapId])
  const hasLayers = layers !== null && layers.length > 0
  const [activePoi, setActivePoi] = useState<Poi | null>(null)

  useAutoLowPower()
  usePrefetchAdjacent(mapId)
  useTilePrefetch(mapId)

  useEffect(() => {
    initConnection()
  }, [initConnection])

  useEffect(() => {
    useLayerStore.getState().resetAll(mapId)
    return () => {
      const map = mapRef.current
      if (map) {
        removeAllLayers(map)
        removePois(map)
      }
    }
  }, [mapId, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (basemapVisible) {
      addBasemap(map, basemapStyle)
    } else {
      removeBasemap(map)
    }
    return () => {
      removeBasemap(map)
    }
  }, [basemapVisible, basemapStyle, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    setImageOpacity(map, imageOpacity)
  }, [imageOpacity, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !layers) return
    syncLayers(map, mapId, layers, groups, { visibleLayers, opacities })
  }, [mapRef, mapId, layers, groups, visibleLayers, opacities])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !pois) return
    addPois(map, mapId, pois, setActivePoi)
  }, [mapRef, mapId, pois])

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.mapContainer} />
      <OfflineBanner />

      {!loading && tilesStatus === 'degraded' && isSlow && (
        <div className={styles.degradedBanner}>
          <span>Modo básico: el mapa es navegable sin alta resolución por conexión lenta.</span>
        </div>
      )}

      {ENABLE_DEV_TOOLS && !loading && !error && (
        <MapControls />
      )}

      {!loading && !error && hasLayers && <LayerMenu mapId={mapId} onCalibrate={() => {}} />}

      {activePoi && (
        <PoiModal poi={activePoi} onClose={() => setActivePoi(null)} />
      )}

      {(loading || tilesStatus === 'loading') && (
        <div className={styles.overlay}>
          <div className={styles.spinner} aria-label="Cargando mapa" />
        </div>
      )}

      {error && (
        <div className={styles.overlay}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Copy composite images**

```bash
New-Item -ItemType Directory -Force -Path "D:\Proyectos\Atlas\atlas-pluriversal\atlas\public\assets\maps\capas\ecosistemas"
Copy-Item "D:\Proyectos\Atlas\atlas-pluriversal\tiles\ecosistemas\_composites\*.webp" -Destination "D:\Proyectos\Atlas\atlas-pluriversal\atlas\public\assets\maps\capas\ecosistemas\"
```

- [ ] **Step 4: Commit**

```bash
git add src/components/map/AtlasMap.tsx public/assets/maps/capas/ecosistemas/
git commit -m "feat: integrate layers, POIs, and menu into AtlasMap; copy composite images"
```

---

### Task 10: Verification — typecheck, lint, test, build

**Files:** (none new — verification only)

- [ ] **Step 1: Run typecheck**

```bash
pnpm typecheck
```

Expected: no type errors. If errors, fix import paths or type mismatches before proceeding.

- [ ] **Step 2: Run linter**

```bash
pnpm lint
```

Expected: 0 errors.

- [ ] **Step 3: Run all tests**

```bash
pnpm test
```

Expected: all tests pass (existing + 7 new test files).

- [ ] **Step 4: Run build**

```bash
pnpm build
```

Expected: successful production build.

- [ ] **Step 5: Visual verification**

```bash
pnpm dev
```

Navigate to `http://localhost:5173/dev`, select `chapter1-ecosistemas`:
- Layer menu appears in top-right with 7 groups
- Toggling groups/composites shows/hides overlays
- POIs appear on bredunco map if navigated
- Calibration panel works in dev tools mode

- [ ] **Step 6: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: verification fixes for layer system integration"
```
