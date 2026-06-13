/**
 * ⚙️ PROVEEDOR DE CONFIGURACIÓN UNIFICADO
 * ========================================
 *
 * Centraliza y cachea todas las configuraciones de mapas,
 * eliminando múltiples llamadas a getters individuales.
 */

import { logger } from "../services/MapLogger";
import type { MapBoundsConfig } from "./mapBounds";
import { getMapBoundsConfig } from "./mapBounds";
import type { MapConfig } from "./mapConfig";
import { getMapConfig } from "./mapConfig";
import type { MapSettings } from "./mapSettings";
import { getMapSettings } from "./mapSettings";
import type { MapStyleConfig } from "./mapStyles";
import { getMapStyleConfig } from "./mapStyles";

/**
 * Configuración completa de un mapa
 */
export interface CompleteMapConfig {
  /** Configuración base del mapa */
  config: MapConfig;
  /** Configuración de interacción y comportamiento */
  settings: MapSettings;
  /** Configuración de bounds y correcciones */
  bounds: MapBoundsConfig;
  /** Configuración de estilos visuales */
  styles: MapStyleConfig;
}

/**
 * Cache de configuraciones procesadas
 */
const configCache = new Map<string, CompleteMapConfig>();

/**
 * Obtiene la configuración completa de un mapa
 *
 * Unifica todas las configuraciones (config, settings, bounds, styles)
 * en un solo objeto. Cachea el resultado para evitar re-cálculos.
 *
 * @param mapId - ID del mapa
 * @returns Configuración completa o null si no existe
 *
 * @example
 * ```ts
 * const config = getCompleteMapConfig('chapter1-encuadres');
 * if (config) {
 *   const { config, settings, bounds, styles } = config;
 *   // Usar configuraciones...
 * }
 * ```
 */
export function getCompleteMapConfig(mapId: string): CompleteMapConfig | null {
  // Verificar cache primero
  if (configCache.has(mapId)) {
    return configCache.get(mapId)!;
  }

  // Obtener configuración base
  const config = getMapConfig(mapId);
  if (!config) {
    return null;
  }

  // PGW todo ceros → mapa sin georreferenciar aún
  if (config.pgwData.every((v) => v === 0)) {
    logger.warn(
      "CONFIG",
      `Mapa "${mapId}" tiene pgwData todo ceros — sin datos geoespaciales configurados`,
    );
  }

  // Agregar todas las configuraciones
  const completeConfig: CompleteMapConfig = {
    config,
    settings: getMapSettings(mapId),
    bounds: getMapBoundsConfig(mapId),
    styles: getMapStyleConfig(mapId),
  };

  // Cachear para futuros usos
  configCache.set(mapId, completeConfig);

  return completeConfig;
}

/**
 * Limpia el cache de configuraciones
 * Útil si las configuraciones se actualizan dinámicamente
 *
 * @param mapId - ID específico a limpiar, o undefined para limpiar todo
 *
 * @example
 * ```ts
 * // Limpiar un mapa específico
 * clearConfigCache('chapter1-encuadres');
 *
 * // Limpiar todo el cache
 * clearConfigCache();
 * ```
 */
export function clearConfigCache(mapId?: string): void {
  if (mapId) {
    configCache.delete(mapId);
  } else {
    configCache.clear();
  }
}

/**
 * Valida que una configuración completa sea válida
 *
 * @param config - Configuración a validar
 * @returns Resultado de validación con errores si los hay
 */
export function validateCompleteConfig(config: CompleteMapConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar config base
  if (!config.config) {
    errors.push("Configuración base faltante");
  } else {
    if (!config.config.id) errors.push("ID faltante");
    if (!config.config.imagePath) errors.push("imagePath faltante");
    if (!config.config.pgwData || config.config.pgwData.length !== 6) {
      errors.push("pgwData inválido (debe ser array de 6 números)");
    }
  }

  // Validar settings
  if (!config.settings) {
    errors.push("Settings faltantes");
  }

  // Validar bounds
  if (!config.bounds) {
    errors.push("Bounds config faltante");
  }

  // Validar styles
  if (!config.styles) {
    errors.push("Styles config faltante");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
