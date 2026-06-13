/**
 * Hook especializado para integrar capas geográficas con MapLibre
 * Maneja la adición/eliminación de capas en el mapa
 */

import type {
  GeoJSONSourceSpecification,
  Map as MapLibreMap,
} from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  getRasterTileLayerById,
  type RasterTileLayerConfig,
} from "../data/raster/ecosistemasRasterLayers";
import type { GeoLayer } from "../types/geo";
import { useGeoLayers } from "./useGeoLayers";

export interface MapLayerOptions {
  visible?: boolean;
  opacity?: number;
  color?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface UseMapLayersOptions {
  map?: MapLibreMap | null;
  visibleLayers?: string[];
  layerOptions?: Record<string, MapLayerOptions>;
  preloadLayerIds?: string[];
}

type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformationLike {
  effectiveType?: EffectiveConnectionType;
  saveData?: boolean;
}

interface RuntimeRasterProfile {
  effectiveType?: EffectiveConnectionType;
  saveData: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  lowBandwidth: boolean;
  lowEndDevice: boolean;
}

interface RasterWarmupStrategy {
  enabled: boolean;
  batchSize: number;
  initialDelayMs: number;
  batchDelayMs: number;
  maxLayers: number;
}

interface RasterAddStrategy {
  batchSize: number;
  batchDelayMs: number;
}

interface RuntimeRasterConfig {
  deliveryMode: "tiles" | "direct";
  sourceUrl: string;
  tileSize: number;
}

const DEFAULT_PRELOAD_BATCH_SIZE = 2;
const DEFAULT_PRELOAD_INITIAL_DELAY_MS = 250;
const DEFAULT_PRELOAD_BATCH_DELAY_MS = 24;
const DEFAULT_PRELOAD_MAX_LAYERS = 12;

const LOW_END_PRELOAD_BATCH_SIZE = 1;
const LOW_END_PRELOAD_INITIAL_DELAY_MS = 500;
const LOW_END_PRELOAD_BATCH_DELAY_MS = 64;
const LOW_END_PRELOAD_MAX_LAYERS = 6;

const BULK_ADD_BATCH_SIZE_DEFAULT = 4;
const BULK_ADD_BATCH_DELAY_DEFAULT_MS = 10;
const BULK_ADD_BATCH_SIZE_LOW_END = 2;
const BULK_ADD_BATCH_DELAY_LOW_END_MS = 20;

const RASTER_FADE_DURATION_MS = 0;

const isRasterDebugEnabled = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return (
      window.localStorage.getItem("atlas:debug:raster") === "1" ||
      (window as unknown as { __ATLAS_DEBUG_RASTER__?: boolean })
        .__ATLAS_DEBUG_RASTER__ === true
    );
  } catch {
    return false;
  }
};

const logRasterDebug = (
  event: string,
  payload?: Record<string, unknown>,
): void => {
  if (!isRasterDebugEnabled()) {
    return;
  }

  if (payload) {
    console.debug(`[RASTER_DEBUG] ${event}`, payload);
    return;
  }

  console.debug(`[RASTER_DEBUG] ${event}`);
};

const getRuntimeRasterProfile = (): RuntimeRasterProfile => {
  if (typeof navigator === "undefined") {
    return {
      saveData: false,
      lowBandwidth: false,
      lowEndDevice: false,
    };
  }

  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    deviceMemory?: number;
  };
  const connection = nav.connection;
  const effectiveType = connection?.effectiveType;
  const saveData = connection?.saveData === true;
  const deviceMemory =
    typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined;
  const hardwareConcurrency =
    typeof nav.hardwareConcurrency === "number"
      ? nav.hardwareConcurrency
      : undefined;

  const lowBandwidth =
    saveData ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g";

  const lowEndDevice =
    (typeof deviceMemory === "number" && deviceMemory <= 4) ||
    (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4);

  return {
    effectiveType,
    saveData,
    deviceMemory,
    hardwareConcurrency,
    lowBandwidth,
    lowEndDevice,
  };
};

const resolveRasterWarmupStrategy = (
  profile: RuntimeRasterProfile,
): RasterWarmupStrategy => {
  if (profile.effectiveType === "slow-2g" || profile.effectiveType === "2g") {
    return {
      enabled: false,
      batchSize: 0,
      initialDelayMs: 0,
      batchDelayMs: 0,
      maxLayers: 0,
    };
  }

  if (profile.saveData || profile.lowEndDevice || profile.effectiveType === "3g") {
    return {
      enabled: true,
      batchSize: LOW_END_PRELOAD_BATCH_SIZE,
      initialDelayMs: LOW_END_PRELOAD_INITIAL_DELAY_MS,
      batchDelayMs: LOW_END_PRELOAD_BATCH_DELAY_MS,
      maxLayers: LOW_END_PRELOAD_MAX_LAYERS,
    };
  }

  return {
    enabled: true,
    batchSize: DEFAULT_PRELOAD_BATCH_SIZE,
    initialDelayMs: DEFAULT_PRELOAD_INITIAL_DELAY_MS,
    batchDelayMs: DEFAULT_PRELOAD_BATCH_DELAY_MS,
    maxLayers: DEFAULT_PRELOAD_MAX_LAYERS,
  };
};

const resolveRasterAddStrategy = (
  profile: RuntimeRasterProfile,
): RasterAddStrategy => {
  if (profile.lowEndDevice) {
    return {
      batchSize: BULK_ADD_BATCH_SIZE_LOW_END,
      batchDelayMs: BULK_ADD_BATCH_DELAY_LOW_END_MS,
    };
  }

  return {
    batchSize: BULK_ADD_BATCH_SIZE_DEFAULT,
    batchDelayMs: BULK_ADD_BATCH_DELAY_DEFAULT_MS,
  };
};

const resolveRuntimeRasterConfig = (
  rasterConfig: RasterTileLayerConfig,
  profile: RuntimeRasterProfile,
): RuntimeRasterConfig => {
  if (profile.lowBandwidth && rasterConfig.allowLowBandwidthDirectFallback) {
    return {
      deliveryMode: "direct",
      sourceUrl: rasterConfig.lowBandwidthSourceUrl,
      tileSize: 512,
    };
  }

  return {
    deliveryMode: rasterConfig.deliveryMode,
    sourceUrl: rasterConfig.sourceUrl,
    tileSize: rasterConfig.tileSize,
  };
};

export const useMapLayers = (options: UseMapLayersOptions = {}) => {
  const {
    map,
    visibleLayers = [],
    layerOptions = {},
    preloadLayerIds = [],
  } = options;
  const { loadLayerById, getLoadedLayerById, hasLayer } = useGeoLayers();
  const runtimeProfile = useMemo(() => getRuntimeRasterProfile(), []);
  const warmupStrategy = useMemo(
    () => resolveRasterWarmupStrategy(runtimeProfile),
    [runtimeProfile],
  );
  const rasterAddStrategy = useMemo(
    () => resolveRasterAddStrategy(runtimeProfile),
    [runtimeProfile],
  );
  const activeLayersRef = useRef<Set<string>>(new Set());
  const visibleLayerSetRef = useRef<Set<string>>(new Set());
  const preloadedLayerIdsRef = useRef<Set<string>>(new Set());

  const getRasterLayerId = (layerId: string) => `${layerId}-raster`;
  const getRasterSourceId = (layerId: string) => `${layerId}-source`;

  const safeGetLayer = useCallback(
    (layerId: string) => {
      if (!map) {
        return undefined;
      }

      try {
        return map.getLayer(layerId);
      } catch {
        return undefined;
      }
    },
    [map],
  );

  const safeGetSource = useCallback(
    (sourceId: string) => {
      if (!map) {
        return undefined;
      }

      try {
        return map.getSource(sourceId);
      } catch {
        return undefined;
      }
    },
    [map],
  );

  const stripRuntimeSuffixes = (layerId: string): string =>
    layerId.replace(/-fill|-stroke|-raster$/, "");

  const getCoordinatesFromBounds = (
    bounds: [number, number, number, number],
  ): [[number, number], [number, number], [number, number], [number, number]] => {
    const [west, south, east, north] = bounds;
    return [
      [west, north],
      [east, north],
      [east, south],
      [west, south],
    ];
  };

  const addRasterLayerToMap = useCallback(
    (layerId: string, options: MapLayerOptions = {}) => {
      if (!map) return false;

      const rasterConfig = getRasterTileLayerById(layerId);
      if (!rasterConfig) return false;
      const runtimeConfig = resolveRuntimeRasterConfig(
        rasterConfig,
        runtimeProfile,
      );

      logRasterDebug("addRasterLayer:start", {
        layerId,
        deliveryMode: runtimeConfig.deliveryMode,
        sourceUrl: runtimeConfig.sourceUrl,
        tileSize: runtimeConfig.tileSize,
        minZoom: rasterConfig.minZoom,
        maxZoom: rasterConfig.maxZoom,
        requestedVisible: options.visible ?? true,
        requestedOpacity: options.opacity ?? 0.85,
      });

      try {
        const rasterLayerId = getRasterLayerId(layerId);
        const rasterSourceId = getRasterSourceId(layerId);
        const rasterOpacity = options.opacity ?? 0.85;
        const rasterVisible = options.visible ?? true;

        if (safeGetLayer(rasterLayerId)) {
          map.setLayoutProperty(
            rasterLayerId,
            "visibility",
            rasterVisible ? "visible" : "none",
          );
          map.setPaintProperty(rasterLayerId, "raster-opacity", rasterOpacity);
          activeLayersRef.current.add(rasterLayerId);
          logRasterDebug("addRasterLayer:reuse-layer", {
            layerId,
            rasterLayerId,
            visibility: rasterVisible ? "visible" : "none",
            opacity: rasterOpacity,
          });
          return true;
        }

        if (!safeGetSource(rasterSourceId)) {
          if (runtimeConfig.deliveryMode === "direct") {
            const coordinates =
              rasterConfig.coordinates ??
              (rasterConfig.bounds
                ? getCoordinatesFromBounds(rasterConfig.bounds)
                : undefined);

            if (!coordinates) {
              console.warn(
                `Capa raster directa sin geometría: ${layerId}. Se omite render.`,
              );
              return false;
            }

            logRasterDebug("addRasterLayer:add-image-source", {
              layerId,
              rasterSourceId,
              sourceUrl: runtimeConfig.sourceUrl,
              coordinatesCount: coordinates.length,
            });

            map.addSource(rasterSourceId, {
              type: "image",
              url: runtimeConfig.sourceUrl,
              coordinates,
            });
          } else {
            logRasterDebug("addRasterLayer:add-raster-source", {
              layerId,
              rasterSourceId,
              tileTemplate: rasterConfig.urlTemplate,
              tileSize: runtimeConfig.tileSize,
              minZoom: rasterConfig.minZoom,
              maxZoom: rasterConfig.maxZoom,
              bounds: rasterConfig.bounds,
            });

            map.addSource(rasterSourceId, {
              type: "raster",
              tiles: [rasterConfig.urlTemplate],
              tileSize: runtimeConfig.tileSize,
              minzoom: rasterConfig.minZoom,
              maxzoom: rasterConfig.maxZoom,
              bounds: rasterConfig.bounds,
            });
          }
        }

        map.addLayer({
          id: rasterLayerId,
          type: "raster",
          source: rasterSourceId,
          layout: {
            visibility: rasterVisible ? "visible" : "none",
          },
          paint: {
            "raster-opacity": rasterOpacity,
            "raster-fade-duration": RASTER_FADE_DURATION_MS,
          },
        });

        activeLayersRef.current.add(rasterLayerId);
        logRasterDebug("addRasterLayer:layer-added", {
          layerId,
          rasterLayerId,
          rasterSourceId,
          visibility: rasterVisible ? "visible" : "none",
          opacity: rasterOpacity,
        });
        return true;
      } catch (error) {
        console.warn(`Error agregando capa raster ${layerId}:`, error);
        logRasterDebug("addRasterLayer:error", {
          layerId,
          errorMessage:
            error instanceof Error ? error.message : String(error ?? "unknown"),
        });
        return false;
      }
    },
    [map, runtimeProfile, safeGetLayer, safeGetSource],
  );

  // Remover una capa del mapa
  const removeLayerFromMap = useCallback(
    (layerId: string) => {
      if (!map) return;

      logRasterDebug("removeLayer:start", { layerId });

      try {
        // Remover las capas asociadas
        [
          `${layerId}-fill`,
          `${layerId}-stroke`,
          layerId,
          getRasterLayerId(layerId),
        ].forEach((id) => {
          if (safeGetLayer(id)) {
            map.removeLayer(id);
            activeLayersRef.current.delete(id);
          }
        });

        // Remover la fuente
        if (safeGetSource(layerId)) {
          map.removeSource(layerId);
        }
        const rasterSourceId = getRasterSourceId(layerId);
        if (safeGetSource(rasterSourceId)) {
          map.removeSource(rasterSourceId);
        }
        logRasterDebug("removeLayer:done", { layerId });
      } catch (error) {
        console.warn(`Error removiendo capa ${layerId}:`, error);
        logRasterDebug("removeLayer:error", {
          layerId,
          errorMessage:
            error instanceof Error ? error.message : String(error ?? "unknown"),
        });
      }
    },
    [map, safeGetLayer, safeGetSource],
  );

  // Agregar una capa al mapa
  const addLayerToMap = useCallback(
    (layerId: string, layer: GeoLayer, options: MapLayerOptions = {}) => {
      if (!map || !layer) return false;

      try {
        // Si la capa ya existe, la removemos primero
        if (safeGetSource(layerId)) {
          removeLayerFromMap(layerId);
        }

        // Agregar fuente
        map.addSource(layerId, {
          type: "geojson",
          data: layer as GeoJSONSourceSpecification["data"],
        });

        // Determinar el tipo de capa basado en la geometría
        const firstFeature = layer.features[0];
        const geometryType = firstFeature?.geometry?.type;

        const {
          opacity = 0.8,
          fillColor = "#3388ff",
          strokeColor = "#1155cc",
          strokeWidth = 2,
        } = options;

        if (geometryType?.includes("Polygon")) {
          // Capa de relleno para polígonos
          map.addLayer({
            id: `${layerId}-fill`,
            type: "fill",
            source: layerId,
            paint: {
              "fill-color": fillColor,
              "fill-opacity": opacity * 0.6,
            },
          });

          // Contorno para polígonos
          map.addLayer({
            id: `${layerId}-stroke`,
            type: "line",
            source: layerId,
            paint: {
              "line-color": strokeColor,
              "line-width": strokeWidth,
              "line-opacity": opacity,
            },
          });

          activeLayersRef.current.add(`${layerId}-fill`);
          activeLayersRef.current.add(`${layerId}-stroke`);
        } else if (geometryType?.includes("Line")) {
          // Capa de línea
          map.addLayer({
            id: layerId,
            type: "line",
            source: layerId,
            paint: {
              "line-color": strokeColor,
              "line-width": strokeWidth,
              "line-opacity": opacity,
            },
          });

          activeLayersRef.current.add(layerId);
        } else if (geometryType?.includes("Point")) {
          // Capa de puntos
          map.addLayer({
            id: layerId,
            type: "circle",
            source: layerId,
            paint: {
              "circle-color": fillColor,
              "circle-radius": 6,
              "circle-opacity": opacity,
              "circle-stroke-color": strokeColor,
              "circle-stroke-width": strokeWidth,
            },
          });

          activeLayersRef.current.add(layerId);
        }

        return true;
      } catch (error) {
        console.warn(`Error agregando capa ${layerId}:`, error);
        return false;
      }
    },
    [map, removeLayerFromMap, safeGetSource],
  );

  // Actualizar visibilidad de una capa
  const updateLayerVisibility = useCallback(
    (layerId: string, visible: boolean) => {
      if (!map) return;
      const targetVisibility = visible ? "visible" : "none";

      const layerIds = [
        `${layerId}-fill`,
        `${layerId}-stroke`,
        layerId,
        getRasterLayerId(layerId),
      ];
      layerIds.forEach((id) => {
        if (safeGetLayer(id)) {
          let currentVisibility: unknown;
          try {
            currentVisibility = map.getLayoutProperty(id, "visibility");
          } catch {
            currentVisibility = undefined;
          }

          if (currentVisibility !== targetVisibility) {
            map.setLayoutProperty(id, "visibility", targetVisibility);
            logRasterDebug("visibility:update", {
              layerId,
              runtimeLayerId: id,
              from: currentVisibility,
              to: targetVisibility,
            });
          }
        }
      });
    },
    [map, safeGetLayer],
  );

  useEffect(() => {
    if (!map || !isRasterDebugEnabled()) {
      return;
    }

    const onSourceData = (event: any) => {
      const sourceId =
        typeof event?.sourceId === "string" ? event.sourceId : undefined;
      if (!sourceId || !sourceId.endsWith("-source")) {
        return;
      }

      const baseLayerId = sourceId.replace(/-source$/, "");
      if (!getRasterTileLayerById(baseLayerId)) {
        return;
      }

      logRasterDebug("map:sourcedata", {
        sourceId,
        baseLayerId,
        sourceDataType:
          typeof event?.sourceDataType === "string"
            ? event.sourceDataType
            : undefined,
        isSourceLoaded:
          typeof event?.isSourceLoaded === "boolean"
            ? event.isSourceLoaded
            : undefined,
      });
    };

    const onError = (event: any) => {
      const sourceId =
        typeof event?.sourceId === "string" ? event.sourceId : undefined;
      if (!sourceId || !sourceId.endsWith("-source")) {
        return;
      }

      const baseLayerId = sourceId.replace(/-source$/, "");
      if (!getRasterTileLayerById(baseLayerId)) {
        return;
      }

      logRasterDebug("map:error", {
        sourceId,
        baseLayerId,
        message:
          event?.error?.message ?? event?.message ?? "unknown map source error",
      });
    };

    map.on("sourcedata", onSourceData);
    map.on("error", onError);
    logRasterDebug("map:event-hooks:attached");

    return () => {
      map.off("sourcedata", onSourceData);
      map.off("error", onError);
      logRasterDebug("map:event-hooks:detached");
    };
  }, [map]);

  // Actualizar opacidad de una capa
  const updateLayerOpacity = useCallback(
    (layerId: string, opacity: number) => {
      if (!map) return;

      if (safeGetLayer(`${layerId}-fill`)) {
        map.setPaintProperty(`${layerId}-fill`, "fill-opacity", opacity * 0.6);
      }
      if (safeGetLayer(`${layerId}-stroke`)) {
        map.setPaintProperty(`${layerId}-stroke`, "line-opacity", opacity);
      }
      if (safeGetLayer(getRasterLayerId(layerId))) {
        map.setPaintProperty(
          getRasterLayerId(layerId),
          "raster-opacity",
          opacity,
        );
      }
      if (safeGetLayer(layerId)) {
        const type = safeGetLayer(layerId)?.type;
        if (type === "line") {
          map.setPaintProperty(layerId, "line-opacity", opacity);
        } else if (type === "circle") {
          map.setPaintProperty(layerId, "circle-opacity", opacity);
        }
      }
    },
    [map, safeGetLayer],
  );

  // Efecto para sincronizar capas visibles
  useEffect(() => {
    if (!map) return;

    activeLayersRef.current.clear();
    preloadedLayerIdsRef.current.clear();
  }, [map]);

  useEffect(() => {
    if (!map || preloadLayerIds.length === 0 || !warmupStrategy.enabled) {
      return;
    }

    const visibleNow = new Set(visibleLayers);
    const pendingRasterPreloadIds = preloadLayerIds
      .filter((layerId) => {
        if (
          !hasLayer(layerId) ||
          visibleNow.has(layerId) ||
          preloadedLayerIdsRef.current.has(layerId)
        ) {
          return false;
        }

        const rasterConfig = getRasterTileLayerById(layerId);
        if (!rasterConfig) {
          return false;
        }

        const runtimeConfig = resolveRuntimeRasterConfig(
          rasterConfig,
          runtimeProfile,
        );

        // La precarga oculta solo aporta valor real para fuentes de imagen directa.
        return runtimeConfig.deliveryMode === "direct";
      })
      .slice(0, warmupStrategy.maxLayers);

    if (pendingRasterPreloadIds.length === 0) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let index = 0;

    const warmBatch = () => {
      if (cancelled) {
        return;
      }

      const upperBound = Math.min(
        index + warmupStrategy.batchSize,
        pendingRasterPreloadIds.length,
      );

      for (; index < upperBound; index++) {
        const layerId = pendingRasterPreloadIds[index];
        preloadedLayerIdsRef.current.add(layerId);

        const opts = layerOptions[layerId] ?? {};
        addRasterLayerToMap(layerId, { ...opts, visible: false });
      }

      if (index < pendingRasterPreloadIds.length) {
        timer = setTimeout(warmBatch, warmupStrategy.batchDelayMs);
      }
    };

    timer = setTimeout(warmBatch, warmupStrategy.initialDelayMs);

    return () => {
      cancelled = true;
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [
    map,
    preloadLayerIds,
    visibleLayers,
    layerOptions,
    hasLayer,
    runtimeProfile,
    warmupStrategy,
    addRasterLayerToMap,
  ]);

  useEffect(() => {
    if (!map) return;

    const layerIds = visibleLayers.filter((id) => hasLayer(id));
    const visibleLayerSet = new Set(layerIds);
    visibleLayerSetRef.current = visibleLayerSet;
    const currentBaseLayerIds = new Set(
      Array.from(activeLayersRef.current).map(stripRuntimeSuffixes),
    );

    // Ocultar capas que dejaron de estar visibles.
    // Se conservan en memoria para evitar remove+add costoso en alternancias rápidas.
    currentBaseLayerIds.forEach((baseLayerId) => {
      if (!visibleLayerSet.has(baseLayerId)) {
        updateLayerVisibility(baseLayerId, false);
      }
    });

    const pendingLayerAdds: string[] = [];

    // Mostrar capas ya cargadas inmediatamente.
    layerIds.forEach((layerId) => {
      const opts = layerOptions[layerId] || {};

      if (currentBaseLayerIds.has(layerId)) {
        updateLayerVisibility(layerId, true);
        if (typeof opts.opacity === "number") {
          updateLayerOpacity(layerId, opts.opacity);
        }
        return;
      }

      pendingLayerAdds.push(layerId);
    });

    if (pendingLayerAdds.length === 0) {
      return;
    }

    logRasterDebug("sync:pending-layer-adds", {
      visibleCount: layerIds.length,
      pendingCount: pendingLayerAdds.length,
      pendingLayerAdds,
    });

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let index = 0;

    const addSingleLayer = (layerId: string) => {
      const opts = layerOptions[layerId] || {};
      const cached = getLoadedLayerById(layerId);
      const rasterConfig = getRasterTileLayerById(layerId);

      if (rasterConfig) {
        logRasterDebug("sync:add-single:raster", { layerId });
        addRasterLayerToMap(layerId, opts);
        return;
      }

      if (cached) {
        logRasterDebug("sync:add-single:geojson-cache", { layerId });
        addLayerToMap(layerId, cached, opts);
        return;
      }

      logRasterDebug("sync:add-single:geojson-load", { layerId });

      loadLayerById(layerId)
        .then((layer) => {
          if (cancelled || !visibleLayerSetRef.current.has(layerId)) {
            return;
          }
          addLayerToMap(layerId, layer, opts);
        })
        .catch((err) => {
          console.warn(`Error cargando capa ${layerId}:`, err);
        });
    };

    const processBatch = () => {
      if (cancelled) {
        return;
      }

      const upperBound = Math.min(
        index + rasterAddStrategy.batchSize,
        pendingLayerAdds.length,
      );

      for (; index < upperBound; index++) {
        addSingleLayer(pendingLayerAdds[index]);
      }

      if (index < pendingLayerAdds.length) {
        timer = setTimeout(processBatch, rasterAddStrategy.batchDelayMs);
      }
    };

    processBatch();

    return () => {
      cancelled = true;
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [
    map,
    visibleLayers,
    layerOptions,
    rasterAddStrategy,
    hasLayer,
    getLoadedLayerById,
    loadLayerById,
    addLayerToMap,
    addRasterLayerToMap,
    updateLayerVisibility,
    updateLayerOpacity,
  ]);

  return {
    // Métodos de control
    addLayer: (
      layerId: string,
      options?: MapLayerOptions,
    ): Promise<boolean> => {
      if (getRasterTileLayerById(layerId)) {
        return Promise.resolve(addRasterLayerToMap(layerId, options));
      }

      const cached = getLoadedLayerById(layerId);
      if (cached)
        return Promise.resolve(addLayerToMap(layerId, cached, options));
      return loadLayerById(layerId)
        .then((layer) => addLayerToMap(layerId, layer, options))
        .catch((err) => {
          console.warn(`Error en addLayer ${layerId}:`, err);
          return false;
        });
    },

    removeLayer: removeLayerFromMap,

    updateVisibility: updateLayerVisibility,
    updateOpacity: updateLayerOpacity,

    // Utilidades
    isLayerActive: (layerId: string) =>
      activeLayersRef.current.has(layerId) ||
      activeLayersRef.current.has(`${layerId}-fill`) ||
      activeLayersRef.current.has(getRasterLayerId(layerId)),

    getActiveLayerCount: () => activeLayersRef.current.size,

    clearAllLayers: () => {
      Array.from(activeLayersRef.current).forEach((layerId) => {
        const baseLayerId = stripRuntimeSuffixes(layerId);
        removeLayerFromMap(baseLayerId);
      });
    },
  };
};
