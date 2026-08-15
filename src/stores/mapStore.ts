import { create } from 'zustand'

export type TilesStatus = 'idle' | 'loading' | 'degraded' | 'ready'

export interface MapStoreState {
  activeMapId: string
  mapBuilt: boolean
  loading: boolean
  error: string | null
  tilesStatus: TilesStatus
  setActiveMap: (mapId: string) => void
  setMapBuilt: (built: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTilesStatus: (tilesStatus: TilesStatus) => void
}

export const useMapStore = create<MapStoreState>()((set) => ({
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
