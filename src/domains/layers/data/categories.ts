/**
 * Capas organizadas por categorías
 * Trabaja únicamente con LayerMetadata (sin cargar geometría)
 */

import type { LayerMetadata } from "../types/geo";
import { LAYER_METADATA } from "./index";

export const LAYER_CATEGORIES = [
  "rivers",
  "ecosystems",
  "boundaries",
  "nodes",
  "conflicts",
  "other",
] as const;

export type LayerCategory = (typeof LAYER_CATEGORIES)[number];

// Helper para obtener metadata de capas por categoría (no carga geometría)
export const getLayersByCategory = (category: string): LayerMetadata[] =>
  LAYER_METADATA.filter((meta: LayerMetadata) => meta.category === category);

export const getRiversLayers = (): LayerMetadata[] =>
  getLayersByCategory("rivers");

export const getEcosystemsLayers = (): LayerMetadata[] =>
  getLayersByCategory("ecosystems");

export const getBoundariesLayers = (): LayerMetadata[] =>
  getLayersByCategory("boundaries");

export const getNodesLayers = (): LayerMetadata[] =>
  getLayersByCategory("nodes");

export const getConflictsLayers = (): LayerMetadata[] =>
  getLayersByCategory("conflicts");

export const getOtherLayers = (): LayerMetadata[] =>
  getLayersByCategory("other");
