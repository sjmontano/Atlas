import { getMapLayerProfile } from "@layers/config/mapLayerProfiles";
import { useMapLayers } from "@layers/hooks";
import { pulseLayer } from "@layers/services/layerPulse";
import { runLayerActivationBenchmark } from "@layers/services/layersBenchmark";
import { useMapContext } from "@map/context/MapContext";
import { useLayersStore } from "@state";
import { useMapStore } from "@state/mapStore";
import { useEffect, useMemo, useRef } from "react";

const PULSE_BULK_THRESHOLD = 5;

/**
 * Sincroniza la visibilidad/opacidad de capas con el mapa,
 * independientemente de si el panel de capas está abierto.
 */
export const LayerMapSync = () => {
  const { map } = useMapContext();
  const activeMapId = useMapStore((s) => s.activeMapId);
  const {
    visibleLayers: visibleLayersSet,
    opacities,
    setLayersVisibility,
  } = useLayersStore();
  const previousVisibleLayersRef = useRef<Set<string>>(new Set());
  const hasHydratedRef = useRef(false);

  const visibleLayers = useMemo(
    () => Array.from(visibleLayersSet),
    [visibleLayersSet],
  );

  const layerOptions = useMemo(
    () =>
      visibleLayers.reduce<Record<string, { opacity?: number }>>(
        (acc, layerId) => {
          const opacity = opacities[layerId];
          if (typeof opacity === "number") {
            acc[layerId] = { opacity };
          }
          return acc;
        },
        {},
      ),
    [visibleLayers, opacities],
  );

  const preloadLayerIds = useMemo(
    () => getMapLayerProfile(activeMapId)?.associatedLayerIds ?? [],
    [activeMapId],
  );

  useMapLayers({
    map,
    visibleLayers,
    layerOptions,
    preloadLayerIds,
  });

  useEffect(() => {
    if (!map || !import.meta.env.DEV) {
      if (typeof window !== "undefined" && window.atlasLayerPerf) {
        delete window.atlasLayerPerf;
      }
      return;
    }

    const runCurrentMapAB = () => {
      const currentLayerIds =
        getMapLayerProfile(activeMapId)?.associatedLayerIds ?? [];

      return runLayerActivationBenchmark({
        map,
        layerIds: currentLayerIds,
        setLayersVisibility,
        benchmarkName: `${activeMapId}-ab`,
      });
    };

    const runEcosistemasAB = () => {
      const ecosistemasLayerIds =
        getMapLayerProfile("chapter1-ecosistemas")?.associatedLayerIds ?? [];

      return runLayerActivationBenchmark({
        map,
        layerIds: ecosistemasLayerIds,
        setLayersVisibility,
        benchmarkName: "chapter1-ecosistemas-ab",
      });
    };

    const api = {
      runCurrentMapAB,
      runEcosistemasAB,
    };

    window.atlasLayerPerf = api;

    return () => {
      if (window.atlasLayerPerf === api) {
        delete window.atlasLayerPerf;
      }
    };
  }, [map, activeMapId, setLayersVisibility]);

  useEffect(() => {
    const previousVisibleLayers = previousVisibleLayersRef.current;

    if (!hasHydratedRef.current) {
      previousVisibleLayersRef.current = new Set(visibleLayers);
      hasHydratedRef.current = true;
      return;
    }

    const addedLayers = visibleLayers.filter(
      (layerId) => !previousVisibleLayers.has(layerId),
    );

    if (
      addedLayers.length > 0 &&
      addedLayers.length <= PULSE_BULK_THRESHOLD
    ) {
      window.setTimeout(() => {
        addedLayers.forEach((layerId) => pulseLayer(map, layerId));
      }, 140);
    }

    previousVisibleLayersRef.current = new Set(visibleLayers);
  }, [map, visibleLayers]);

  return null;
};

export default LayerMapSync;
