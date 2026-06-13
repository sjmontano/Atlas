/**
 * ⚙️ HOOK DE CONFIGURACIÓN UNIFICADA
 * ===================================
 *
 * Hook para obtener configuración completa de un mapa.
 * Usa el provider de configuración y valida los datos.
 */

import { useMemo } from "react";
import {
    getCompleteMapConfig,
    validateCompleteConfig,
    type CompleteMapConfig,
} from "../config/mapConfigProvider";

export interface UseMapConfigurationResult {
  /** Configuración completa del mapa */
  config: CompleteMapConfig | null;
  /** Si la configuración es válida */
  isValid: boolean;
  /** Errores de validación */
  errors: string[];
  /** Si la configuración existe */
  exists: boolean;
}

/**
 * Hook para obtener configuración completa de un mapa
 *
 * Obtiene y valida todas las configuraciones (config, settings, bounds, styles).
 * Usa cache interno para optimizar performance.
 *
 * @param mapId - ID del mapa
 * @returns Configuración completa con validación
 *
 * @example
 * ```ts
 * const { config, isValid, errors } = useMapConfiguration('chapter1-encuadres');
 *
 * if (!config) {
 *   return <div>Mapa no encontrado</div>;
 * }
 *
 * if (!isValid) {
 *   console.error('Errores de configuración:', errors);
 * }
 *
 * const { config: mapConfig, settings, bounds, styles } = config;
 * ```
 */
export function useMapConfiguration(mapId: string): UseMapConfigurationResult {
  const result = useMemo(() => {
    const config = getCompleteMapConfig(mapId);

    if (!config) {
      return {
        config: null,
        isValid: false,
        errors: [`Configuración no encontrada: ${mapId}`],
        exists: false,
      };
    }

    const validation = validateCompleteConfig(config);

    return {
      config,
      isValid: validation.valid,
      errors: validation.errors,
      exists: true,
    };
  }, [mapId]);

  return result;
}
