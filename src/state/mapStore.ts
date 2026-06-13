/**
 * 🗺️ MAP STORE — Estado del motor cartográfico
 * ================================================
 * - qué mapa está activo
 * - flags de estado (mapBuilt, loading)
 * - NO contiene mapInstance (va en MapContext como ref)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useLayersStore } from "./layersStore";

interface MapStore {
  /** ID del mapa activo */
  activeMapId: string;
  /** El mapa terminó de construirse (la imagen geo está visible) */
  mapBuilt: boolean;
  /** Cargando configuración o dimensiones */
  loading: boolean;
  /** Error de inicialización, null si todo OK */
  error: string | null;

  // ─── Acciones ────────────────────────────────────────────────────────────
  setActiveMap: (mapId: string) => void;
  setMapBuilt: (built: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMapStore = create<MapStore>()(
  devtools(
    (set) => ({
      activeMapId: "intro",
      mapBuilt: false,
      loading: false,
      error: null,

      setActiveMap: (mapId) =>
        set(
          (s) => {
            const layersStore = useLayersStore.getState();
            layersStore.persistCurrentMapState();
            layersStore.setCurrentMap(mapId);
            layersStore.applyMapProfile(mapId);
            return { ...s, activeMapId: mapId, mapBuilt: false, error: null };
          },
          false,
          "SetActiveMap",
        ),
      setMapBuilt: (built) => set({ mapBuilt: built }, false, "SetMapBuilt"),
      setLoading: (loading) => set({ loading }, false, "SetLoading"),
      setError: (error) => set({ error }, false, "SetError"),
    }),
    { name: "MapStore" },
  ),
);
