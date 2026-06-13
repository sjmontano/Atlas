/**
 * 📐 CALCULADOR DE BOUNDS GEOGRÁFICOS
 * ====================================
 *
 * Servicio consolidado para cálculo de bounds geográficos desde datos PGW.
 * Elimina duplicación entre AtlasMapBuilder y MapRenderer.
 */

import { logger } from "./MapLogger";

export type GeographicBounds = [number, number, number, number]; // [west, south, east, north]
export type PGWData = readonly [number, number, number, number, number, number]; // [a, d, b, e, c, f]
export type GeoCoordinate = [number, number]; // [lng, lat]
export type ImageCoordinates = [
  GeoCoordinate,
  GeoCoordinate,
  GeoCoordinate,
  GeoCoordinate,
]; // [top-left, top-right, bottom-right, bottom-left]

export interface BoundsCorrections {
  left?: number;
  bottom?: number;
  right?: number;
  top?: number;
}

export interface BoundsResult {
  /** Bounds geográficos [west, south, east, north] */
  bounds: GeographicBounds;
  /** Coordenadas para MapLibre image source [TL, TR, BR, BL] */
  coordinates: ImageCoordinates;
  /** Centro calculado [lng, lat] */
  center: [number, number];
  /** Si los bounds son válidos */
  isValid: boolean;
}

export interface BoundsTraceOptions {
  /** Identificador del mapa para facilitar comparaciones */
  mapId?: string;
  /** Fuente de la llamada (hook/servicio) */
  source?: string;
  /** Fuerza habilitar o deshabilitar trazas */
  enabled?: boolean;
}

interface AffineGeometryResult {
  origin: GeoCoordinate;
  coordinates: ImageCoordinates;
}

function boundsFromCoordinates(coordinates: ImageCoordinates): GeographicBounds {
  const longitudes = coordinates.map((corner) => corner[0]);
  const latitudes = coordinates.map((corner) => corner[1]);

  return [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ];
}

function buildAffineGeometry(
  pgwData: PGWData,
  width: number,
  height: number,
): AffineGeometryResult {
  const [a, d, b, e, c, f] = pgwData;

  // Convertir centro del píxel (0,0) a esquina superior izquierda real.
  const x0 = c - 0.5 * a - 0.5 * b;
  const y0 = f - 0.5 * d - 0.5 * e;

  const topLeft: GeoCoordinate = [x0, y0];
  const topRight: GeoCoordinate = [x0 + a * width, y0 + d * width];
  const bottomRight: GeoCoordinate = [
    x0 + a * width + b * height,
    y0 + d * width + e * height,
  ];
  const bottomLeft: GeoCoordinate = [x0 + b * height, y0 + e * height];

  return {
    origin: [x0, y0],
    coordinates: [topLeft, topRight, bottomRight, bottomLeft],
  };
}

function shouldTraceBounds(options?: BoundsTraceOptions): boolean {
  if (typeof options?.enabled === "boolean") {
    return options.enabled;
  }

  return Boolean(import.meta.env?.DEV);
}

function traceBoundsCalculation(input: {
  pgwData: PGWData;
  width: number;
  height: number;
  origin: GeoCoordinate;
  coordinates: ImageCoordinates;
  bounds: GeographicBounds;
  center: [number, number];
  isValid: boolean;
  corrections?: BoundsCorrections;
  traceOptions?: BoundsTraceOptions;
}): void {
  const {
    pgwData,
    width,
    height,
    origin,
    coordinates,
    bounds,
    center,
    isValid,
    corrections,
    traceOptions,
  } = input;

  const [a, d, b, e] = pgwData;
  const [west, south, east, north] = bounds;
  const [x0, y0] = origin;

  const footprintWidth = east - west;
  const footprintHeight = north - south;
  const horizontalDegreesPerPixel = width !== 0 ? footprintWidth / width : NaN;
  const verticalDegreesPerPixel = height !== 0 ? footprintHeight / height : NaN;

  logger.group("boundsCalculator", "[BoundsCalculator] Cálculo PGW -> Bounds");
  logger.log("boundsCalculator", "Entradas", {
    mapId: traceOptions?.mapId ?? "unknown",
    source: traceOptions?.source ?? "processBounds",
    pgwData,
    imagePixels: { width, height },
    corrections: corrections ?? null,
  });
  logger.log("boundsCalculator", "Fórmulas aplicadas", {
    originX: "x0 = C - 0.5*A - 0.5*B",
    originY: "y0 = F - 0.5*D - 0.5*E",
    topLeft: "[x0, y0]",
    topRight: "[x0 + W*A, y0 + W*D]",
    bottomRight: "[x0 + W*A + H*B, y0 + W*D + H*E]",
    bottomLeft: "[x0 + H*B, y0 + H*E]",
    bounds: "[west, south, east, north] = min/max de longitudes y latitudes",
  });
  logger.log("boundsCalculator", "Origen corregido medio píxel (x0, y0)", { x0, y0 });
  logger.log("boundsCalculator", "Esquinas [TL, TR, BR, BL]", coordinates);
  logger.log("boundsCalculator", "Bounds [west, south, east, north]", bounds);
  logger.log("boundsCalculator", "Centro [lng, lat]", center);
  logger.log("boundsCalculator", "Comparación tamaño imagen vs huella geográfica", {
    imagePixels: { width, height },
    geographicFootprintDegrees: {
      width: footprintWidth,
      height: footprintHeight,
    },
    derivedDegreesPerPixel: {
      horizontal: horizontalDegreesPerPixel,
      vertical: verticalDegreesPerPixel,
    },
    affineTerms: { A: a, D: d, B: b, E: e },
  });
  logger.log("boundsCalculator", "Resultado válido", isValid);
  logger.groupEnd("boundsCalculator");
}

/**
 * Calcula las 4 esquinas geográficas de la imagen en orden MapLibre
 * [top-left, top-right, bottom-right, bottom-left].
 *
 * Importante: en PGW, C/F representan el centro del píxel (0,0).
 * Para obtener la esquina superior izquierda de la imagen se corrige
 * medio píxel en ambos ejes.
 */
export function calculateImageCoordinates(
  pgwData: PGWData,
  width: number,
  height: number,
): ImageCoordinates {
  return buildAffineGeometry(pgwData, width, height).coordinates;
}

/**
 * Calcula bounds geográficos desde datos PGW
 *
 * Transforma coordenadas pixel a coordenadas geográficas usando
 * la transformación afín definida en el archivo PGW:
 * X = a*x + b*y + c
 * Y = d*x + e*y + f
 *
 * @param pgwData - Array PGW [a, d, b, e, c, f]
 * @param width - Ancho de la imagen en píxeles
 * @param height - Alto de la imagen en píxeles
 * @returns Bounds geográficos [west, south, east, north]
 *
 * @example
 * ```ts
 * const bounds = calculateGeographicBounds(
 *   [0.0001, 0, 0, -0.0001, -76.5, 3.5],
 *   2000,
 *   1500
 * );
 * // [-76.5, 3.35, -76.3, 3.5]
 * ```
 */
export function calculateGeographicBounds(
  pgwData: PGWData,
  width: number,
  height: number,
): GeographicBounds {
  const coordinates = calculateImageCoordinates(pgwData, width, height);
  return boundsFromCoordinates(coordinates);
}

/**
 * Aplica correcciones a los bounds
 *
 * @param bounds - Bounds originales [west, south, east, north]
 * @param corrections - Correcciones a aplicar
 * @returns Bounds corregidos
 *
 * @example
 * ```ts
 * const corrected = applyBoundsCorrections(
 *   [-76.5, 3.35, -76.3, 3.5],
 *   { left: 0.01, right: -0.01 }
 * );
 * // [-76.49, 3.35, -76.31, 3.5]
 * ```
 */
export function applyBoundsCorrections(
  bounds: GeographicBounds,
  corrections?: BoundsCorrections,
): GeographicBounds {
  if (!corrections) {
    return bounds;
  }

  const { left = 0, bottom = 0, right = 0, top = 0 } = corrections;

  const correctedBounds: GeographicBounds = [
    bounds[0] + left, // west
    bounds[1] + bottom, // south
    bounds[2] + right, // east
    bounds[3] + top, // north
  ];

  return correctedBounds;
}

/**
 * Calcula el centro de unos bounds
 *
 * @param bounds - Bounds geográficos [west, south, east, north]
 * @returns Centro [lng, lat]
 *
 * @example
 * ```ts
 * const center = calculateCenter([-76.5, 3.35, -76.3, 3.5]);
 * // [-76.4, 3.425]
 * ```
 */
export function calculateCenter(bounds: GeographicBounds): [number, number] {
  return [
    bounds[0] + (bounds[2] - bounds[0]) / 2, // lng
    bounds[1] + (bounds[3] - bounds[1]) / 2, // lat
  ];
}

/**
 * Valida que los bounds sean números finitos
 *
 * @param bounds - Bounds a validar
 * @returns true si son válidos
 */
export function validateBounds(bounds: GeographicBounds): boolean {
  return bounds.every((v) => Number.isFinite(v));
}

/**
 * Procesa bounds completos: calcula desde PGW, aplica correcciones, valida
 *
 * @param pgwData - Datos PGW
 * @param width - Ancho de imagen
 * @param height - Alto de imagen
 * @param corrections - Correcciones opcionales
 * @returns Resultado completo con bounds, centro y validación
 *
 * @example
 * ```ts
 * const result = processBounds(
 *   [0.0001, 0, 0, -0.0001, -76.5, 3.5],
 *   2000,
 *   1500,
 *   { left: 0.01 }
 * );
 * // {
 * //   bounds: [-76.49, 3.35, -76.3, 3.5],
 * //   center: [-76.395, 3.425],
 * //   isValid: true
 * // }
 * ```
 */
export function processBounds(
  pgwData: PGWData,
  width: number,
  height: number,
  corrections?: BoundsCorrections,
  traceOptions?: BoundsTraceOptions,
): BoundsResult {
  const geometry = buildAffineGeometry(pgwData, width, height);
  const coordinates = geometry.coordinates;
  const rawBounds = boundsFromCoordinates(coordinates);
  const bounds = applyBoundsCorrections(rawBounds, corrections);
  const center = calculateCenter(bounds);
  const isValid = validateBounds(bounds);

  const result: BoundsResult = { bounds, coordinates, center, isValid };

  if (shouldTraceBounds(traceOptions)) {
    traceBoundsCalculation({
      pgwData,
      width,
      height,
      origin: geometry.origin,
      coordinates,
      bounds,
      center,
      isValid,
      corrections,
      traceOptions,
    });
  }

  return result;
}

/* ============================================================================
 * ⚠️ FUNCIONES DESHABILITADAS - NO FUNCIONAN EN MAPLIBRE
 * ============================================================================
 *
 * Las siguientes funciones fueron implementadas basándose en StackOverflow
 * para intentar manejar bounds rotados, pero MapLibre GL JS NO soporta
 * bounds rotados nativamente.
 *
 * PROBLEMA:
 * - MapLibre asume bounds rectangulares norte-sur sin importar el bearing
 * - Expandir el bounding box no resuelve el problema
 * - Los eventos para restricción crean efectos visuales extraños
 *
 * NOTA DE CONTEXTO:
 * - Estas funciones quedaron deshabilitadas por generar restricciones
 *   inconsistentes en MapLibre.
 * - El flujo vigente usa geometría PGW canónica en este servicio y la
 *   rotación/encuadre operativo se resuelve en runtime desde settings.
 *
 * Código eliminado: boundsToPoints() y findRotatedBoundingBox()
 * Fecha: Febrero 2026
 * ============================================================================ */
