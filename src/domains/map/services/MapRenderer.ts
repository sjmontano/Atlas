/**
 * 🏗️ MAP RENDERER SERVICE - OPTIMIZADO
 * =====================================
 *
 * Servicio especializado para construir y configurar mapas georreferenciados.
 * Versión optimizada que usa boundsCalculator y eliminación duplicación.
 */

import maplibregl from "maplibre-gl";
import type { MapConfig } from "../config/mapConfig";
import mapSettings, {
  getMapSettings,
  resolveRuntimeBounds,
  type RuntimeBoundsResolution,
} from "../config/mapSettings";
import { getMapStyleConfig } from "../config/mapStyles";
import { rotateImageCoordinates } from "../utils/coordinatesRotator";
import {
  processBounds,
  type BoundsResult,
  type GeographicBounds,
  type ImageCoordinates,
} from "./BoundsCalculator";
import { logger } from "./MapLogger";

type PrecomputedGeographicBounds = Pick<
  BoundsResult,
  "bounds" | "coordinates" | "center"
>;

type PrecomputedRuntimeBoundsResolution = Pick<
  RuntimeBoundsResolution,
  "bounds" | "source" | "strategy" | "maxDeltaDegrees"
>;

/**
 * Opciones para renderizar un mapa
 */
export interface MapRenderOptions {
  /** Configuración del mapa */
  config: MapConfig;
  /** Configuraciones adicionales específicas del mapa */
  mapId: string;
  /** Callbacks de eventos */
  onSuccess?: (map: maplibregl.Map, config: MapConfig) => void;
  onError?: (error: string) => void;
}

/**
 * Resultado de cálculo de bounds geográficos
 */
export interface GeographicBoundsResult {
  /** Bounds geográficos [west, south, east, north] */
  bounds: [number, number, number, number];
  /** Coordenadas para MapLibre image source [TL, TR, BR, BL] */
  coordinates: ImageCoordinates;
  /** Centro calculado [lng, lat] */
  center: [number, number];
}

/**
 * Servicio para construir mapas georreferenciados con datos PGW
 *
 * Versión simplificada que delega cálculos complejos a servicios especializados:
 * - boundsCalculator: Cálculo de bounds geográficos
 * - mapConfigProvider: Gestión de configuraciones
 *
 * @example
 * ```ts
 * const renderer = new MapRenderer(map, mapConfig, 'chapter1-encuadres');
 * await renderer.buildGeoreferencedMap();
 * ```
 */
export class MapRenderer {
  private map: maplibregl.Map;
  private config: MapConfig;
  private mapId: string;

  constructor(map: maplibregl.Map, config: MapConfig, mapId: string) {
    this.map = map;
    this.config = config;
    this.mapId = mapId;
  }

  /**
   * Modo temporal de pruebas: intro funciona solo con raster tiles,
   * sin solicitar imagen base (preview/full).
   */
  private isTilesOnlyMode(): boolean {
    const settings = getMapSettings(this.mapId);
    return this.mapId === "intro" && settings.useTiles === true;
  }

  /**
   * Calcula los bounds geográficos del mapa usando boundsCalculator
   *
   * @returns Bounds y centro calculados
   * @throws Error si las dimensiones no están disponibles
   */
  getGeographicBounds(): GeographicBoundsResult {
    logger.log(
      "mapRenderer",
      "📐 [MapRenderer] Calculando bounds geográficos...",
    );

    if (!this.config.dimensions) {
      throw new Error(
        "Dimensiones de imagen no disponibles. Cargar dimensiones antes de calcular bounds.",
      );
    }

    logger.log(
      "mapRenderer",
      "📐 [MapRenderer] Dimensiones disponibles:",
      this.config.dimensions,
    );

    // Usar boundsCalculator centralizado (elimina duplicación)
    const result = processBounds(
      this.config.pgwData,
      this.config.dimensions.width,
      this.config.dimensions.height,
      undefined,
      {
        mapId: this.mapId,
        source: "MapRenderer.getGeographicBounds",
      },
    );

    logger.log(
      "mapRenderer",
      "📐 [MapRenderer] Resultado de processBounds:",
      result,
    );

    if (!result.isValid) {
      throw new Error("Bounds geográficos inválidos después del cálculo");
    }

    const boundsResult = {
      bounds: result.bounds,
      coordinates: result.coordinates,
      center: result.center,
    };

    logger.log(
      "mapRenderer",
      "✅ [MapRenderer] Bounds geográficos calculados:",
      boundsResult,
    );

    return boundsResult;
  }

  /**
   * Añade la imagen georreferenciada como source al mapa
   *
    * Modelo actual:
    * - El bearing del mapa se define desde settings en runtime.
    * - Si la capa base es image source, la rotación de coordenadas
    *   puede aplicarse sobre los vértices para mantener consistencia visual.
    * - En intro (tiles-only) se omite image source y se trabaja con tiles.
   *
   * @param coordinates - Coordenadas de imagen [TL, TR, BR, BL]
   * @param bounds - Bounds geográficos del mapa [west, south, east, north]
   * @returns Bounds ajustados (expandidos si hay rotación, originales si no)
   */
  addGeoreferencedSource(
    coordinates: ImageCoordinates,
    bounds: GeographicBounds,
  ): GeographicBounds {
    if (!this.map.getSource("atlas-georef-image")) {
      const [west, south, east, north] = bounds;

      const baseCoordinates = coordinates;

      // Aplicar rotación del bearing a los vértices si es necesario.
      // El mapa usa bearing nativo desde settings; esta rotación de vértices
      // mantiene la consistencia visual de la imagen base en ese encuadre.
      const settings = getMapSettings(this.mapId);
      const bearing = settings.initialBearing ?? 0;
      const center: [number, number] = [(west + east) / 2, (south + north) / 2];
      const rotatedCoordinates =
        bearing !== 0
          ? rotateImageCoordinates(baseCoordinates, center, bearing)
          : baseCoordinates;

      logger.log(
        "mapRenderer",
        "📍 Coordenadas imagen [TL, TR, BR, BL] (bearing:",
        bearing,
        "):",
        rotatedCoordinates,
      );

      // Usar imagen de baja resolución si está disponible (LQIP).
      // Los tiles de alta resolución se superponen en addTilesLayer().
      const sourceUrl = this.config.lowResImagePath ?? this.config.imagePath;

      this.map.addSource("atlas-georef-image", {
        type: "image",
        url: sourceUrl,
        coordinates: rotatedCoordinates,
      });

      logger.log("mapRenderer", "✅ Source agregado:", this.config.imagePath);

      return bounds; // Retornar bounds originales
    }

    // Si el source ya existe, retornar bounds originales
    return bounds;
  }

  /**
   * Añade la capa raster con estilos configurados
   */
  addRasterLayer(): void {
    const styleConfig = getMapStyleConfig(this.mapId);

    if (!this.map.getLayer("atlas-georef-layer")) {
      this.map.addLayer({
        id: "atlas-georef-layer",
        type: "raster",
        source: "atlas-georef-image",
        paint: {
          "raster-opacity": styleConfig.rasterOpacity,
          "raster-fade-duration": 300,
        },
      });

      logger.log(
        "mapRenderer",
        "✅ Capa raster agregada (opacidad:",
        styleConfig.rasterOpacity,
        ")",
      );
    }
  }

  /**
   * Añade capa de tiles de alta resolución sobre la imagen base
   *
   * Esta capa carga tiles progresivamente según el nivel de zoom,
   * proporcionando alta resolución solo donde el usuario está mirando.
   *
   * Requiere que mapSettings tenga useTiles: true y tilesConfig configurado.
   */
  addTilesLayer(): void {
    const settings = getMapSettings(this.mapId);
    const styleConfig = getMapStyleConfig(this.mapId);

    // Verificar si los tiles están habilitados
    if (!settings.useTiles || !settings.tilesConfig) {
      logger.log("mapRenderer", "ℹ️ Tiles no habilitados para este mapa");
      return;
    }

    const tilesSourceName = `${this.config.id}-tiles`;
    const tilesLayerName = `${this.config.id}-tiles-layer`;
    const config = settings.tilesConfig;

    // Agregar source de tiles
    if (!this.map.getSource(tilesSourceName)) {
      this.map.addSource(tilesSourceName, {
        type: "raster",
        tiles: [config.urlTemplate],
        tileSize: config.tileSize,
        minzoom: config.minZoom,
        maxzoom: config.maxZoom,
        bounds: config.bounds, // Undefined = usar bounds globales
        scheme: "xyz", // Esquema XYZ estándar (usado por GDAL2Tiles)
      });

      logger.log(
        "mapRenderer",
        `🗺️ Source de tiles agregado: ${tilesSourceName}`,
        {
          urlTemplate: config.urlTemplate,
          tileSize: config.tileSize,
          zoomRange: `${config.minZoom}-${config.maxZoom}`,
        },
      );
    }

    // Agregar capa de tiles (encima de la imagen base)
    if (!this.map.getLayer(tilesLayerName)) {
      const tilesOpacity = styleConfig.tileLayerOpacity ?? styleConfig.rasterOpacity;
      this.map.addLayer({
        id: tilesLayerName,
        type: "raster",
        source: tilesSourceName,
        paint: {
          "raster-opacity": tilesOpacity,
          "raster-fade-duration": config.fadeInDuration || 300,
        },
      });

      logger.log("mapRenderer", `✅ Capa de tiles agregada: ${tilesLayerName}`);
    }
  }

  /**
   * Ajusta la vista del mapa a los bounds
   *
    * Conserva el bearing actual al ejecutar fitBounds para evitar
    * que el mapa vuelva a north-up durante ajustes de cámara.
   *
   * @param bounds - Bounds geográficos
   * @param options - Opciones de ajuste (padding, duration)
   */
  fitMapToBounds(
    bounds: GeographicBounds,
    options?: {
      padding?:
      | number
      | { top: number; right: number; bottom: number; left: number };
      duration?: number;
    },
  ): void {
    const { padding = 20, duration = 1000 } = options || {};
    const currentBearing = this.map.getBearing();

    logger.log(
      "mapRenderer",
      `🗺️ [fitMapToBounds] Ajustando vista a bounds con fitBounds() estándar`,
      { bounds, padding, duration, currentBearing },
    );

    // Conserva el bearing actual para no perder la rotación fija del mapa.
    this.map.fitBounds(bounds, {
      padding,
      duration,
      bearing: currentBearing,
    });

    logger.log("mapRenderer", `✅ [fitMapToBounds] Vista ajustada a bounds`);
  }

  /**
   * Construye completamente el mapa georreferenciado
   *
   * Secuencia:
   * 1. Calcula bounds geográficos
   * 2. Añade source de imagen (con coordenadas rotadas si aplica)
   * 3. Añade capa raster
   * 4. Ajusta vista a bounds
   *
   * @returns Bounds ajustados (si hay rotación, serán diferentes a los originales)
   * @throws Error si hay problemas en la construcción
   */
  async buildGeoreferencedMap(
    onLowResReady?: () => void,
    precomputedBounds?: PrecomputedGeographicBounds,
    precomputedRuntimeBounds?: PrecomputedRuntimeBoundsResolution,
  ): Promise<GeographicBounds> {
    logger.log(
      "mapRenderer",
      "\n🏭️ [MapRenderer] ========== INICIO buildGeoreferencedMap ==========",
    );
    logger.group(
      "mapRenderer",
      `\n🏭️ [MapRenderer] ========== INICIO buildGeoreferencedMap: ${this.config.name} ==========`,
    );

    logger.table("mapRenderer", {
      Imagen: this.config.imagePath,
      Ancho: this.config.dimensions?.width,
      Alto: this.config.dimensions?.height,
    });

    try {
      logger.group("mapRenderer", "📐 Paso 1: Calcular Bounds Geográficos");
      const geographicBounds = precomputedBounds ?? this.getGeographicBounds();
      const { bounds: computedBounds, coordinates } = geographicBounds;
      if (precomputedBounds) {
        logger.log(
          "mapRenderer",
          "📐 [MapRenderer] Reutilizando bounds precomputados desde useMapBounds",
        );
      }
      logger.log("mapRenderer", "✅ Bounds:", computedBounds);
      logger.groupEnd("mapRenderer");

      const settings = getMapSettings(this.mapId);
      const tilesOnlyMode = this.isTilesOnlyMode();
      const runtimeBounds =
        precomputedRuntimeBounds ??
        resolveRuntimeBounds({
          mapId: this.mapId,
          pgwBounds: computedBounds,
          imagePixels: this.config.dimensions
            ? {
              width: this.config.dimensions.width,
              height: this.config.dimensions.height,
            }
            : undefined,
          settings,
        });
      const effectiveBounds = runtimeBounds.bounds;

      if (precomputedRuntimeBounds) {
        logger.log(
          "mapRenderer",
          "🧭 [MapRenderer] Reutilizando bounds runtime precomputados desde useAtlasMap",
        );
      }

      if (runtimeBounds.source !== "pgw") {
        logger.log(
          "mapRenderer",
          "🧭 Bounds runtime resueltos para perfil tiles:",
          {
            source: runtimeBounds.source,
            strategy: runtimeBounds.strategy,
            maxDeltaDegrees: runtimeBounds.maxDeltaDegrees,
            bounds: effectiveBounds,
          },
        );
      }

      if (!tilesOnlyMode) {
        logger.group(
          "mapRenderer",
          "🖼️ Paso 2: Agregar Source Georreferenciado",
        );
        this.addGeoreferencedSource(coordinates, computedBounds);
        logger.groupEnd("mapRenderer");

        // Detectar cuándo la imagen de baja resolución termina de descargarse
        // para notificar al shell y activar la transición semi-transparente.
        if (onLowResReady) {
          const handler = (e: maplibregl.MapSourceDataEvent) => {
            if (
              e.sourceId === "atlas-georef-image" &&
              this.map.isSourceLoaded("atlas-georef-image")
            ) {
              this.map.off("sourcedata", handler);
              logger.log(
                "mapRenderer",
                "✅ Imagen base cargada — shell semi-transparente",
              );
              onLowResReady();
            }
          };
          this.map.on("sourcedata", handler);
        }

        logger.group("mapRenderer", "🎨 Paso 3: Agregar Capa Raster");
        this.addRasterLayer();
        logger.groupEnd("mapRenderer");
      } else {
        logger.log(
          "mapRenderer",
          "🧪 Modo solo tiles activo para intro: se omite imagen base",
        );
        onLowResReady?.();
      }

      logger.group(
        "mapRenderer",
        "🔲 Paso 3.5: Agregar Tiles de Alta Resolución",
      );
      this.addTilesLayer();
      logger.groupEnd("mapRenderer");

      // Verificar si hay initialZoom configurado explícitamente
      const hasExplicitZoom =
        mapSettings[this.mapId]?.initialZoom !== undefined;

      logger.group("mapRenderer", "🗺️ Paso 4: Ajustar Vista a Bounds");

      if (hasExplicitZoom) {
        // Solo centrar el mapa sin ajustar zoom (respeta initialZoom configurado)
        const center = [
          (effectiveBounds[0] + effectiveBounds[2]) / 2,
          (effectiveBounds[1] + effectiveBounds[3]) / 2,
        ] as [number, number];

        this.map.setCenter(center);
      } else {
        const center = [
          (effectiveBounds[0] + effectiveBounds[2]) / 2,
          (effectiveBounds[1] + effectiveBounds[3]) / 2,
        ] as [number, number];

        if (tilesOnlyMode && this.mapId === "intro") {
          // Intro usa el zoom auto-calculado en useAtlasMap para llenar viewport
          // sin dejar holgura lateral; aquí solo recentramos.
          this.map.setCenter(center);
        } else {
          // Calcular zoom automáticamente basado en bounds
          this.fitMapToBounds(effectiveBounds, {
            padding: { top: 20, right: 20, bottom: 20, left: 20 },
            duration: 0,
          });
        }

        // En intro con bearing fijo, bloquear zoom-out al encuadre
        // calculado evita expansión lateral perceptual.
        if (tilesOnlyMode && this.mapId === "intro") {
          const fittedZoom = this.map.getZoom();
          this.map.setMinZoom(fittedZoom);
          logger.log(
            "mapRenderer",
            "🔒 Min zoom fijado al fit de intro:",
            fittedZoom,
          );
        }
      }

      logger.groupEnd("mapRenderer");

      logger.log(
        "mapRenderer",
        `✅ ${this.config.name} renderizado exitosamente`,
      );
      logger.groupEnd("mapRenderer");
      logger.log(
        "mapRenderer",
        "🏭️ [MapRenderer] ========== FIN buildGeoreferencedMap ==========\n",
      );

      return effectiveBounds;
    } catch (error: unknown) {
      logger.groupEnd("mapRenderer");
      const detail = error instanceof Error ? error.message : String(error);
      const errorMsg = `Error construyendo mapa ${this.config.name}: ${detail}`;
      logger.error("mapRenderer", `❌ [MapRenderer] ${errorMsg}`, error);
      throw new Error(errorMsg);
    }
  }

  /**
   * Limpia los recursos del renderer
   */
  cleanup(): void {
    if (this.map.getLayer("atlas-georef-layer")) {
      this.map.removeLayer("atlas-georef-layer");
    }

    if (this.map.getSource("atlas-georef-image")) {
      this.map.removeSource("atlas-georef-image");
    }
  }

  /**
   * Obtiene información del estado actual del mapa
   */
  getMapInfo(): {
    name: string;
    center: [number, number];
    zoom: number;
    bearing: number;
    hasGeoreferenceLayer: boolean;
  } {
    return {
      name: this.config.name,
      center: this.map.getCenter().toArray() as [number, number],
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing(),
      hasGeoreferenceLayer: !!this.map.getLayer("atlas-georef-layer"),
    };
  }
}

/**
 * Factory function para crear un MapRenderer
 *
 * @param map - Instancia de MapLibre
 * @param config - Configuración del mapa
 * @param mapId - ID del mapa
 * @returns Instancia de MapRenderer
 *
 * @example
 * ```ts
 * const renderer = createMapRenderer(map, mapConfig, 'chapter1-encuadres');
 * await renderer.buildGeoreferencedMap();
 * ```
 */
export function createMapRenderer(
  map: maplibregl.Map,
  config: MapConfig,
  mapId: string,
): MapRenderer {
  return new MapRenderer(map, config, mapId);
}

/**
 * Valida si un mapa está listo para renderizar
 *
 * @param config - Configuración del mapa a validar
 * @returns Resultado de validación con errores si los hay
 *
 * @example
 * ```ts
 * const validation = validateMapForRendering(mapConfig);
 * if (!validation.valid) {
 *   console.error('Errores:', validation.errors);
 * }
 * ```
 */
export function validateMapForRendering(config: MapConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar datos PGW (debe ser array de 6 números)
  if (!config.pgwData) {
    errors.push("Datos PGW no definidos");
  } else if (!Array.isArray(config.pgwData)) {
    errors.push("Datos PGW deben ser un array");
  } else if (config.pgwData.length !== 6) {
    errors.push(
      `Datos PGW deben tener 6 elementos, encontrados: ${config.pgwData.length}`,
    );
  } else {
    // Validar que todos los elementos sean números válidos
    config.pgwData.forEach((value, index) => {
      if (typeof value !== "number" || isNaN(value)) {
        errors.push(
          `Elemento PGW[${index}] inválido: ${value} (debe ser número)`,
        );
      }
    });
  }

  // Validar ruta de imagen
  if (!config.imagePath) {
    errors.push("Ruta de imagen no definida");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
