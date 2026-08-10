import { create } from 'zustand'

export const useMapStore = create((set) => ({
  activeMapId: 'intro',
  mapBuilt: false,
  loading: false,
  error: null,
  tilesStatus: 'idle',

  setActiveMap: (mapId) => set({ activeMapId: mapId, mapBuilt: false, error: null, tilesStatus: 'idle' }),
  setMapBuilt: (built) => set({ mapBuilt: built }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTilesStatus: (tilesStatus) => set({ tilesStatus }),
}))
