/**
 * 🔄 ROTADOR DE COORDENADAS GEOGRÁFICAS
 * ======================================
 *
 * Utilidad para rotar coordenadas geográficas alrededor de un punto central.
 * Usado para rotar image sources en MapLibre según el bearing del mapa.
 */

export type GeoCoordinate = [number, number]; // [lng, lat]

/**
 * Rota un punto geográfico alrededor de un centro
 *
 * @param point - Punto a rotar [lng, lat]
 * @param center - Centro de rotación [lng, lat]
 * @param angleDegrees - Ángulo de rotación en grados (positivo = horario)
 * @returns Punto rotado [lng, lat]
 *
 * @example
 * ```ts
 * const rotated = rotatePoint(
 *   [-76.5, 3.5],
 *   [-76.4, 3.4],
 *   -90
 * );
 * ```
 */
export function rotatePoint(
  point: GeoCoordinate,
  center: GeoCoordinate,
  angleDegrees: number,
): GeoCoordinate {
  const angleRad = (angleDegrees * Math.PI) / 180;

  // Trasladar al origen
  const dx = point[0] - center[0];
  const dy = point[1] - center[1];

  // Rotar
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const rotatedX = dx * cos - dy * sin;
  const rotatedY = dx * sin + dy * cos;

  // Trasladar de vuelta
  return [center[0] + rotatedX, center[1] + rotatedY];
}

/**
 * Rota las coordenadas de una imagen georreferenciada
 *
 * Las coordenadas de MapLibre image source son:
 * [topLeft, topRight, bottomRight, bottomLeft]
 *
 * @param coordinates - Coordenadas originales de la imagen
 * @param center - Centro de rotación [lng, lat]
 * @param bearing - Bearing del mapa en grados
 * @returns Coordenadas rotadas
 *
 * @example
 * ```ts
 * const rotated = rotateImageCoordinates(
 *   [
 *     [-76.5, 3.5],  // TL
 *     [-76.3, 3.5],  // TR
 *     [-76.3, 3.3],  // BR
 *     [-76.5, 3.3],  // BL
 *   ],
 *   [-76.4, 3.4],
 *   -90
 * );
 * ```
 */
export function rotateImageCoordinates(
  coordinates: [GeoCoordinate, GeoCoordinate, GeoCoordinate, GeoCoordinate],
  center: GeoCoordinate,
  bearing: number,
): [GeoCoordinate, GeoCoordinate, GeoCoordinate, GeoCoordinate] {
  // Si no hay bearing, retornar las coordenadas originales
  if (Math.abs(bearing) < 0.01) {
    return coordinates;
  }

  // Rotar cada esquina
  return [
    rotatePoint(coordinates[0], center, bearing), // Top-left
    rotatePoint(coordinates[1], center, bearing), // Top-right
    rotatePoint(coordinates[2], center, bearing), // Bottom-right
    rotatePoint(coordinates[3], center, bearing), // Bottom-left
  ];
}
