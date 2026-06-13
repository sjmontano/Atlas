/**
 * Perfiles declarativos de capas por mapa.
 *
 * Fase 1:
 * - Definir que capas se activan por defecto por mapId.
 * - Definir opacidades y categorias activas base.
 */

import { LAYER_CATEGORIES, hasLayer } from "@layers/data";
import { ECOSISTEMAS_RASTER_LAYER_IDS } from "@layers/data/raster/ecosistemasRasterLayers";

export interface MapLayerProfile {
  mapId: string;
  associatedLayerIds: string[];
  defaultVisibleLayerIds: string[];
  defaultOpacities?: Record<string, number>;
  activeCategories?: string[];
}

export interface ChapterLayerPreset {
  chapter: number;
  activeCategories: string[];
}

const LAYER_IDS = {
  CUENCA_RIO_CAUCA: "6876a614f322d4b584cf33af",
  CUENCA_ALTA: "6876a45ef322d4b584cf3289",
  CUENCA_MEDIA: "68714a0576fa85909c374677",
  CUENCA_BAJA: "6871472e76fa85909c374158",
  VALLE_ALTO: "6876a69ef322d4b584cf340f",
  RIO_CAUCA: "68714cba76fa85909c374c47",
  RIO_ANCHICAYA: "679d28cec7c9d2574cdd82bd",
  RIO_ATRATO: "68714c5a76fa85909c374b8e",
  RIO_MAGDALENA: "68714f9f76fa85909c374eab",
  ENCUADRE_CUENCA_ALTA: "67d493fe120c910491ca6bfc",
  ENCUADRE_SUR_VALLE: "67d49445120c910491ca6c02",
  ENCUADRE_LIMITES: "67fed4ad7b0d0bb5d1672482",
  ENCUADRE_COMPLETA: "67fede667b0d0bb5d16726d6",
  NEVADOS: "679d28bfc7c9d2574cdd82b5",
  NODO_SUAREZ: "67a3a0e748b33083a42f2a22",
  NODO_CALI: "67a3a13652703a7ececb0146",
  NODO_VILLA_RICA: "67a3a10448b33083a42f2a25",
} as const;

export const CHAPTER_LAYER_PRESETS: Record<number, ChapterLayerPreset> = {
  1: {
    chapter: 1,
    activeCategories: ["boundaries", "rivers", "ecosystems", "conflicts"],
  },
  2: {
    chapter: 2,
    activeCategories: ["nodes", "boundaries", "rivers"],
  },
};

export const MAP_LAYER_PROFILES: Record<string, MapLayerProfile> = {
  intro: {
    mapId: "intro",
    associatedLayerIds: [
      LAYER_IDS.CUENCA_RIO_CAUCA,
      LAYER_IDS.CUENCA_ALTA,
      LAYER_IDS.CUENCA_MEDIA,
      LAYER_IDS.CUENCA_BAJA,
      LAYER_IDS.VALLE_ALTO,
      LAYER_IDS.RIO_CAUCA,
      LAYER_IDS.RIO_MAGDALENA,
      LAYER_IDS.RIO_ATRATO,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.CUENCA_RIO_CAUCA,
      LAYER_IDS.RIO_CAUCA,
      LAYER_IDS.VALLE_ALTO,
    ],
    activeCategories: ["boundaries", "rivers"],
    defaultOpacities: {
      [LAYER_IDS.CUENCA_RIO_CAUCA]: 0.8,
      [LAYER_IDS.RIO_CAUCA]: 0.9,
      [LAYER_IDS.VALLE_ALTO]: 0.7,
    },
  },

  "chapter1-encuadres": {
    mapId: "chapter1-encuadres",
    associatedLayerIds: [
      LAYER_IDS.ENCUADRE_CUENCA_ALTA,
      LAYER_IDS.ENCUADRE_SUR_VALLE,
      LAYER_IDS.ENCUADRE_LIMITES,
      LAYER_IDS.ENCUADRE_COMPLETA,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.ENCUADRE_CUENCA_ALTA,
      LAYER_IDS.ENCUADRE_SUR_VALLE,
      LAYER_IDS.ENCUADRE_LIMITES,
      LAYER_IDS.ENCUADRE_COMPLETA,
    ],
    activeCategories: ["boundaries", "rivers"],
  },

  "chapter1-ecosistemas": {
    mapId: "chapter1-ecosistemas",
    associatedLayerIds: ECOSISTEMAS_RASTER_LAYER_IDS,
    defaultVisibleLayerIds: ["agriculturaMixta-layer"],
    activeCategories: ["ecosystems"],
    defaultOpacities: Object.fromEntries(
      ECOSISTEMAS_RASTER_LAYER_IDS.map((id) => [id, 0.9]),
    ),
  },

  "chapter1-formas-paisaje": {
    mapId: "chapter1-formas-paisaje",
    associatedLayerIds: [
      LAYER_IDS.CUENCA_ALTA,
      LAYER_IDS.VALLE_ALTO,
      LAYER_IDS.RIO_CAUCA,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.CUENCA_ALTA,
      LAYER_IDS.VALLE_ALTO,
      LAYER_IDS.RIO_CAUCA,
    ],
    activeCategories: ["boundaries", "rivers"],
  },

  "chapter1-bredunco": {
    mapId: "chapter1-bredunco",
    associatedLayerIds: [
      LAYER_IDS.CUENCA_ALTA,
      LAYER_IDS.VALLE_ALTO,
      LAYER_IDS.RIO_CAUCA,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.CUENCA_ALTA,
      LAYER_IDS.VALLE_ALTO,
      LAYER_IDS.RIO_CAUCA,
    ],
    activeCategories: ["boundaries", "rivers"],
  },

  "chapter1-mosaicos-del-agua": {
    mapId: "chapter1-mosaicos-del-agua",
    associatedLayerIds: [
      LAYER_IDS.RIO_CAUCA,
      LAYER_IDS.RIO_ANCHICAYA,
      LAYER_IDS.RIO_ATRATO,
      LAYER_IDS.RIO_MAGDALENA,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.RIO_CAUCA,
      LAYER_IDS.RIO_ANCHICAYA,
      LAYER_IDS.RIO_ATRATO,
      LAYER_IDS.RIO_MAGDALENA,
    ],
    activeCategories: ["rivers", "conflicts"],
  },

  "chapter1-un-rio-cauca": {
    mapId: "chapter1-un-rio-cauca",
    associatedLayerIds: [
      LAYER_IDS.CUENCA_RIO_CAUCA,
      LAYER_IDS.CUENCA_ALTA,
      LAYER_IDS.CUENCA_MEDIA,
      LAYER_IDS.CUENCA_BAJA,
      LAYER_IDS.VALLE_ALTO,
      LAYER_IDS.RIO_CAUCA,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.CUENCA_RIO_CAUCA,
      LAYER_IDS.RIO_CAUCA,
      LAYER_IDS.VALLE_ALTO,
    ],
    activeCategories: ["rivers", "boundaries"],
  },

  "chapter2-valle": {
    mapId: "chapter2-valle",
    associatedLayerIds: [
      LAYER_IDS.NODO_CALI,
      LAYER_IDS.NODO_VILLA_RICA,
      LAYER_IDS.NODO_SUAREZ,
    ],
    defaultVisibleLayerIds: [
      LAYER_IDS.NODO_CALI,
      LAYER_IDS.NODO_VILLA_RICA,
      LAYER_IDS.NODO_SUAREZ,
    ],
    activeCategories: ["nodes"],
  },

  "chapter2-suarez": {
    mapId: "chapter2-suarez",
    associatedLayerIds: [LAYER_IDS.NODO_SUAREZ],
    defaultVisibleLayerIds: [LAYER_IDS.NODO_SUAREZ],
    activeCategories: ["nodes"],
  },

  "chapter2-cali": {
    mapId: "chapter2-cali",
    associatedLayerIds: [LAYER_IDS.NODO_CALI],
    defaultVisibleLayerIds: [LAYER_IDS.NODO_CALI],
    activeCategories: ["nodes"],
  },

  "chapter2-villa-rica": {
    mapId: "chapter2-villa-rica",
    associatedLayerIds: [LAYER_IDS.NODO_VILLA_RICA],
    defaultVisibleLayerIds: [LAYER_IDS.NODO_VILLA_RICA],
    activeCategories: ["nodes"],
  },
};

export function getMapLayerProfile(mapId: string): MapLayerProfile | null {
  return MAP_LAYER_PROFILES[mapId] ?? null;
}

export function getChapterLayerPreset(
  chapter: number,
): ChapterLayerPreset | null {
  return CHAPTER_LAYER_PRESETS[chapter] ?? null;
}

export interface LayerProfileValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida integridad de perfiles declarativos:
 * - IDs de capa existentes en metadata
 * - Categorias declaradas validas
 */
export function validateMapLayerProfiles(): LayerProfileValidationResult {
  const errors: string[] = [];
  const validCategories = new Set<string>(LAYER_CATEGORIES);

  Object.entries(MAP_LAYER_PROFILES).forEach(([mapId, profile]) => {
    profile.associatedLayerIds.forEach((layerId) => {
      if (!hasLayer(layerId)) {
        errors.push(`[${mapId}] associated layerId no existe: ${layerId}`);
      }
    });

    profile.defaultVisibleLayerIds.forEach((layerId) => {
      if (!hasLayer(layerId)) {
        errors.push(`[${mapId}] layerId no existe en metadata: ${layerId}`);
      }

      if (!profile.associatedLayerIds.includes(layerId)) {
        errors.push(
          `[${mapId}] defaultVisibleLayerId no esta en associatedLayerIds: ${layerId}`,
        );
      }
    });

    (profile.activeCategories ?? []).forEach((category) => {
      if (!validCategories.has(category)) {
        errors.push(`[${mapId}] categoria invalida: ${category}`);
      }
    });
  });

  Object.entries(CHAPTER_LAYER_PRESETS).forEach(([chapter, preset]) => {
    preset.activeCategories.forEach((category) => {
      if (!validCategories.has(category)) {
        errors.push(`[chapter:${chapter}] categoria invalida: ${category}`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
