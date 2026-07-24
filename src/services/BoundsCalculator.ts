/**
 * 📐 CALCULADOR DE BOUNDS GEOGRÁFICOS
 * ====================================
 *
 * Transforma datos PGW (World File) en coordenadas geográficas para
 * MapLibre ImageSource, usando la transformación afín:
 *
 *   lng = A·col + B·row + C
 *   lat = D·col + E·row + F
 *
 * La fórmula es genérica: funciona con PGW estándar (B=D=0) y con PGW
 * rotado (A=E=0, B≠0, D≠0) sin conversión. Con PGW rotado la imagen tiene
 * el norte geográfico "a la derecha" y MapLibre la alinea con bearing −90.
 *
 * C/F representan el CENTRO del píxel (0,0). Se aplica corrección
 * half-pixel para obtener la esquina real de la imagen.
 */

export type GeographicBounds = [number, number, number, number] // [west, south, east, north]
export type GeoCoordinate = [number, number] // [lng, lat]
export type ImageCoordinates = [
  GeoCoordinate, // top-left
  GeoCoordinate, // top-right
  GeoCoordinate, // bottom-right
  GeoCoordinate, // bottom-left
]
export type PGWData = readonly [number, number, number, number, number, number]

export interface BoundsResult {
  /** Bounds geográficos [west, south, east, north] */
  bounds: GeographicBounds
  /** Coordenadas para MapLibre image source [TL, TR, BR, BL] */
  coordinates: ImageCoordinates
  /** Centro calculado [lng, lat] */
  center: GeoCoordinate
  /** Si los bounds son números finitos */
  isValid: boolean
}

function boundsFromCoordinates(coordinates: ImageCoordinates): GeographicBounds {
  const lngs = coordinates.map((c) => c[0])
  const lats = coordinates.map((c) => c[1])
  return [
    Math.min(...lngs),
    Math.min(...lats),
    Math.max(...lngs),
    Math.max(...lats),
  ]
}

/**
 * Calcula las 4 esquinas geográficas de la imagen en orden MapLibre
 * [top-left, top-right, bottom-right, bottom-left].
 *
 * @param pgwData - Array PGW [A, D, B, E, C, F]
 * @param width - Ancho de la imagen en píxeles (portrait original)
 * @param height - Alto de la imagen en píxeles (portrait original)
 *
 * @example
 * // PGW rotado del mapa intro:
 * calculateImageCoordinates(
 *   [0, 0.001181998411, 0.001182047579, 0, -78.907953, -0.290036],
 *   5649, 11141
 * )
 * // TL ≈ [-78.9085, -0.2906]  BR ≈ [-65.7393, 6.3865]
 */
export function calculateImageCoordinates(
  pgwData: PGWData,
  width: number,
  height: number,
): ImageCoordinates {
  const [a, d, b, e, c, f] = pgwData

  // Centro del píxel (0,0) → esquina superior izquierda real
  const x0 = c - 0.5 * a - 0.5 * b
  const y0 = f - 0.5 * d - 0.5 * e

  const topLeft: GeoCoordinate = [x0, y0]
  const topRight: GeoCoordinate = [x0 + a * width, y0 + d * width]
  const bottomRight: GeoCoordinate = [
    x0 + a * width + b * height,
    y0 + d * width + e * height,
  ]
  const bottomLeft: GeoCoordinate = [x0 + b * height, y0 + e * height]

  return [topLeft, topRight, bottomRight, bottomLeft]
}

/**
 * Calcula bounds geográficos axis-aligned [west, south, east, north]
 * desde datos PGW.
 */
export function calculateGeographicBounds(
  pgwData: PGWData,
  width: number,
  height: number,
): GeographicBounds {
  return boundsFromCoordinates(calculateImageCoordinates(pgwData, width, height))
}

/**
 * Calcula el centro de unos bounds.
 */
export function calculateCenter(bounds: GeographicBounds): GeoCoordinate {
  return [
    bounds[0] + (bounds[2] - bounds[0]) / 2,
    bounds[1] + (bounds[3] - bounds[1]) / 2,
  ]
}

/**
 * Valida que los bounds sean números finitos.
 */
export function validateBounds(bounds: GeographicBounds): boolean {
  return bounds.every((v) => Number.isFinite(v))
}

/**
 * Expande unos bounds por un factor fraccionario en cada lado.
 * Útil para crear viewportMaxBounds con margen alrededor de la imagen.
 *
 * @param bounds - Bounds originales
 * @param factor - Fracción a expandir (0.15 = 15% por lado)
 *
 * @example
 * expandBounds([-78.9, -0.3, -65.7, 6.4], 0.1)
 * // west −10% del span, south −10%, east +10%, north +10%
 */
export function expandBounds(
  bounds: GeographicBounds,
  factor: number,
): GeographicBounds {
  const [west, south, east, north] = bounds
  const lonPad = (east - west) * factor
  const latPad = (north - south) * factor
  return [
    west - lonPad,
    south - latPad,
    east + lonPad,
    north + latPad,
  ]
}

/**
 * Procesa bounds completos: coordenadas + bounds + centro + validación.
 */
export function processBounds(
  pgwData: PGWData,
  width: number,
  height: number,
): BoundsResult {
  const coordinates = calculateImageCoordinates(pgwData, width, height)
  const bounds = boundsFromCoordinates(coordinates)
  const center = calculateCenter(bounds)
  const isValid = validateBounds(bounds)

  return { bounds, coordinates, center, isValid }
}
