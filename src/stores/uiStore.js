import { create } from 'zustand'

const isLowPowerDevice =
  typeof navigator !== 'undefined' &&
  (navigator.hardwareConcurrency != null ? navigator.hardwareConcurrency <= 4 : false)

const isSlowConnection = () => {
  if (typeof navigator === 'undefined') return false
  const conn = navigator.connection
  return conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g'
}

export const useUIStore = create((set) => ({
  activeModal: null,
  sidebarOpen: false,
  activePanel: null,

  basemapVisible: false,
  basemapStyle: 'light',
  imageOpacity: 1,
  tilesVisible: true,

  lowPowerMode: isLowPowerDevice || isSlowConnection(),

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActivePanel: (panel) => set({ activePanel: panel }),

  toggleBasemap: () => set((s) => ({ basemapVisible: !s.basemapVisible })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
  toggleTiles: () => set((s) => ({ tilesVisible: !s.tilesVisible })),
  toggleLowPowerMode: () => set((s) => ({ lowPowerMode: !s.lowPowerMode })),
  setLowPowerMode: (on) => set({ lowPowerMode: on }),
}))
