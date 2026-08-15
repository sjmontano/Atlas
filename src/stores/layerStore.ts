import { create } from 'zustand'

export interface LayerStoreState {
  visibleLayers: Set<string>
  opacities: Record<string, number>
  activeCategories: Set<string>
  expandedGroups: Record<string, boolean>
  toggleLayer: (layerId: string) => void
  setLayerOpacity: (layerId: string, opacity: number) => void
  setLayerGroupVisible: (groupId: string, visible: boolean, layerIds: string[]) => void
  setActiveCategories: (categories: string[]) => void
  toggleGroupExpanded: (groupId: string) => void
  resetAll: (mapId: string) => void
}

const STORAGE_PREFIX = 'atlas:layers:'

let currentMapId: string | null = null
let unsub: (() => void) | null = null

function loadPersisted(mapId: string): { v: string[]; o: Record<string, number> } {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + mapId)
    if (!raw) return { v: [], o: {} }
    const data = JSON.parse(raw) as { v?: string[]; o?: Record<string, number> }
    return { v: data.v ?? [], o: data.o ?? {} }
  } catch {
    return { v: [], o: {} }
  }
}

function persist(state: LayerStoreState, mapId: string | null): void {
  if (!mapId) return
  const payload = { v: [...state.visibleLayers], o: { ...state.opacities } }
  localStorage.setItem(STORAGE_PREFIX + mapId, JSON.stringify(payload))
}

export const useLayerStore = create<LayerStoreState>()((set) => ({
  visibleLayers: new Set<string>(),
  opacities: {},
  activeCategories: new Set<string>(),
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

  setLayerGroupVisible: (_groupId, visible, layerIds) =>
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

  toggleGroupExpanded: (groupId) =>
    set((state) => ({
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: !state.expandedGroups[groupId],
      },
    })),

  resetAll: (mapId) => {
    if (unsub) {
      unsub()
      unsub = null
    }
    currentMapId = mapId
    const persisted = loadPersisted(mapId)
    set({
      visibleLayers: new Set(persisted.v),
      opacities: persisted.o,
      activeCategories: new Set<string>(),
      expandedGroups: {},
    })
    unsub = useLayerStore.subscribe((state) => {
      persist(state, currentMapId)
    })
  },
}))
