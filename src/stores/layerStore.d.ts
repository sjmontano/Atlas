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

export const useLayerStore: {
  (): LayerStoreState
  getState: () => LayerStoreState
  subscribe: (listener: (state: LayerStoreState) => void) => () => void
}
