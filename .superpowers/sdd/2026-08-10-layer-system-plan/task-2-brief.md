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


