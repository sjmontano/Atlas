import { create } from 'zustand'

export const useLayerStore = create((set) => ({
  visibleLayers: new Set(),
  opacities: {},
  activeCategories: new Set(),

  toggleLayer: (layerId) =>
    set((state) => {
      const next = new Set(state.visibleLayers)
      if (next.has(layerId)) {
        next.delete(layerId)
      } else {
        next.add(layerId)
      }
      return { visibleLayers: next }
    }),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      opacities: { ...state.opacities, [layerId]: opacity },
    })),

  setActiveCategories: (categories) => set({ activeCategories: new Set(categories) }),
}))
