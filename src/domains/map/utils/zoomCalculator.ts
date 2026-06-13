/**
 * 🔍 CALCULADOR DE ZOOM AUTOMÁTICO
 * =================================
 *
 * Utilidad para calcular el nivel de zoom óptimo basado en el tamaño
 * del contenedor y los bounds geográficos del mapa.
 */

import type { GeographicBounds } from "../services/BoundsCalculator";

export interface ContainerSize {
  width: number;
  height: number;
}

export interface ZoomSettings {
  /** Zoom mínimo permitido */
  minZoom: number;
  /** Zoom por defecto si no se calcula automático */
  initialZoom: number;
  /** Offset de ajuste (negativo = más alejado) */
  zoomOffset?: number;
  /**
   * Bearing inicial del mapa en grados.
   * Con bearing ±90°, el viewport está rotado 90°: el eje horizontal de la
   * pantalla corresponde al span de latitud y el vertical al de longitud.
   * El calculador intercambia las dimensiones del contenedor para compensar.
   */
  bearing?: number;
}

/**
 * Calcula el zoom automático para que los bounds llenen el viewport
 *
 * Usa la fórmula de conversión de grados a píxeles en proyección Web Mercator:
 * - 1 grado de latitud ≈ 111km
 * - 1 grado de longitud ≈ 111km × cos(latitud)
 *
 * El zoom se calcula para que la imagen llene el contenedor, tomando
 * el zoom más restrictivo (menor) entre latitud y longitud.
 *
 * @param containerSize - Dimensiones del contenedor en píxeles
 * @param bounds - Bounds geográficos [west, south, east, north]
 * @param center - Centro geográfico [lng, lat]
 * @param settings - Configuración de zoom
 * @returns Nivel de zoom calculado
 *
 * @example
 * ```ts
 * const zoom = calculateAutoZoom(
 *   { width: 1920, height: 1080 },
 *   [-76.5, 3.35, -76.3, 3.5],
 *   [-76.4, 3.425],
 *   { minZoom: 8, initialZoom: 10, zoomOffset: -0.5 }
 * );
 * // 12.3
 * ```
 */
export function calculateAutoZoom(
  containerSize: ContainerSize,
  bounds: GeographicBounds,
  center: [number, number],
  settings: ZoomSettings,
): number {
  const { minZoom, initialZoom, zoomOffset = -0.5 } = settings;

  // Si el contenedor no tiene dimensiones válidas, usar zoom por defecto
  if (containerSize.width <= 0 || containerSize.height <= 0) {
    return initialZoom;
  }

  const boundsWidth = bounds[2] - bounds[0]; // Diferencia de longitud
  const boundsHeight = bounds[3] - bounds[1]; // Diferencia de latitud

  // Bounds vacíos o degenerados (mapa aún sin georreferenciar) → zoom por defecto
  if (boundsWidth <= 0 || boundsHeight <= 0) {
    return initialZoom;
  }

  // Con bearing ±90°, la cámara está girada: el eje horizontal de la pantalla
  // corresponde al span de latitud y el vertical al de longitud.
  // Intercambiamos las dimensiones del contenedor para que el cálculo sea correcto.
  const normalizedBearing = (((settings.bearing ?? 0) % 360) + 360) % 360;
  const isQuarterTurn = normalizedBearing === 90 || normalizedBearing === 270;
  const viewportWidth = isQuarterTurn ? containerSize.height : containerSize.width;
  const viewportHeight = isQuarterTurn ? containerSize.width : containerSize.height;

  // Factor de conversión aproximado: 1 grado ≈ 111km ≈ 111,000m
  const METERS_PER_DEGREE = 111000;

  // Zoom basado en alto del viewport (corresponde al span de latitud del mapa)
  const latZoom = Math.log2(
    viewportHeight / (boundsHeight * METERS_PER_DEGREE),
  );

  // Zoom basado en ancho del viewport (corresponde al span de longitud del mapa)
  // Ajustado por la latitud del centro (los meridianos convergen en los polos)
  const lngZoom = Math.log2(
    viewportWidth /
    (boundsWidth * METERS_PER_DEGREE * Math.cos((center[1] * Math.PI) / 180)),
  );

  // ⭐ CLAVE: Math.max asegura que AMBAS dimensiones llenen completamente el viewport
  // Si usáramos Math.min, una dimensión podría no llenar y aparecería espacio vacío
  const autoZoom = Math.max(latZoom, lngZoom) + zoomOffset;

  // Asegurar que no sea menor que el mínimo permitido
  return Math.max(autoZoom, minZoom);
}

/**
 * Calcula el zoom desde un elemento HTML contenedor
 *
 * @param container - Elemento HTML del contenedor
 * @param bounds - Bounds geográficos
 * @param center - Centro geográfico
 * @param settings - Configuración de zoom
 * @returns Nivel de zoom calculado
 *
 * @example
 * ```ts
 * const zoom = calculateAutoZoomFromElement(
 *   mapContainerRef.current,
 *   [-76.5, 3.35, -76.3, 3.5],
 *   [-76.4, 3.425],
 *   { minZoom: 8, initialZoom: 10 }
 * );
 * ```
 */
export function calculateAutoZoomFromElement(
  container: HTMLElement | null,
  bounds: GeographicBounds,
  center: [number, number],
  settings: ZoomSettings,
): number {
  if (!container) {
    return settings.initialZoom;
  }

  const containerSize: ContainerSize = {
    width: container.offsetWidth,
    height: container.offsetHeight,
  };

  return calculateAutoZoom(containerSize, bounds, center, settings);
}
