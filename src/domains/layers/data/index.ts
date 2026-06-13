/**
 * Índice de todas las capas geográficas del Atlas
 * Los datos GeoJSON se cargan de forma lazy desde /assets/geo-layers/{slug}.json
 */

import type { LayerMetadata } from "../types/geo";
import {
    getRasterTileLayerById,
    hasRasterTileLayer,
} from "./raster/ecosistemasRasterLayers";

// Re-exports organizados por categoría
export * from "./categories";

// Mapa de id → slug para carga lazy de GeoJSON
export const LAYER_SLUG_MAP: Record<string, string> = {
  "679d28cec7c9d2574cdd82bd": "rio-anchicaya",
  "679d28bfc7c9d2574cdd82b5": "nevados",
  "67d49445120c910491ca6c02": "encuadre-del-sur-del-valle-alto",
  "679d29aac7c9d2574cdd833e": "sur-geografico-del-valle-dle-alto-cauca",
  "679d29bcc7c9d2574cdd8341": "vallegeograficodelaltocauca",
  "67a3a0e748b33083a42f2a22": "nodosuarez",
  "67d493fe120c910491ca6bfc": "encuadre-cuenca-alta",
  "67a3a13652703a7ececb0146": "nodoorientecali",
  "67a3a10448b33083a42f2a25": "nodovillarica",
  "67fed4ad7b0d0bb5d1672482": "encuadre-limites-de-la-cuenca",
  "67fede667b0d0bb5d16726d6": "encuadrecuencacompleta",
  "6871472e76fa85909c374158": "cuenca-baja",
  "68714a0576fa85909c374677": "cuenca-media",
  "68714c5a76fa85909c374b8e": "rio-atrato",
  "68714cba76fa85909c374c47": "rio-cauca",
  "68714ee276fa85909c374dc2": "rio-cesar",
  "68714f9f76fa85909c374eab": "rio-magdalena",
  "68714ff976fa85909c374f04": "rio-nechi",
  "6871515a76fa85909c374f5d": "rio-san-jorge",
  "687151af76fa85909c37500a": "rio-san-juan",
  "6876a45ef322d4b584cf3289": "capa-cuenca-alta",
  "6876a614f322d4b584cf33af": "cuenca-del-rio-cauca",
  "6876a69ef322d4b584cf340f": "valle-alto-del-rio-cauca",
  "68c38720c906b388229315dc": "mojana",
  "6913f9f360ad596f5c78372f": "monocultivo-de-cana-de-azucar",
  "6913fabc60ad596f5c783759": "se-encharca-arriba-se-deseca-abajo",
  "6921d06cf28b5900b400495c": "aguas-que-llegan",
  "6921e3e7f28b5900b4004ede": "nos-encharcaron-el-rio",
  "69322bcb43edd351cc2757c4": "cali-se-deseca",
};

// Mapa de nombre → id para búsquedas por nombre
export const LAYER_NAME_TO_ID: Record<string, string> = {
  "Rio Anchicaya": "679d28cec7c9d2574cdd82bd",
  Nevados: "679d28bfc7c9d2574cdd82b5",
  "Encuadre del sur del valle alto": "67d49445120c910491ca6c02",
  "Sur geografico del valle dle Alto Cauca": "679d29aac7c9d2574cdd833e",
  valleGeograficoDelAltoCauca: "679d29bcc7c9d2574cdd8341",
  nodoSuarez: "67a3a0e748b33083a42f2a22",
  "Encuadre cuenca alta": "67d493fe120c910491ca6bfc",
  nodoOrienteCali: "67a3a13652703a7ececb0146",
  nodoVillaRica: "67a3a10448b33083a42f2a25",
  "Encuadre limites de la cuenca": "67fed4ad7b0d0bb5d1672482",
  EncuadreCuencaCompleta: "67fede667b0d0bb5d16726d6",
  "Cuenca Baja": "6871472e76fa85909c374158",
  "Cuenca media": "68714a0576fa85909c374677",
  "Río Atrato": "68714c5a76fa85909c374b8e",
  "Río Cauca": "68714cba76fa85909c374c47",
  "Río Cesar": "68714ee276fa85909c374dc2",
  "Río Magdalena": "68714f9f76fa85909c374eab",
  "Río Nechí": "68714ff976fa85909c374f04",
  "Río San Jorge": "6871515a76fa85909c374f5d",
  "Río San Juan": "687151af76fa85909c37500a",
  "capa Cuenca alta": "6876a45ef322d4b584cf3289",
  "Cuenca del río Cauca": "6876a614f322d4b584cf33af",
  "Valle alto del río Cauca": "6876a69ef322d4b584cf340f",
  Mojana: "68c38720c906b388229315dc",
  "Monocultivo de caña de azúcar": "6913f9f360ad596f5c78372f",
  "Se encharca arriba se deseca abajo": "6913fabc60ad596f5c783759",
  "Aguas que llegan": "6921d06cf28b5900b400495c",
  "Nos encharcaron el río": "6921e3e7f28b5900b4004ede",
  "Cali se deseca": "69322bcb43edd351cc2757c4",
};

// Metadata de todas las capas
export const LAYER_METADATA: LayerMetadata[] = [
  {
    id: "679d28cec7c9d2574cdd82bd",
    name: "Rio Anchicaya",
    slug: "rio-anchicaya",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 4,
    description: "Capa geográfica: Rio Anchicaya",
  },
  {
    id: "679d28bfc7c9d2574cdd82b5",
    name: "Nevados",
    slug: "nevados",
    category: "ecosystems",
    geometryType: "Point",
    featureCount: 6,
    description: "Capa geográfica: Nevados",
  },
  {
    id: "67d49445120c910491ca6c02",
    name: "Encuadre del sur del valle alto",
    slug: "encuadre-del-sur-del-valle-alto",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Encuadre del sur del valle alto",
  },
  {
    id: "679d29aac7c9d2574cdd833e",
    name: "Sur geografico del valle dle Alto Cauca",
    slug: "sur-geografico-del-valle-dle-alto-cauca",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Sur geografico del valle dle Alto Cauca",
  },
  {
    id: "679d29bcc7c9d2574cdd8341",
    name: "valleGeograficoDelAltoCauca",
    slug: "vallegeograficodelaltocauca",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: valleGeograficoDelAltoCauca",
  },
  {
    id: "67a3a0e748b33083a42f2a22",
    name: "nodoSuarez",
    slug: "nodosuarez",
    category: "nodes",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: nodoSuarez",
  },
  {
    id: "67d493fe120c910491ca6bfc",
    name: "Encuadre cuenca alta",
    slug: "encuadre-cuenca-alta",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Encuadre cuenca alta",
  },
  {
    id: "67a3a13652703a7ececb0146",
    name: "nodoOrienteCali",
    slug: "nodoorientecali",
    category: "nodes",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: nodoOrienteCali",
  },
  {
    id: "67a3a10448b33083a42f2a25",
    name: "nodoVillaRica",
    slug: "nodovillarica",
    category: "nodes",
    geometryType: "MultiPolygon",
    featureCount: 4,
    description: "Capa geográfica: nodoVillaRica",
  },
  {
    id: "67fed4ad7b0d0bb5d1672482",
    name: "Encuadre limites de la cuenca",
    slug: "encuadre-limites-de-la-cuenca",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Encuadre limites de la cuenca",
  },
  {
    id: "67fede667b0d0bb5d16726d6",
    name: "EncuadreCuencaCompleta",
    slug: "encuadrecuencacompleta",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: EncuadreCuencaCompleta",
  },
  {
    id: "6871472e76fa85909c374158",
    name: "Cuenca Baja",
    slug: "cuenca-baja",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Cuenca Baja",
  },
  {
    id: "68714a0576fa85909c374677",
    name: "Cuenca media",
    slug: "cuenca-media",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Cuenca media",
  },
  {
    id: "68714c5a76fa85909c374b8e",
    name: "Río Atrato",
    slug: "rio-atrato",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río Atrato",
  },
  {
    id: "68714cba76fa85909c374c47",
    name: "Río Cauca",
    slug: "rio-cauca",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río Cauca",
  },
  {
    id: "68714ee276fa85909c374dc2",
    name: "Río Cesar",
    slug: "rio-cesar",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río Cesar",
  },
  {
    id: "68714f9f76fa85909c374eab",
    name: "Río Magdalena",
    slug: "rio-magdalena",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río Magdalena",
  },
  {
    id: "68714ff976fa85909c374f04",
    name: "Río Nechí",
    slug: "rio-nechi",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río Nechí",
  },
  {
    id: "6871515a76fa85909c374f5d",
    name: "Río San Jorge",
    slug: "rio-san-jorge",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río San Jorge",
  },
  {
    id: "687151af76fa85909c37500a",
    name: "Río San Juan",
    slug: "rio-san-juan",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Río San Juan",
  },
  {
    id: "6876a45ef322d4b584cf3289",
    name: "capa Cuenca alta",
    slug: "capa-cuenca-alta",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: capa Cuenca alta",
  },
  {
    id: "6876a614f322d4b584cf33af",
    name: "Cuenca del río Cauca",
    slug: "cuenca-del-rio-cauca",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Cuenca del río Cauca",
  },
  {
    id: "6876a69ef322d4b584cf340f",
    name: "Valle alto del río Cauca",
    slug: "valle-alto-del-rio-cauca",
    category: "rivers",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Valle alto del río Cauca",
  },
  {
    id: "68c38720c906b388229315dc",
    name: "Mojana",
    slug: "mojana",
    category: "boundaries",
    geometryType: "MultiPolygon",
    featureCount: 1,
    description: "Capa geográfica: Mojana",
  },
  {
    id: "6913f9f360ad596f5c78372f",
    name: "Monocultivo de caña de azúcar",
    slug: "monocultivo-de-cana-de-azucar",
    category: "conflicts",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Monocultivo de caña de azúcar",
  },
  {
    id: "6913fabc60ad596f5c783759",
    name: "Se encharca arriba se deseca abajo",
    slug: "se-encharca-arriba-se-deseca-abajo",
    category: "conflicts",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Se encharca arriba se deseca abajo",
  },
  {
    id: "6921d06cf28b5900b400495c",
    name: "Aguas que llegan",
    slug: "aguas-que-llegan",
    category: "other",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Aguas que llegan",
  },
  {
    id: "6921e3e7f28b5900b4004ede",
    name: "Nos encharcaron el río",
    slug: "nos-encharcaron-el-rio",
    category: "rivers",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Nos encharcaron el río",
  },
  {
    id: "69322bcb43edd351cc2757c4",
    name: "Cali se deseca",
    slug: "cali-se-deseca",
    category: "nodes",
    geometryType: "MultiLineString",
    featureCount: 1,
    description: "Capa geográfica: Cali se deseca",
  },
];

// ─── Helpers de metadata (síncronos, sin necesidad de cargar geometría) ───────

export const getAllLayerMetadata = (): LayerMetadata[] => LAYER_METADATA;

export const getMetadataByCategory = (category: string): LayerMetadata[] =>
  LAYER_METADATA.filter((meta) => meta.category === category);

export const getMetadataById = (id: string): LayerMetadata | undefined =>
  LAYER_METADATA.find((meta) => meta.id === id);

export interface LayerDisplayMetadata {
  id: string;
  name: string;
  category: string;
}

export const getLayerDisplayMetadataById = (
  id: string,
): LayerDisplayMetadata | undefined => {
  const vectorMetadata = getMetadataById(id);
  if (vectorMetadata) {
    return {
      id: vectorMetadata.id,
      name: vectorMetadata.name,
      category: vectorMetadata.category,
    };
  }

  const rasterLayer = getRasterTileLayerById(id);
  if (!rasterLayer) {
    return undefined;
  }

  return {
    id: rasterLayer.id,
    name: rasterLayer.name,
    category: rasterLayer.category,
  };
};

export const getSlugById = (id: string): string | undefined =>
  LAYER_SLUG_MAP[id];

export const hasLayer = (id: string): boolean =>
  id in LAYER_SLUG_MAP || hasRasterTileLayer(id);
