import { describe, expect, it, vi } from "vitest";

const INTRO_BASE_LAYER_ID = "6876a614f322d4b584cf33af";
const INTRO_EXTRA_LAYER_ID = "68714a0576fa85909c374677";
const SUAREZ_LAYER_ID = "67a3a0e748b33083a42f2a22";

const importFreshStores = async () => {
  vi.resetModules();
  const layersModule = await import("@state/layersStore");
  const mapModule = await import("@state/mapStore");

  return {
    useLayersStore: layersModule.useLayersStore,
    useMapStore: mapModule.useMapStore,
    storageKey: layersModule.LAYERS_MAP_OVERRIDES_STORAGE_KEY,
  };
};

describe("LayersStore map overrides", () => {
  it("persiste overrides en localStorage al cambiar visibilidad/opacidad", async () => {
    const { useLayersStore, storageKey } = await importFreshStores();

    useLayersStore.getState().showLayer(INTRO_EXTRA_LAYER_ID);
    useLayersStore.getState().setOpacity(INTRO_EXTRA_LAYER_ID, 0.42);

    const raw = window.localStorage.getItem(storageKey);
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw ?? "{}");
    expect(persisted.intro).toBeDefined();
    expect(persisted.intro.visibleLayerIds).toContain(INTRO_EXTRA_LAYER_ID);
    expect(persisted.intro.opacities[INTRO_EXTRA_LAYER_ID]).toBe(0.42);
  });

  it("restaura estado personalizado por mapa al volver", async () => {
    const { useLayersStore, useMapStore } = await importFreshStores();

    useLayersStore.getState().showLayer(INTRO_EXTRA_LAYER_ID);
    useLayersStore.getState().setOpacity(INTRO_EXTRA_LAYER_ID, 0.66);

    useMapStore.getState().setActiveMap("chapter2-suarez");
    expect(useLayersStore.getState().visibleLayers.has(SUAREZ_LAYER_ID)).toBe(
      true,
    );

    useLayersStore.getState().hideLayer(SUAREZ_LAYER_ID);
    useMapStore.getState().setActiveMap("intro");

    const introState = useLayersStore.getState();
    expect(introState.visibleLayers.has(INTRO_BASE_LAYER_ID)).toBe(true);
    expect(introState.visibleLayers.has(INTRO_EXTRA_LAYER_ID)).toBe(true);
    expect(introState.opacities[INTRO_EXTRA_LAYER_ID]).toBe(0.66);

    useMapStore.getState().setActiveMap("chapter2-suarez");
    expect(useLayersStore.getState().visibleLayers.has(SUAREZ_LAYER_ID)).toBe(
      false,
    );
  });

  it("hidrata overrides desde localStorage al iniciar", async () => {
    const storagePayload = {
      intro: {
        visibleLayerIds: [INTRO_EXTRA_LAYER_ID],
        opacities: {
          [INTRO_EXTRA_LAYER_ID]: 0.5,
        },
      },
    };

    const { storageKey } = await importFreshStores();

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(storagePayload),
    );

    const { useLayersStore } = await importFreshStores();
    const state = useLayersStore.getState();

    expect(state.visibleLayers.has(INTRO_EXTRA_LAYER_ID)).toBe(true);
    expect(state.visibleLayers.has(INTRO_BASE_LAYER_ID)).toBe(false);
    expect(state.opacities[INTRO_EXTRA_LAYER_ID]).toBe(0.5);
  });
});
