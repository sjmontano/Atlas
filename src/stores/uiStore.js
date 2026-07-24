import { create } from 'zustand'

export const useUIStore = create((set) => ({
  activeModal: null,
  sidebarOpen: false,
  activePanel: null,

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setActivePanel: (panel) => set({ activePanel: panel }),
}))
