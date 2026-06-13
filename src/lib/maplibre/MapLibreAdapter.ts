/**
 * 🗺️ GESTOR DE INSTANCIAS MAPLIBRE
 * ==================================
 *
 * Servicio para crear y configurar instancias de MapLibre GL JS.
 * Encapsula toda la lógica de creación y configuración del mapa.
 *
 * ROTACIÓN NATIVA CON MAPLIBRE:
 * ==============================
 * - Bearing aplicado directamente en MapLibre (GPU-accelerated)
 * - Imagen base y tiles usan coordenadas originales
 * - Sincronización perfecta entre todas las capas
 * - dragRotate desactivado para evitar rotación del usuario
 */

import type { GeographicBounds } from "@map/services/BoundsCalculator";
import { logger } from "@map/services/MapLogger";
import maplibregl from "maplibre-gl";

type MapOptionsWithViscosity = maplibregl.MapOptions & {
  maxBoundsViscosity?: number;
};

type EffectiveConnectionType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformationLike {
  effectiveType?: EffectiveConnectionType;
  saveData?: boolean;
}

interface RuntimeMapProfile {
  effectiveType?: EffectiveConnectionType;
  saveData: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  lowEndDevice: boolean;
}

const OSM_STREET_TILE_TEMPLATE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const buildMapStyle = (
  streetViewEnabled: boolean,
): maplibregl.StyleSpecification => {
  if (!streetViewEnabled) {
    return {
      version: 8,
      sources: {},
      layers: [],
    };
  }

  return {
    version: 8,
    sources: {
      "street-view-source": {
        type: "raster",
        tiles: [OSM_STREET_TILE_TEMPLATE],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "street-view-layer",
        type: "raster",
        source: "street-view-source",
        paint: {
          "raster-opacity": 1,
        },
      },
    ],
  };
};

const getRuntimeMapProfile = (): RuntimeMapProfile => {
  if (typeof navigator === "undefined") {
    return { saveData: false, lowEndDevice: false };
  }

  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    deviceMemory?: number;
  };

  const connection = nav.connection;
  const deviceMemory =
    typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined;
  const hardwareConcurrency =
    typeof nav.hardwareConcurrency === "number"
      ? nav.hardwareConcurrency
      : undefined;

  const lowEndDevice =
    (typeof deviceMemory === "number" && deviceMemory <= 4) ||
    (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4);

  return {
    effectiveType: connection?.effectiveType,
    saveData: connection?.saveData === true,
    deviceMemory,
    hardwareConcurrency,
    lowEndDevice,
  };
};

const resolveAdaptiveTileCacheSize = (profile: RuntimeMapProfile): number => {
  if (profile.saveData || profile.effectiveType === "slow-2g") {
    return 110;
  }

  if (profile.effectiveType === "2g" || profile.effectiveType === "3g") {
    return 160;
  }

  if (profile.lowEndDevice) {
    return 220;
  }

  return 400;
};

export interface MapInstanceOptions {
  /** Contenedor DOM del mapa */
  container: HTMLElement;
  /** Centro inicial [lng, lat] */
  center: [number, number];
  /** Nivel de zoom inicial */
  zoom: number;
  /** Rotación inicial del mapa en grados (0-360) */
  bearing?: number;
  /** Zoom mínimo */
  minZoom?: number;
  /** Zoom máximo */
  maxZoom?: number;
  /** Bounds máximos del mapa */
  maxBounds?: GeographicBounds;
  /** Permitir arrastre panorámico */
  dragPan?: boolean;
  /** Permitir zoom con scroll */
  scrollZoom?: boolean;
  /** Mostrar base raster tipo Street View (OSM) */
  streetViewEnabled?: boolean;
}

/**
 * Crea una instancia de MapLibre con configuración base
 *
 * ROTACIÓN NATIVA: bearing aplicado directamente en MapLibre
 *
 * @param options - Opciones de configuración del mapa
 * @returns Instancia de MapLibre GL Map
 *
 * @example
 * ```ts
 * const map = createMapInstance({
 *   container: document.getElementById('map')!,
 *   center: [-76.4, 3.425],
 *   zoom: 10,
 *   bearing: 90, // Rotación 90° (nativa)
 *   minZoom: 8,
 *   maxZoom: 18,
 *   maxBounds: [-77, 3, -76, 4],
 * });
 * ```
 */
export function createMapInstance(options: MapInstanceOptions): maplibregl.Map {
  const {
    container,
    center,
    zoom,
    bearing = 0, // Bearing desde settings (90, -15, etc.)
    minZoom = 0,
    maxZoom = 22,
    maxBounds,
    dragPan = true,
    scrollZoom = true,
    streetViewEnabled = true,
  } = options;

  const runtimeProfile = getRuntimeMapProfile();
  const tileCacheSize = resolveAdaptiveTileCacheSize(runtimeProfile);

  const mapOptions: MapOptionsWithViscosity = {
    container,
    style: buildMapStyle(streetViewEnabled),
    center,
    zoom,
    bearing, // 🔑 Rotación nativa de MapLibre
    minZoom,
    maxZoom,
    maxBounds,
    dragPan,
    dragRotate: false, // 🔑 Usuario no puede rotar (bearing fijo)
    scrollZoom,
    touchZoomRotate: false, // 🔑 Rotación táctil desactivada
    // Cache adaptativa: menor presión de memoria en equipos modestos/red lenta.
    maxTileCacheSize: tileCacheSize,
    // Evita revalidaciones frecuentes (304) cuando el tile ya está en cache.
    refreshExpiredTiles: false,
    trackResize: true,
  };

  // ✅ Aplicar maxBoundsViscosity si hay bounds definidos
  // maxBoundsViscosity = 1.0 → Paredes rígidas (no elásticas)
  if (maxBounds) {
    mapOptions.maxBoundsViscosity = 1.0;
  }

  logger.log("mapLibreManager", "🗺️ Creando instancia MapLibre con opciones:", {
    center,
    zoom,
    bearing, // Rotación nativa
    minZoom,
    maxZoom,
    maxBounds,
    maxBoundsViscosity: maxBounds ? 1.0 : undefined,
    interactions: {
      dragPan,
      dragRotate: false,
      scrollZoom,
      touchZoomRotate: false,
    },
    baseStyle: {
      streetViewEnabled,
      tileTemplate: streetViewEnabled ? OSM_STREET_TILE_TEMPLATE : undefined,
    },
    performance: {
      maxTileCacheSize: tileCacheSize,
      effectiveType: runtimeProfile.effectiveType,
      saveData: runtimeProfile.saveData,
      deviceMemory: runtimeProfile.deviceMemory,
      hardwareConcurrency: runtimeProfile.hardwareConcurrency,
    },
  });

  const map = new maplibregl.Map(mapOptions);
  logger.log(
    "mapLibreManager",
    "✅ Instancia MapLibre creada con bearing:",
    bearing,
  );

  return map;
}

/**
 * Destruye una instancia de mapa de forma segura
 *
 * @param map - Instancia del mapa a destruir
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   const map = createMapInstance(options);
 *   return () => destroyMapInstance(map);
 * }, []);
 * ```
 */
export function destroyMapInstance(map: maplibregl.Map | null): void {
  if (map) {
    map.remove();
  }
}

/**
 * Configuración de eventos comunes del mapa
 */
export interface MapEventHandlers {
  /** Callback cuando el mapa termina de cargar */
  onLoad?: (map: maplibregl.Map) => void | Promise<void>;
  /** Callback cuando hay un error */
  onError?: (errorEvent: MapErrorEventLike) => void;
  /** Callback cuando el mapa se mueve */
  onMove?: (map: maplibregl.Map) => void;
  /** Callback cuando cambia el zoom */
  onZoom?: (map: maplibregl.Map) => void;
  /** Callback cuando cambia la rotación */
  onRotate?: (map: maplibregl.Map) => void;
}

export interface MapErrorEventLike {
  sourceId?: string;
  message?: string;
  error?: Error | { message?: string };
}

/**
 * Registra manejadores de eventos comunes en el mapa
 *
 * @param map - Instancia del mapa
 * @param handlers - Manejadores de eventos
 *
 * @example
 * ```ts
 * registerMapEventHandlers(map, {
 *   onLoad: async (map) => {
 *     await buildGeoreferencedMap(map);
 *   },
 *   onError: (error) => {
 *     console.error('Map error:', error);
 *   },
 * });
 * ```
 */
export function registerMapEventHandlers(
  map: maplibregl.Map,
  handlers: MapEventHandlers,
): void {
  const { onLoad, onError, onMove, onZoom, onRotate } = handlers;

  if (onLoad) {
    map.on("load", () => onLoad(map));
  }

  if (onError) {
    map.on("error", (e) => onError(e as MapErrorEventLike));
  }

  if (onMove) {
    map.on("move", () => onMove(map));
  }

  if (onZoom) {
    map.on("zoom", () => onZoom(map));
  }

  if (onRotate) {
    map.on("rotate", () => onRotate(map));
  }
}

/* ============================================================================
 * ⚠️ FUNCIÓN ELIMINADA - NO NECESARIA CON TURF.JS
 * ============================================================================
 *
 * applyBearing() eliminada porque:
 * - Con Turf.js, el mapa siempre tiene bearing: 0
 * - La rotación se aplica a las coordenadas de la imagen, no al mapa
 * - No hay necesidad de rotar el mapa después de cargarlo
 *
 * Si necesitas rotar la imagen, modifica imageRotation en mapSettings.ts
 * ============================================================================ */
