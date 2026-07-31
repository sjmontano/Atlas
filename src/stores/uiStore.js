import { create } from 'zustand'

export const useUIStore = create((set) => ({
  activeModal: null,
  sidebarOpen: false,
  activePanel: null,

  basemapVisible: false,
  basemapStyle: 'light' ,
  imageOpacity: 1,

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActivePanel: (panel) => set({ activePanel: panel }),

  toggleBasemap: () => set((s) => ({ basemapVisible: !s.basemapVisible })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  setImageOpacity: (opacity) => set({ imageOpacity: opacity }),
}))
