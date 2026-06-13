/**
 * 🗺️ HOOK PRINCIPAL DE ATLAS MAP
 * ================================
 *
 * Hook maestro que orquesta la inicialización completa de un mapa Atlas.
 * Coordina: configuración → dimensiones → bounds → zoom → MapLibre → renderer.
 */

import {
  createLayerManager,
  type LayerManager,
} from "@layers/services/LayerManager";
import {
  createMapInstance,
  destroyMapInstance,
  registerMapEventHandlers,
} from "@lib/maplibre";
import { getErrorMessage } from "@shared/utils/errorUtils";
import type maplibregl from "maplibre-gl";
import { LngLat } from "maplibre-gl";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { MapConfig } from "../config/mapConfig";
import { resolveRuntimeBounds } from "../config/mapSettings";
import { logger } from "../services/MapLogger";
import { createMapRenderer, type MapRenderer } from "../services/MapRenderer";
import {
  prefetchRegionTiles,
  resolveAdaptivePrefetchMaxZoom,
} from "../services/TilePrefetcher";
import { useMapBounds } from "./useMapBounds";
import { useMapConfiguration } from "./useMapConfiguration";
import { useMapDimensions } from "./useMapDimensions";
import { useMapZoom } from "./useMapZoom";

export interface UseAtlasMapOptions {
  /** ID del mapa a construir */
  mapId: string;
  /** Ref al contenedor DOM del mapa */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Habilitar leyenda de capas */
  enableLegend?: boolean;
  /** Callback cuando el mapa se construye */
  onMapBuild?: (map: maplibregl.Map, config: MapConfig) => void;
  /** Callback cuando hay error */
  onError?: (error: string) => void;
}

export interface UseAtlasMapResult {
  /** Instancia del mapa MapLibre */
  map: maplibregl.Map | null;
  /** Renderer del mapa */
  mapRenderer: MapRenderer | null;
  /** Gestor de capas (si enableLegend=true) */
  layerManager: LayerManager | null;
  /** Si el mapa está construido y listo */
  mapBuilt: boolean;
  /** Si la imagen base (low-res o high-res) ya se descargó */
  lowResReady: boolean;
  /** Error si lo hay */
  error: string | null;
  /** Vista inicial del mapa */
  initialView: {
    center: [number, number];
    zoom: number;
    bearing: number;
  } | null;
  /** Si está cargando */
  loading: boolean;
}

type RuntimeBoundsTuple = [number, number, number, number];

export function resolveInitialMaxBounds(
  autoBounds: boolean | undefined,
  runtimeBounds: RuntimeBoundsTuple,
): RuntimeBoundsTuple | undefined {
  return autoBounds !== false ? runtimeBounds : undefined;
}

export function applyFinalMaxBounds(
  map: Pick<maplibregl.Map, "setMaxBounds">,
  autoBounds: boolean | undefined,
  adjustedBounds: RuntimeBoundsTuple,
): void {
  if (autoBounds !== false) {
    map.setMaxBounds(adjustedBounds);
  }
}

/**
 * Crea un TransformConstrainFunction bearing-aware para reemplazar setMaxBounds.
 *
 * Con bearing=-90 los ejes de pantalla están invertidos:
 *   - Ancho de pantalla W spans: latitud (sur → norte)
 *   - Alto de pantalla H spans: longitud (oeste → este)
 *
 * La función recibe el centro propuesto y lo fija para que las esquinas
 * del viewport nunca escapen de viewportMaxBounds.
 */
export function createBearingAwareConstrain(
  getCanvas: () => { clientWidth: number; clientHeight: number },
  vmb: [number, number, number, number],
  bearing: number,
): maplibregl.TransformConstrainFunction {
  const [west, south, east, north] = vmb;
  const normalized = ((bearing % 360) + 360) % 360;
  const isQuarterTurn = normalized === 90 || normalized === 270;

  // Spans precalculados (constantes, no dependen del frame)
  const latSpan = north - south;
  const lonSpan = east - west;

  return (lngLat: LngLat, zoom: number) => {
    const canvas = getCanvas();
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    // ── Paso A: minZoom bearing-aware ─────────────────────────────────────
    // dpp(z) = 360 / (512 * 2^z). Para que el viewport quepa en el bound:
    //   W * dpp(z) <= span  →  z >= log2(W * 360 / (512 * span))
    // Con bearing ±90°: W cubre latSpan, H cubre lonSpan.
    // Con bearing 0/180°: W cubre lonSpan, H cubre latSpan.
    let minZoom: number;
    if (isQuarterTurn) {
      const minZoomW = latSpan > 0 ? Math.log2(W * 360 / (512 * latSpan)) : 0;
      const minZoomH = lonSpan > 0 ? Math.log2(H * 360 / (512 * lonSpan)) : 0;
      minZoom = Math.max(minZoomW, minZoomH);
    } else {
      const minZoomW = lonSpan > 0 ? Math.log2(W * 360 / (512 * lonSpan)) : 0;
      const minZoomH = latSpan > 0 ? Math.log2(H * 360 / (512 * latSpan)) : 0;
      minZoom = Math.max(minZoomW, minZoomH);
    }

    // ── Paso B: clampear zoom ANTES de calcular dpp ───────────────────────
    const clampedZoom = Math.max(minZoom, zoom);

    // ── Paso C: dpp con zoom ya corregido ─────────────────────────────────
    const dpp = 360 / (512 * Math.pow(2, clampedZoom));

    // ── Paso D: clampear centro ───────────────────────────────────────────
    let clampedLng = lngLat.lng;
    let clampedLat = lngLat.lat;

    if (isQuarterTurn) {
      // bearing ±90°: pantalla W ↔ eje lat, pantalla H ↔ eje lon
      const halfLat = (W / 2) * dpp;
      const halfLon = (H / 2) * dpp;
      const minLat = south + halfLat;
      const maxLat = north - halfLat;
      const minLon = west + halfLon;
      const maxLon = east - halfLon;
      clampedLat = minLat <= maxLat
        ? Math.max(minLat, Math.min(maxLat, clampedLat))
        : (south + north) / 2;
      clampedLng = minLon <= maxLon
        ? Math.max(minLon, Math.min(maxLon, clampedLng))
        : (west + east) / 2;
    } else {
      // bearing 0/180: pantalla W ↔ eje lon, pantalla H ↔ eje lat
      const halfLon = (W / 2) * dpp;
      const halfLat = (H / 2) * dpp;
      const minLon = west + halfLon;
      const maxLon = east - halfLon;
      const minLat = south + halfLat;
      const maxLat = north - halfLat;
      clampedLng = minLon <= maxLon
        ? Math.max(minLon, Math.min(maxLon, clampedLng))
        : (west + east) / 2;
      clampedLat = minLat <= maxLat
        ? Math.max(minLat, Math.min(maxLat, clampedLat))
        : (south + north) / 2;
    }

    // Guardrail: coordenadas siempre válidas
    clampedLat = Math.max(-89.9, Math.min(89.9, clampedLat));
    clampedLng = Math.max(-179.9, Math.min(179.9, clampedLng));

    return {
      center: new LngLat(clampedLng, clampedLat),
      zoom: clampedZoom,
    };
  };
}

/**
 * Hook principal para inicializar mapas Atlas.
 *
 * Orquesta toda la inicialización del mapa:
 * 1. Carga y valida configuración
 * 2. Carga dimensiones de la imagen
 * 3. Calcula bounds geográficos
 * 4. Calcula zoom automático
 * 5. Crea instancia de MapLibre
 * 6. Construye mapa georreferenciado
 * 7. Opcionalmente crea LayerManager
 */
export function useAtlasMap(options: UseAtlasMapOptions): UseAtlasMapResult {
  const { mapId, containerRef, enableLegend } = options;

  // ── Callback refs — nunca quedan obsoletas, nunca van en deps ────────────
  const onMapBuildRef = useRef(options.onMapBuild);
  const onErrorRef = useRef(options.onError);
  onMapBuildRef.current = options.onMapBuild;
  onErrorRef.current = options.onError;

  // ── Refs de instancias ────────────────────────────────────────────────────
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapRendererRef = useRef<MapRenderer | null>(null);
  const layerManagerRef = useRef<LayerManager | null>(null);
  const prefetchCancelRef = useRef<(() => void) | null>(null);

  // ── Estado ────────────────────────────────────────────────────────────────
  const [mapBuilt, setMapBuilt] = useState(false);
  const [lowResReady, setLowResReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialView, setInitialView] = useState<{
    center: [number, number];
    zoom: number;
    bearing: number;
  } | null>(null);

  // ── Paso 1: Configuración ─────────────────────────────────────────────────
  const {
    config: completeConfig,
    isValid: configValid,
    errors: configErrors,
  } = useMapConfiguration(mapId);

  // ── Paso 2: Dimensiones de imagen ─────────────────────────────────────────
  const {
    dimensions,
    loading: dimensionsLoading,
    error: dimensionsError,
  } = useMapDimensions(
    completeConfig?.config.imagePath ?? "",
    completeConfig?.config.dimensions,
  );

  // ── Paso 3: Bounds geográficos ────────────────────────────────────────────
  const boundsResult = useMapBounds(
    completeConfig?.config.pgwData ?? [0, 0, 0, 0, 0, 0],
    dimensions,
    completeConfig?.bounds.corrections,
    mapId,
  );

  // Intro usa tiles como fuente de verdad para el encuadre en runtime.
  // Esto evita desincronía entre el centro/zoom inicial y el render final.
  const runtimeBoundsResolution = useMemo(
    () => {
      const fallback: [number, number, number, number] =
        boundsResult?.bounds ?? [0, 0, 0, 0];
      const settings = completeConfig?.settings;

      if (!settings) {
        return {
          bounds: fallback,
          source: "pgw" as const,
          strategy: "configured" as const,
        };
      }

      return resolveRuntimeBounds({
        mapId,
        pgwBounds: fallback,
        imagePixels: dimensions
          ? { width: dimensions.width, height: dimensions.height }
          : undefined,
        settings,
      });
    },
    [boundsResult, completeConfig?.settings, dimensions, mapId],
  );

  const effectiveRuntimeBounds = runtimeBoundsResolution.bounds;

  const effectiveRuntimeCenter = useMemo<[number, number]>(() => {
    return [
      (effectiveRuntimeBounds[0] + effectiveRuntimeBounds[2]) / 2,
      (effectiveRuntimeBounds[1] + effectiveRuntimeBounds[3]) / 2,
    ];
  }, [effectiveRuntimeBounds]);

  const zoomSettings = useMemo(
    () => ({
      minZoom: completeConfig?.settings.minZoom ?? 0,
      initialZoom: completeConfig?.settings.initialZoom ?? 10,
      // En intro usamos encuadre estricto para evitar holgura lateral.
      zoomOffset: mapId === "intro" ? 0 : -0.5,
      bearing: completeConfig?.settings.initialBearing ?? 0,
    }),
    [
      completeConfig?.settings.initialZoom,
      completeConfig?.settings.minZoom,
      completeConfig?.settings.initialBearing,
      mapId,
    ],
  );

  // ── Paso 4: Zoom automático ───────────────────────────────────────────────
  const { zoom: calculatedZoom } = useMapZoom(containerRef, {
    bounds: effectiveRuntimeBounds,
    center: effectiveRuntimeCenter,
    settings: zoomSettings,
    enabled: completeConfig?.settings.autoBounds !== false,
  });

  const loading = dimensionsLoading || !boundsResult;

  const isRecoverableMapError = (
    sourceId: string | undefined,
    message: string,
  ): boolean => {
    if (!sourceId) {
      return false;
    }

    // Errores de capas dinámicas (vector/raster temáticas) no deben tumbar
    // el mapa completo; se reportan en consola y se continúa.
    if (sourceId.endsWith("-source")) {
      return true;
    }

    // Errores de tiles superpuestos tampoco deben ser fatales.
    if (sourceId.endsWith("-tiles") || sourceId.includes("ecosistemas-layers")) {
      return true;
    }

    // Cualquier error de decode fuera del source base se considera recuperable.
    if (
      message.toLowerCase().includes("could not be decoded") &&
      sourceId !== "atlas-georef-image"
    ) {
      return true;
    }

    return false;
  };

  // Ref para capturar zoom actual dentro del efecto sin incluirlo en deps
  const zoomRef = useRef(calculatedZoom);
  zoomRef.current = calculatedZoom;

  // Booleano estable — false mientras zoom sea Infinity (bounds aún vacíos)
  const isReady = useMemo(
    () =>
      !dimensionsLoading &&
      !!dimensions &&
      !!boundsResult &&
      boundsResult.isValid &&
      Number.isFinite(calculatedZoom) &&
      calculatedZoom >= 0,
    [dimensionsLoading, dimensions, boundsResult, calculatedZoom],
  );

  // ── Paso 5: Inicializar mapa ──────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    if (!containerRef.current || mapRef.current) return;
    if (!boundsResult) return;

    if (!completeConfig) {
      const msg = `Configuración de mapa no encontrada: ${mapId}`;
      logger.error("MAP_INIT", msg);
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    if (!configValid) {
      const msg = `Mapa inválido: ${configErrors.join(", ")}`;
      logger.error("MAP_INIT", msg);
      setError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    if (dimensionsError) {
      setError(dimensionsError);
      onErrorRef.current?.(dimensionsError);
      return;
    }

    // Flag de cancelación — reemplaza el hack con initializingRef
    let cancelled = false;

    const initializeMap = async () => {
      const { config: mapConfig, settings, styles } = completeConfig;
      const center = effectiveRuntimeCenter;

      // Leer zoom desde ref — sin que sea dep del efecto (evita destroyMap+rebuild)
      const zoom = zoomRef.current;

      logger.log("MAP_INIT", "Bounds runtime resueltos", {
        source: runtimeBoundsResolution.source,
        strategy: runtimeBoundsResolution.strategy,
        maxDeltaDegrees: runtimeBoundsResolution.maxDeltaDegrees,
        bounds: effectiveRuntimeBounds,
      });

      logger.info("MAP_INIT", `Iniciando: ${mapId}`, { center, zoom });

      try {
        const map = createMapInstance({
          container: containerRef.current!,
          center,
          zoom,
          bearing: settings.initialBearing,
          minZoom: settings.minZoom,
          maxZoom: settings.maxZoom,
          // Se aplica un maxBounds inicial para activar paredes rígidas
          // (maxBoundsViscosity=1 en adapter). Luego se ajusta con los
          // bounds finales retornados por buildGeoreferencedMap.
          maxBounds: settings.useTransformConstrain
            ? undefined
            : resolveInitialMaxBounds(
              settings.autoBounds,
              (settings.viewportMaxBounds as RuntimeBoundsTuple | undefined) ?? effectiveRuntimeBounds,
            ),
          dragPan: settings.dragPan,
          scrollZoom: settings.scrollZoom,
          streetViewEnabled: settings.streetViewEnabled !== false,
        });

        if (cancelled) {
          destroyMapInstance(map);
          return;
        }

        // Activar restricción bearing-aware si el mapa lo requiere.
        // Debe aplicarse ANTES del primer render para que ya esté activo
        // en onLoad. setMaxBounds no se aplica (autoBounds=false para este caso).
        if (settings.useTransformConstrain && settings.viewportMaxBounds) {
          map.setTransformConstrain(
            createBearingAwareConstrain(
              () => map.getContainer(),
              settings.viewportMaxBounds as RuntimeBoundsTuple,
              settings.initialBearing,
            ),
          );
          logger.info("MAP_INIT", `setTransformConstrain activo: ${mapId}`, {
            vmb: settings.viewportMaxBounds,
            bearing: settings.initialBearing,
          });
        }

        mapRef.current = map;

        // Pasar dimensiones via spread — sin mutar el config compartido
        mapRendererRef.current = createMapRenderer(
          map,
          dimensions ? { ...mapConfig, dimensions } : mapConfig,
          mapId,
        );

        if (enableLegend) {
          layerManagerRef.current = createLayerManager(map);
        }

        registerMapEventHandlers(map, {
          onLoad: async (loadedMap) => {
            if (cancelled || !mapRendererRef.current) return;

            try {
              const adjustedBounds =
                await mapRendererRef.current.buildGeoreferencedMap(
                  () => setLowResReady(true),
                  boundsResult,
                  runtimeBoundsResolution,
                );
              if (cancelled) return;

              // Aplicar maxBounds tras la construcción (igual que en AtlasMapBuilder)
              if (!settings.useTransformConstrain) {
                applyFinalMaxBounds(
                  loadedMap,
                  settings.autoBounds,
                  (settings.viewportMaxBounds as RuntimeBoundsTuple | undefined) ?? adjustedBounds,
                );
              }

              // setTransformConstrain: encuadrar a viewportMaxBounds y fijar minZoom.
              // Se usa cameraForBounds (NO fitBounds) porque:
              //   - fitBounds puede resetear bearing a 0 → mapa "derecho" en vez de -90°.
              //   - cameraForBounds calcula centro+zoom respetando el bearing actual
              //     sin modificar el estado del mapa hasta setCenter/setZoom explícitos.
              if (settings.useTransformConstrain && settings.viewportMaxBounds) {
                const vmb = settings.viewportMaxBounds as RuntimeBoundsTuple;
                const camera = loadedMap.cameraForBounds(
                  [vmb[0], vmb[1], vmb[2], vmb[3]],
                  { bearing: loadedMap.getBearing(), padding: 0 },
                );
                if (camera?.center) {
                  const targetZoom = camera.zoom ?? loadedMap.getZoom();
                  loadedMap.setCenter(camera.center);
                  loadedMap.setZoom(targetZoom);
                  // minZoom no se fija estáticamente: el constrain lo calcula
                  // dinámicamente por frame según canvas size y bearing.
                }
              }

              if (layerManagerRef.current) {
                const georefLayerId = "atlas-georef-layer";
                const tilesLayerId = `${mapConfig.id}-tiles-layer`;
                const layerToRegister = loadedMap.getLayer(georefLayerId)
                  ? georefLayerId
                  : loadedMap.getLayer(tilesLayerId)
                    ? tilesLayerId
                    : null;

                if (layerToRegister) {
                  layerManagerRef.current.registerLayer({
                    id: layerToRegister,
                    name: mapConfig.name,
                    type: "raster",
                    category: `Capítulo ${mapConfig.chapter ?? "N/A"}`,
                    visible: true,
                    opacity: styles.rasterOpacity,
                    zIndex: 0,
                    metadata: {
                      description: mapConfig.description,
                      chapter: mapConfig.chapter,
                    },
                  });
                }
              }

              const view = {
                center: loadedMap.getCenter().toArray() as [number, number],
                zoom: loadedMap.getZoom(),
                bearing: loadedMap.getBearing(),
              };

              setInitialView(view);
              setMapBuilt(true);

              // Precargar tiles zoom 0-7 de la región durante tiempo idle.
              // Se inicia 2 s después de que el mapa queda visible, con
              // requestIdleCallback para no competir con interacciones del usuario.
              if (settings.useTiles && settings.tilesConfig) {
                prefetchCancelRef.current?.();

                // Prefetch solo cuando se habilita explícitamente por mapa.
                if (settings.tilesConfig.prefetchEnabled === true) {
                  const prefetchCap = settings.tilesConfig.prefetchMaxZoom ?? 7;
                  const basePrefetchMaxZoom = Math.min(
                    settings.tilesConfig.maxZoom,
                    prefetchCap,
                  );
                  const prefetchMaxZoom = settings.tilesConfig.adaptiveLoading
                    ? resolveAdaptivePrefetchMaxZoom(basePrefetchMaxZoom)
                    : basePrefetchMaxZoom;

                  if (
                    prefetchMaxZoom !== null &&
                    prefetchMaxZoom >= settings.tilesConfig.minZoom
                  ) {
                    prefetchCancelRef.current = prefetchRegionTiles({
                      urlTemplate: settings.tilesConfig.urlTemplate,
                      bounds: settings.tilesConfig.bounds ?? adjustedBounds,
                      minZoom: 0,
                      maxZoom: prefetchMaxZoom,
                    });
                  }
                }
              }

              logger.info("MAP_INIT", `Mapa listo: ${mapConfig.name}`, view);
              onMapBuildRef.current?.(loadedMap, mapConfig);
            } catch (buildErr: unknown) {
              if (cancelled) return;
              const msg = `Error construyendo mapa: ${getErrorMessage(buildErr)}`;
              logger.error("MAP_INIT", msg, buildErr);
              setError(msg);
              onErrorRef.current?.(msg);
            }
          },

          onError: (mapErrorEvent) => {
            if (cancelled) return;

            const sourceId = mapErrorEvent?.sourceId as string | undefined;
            const innerError = mapErrorEvent?.error;
            const rawMessage =
              innerError?.message ??
              mapErrorEvent?.message ??
              "Error desconocido";

            if (isRecoverableMapError(sourceId, rawMessage)) {
              logger.warn("MAP_INIT", "Error no fatal de source/capa", {
                sourceId,
                message: rawMessage,
              });
              return;
            }

            const msg = `Error del mapa: ${rawMessage}`;
            logger.error("MAP_INIT", msg, mapErrorEvent);
            setError(msg);
            onErrorRef.current?.(msg);
          },
        });
      } catch (initErr: unknown) {
        if (cancelled) return;
        const msg = `Error de inicialización: ${getErrorMessage(initErr)}`;
        logger.error("MAP_INIT", msg, initErr);
        setError(msg);
        onErrorRef.current?.(msg);
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      prefetchCancelRef.current?.();
      prefetchCancelRef.current = null;
      if (mapRef.current) {
        destroyMapInstance(mapRef.current);
        mapRef.current = null;
      }
      mapRendererRef.current = null;
      layerManagerRef.current = null;
    };
    // calculatedZoom está excluido intencionalmente: se lee vía zoomRef.current
    // para evitar destroy+rebuild cuando el zoom converge de Infinity → valor real.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, isReady, enableLegend]);

  return {
    map: mapRef.current,
    mapRenderer: mapRendererRef.current,
    layerManager: layerManagerRef.current,
    mapBuilt,
    lowResReady,
    error,
    initialView,
    loading,
  };
}
