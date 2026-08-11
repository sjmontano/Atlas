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

export const useLayerStore = create((set, _get) => ({
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
