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
 * ESTRATEGIA DE CONVERSIÓN PGW — Auditoría 2026-07-30
 * ===================================================
 *
 * PGW rotado (A=0, E=0, B≠0, D≠0):
 *   Imagen de cartografía en orientación portrait física. Los ejes están
 *   intercambiados respecto al espacio geográfico: columnas → latitud (D),
 *   filas → longitud (B). MapLibre ImageSource NO puede interpretar este
 *   formato correctamente porque espera coordenadas donde TL→TR sea un
 *   paralelo (misma latitud), no una meridiana.
 *
 *   **Solución probada en v17**: convertir automáticamente a PGW estándar
 *   (B=D=0) antes de calcular coordenadas. La conversión es 90° horario:
 *     A_std = D       D_std = 0
 *     B_std = 0       E_std = −B
 *     C_std = C       F_std = F + B·H   (origen SW → NW)
 *
 *   Con PGW estándar + bearing=−90 en MapLibre, la imagen portrait se
 *   alinea perfectamente con el basemap.
 *
 * PGW mixto (A≠0, E≠0, B≠0, D≠0):
 *   PGW con componentes residuales de rotación. La fórmula afín genérica
 *   maneja estos casos directamente sin conversión.
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
 * Detecta si un PGW está en formato rotado (ejes intercambiados).
 * Condición: A ≈ 0, E ≈ 0, B ≠ 0, D ≠ 0.
 */
function isRotatedPGW(a: number, e: number, b: number, d: number): boolean {
  const ε = 1e-10
  return (
    Math.abs(a) < ε &&
    Math.abs(e) < ε &&
    Math.abs(b) > ε &&
    Math.abs(d) > ε
  )
}

/**
 * Convierte PGW rotado (A=0, E=0) a PGW estándar (B=0, D=0).
 *
 * Los PGW rotados provienen de imágenes portrait donde las columnas
 * mapean a latitud y las filas a longitud. MapLibre ImageSource espera
 * coordenadas en orden [NW, NE, SE, SW] con el borde superior paralelo
 * a un paralelo. Esta conversión rota el PGW 90° horario:
 *
 *   A_std = D       B_std = 0       C_std = C
 *   D_std = 0       E_std = −B      F_std = F + B·H
 *
 * F_std desplaza el origen de la esquina SW a la esquina NW.
 *
 * @param pgw - PGW rotado [0, D, B, 0, C, F]
 * @param height - Alto de la imagen en píxeles
 * @returns PGW estándar [A, 0, 0, E, C, F_nw]
 */
function convertRotatedPGW(
  pgw: PGWData,
  height: number,
): PGWData {
  const [, d, b, , c, f] = pgw
  return [d, 0, 0, -b, c, f + b * height]
}

/**
 * Calcula las 4 esquinas geográficas de la imagen en orden MapLibre
 * [top-left, top-right, bottom-right, bottom-left].
 *
 * Recibe PGW estándar (B=0, D=0) — la conversión desde PGW rotado
 * ocurre en processBounds() antes de llamar a esta función.
 *
 * @param pgwData - PGW estándar [A, 0, 0, E, C, F] con F en esquina NW
 * @param width - Ancho de la imagen en píxeles
 * @param height - Alto de la imagen en píxeles
 *
 * @example
 * // PGW estándar del mapa intro:
 * calculateImageCoordinates(
 *   [0.001182, 0, 0, -0.001182, -78.908, 12.880],
 *   5649, 11141
 * )
 * // TL ≈ [-78.9085, 12.880]  BR ≈ [-72.231, -0.290]
 */
export function calculateImageCoordinates(
  pgwData: PGWData,
  width: number,
  height: number,
): ImageCoordinates {
  const [a, d, b, e, c, f] = pgwData

  // Centro del píxel (0,0) → esquina superior izquierda real (NW)
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
 *
 * Si detecta PGW rotado (A=0, E=0), lo convierte automáticamente a
 * PGW estándar antes de calcular coordenadas. Esto garantiza que
 * MapLibre ImageSource reciba las 4 esquinas en orden [NW, NE, SE, SW]
 * con el borde superior paralelo a un paralelo.
 */
export function processBounds(
  pgwData: PGWData,
  width: number,
  height: number,
): BoundsResult {
  const [a, d, b, e] = pgwData
  const effectivePGW = isRotatedPGW(a, e, b, d)
    ? convertRotatedPGW(pgwData, height)
    : pgwData

  const coordinates = calculateImageCoordinates(effectivePGW, width, height)
  const bounds = boundsFromCoordinates(coordinates)
  const center = calculateCenter(bounds)
  const isValid = validateBounds(bounds)

  return { bounds, coordinates, center, isValid }
}
