import {
  calculateGeographicBounds,
  calculateImageCoordinates,
  type ImageCoordinates,
  type PGWData,
} from "../../../map/services/BoundsCalculator";

export interface RasterTileLayerConfig {
  id: string;
  sourceId: string;
  name: string;
  menuLabel: string;
  category: "ecosystems";
  ecosystemCategory: string;
  ecosystemSubcategory: string;
  deliveryMode: "tiles" | "direct";
  sourceUrl: string;
  lowBandwidthSourceUrl: string;
  urlTemplate: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  coordinates?: ImageCoordinates;
  bounds?: [number, number, number, number];
  allowLowBandwidthDirectFallback?: boolean;
}

const ECOSISTEMAS_LAYERS_PGW: PGWData = [
  0.0,
  0.000217454076 * 2.03,
  0.000217466863 * 2.03,
  -0.0,
  -77.62,
  1.58,
];

const ECOSISTEMAS_LAYERS_DIMENSIONS = {
  width: 5846,
  height: 10394,
} as const;

const ECOSISTEMAS_LAYERS_BOUNDS = calculateGeographicBounds(
  ECOSISTEMAS_LAYERS_PGW,
  ECOSISTEMAS_LAYERS_DIMENSIONS.width,
  ECOSISTEMAS_LAYERS_DIMENSIONS.height,
);

const ECOSISTEMAS_LAYERS_COORDINATES = calculateImageCoordinates(
  ECOSISTEMAS_LAYERS_PGW,
  ECOSISTEMAS_LAYERS_DIMENSIONS.width,
  ECOSISTEMAS_LAYERS_DIMENSIONS.height,
);

export const ECOSISTEMAS_LAYERS_GEOREFERENCE = Object.freeze({
  pgw: ECOSISTEMAS_LAYERS_PGW,
  dimensions: ECOSISTEMAS_LAYERS_DIMENSIONS,
  bounds: ECOSISTEMAS_LAYERS_BOUNDS,
  coordinates: ECOSISTEMAS_LAYERS_COORDINATES,
});

const TILE_TEMPLATE_BASE =
  "/assets/maps/tiles/layers/chapter1/ecosistemas-layers";

const DIRECT_IMAGE_BASE = "/assets/maps/layers/ecosistemas/direct-all";
const DIRECT_IMAGE_LITE_BASE = "/assets/maps/layers/ecosistemas/direct-lite";

const DEFAULT_ECOSISTEMAS_DELIVERY_MODE: RasterTileLayerConfig["deliveryMode"] =
  "tiles";

const buildTileUrlTemplate = (layerId: string): string =>
  `${TILE_TEMPLATE_BASE}/${layerId}/{z}/{x}/{y}.webp`;

const buildDirectImageUrl = (layerId: string): string =>
  `${DIRECT_IMAGE_BASE}/${layerId}.webp`;

const buildDirectLiteImageUrl = (layerId: string): string =>
  `${DIRECT_IMAGE_LITE_BASE}/${layerId}.webp`;

const resolveDeliveryMode = (): RasterTileLayerConfig["deliveryMode"] =>
  DEFAULT_ECOSISTEMAS_DELIVERY_MODE;

const createLayer = (
  id: string,
  sourceId: string,
  menuLabel: string,
  ecosystemCategory: string,
  ecosystemSubcategory: string,
  sourceUrl: string,
): RasterTileLayerConfig => {
  const deliveryMode = resolveDeliveryMode();

  return {
    id,
    sourceId,
    name: menuLabel,
    menuLabel,
    category: "ecosystems",
    ecosystemCategory,
    ecosystemSubcategory,
    deliveryMode,
    sourceUrl: deliveryMode === "direct" ? buildDirectImageUrl(id) : sourceUrl,
    lowBandwidthSourceUrl: buildDirectLiteImageUrl(id),
    urlTemplate: buildTileUrlTemplate(id),
    tileSize: 512,
    minZoom: 7,
    maxZoom: 8,
    coordinates: ECOSISTEMAS_LAYERS_COORDINATES,
    bounds: ECOSISTEMAS_LAYERS_BOUNDS,
    allowLowBandwidthDirectFallback: false,
  };
};

export const ECOSISTEMAS_RASTER_LAYERS: RasterTileLayerConfig[] = [
  createLayer(
    "sedimentosSubmarinos-layer",
    "sedimentosSubmarinos_",
    "Sedimentos submarinos",
    "1. Amenazados y en estado vulnerable",
    "1.1. De litoral y aguas poco profundas",
    "/assets/maps/layers/ecosistemas/sedimentos-submarinos.webp",
  ),
  createLayer(
    "manglar-layer",
    "manglar_",
    "Manglar",
    "1. Amenazados y en estado vulnerable",
    "1.1. De litoral y aguas poco profundas",
    "/assets/maps/layers/ecosistemas/manglar.webp",
  ),
  createLayer(
    "llanuraMareal-layer",
    "llanuraMareal_",
    "Llanura mareal",
    "1. Amenazados y en estado vulnerable",
    "1.1. De litoral y aguas poco profundas",
    "/assets/maps/layers/ecosistemas/llanura-mareal.webp",
  ),
  createLayer(
    "playas-layer",
    "playas_",
    "Playas",
    "1. Amenazados y en estado vulnerable",
    "1.1. De litoral y aguas poco profundas",
    "/assets/maps/layers/ecosistemas/playas.webp",
  ),
  createLayer(
    "zonaPantanosa-layer",
    "zonaPantanosa_",
    "Zona pantanosa",
    "1. Amenazados y en estado vulnerable",
    "1.1. De litoral y aguas poco profundas",
    "/assets/maps/layers/ecosistemas/zona-pantanosa.webp",
  ),
  createLayer(
    "rocasExpuestas-layer",
    "rocasExpuestas_",
    "Rocas expuestas",
    "1. Amenazados y en estado vulnerable",
    "1.2. Con vegetacion de baja altura",
    "/assets/maps/layers/ecosistemas/rocas-expuestas.webp",
  ),
  createLayer(
    "humedales-layer",
    "humedales_",
    "Humedales",
    "1. Amenazados y en estado vulnerable",
    "1.2. Con vegetacion de baja altura",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752620855/geoImages/zabqishlczt4jhzan583.webp",
  ),
  createLayer(
    "arbustal-layer",
    "arbustal_",
    "Vegetacion arbustiva (arbustal)",
    "1. Amenazados y en estado vulnerable",
    "1.2. Con vegetacion de baja altura",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752616024/geoImages/jmzub122jv4yei2hpchp.webp",
  ),
  createLayer(
    "herbazalPastos-layer",
    "herbazalPastos_",
    "Campos de hierbas y pastos (herbazal)",
    "1. Amenazados y en estado vulnerable",
    "1.2. Con vegetacion de baja altura",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752620752/geoImages/ab8fmppquopvzo4t9ime.webp",
  ),
  createLayer(
    "xerofitico-layer",
    "xerofitico_",
    "Extremadamente secos (Xerofitico)",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "/assets/maps/layers/ecosistemas/xerofitico.webp",
  ),
  createLayer(
    "subxerofitico-layer",
    "subxerofitico_",
    "Muy secos (Subxerofitico)",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "/assets/maps/layers/ecosistemas/subxerofitico.webp",
  ),
  createLayer(
    "inundables-layer",
    "inundables_",
    "Inundables",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "/assets/maps/layers/ecosistemas/inundables.webp",
  ),
  createLayer(
    "secosTropicales-layer",
    "secosTropicales_",
    "Secos tropicales",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "/assets/maps/layers/ecosistemas/secos-tropicales.webp",
  ),
  createLayer(
    "humedosTropicales-layer",
    "humedosTropicales_",
    "Humedos tropicales",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "/assets/maps/layers/ecosistemas/humedos-tropicales.webp",
  ),
  createLayer(
    "subandinos-layer",
    "subandinos_",
    "Subandinos",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "/assets/maps/layers/ecosistemas/subandinos.webp",
  ),
  createLayer(
    "bosqueNiebla-layer",
    "bosqueNiebla_",
    "De niebla",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752616666/geoImages/ccrcbspmilcmwnttnijk.webp",
  ),
  createLayer(
    "altoAndinos-layer",
    "altoAndinos_",
    "Alto andinos",
    "1. Amenazados y en estado vulnerable",
    "1.3. Bosques",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752615317/geoImages/nsxeretli1c7vs11x6kc.webp",
  ),
  createLayer(
    "pantanoParamo-layer",
    "pantanoParamo_",
    "Pantano de paramo (Turbera)",
    "1. Amenazados y en estado vulnerable",
    "1.4. Altas cumbres",
    "/assets/maps/layers/ecosistemas/pantano-paramo.webp",
  ),
  createLayer(
    "Paramo-layer",
    "Paramo_",
    "Paramo",
    "1. Amenazados y en estado vulnerable",
    "1.4. Altas cumbres",
    "/assets/maps/layers/ecosistemas/paramo.webp",
  ),
  createLayer(
    "laguna-layer",
    "laguna_",
    "Laguna",
    "1. Amenazados y en estado vulnerable",
    "1.4. Altas cumbres",
    "/assets/maps/layers/ecosistemas/laguna.webp",
  ),
  createLayer(
    "glaciaresNivales-layer",
    "glaciaresNivales_",
    "Glaciares y nivales",
    "1. Amenazados y en estado vulnerable",
    "1.4. Altas cumbres",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752620635/geoImages/fucpwcprswkntuimp3ln.webp",
  ),
  createLayer(
    "bosqueFragmentado-layer",
    "bosqueFragmentado_",
    "Bosque fragmentado",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.1. Intervenciones moderadas",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752616546/geoImages/gsvasgqvuszn6hz18ap4.webp",
  ),
  createLayer(
    "regeneracionVegetal-layer",
    "regeneracionVegetal_",
    "Vegetacion en regeneracion",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.1. Intervenciones moderadas",
    "/assets/maps/layers/ecosistemas/regeneracion-vegetal.webp",
  ),
  createLayer(
    "agriculturaMixta-layer",
    "agriculturaMixta_",
    "Agricultura mixta",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.2. Zonas con agricultura y ganaderia",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752614823/geoImages/ehxtmyhan6sxciwzeqq8.webp",
  ),
  createLayer(
    "areasInundacion-layer",
    "areasInundacion_",
    "Areas de inundacion y humedales desecados",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.2. Zonas con agricultura y ganaderia",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752616054/geoImages/g6pgktggt7ni6xiyhupw.webp",
  ),
  createLayer(
    "monocultivos-layer",
    "monocultivos_",
    "Monocultivos",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.2. Zonas con agricultura y ganaderia",
    "/assets/maps/layers/ecosistemas/monocultivos.webp",
  ),
  createLayer(
    "ganaderia-layer",
    "ganaderia_",
    "Ganaderia",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.2. Zonas con agricultura y ganaderia",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752620553/geoImages/gtwqfz5u1o3kmbtl33a4.webp",
  ),
  createLayer(
    "zonaUrbanaIndustrial-layer",
    "zonaUrbanaIndustrial_",
    "Zonas urbanizadas, industrializadas y con mineria intensiva",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.3. Intervenciones severas",
    "/assets/maps/layers/ecosistemas/zona-urbana-industrial.webp",
  ),
  createLayer(
    "aguaSuperficial-layer",
    "aguaSuperficial_",
    "Cuerpos de agua artificial",
    "2. Entornos del ser humano que transforman ecosistemas",
    "2.3. Intervenciones severas",
    "https://res.cloudinary.com/dvluvxfvn/image/upload/v1752615018/geoImages/uw21wuzdbrqiefckuf4d.webp",
  ),
  createLayer(
    "sinInformacion-layer",
    "sinInformacion_",
    "Sin informacion y otras areas",
    "3. Sin informacion y otras areas",
    "3. Sin informacion y otras areas",
    "/assets/maps/layers/ecosistemas/sin-informacion.webp",
  ),
];

export interface EcosistemasSubcategoryGroup {
  subcategory: string;
  layers: RasterTileLayerConfig[];
}

export interface EcosistemasCategoryGroup {
  category: string;
  subcategories: EcosistemasSubcategoryGroup[];
}

const RASTER_TILE_LAYER_MAP = new Map(
  ECOSISTEMAS_RASTER_LAYERS.map((layer) => [layer.id, layer]),
);

export const ECOSISTEMAS_RASTER_LAYER_IDS = ECOSISTEMAS_RASTER_LAYERS.map(
  (layer) => layer.id,
);

export const getRasterTileLayerById = (
  id: string,
): RasterTileLayerConfig | undefined => RASTER_TILE_LAYER_MAP.get(id);

export const hasRasterTileLayer = (id: string): boolean =>
  RASTER_TILE_LAYER_MAP.has(id);

export const getEcosistemasLayerHierarchy = (
  layerIds?: string[],
): EcosistemasCategoryGroup[] => {
  const allowedIds = layerIds ? new Set(layerIds) : null;
  const selected = ECOSISTEMAS_RASTER_LAYERS.filter((layer) =>
    allowedIds ? allowedIds.has(layer.id) : true,
  );

  const categories = new Map<string, Map<string, RasterTileLayerConfig[]>>();

  selected.forEach((layer) => {
    if (!categories.has(layer.ecosystemCategory)) {
      categories.set(layer.ecosystemCategory, new Map());
    }
    const subcategories = categories.get(layer.ecosystemCategory)!;
    if (!subcategories.has(layer.ecosystemSubcategory)) {
      subcategories.set(layer.ecosystemSubcategory, []);
    }
    subcategories.get(layer.ecosystemSubcategory)!.push(layer);
  });

  return Array.from(categories.entries()).map(([category, subcatMap]) => ({
    category,
    subcategories: Array.from(subcatMap.entries()).map(
      ([subcategory, layers]) => ({
        subcategory,
        layers,
      }),
    ),
  }));
};
