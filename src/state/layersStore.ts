/**
 * 🧱 LAYERS STORE — Estado de capas vectoriales
 * =================================================
 * - qué capas están visibles
 * - opacidades por capa
 * - toggle masivo por categoría
 *
 * Regla: LayerManager (que actúa sobre MapLibre) observa este store
 * en useMapLayers y sincroniza el estado visual.
 */

import {
  getChapterLayerPreset,
  getMapLayerProfile,
  validateMapLayerProfiles,
} from "@layers/config/mapLayerProfiles";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const LAYERS_MAP_OVERRIDES_STORAGE_KEY = "atlas.layers.map-overrides.v2";

type LayerMapOverride = {
  visibleLayerIds: string[];
  opacities: Record<string, number>;
};

type LayerMapOverrides = Record<string, LayerMapOverride>;

const loadMapOverridesFromStorage = (): LayerMapOverrides => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LAYERS_MAP_OVERRIDES_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as LayerMapOverrides;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
};

const persistMapOverridesToStorage = (mapOverrides: LayerMapOverrides) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      LAYERS_MAP_OVERRIDES_STORAGE_KEY,
      JSON.stringify(mapOverrides),
    );
  } catch {
    // Si localStorage falla (quota/privacy), mantenemos funcionamiento en memoria.
  }
};

const INITIAL_MAP_ID = "intro";
const initialProfile = getMapLayerProfile(INITIAL_MAP_ID);
const initialChapterPreset = getChapterLayerPreset(1);
const initialMapOverrides = loadMapOverridesFromStorage();
const initialMapOverride = initialMapOverrides[INITIAL_MAP_ID];
const initialAssociatedLayers = new Set(
  initialProfile?.associatedLayerIds ?? [],
);
const initialVisibleLayers = initialMapOverride
  ? initialMapOverride.visibleLayerIds.filter((layerId) =>
    initialAssociatedLayers.has(layerId),
  )
  : (initialProfile?.defaultVisibleLayerIds ?? []);
const initialOverrideOpacities = Object.entries(
  initialMapOverride?.opacities ?? {},
).reduce<Record<string, number>>((acc, [layerId, value]) => {
  if (initialAssociatedLayers.has(layerId)) {
    acc[layerId] = value;
  }
  return acc;
}, {});
const profileValidation = validateMapLayerProfiles();

if (!profileValidation.valid) {
  console.warn(
    "[LayersStore] Se encontraron inconsistencias en perfiles de capas:",
    profileValidation.errors,
  );
}

interface LayersStore {
  currentMapId: string;
  visibleLayers: Set<string>;
  opacities: Record<string, number>;
  activeCategories: Set<string>;
  mapOverrides: LayerMapOverrides;

  // ─── Acciones ────────────────────────────────────────────────────────────
  setCurrentMap: (mapId: string) => void;
  persistCurrentMapState: () => void;
  toggleLayer: (layerId: string) => void;
  showLayer: (layerId: string) => void;
  hideLayer: (layerId: string) => void;
  setLayersVisibility: (layerIds: string[], visible: boolean) => void;
  setOpacity: (layerId: string, opacity: number) => void;
  toggleCategory: (category: string) => void;
  resetLayers: () => void;
  applyChapterDefaults: (chapter: number) => void;
  applyMapProfile: (mapId: string) => void;
}

export const useLayersStore = create<LayersStore>()(
  devtools(
    (set, get) => ({
      currentMapId: INITIAL_MAP_ID,
      visibleLayers: new Set(initialVisibleLayers),
      opacities: {
        ...(initialProfile?.defaultOpacities ?? {}),
        ...initialOverrideOpacities,
      },
      activeCategories: new Set(initialChapterPreset?.activeCategories ?? []),
      mapOverrides: initialMapOverrides,

      setCurrentMap: (mapId) =>
        set({ currentMapId: mapId }, false, "SetCurrentMap"),

      persistCurrentMapState: () => {
        const { currentMapId, visibleLayers, opacities, mapOverrides } = get();

        if (!currentMapId) {
          return;
        }

        const nextOverrides = {
          ...mapOverrides,
          [currentMapId]: {
            visibleLayerIds: Array.from(visibleLayers),
            opacities: { ...opacities },
          },
        };

        persistMapOverridesToStorage(nextOverrides);

        set(
          {
            mapOverrides: nextOverrides,
          },
          false,
          "PersistCurrentMapState",
        );
      },

      toggleLayer: (layerId) =>
        set(
          (s) => {
            const next = new Set(s.visibleLayers);
            if (next.has(layerId)) {
              next.delete(layerId);
            } else {
              next.add(layerId);
            }
            const nextOverrides = {
              ...s.mapOverrides,
              [s.currentMapId]: {
                visibleLayerIds: Array.from(next),
                opacities: { ...s.opacities },
              },
            };
            persistMapOverridesToStorage(nextOverrides);
            return { visibleLayers: next, mapOverrides: nextOverrides };
          },
          false,
          "ToggleLayer",
        ),

      setLayersVisibility: (layerIds, visible) => {
        if (layerIds.length === 0) {
          return;
        }

        set(
          (s) => {
            const uniqueIds = new Set(layerIds);
            const nextVisibleLayers = new Set(s.visibleLayers);

            uniqueIds.forEach((layerId) => {
              if (visible) {
                nextVisibleLayers.add(layerId);
              } else {
                nextVisibleLayers.delete(layerId);
              }
            });

            const nextOverrides = {
              ...s.mapOverrides,
              [s.currentMapId]: {
                visibleLayerIds: Array.from(nextVisibleLayers),
                opacities: { ...s.opacities },
              },
            };

            persistMapOverridesToStorage(nextOverrides);

            return {
              visibleLayers: nextVisibleLayers,
              mapOverrides: nextOverrides,
            };
          },
          false,
          visible ? "ShowLayersBulk" : "HideLayersBulk",
        );
      },

      showLayer: (layerId) => get().setLayersVisibility([layerId], true),

      hideLayer: (layerId) => get().setLayersVisibility([layerId], false),

      setOpacity: (layerId, opacity) =>
        set(
          (s) => {
            const nextOpacities = { ...s.opacities, [layerId]: opacity };
            const nextOverrides = {
              ...s.mapOverrides,
              [s.currentMapId]: {
                visibleLayerIds: Array.from(s.visibleLayers),
                opacities: nextOpacities,
              },
            };
            persistMapOverridesToStorage(nextOverrides);

            return { opacities: nextOpacities, mapOverrides: nextOverrides };
          },
          false,
          "SetOpacity",
        ),

      toggleCategory: (category) =>
        set(
          (s) => {
            const next = new Set(s.activeCategories);
            if (next.has(category)) {
              next.delete(category);
            } else {
              next.add(category);
            }
            return { activeCategories: next };
          },
          false,
          "ToggleCategory",
        ),

      resetLayers: () =>
        (() => {
          persistMapOverridesToStorage({});
          set(
            {
              currentMapId: INITIAL_MAP_ID,
              visibleLayers: new Set(),
              opacities: {},
              activeCategories: new Set(),
              mapOverrides: {},
            },
            false,
            "ResetLayers",
          );
        })(),

      applyMapProfile: (mapId) => {
        const profile = getMapLayerProfile(mapId);

        if (!profile) {
          return;
        }

        const associatedLayerIds = new Set(profile.associatedLayerIds);
        const mapOverride = get().mapOverrides[mapId];
        const visibleLayerIds = mapOverride
          ? mapOverride.visibleLayerIds.filter((layerId) =>
            associatedLayerIds.has(layerId),
          )
          : profile.defaultVisibleLayerIds;

        const opacitiesFromOverride = Object.entries(
          mapOverride?.opacities ?? {},
        ).reduce<Record<string, number>>((acc, [layerId, value]) => {
          if (associatedLayerIds.has(layerId)) {
            acc[layerId] = value;
          }
          return acc;
        }, {});

        set(
          (s) => ({
            visibleLayers: new Set(visibleLayerIds),
            opacities: {
              ...(profile.defaultOpacities ?? {}),
              ...opacitiesFromOverride,
            },
            activeCategories: new Set(
              profile.activeCategories ?? Array.from(s.activeCategories),
            ),
          }),
          false,
          "ApplyMapProfile",
        );
      },

      /**
       * Aplica las capas por defecto de un capítulo.
       * Llama directamente a getState() desde chaptersStore (coordinación entre stores).
       */
      applyChapterDefaults: (chapter) => {
        const preset = getChapterLayerPreset(chapter);

        if (!preset) {
          get().resetLayers();
          return;
        }

        set(
          {
            visibleLayers: new Set(),
            opacities: {},
            activeCategories: new Set(preset.activeCategories),
          },
          false,
          "ApplyChapterDefaults",
        );
      },
    }),
    { name: "LayersStore" },
  ),
);
