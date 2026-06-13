/**
 * Hook para gestionar capas geográficas del Atlas
 * Metadata disponible síncronamente; geometría se carga de forma lazy via fetch
 */

import { useMemo, useState } from "react";
import {
    LAYER_CATEGORIES,
    LAYER_METADATA,
    LAYER_NAME_TO_ID,
    LAYER_SLUG_MAP,
    getAllLayerMetadata,
    getLayersByCategory,
    getMetadataById,
    hasLayer,
} from "../data";
import { getLoadedGeoLayer, loadGeoLayer } from "../services/GeoLayerLoader";
import type { GeoLayer } from "../types/geo";

export interface UseGeoLayersOptions {
  enableSearch?: boolean;
}

export const useGeoLayers = (options: UseGeoLayersOptions = {}) => {
  const { enableSearch = true } = options;

  const [searchTerm, setSearchTerm] = useState("");

  // Metadata filtrada por búsqueda
  const filteredMetadata = useMemo(() => {
    if (!searchTerm || !enableSearch) return LAYER_METADATA;
    const term = searchTerm.toLowerCase();
    return LAYER_METADATA.filter((meta) =>
      meta.name.toLowerCase().includes(term),
    );
  }, [searchTerm, enableSearch]);

  return {
    // Estado
    loading: false, // metadata siempre disponible de inmediato
    searchTerm,
    setSearchTerm,

    // Datos (sólo metadata — sin geometría)
    layers: filteredMetadata,
    metadata: filteredMetadata,
    categories: LAYER_CATEGORIES,

    // Getters síncronos de metadata
    getMetadataById,
    getLayersByCategory,
    getRiversLayers: () => getLayersByCategory("rivers"),
    getBoundariesLayers: () => getLayersByCategory("boundaries"),
    getNodesLayers: () => getLayersByCategory("nodes"),
    getEcosystemsLayers: () => getLayersByCategory("ecosystems"),
    getConflictsLayers: () => getLayersByCategory("conflicts"),

    // Carga asíncrona de geometría por id
    loadLayerById: (id: string): Promise<GeoLayer> => {
      const slug = LAYER_SLUG_MAP[id];
      if (!slug) return Promise.reject(new Error(`Capa desconocida: ${id}`));
      return loadGeoLayer(slug);
    },

    // Acceso síncrono a geometría ya cacheada (puede ser undefined)
    getLoadedLayerById: (id: string): GeoLayer | undefined => {
      const slug = LAYER_SLUG_MAP[id];
      return slug ? getLoadedGeoLayer(slug) : undefined;
    },

    // Utilidades de metadata
    getAllLayers: getAllLayerMetadata,
    getTotalLayerCount: () => LAYER_METADATA.length,
    getLayerCount: (category?: string) =>
      category ? getLayersByCategory(category).length : LAYER_METADATA.length,

    // Búsqueda
    searchLayers: setSearchTerm,
    clearSearch: () => setSearchTerm(""),

    // Validación
    hasLayer,
    isValidLayerName: (name: string) => name in LAYER_NAME_TO_ID,
  };
};
