import { create } from 'zustand'
import type { BasemapStyle } from '@services/BasemapManager.ts'

export interface UIStoreState {
  activeModal: unknown
  sidebarOpen: boolean
  activePanel: string | null

  basemapVisible: boolean
  basemapStyle: BasemapStyle
  imageOpacity: number
  tilesVisible: boolean

  lowPowerMode: boolean

  openModal: (modal: unknown) => void
  closeModal: () => void
  toggleSidebar: () => void
  setActivePanel: (panel: string | null) => void

  toggleBasemap: () => void
  setBasemapStyle: (style: BasemapStyle) => void
  setImageOpacity: (opacity: number) => void
  toggleTiles: () => void
  toggleLowPowerMode: () => void
  setLowPowerMode: (on: boolean) => void
}

const isLowPowerDevice =
  typeof navigator !== 'undefined' &&
  (navigator.hardwareConcurrency != null ? navigator.hardwareConcurrency <= 4 : false)

// `navigator.connection` no forma parte de los tipos DOM estándar.
interface NavigatorWithConnection extends Navigator {
  connection?: { effectiveType?: string }
}

const isSlowConnection = () => {
  if (typeof navigator === 'undefined') return false
  const conn = (navigator as NavigatorWithConnection).connection
  return conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g'
}

export const useUIStore = create<UIStoreState>()((set) => ({
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
