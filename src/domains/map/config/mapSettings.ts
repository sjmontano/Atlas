import { logger } from "../services/MapLogger";

/**
 * 🎛️ CONFIGURACIONES DE MAPAS - ATLAS 2.0
 * =====================================
 * Configuraciones específicas para cada mapa
 * Basado en el patrón de la versión anterior del Atlas
 */

/**
 * Configuración de Raster Tiles para mapas de alta resolución
 */
export interface TilesConfig {
  urlTemplate: string; // URL template: "/tiles/map/{z}/{x}/{y}.png"
  tileSize: number; // 256 o 512 px
  minZoom: number; // Zoom mínimo con tiles
  maxZoom: number; // Zoom máximo con tiles
  fadeInDuration?: number; // Duración de fade-in en ms (default: 300)
  bounds?: [number, number, number, number]; // Opcional: limitar área de tiles
  adaptiveLoading?: boolean; // Carga adaptativa según la red detectada
  prefetchEnabled?: boolean; // Activa/desactiva precarga regional idle
  prefetchMaxZoom?: number; // Límite superior de zoom para prefetch
}

export interface ViewportBoundsForce {
  /** Acota los laterales en grados (eje horizontal de pantalla) */
  lateralInset: number;
  /** Extiende arriba/abajo en grados (eje vertical de pantalla) */
  verticalExpand: number;
}

export interface MapSettings {
  initialZoom: number;
  initialBearing: number; // Rotación visual del mapa (0, 90, -15, etc.)
  dragRotate: boolean;
  touchZoomRotate: boolean;
  dragPan: boolean;
  scrollZoom: boolean;
  streetViewEnabled?: boolean;
  maxZoom: number;
  minZoom: number;
  autoBounds?: boolean;
  /** Ajuste forzado del bounds en ejes de pantalla */
  boundsViewportForce?: ViewportBoundsForce;

  // Configuración de Raster Tiles (opcional)
  useTiles?: boolean; // Si true, carga tiles de alta resolución sobre la imagen base
  /** Estrategia para resolver bounds en mapas con tiles */
  tilesBoundsStrategy?: RuntimeTilesBoundsStrategy;
  tilesConfig?: TilesConfig; // Configuración de tiles
  /** Bounds de restricción visual del viewport (pan). Si se omite, se usa el bounds runtime. */
  viewportMaxBounds?: [number, number, number, number];
  /**
   * Usa setTransformConstrain en vez de setMaxBounds para restricción bearing-aware.
   * Requiere viewportMaxBounds definido. Se aplica solo cuando autoBounds=false.
   */
  useTransformConstrain?: boolean;
}

// Configuración por defecto para mapas sin configuración específica
const defaultSettings: MapSettings = {
  initialZoom: 0,
  initialBearing: 0, // Sin rotación por defecto
  dragRotate: false, // Rotación desactivada por defecto
  touchZoomRotate: false, // Rotación táctil desactivada por defecto
  dragPan: false, // Drag pan desactivado por defecto
  scrollZoom: false, // Scroll zoom desactivado por defecto
  streetViewEnabled: true,
  maxZoom: 14, // Zoom máximo por defecto
  minZoom: 0, // Zoom mínimo por defecto
  autoBounds: true, // Por defecto aplicar bounds automáticos
  tilesBoundsStrategy: "configured",
};

/**
 * Computa viewportMaxBounds recortando el eje suelto para bearing ±90° / 0°.
 * bearing ±90°: W↔lat domina → recorta lon (east).
 * bearing 0/180°: W↔lon domina → recorta lat (north).
 * k=0.5 ≈ referencia 16:9 landscape; el constrain bearing-aware absorbe variaciones.
 */
function computeVmb(
  bounds: [number, number, number, number],
  bearing: number,
  k = 0.5,
): [number, number, number, number] {
  const [west, south, east, north] = bounds;
  const latSpan = north - south;
  const lonSpan = east - west;
  const normalized = ((bearing % 360) + 360) % 360;
  const isQuarterTurn = normalized === 90 || normalized === 270;
  if (isQuarterTurn) {
    // W↔lat domina: recortar eje suelto (lon)
    return [west, south, Math.min(west + latSpan * k, east), north];
  }
  // W↔lon domina: recortar eje suelto (lat)
  return [west, south, east, Math.min(south + lonSpan * k, north)];
}

const mapSettings: Record<string, Partial<MapSettings>> = {
  intro: {
    maxZoom: 9,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    boundsViewportForce: { lateralInset: 0, verticalExpand: 0 },
    // Panel A: setTransformConstrain bearing-aware
    useTransformConstrain: true,
    // viewportMaxBounds = tilesConfig.bounds → constraint alineado al tileset real
    viewportMaxBounds: [-78.908544263897, -0.02089838124, -72.289352185258, 12.879198862123],
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/intro/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      bounds: [
        -78.908544263897,
        -0.02089838124,
        -65.739352185258,
        12.879198862123,
      ],
    },
  },

  // ─── Variantes de intro para comparación de bounds ───────────────────────
  // Igual bearing/zoom que intro. Difieren en tilesConfig.bounds (y pgwData en
  // atlasMapData.ts). viewportMaxBounds idéntico en los 3 para comparar tiles.

  "intro-pgw-current": {
    maxZoom: 9,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    boundsViewportForce: { lateralInset: 0, verticalExpand: 0 },
    // Panel A: setTransformConstrain bearing-aware
    useTransformConstrain: true,
    // viewportMaxBounds = tilesConfig.bounds → constraint alineado al tileset real
    viewportMaxBounds: [-78.908544263897, -0.02089838124, -72.289352185258, 12.879198862123],
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/intro/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      bounds: [
        -78.908544263897,
        -0.02089838124,
        -72.739352185258,
        12.879198862123,
      ],
    },
  },

  // Panel C: setMaxBounds nativo — bug visible con bearing=-90
  //   autoBounds: true → setMaxBounds(viewportMaxBounds) en onLoad
  //   Con bearing=-90 los ejes están invertidos → camara escapa arriba/abajo al zoom in.
  "intro-pgw-transformed": {
    maxZoom: 9,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    boundsViewportForce: { lateralInset: 0, verticalExpand: 0 },
    // Panel C (test): misma restricción bearing-aware con bounds del tileset
    useTransformConstrain: true,
    viewportMaxBounds: [-78.908544263897, -0.02089838124, -65.739352185258, 12.879198862123],
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/intro/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      // Mismo tileset — la diferencia es el mecanismo de restricción de cámara
      bounds: [
        -78.908544263897,
        -0.02089838124,
        -72.739352185258,
        12.879198862123,
      ],
    },
  },

  // Panel B: bounds derivados del PGW original de Atlas v17 (sin transformar)
  //   F_v17 = −0.290036434033 → north=−0.2894, south=−6.9666
  //   Los tiles se solicitan al sur del ecuador → panel vacío en Colombia.
  "intro-pgw-v17": {
    maxZoom: 9,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    boundsViewportForce: { lateralInset: 0, verticalExpand: 0 },
    // Viewport fijo a Colombia para ver vacío vs Panel A
    viewportMaxBounds: [-78.908544263897, -0.02089838124, -65.739352185258, 12.879198862123],
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/intro/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      // Bounds derivados de F_v17=−0.290036434033: north=−0.2894, south=−6.9666
      bounds: [
        -78.908544263897,
        -6.966554458033,
        -65.739352185258,
        -0.289445434827,
      ],
    },
  },

  "chapter1-encuadres": {
    maxZoom: 8,
    initialZoom: 4.5,
    minZoom: 4.5,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    autoBounds: false,
    streetViewEnabled: true,
    tilesBoundsStrategy: "auto",
    useTransformConstrain: true,
    viewportMaxBounds: computeVmb([-82.7041078, -12.9807481, -67.8153349, -4.6172733], -90),
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/encuadres/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 8,
      fadeInDuration: 300,
      bounds: [-82.7041078, -12.9807481, -67.8153349, -4.6172733],
    },
  },

  "chapter1-ecosistemas": {
    maxZoom: 10,
    initialBearing: -90,
    initialZoom: 7,
    minZoom: 7,
    dragPan: true,
    scrollZoom: true,
    streetViewEnabled: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    useTransformConstrain: true,
    viewportMaxBounds: computeVmb([-77.717574, 1.505615, -72.824285, 4.258046], -90),
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/ecosistemas/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 7,
      maxZoom: 10,
      fadeInDuration: 150,
      adaptiveLoading: true,
      prefetchEnabled: false,
      bounds: [-77.717574, 1.505615, -72.824285, 4.258046],
    },
  },

  // Sistema 2 capas:
  //   Capa 1: formas-del-paisaje-preview.webp (~100KB) → carga inmediata
  //   Capa 2: tiles/formas-del-paisaje/{z}/{x}/{y}.webp → alta resolución progresiva
  "chapter1-formas-paisaje": {
    maxZoom: 9,
    initialZoom: 6.3,
    minZoom: 5.5,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    useTransformConstrain: true,
    viewportMaxBounds: computeVmb([-79.131273, -0.005835, -66.445084, 7.117097], -90),
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/formas-del-paisaje/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      bounds: [-79.131273, -0.005835, -66.445084, 7.117097],
    },
  },

  "chapter1-bredunco": {
    maxZoom: 9,
    initialBearing: -90,
    initialZoom: 5.8,
    minZoom: 5.2,
    dragPan: true,
    scrollZoom: true,
    autoBounds: false,
    tilesBoundsStrategy: "auto",
    useTransformConstrain: true,
    viewportMaxBounds: computeVmb([-78.907953, -0.290036, -67.017737, 6.387073], -90),
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/bredunco/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      bounds: [-78.907953, -0.290036, -67.017737, 6.387073],
    },
  },

  "chapter1-mosaicos-del-agua": {
    maxZoom: 12,
    initialBearing: -90,
    initialZoom: 8.6,
    minZoom: 8.6,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    useTransformConstrain: true,
    viewportMaxBounds: computeVmb([-76.968456, 2.161909, -74.242614, 3.694959], -90),
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/mosaicos-del-agua/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 12,
      fadeInDuration: 150,
      adaptiveLoading: true,
      bounds: [-76.968456, 2.161909, -74.242614, 3.694959],
    },
  },

  "chapter1-un-rio-cauca": {
    maxZoom: 9,
    initialBearing: -90,
    initialZoom: 6.6,
    minZoom: 5.2,
    dragPan: true,
    scrollZoom: true,
    autoBounds: true,
    tilesBoundsStrategy: "auto",
    useTransformConstrain: true,
    viewportMaxBounds: computeVmb([-79.451453, -0.584716, -66.107764, 6.911411], -90),
    useTiles: true,
    tilesConfig: {
      urlTemplate: "/assets/maps/tiles/un-rio-cauca/{z}/{x}/{y}.webp",
      tileSize: 512,
      minZoom: 0,
      maxZoom: 9,
      fadeInDuration: 150,
      adaptiveLoading: true,
      bounds: [-79.451453, -0.584716, -66.107764, 6.911411],
    },
  },

  "chapter2-valle": {
    initialZoom: 8,
    initialBearing: -90,
    dragRotate: false,
    touchZoomRotate: false,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 12,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.548544263897, 1.87, -75.249352185258, 5.879198862123] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter2-suarez": {
    initialZoom: 9,
    initialBearing: -90,
    dragRotate: false,
    touchZoomRotate: false,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 15,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.3, 2.3, -76.2, 3.5] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter2-cali": {
    initialZoom: 11,
    initialBearing: -90,
    dragRotate: false,
    touchZoomRotate: false,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 15,
    minZoom: 9,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.0, 2.8, -76.0, 4.0] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter2-villa-rica": {
    initialZoom: 10,
    initialBearing: -90,
    dragRotate: false,
    touchZoomRotate: false,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 15,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.0, 2.6, -76.0, 3.8] as [number, number, number, number],
    streetViewEnabled: true,
  },

  // ═══════════════════════════════════════════════════
  // Capítulo 3 — portado desde Atlas v17
  // ═══════════════════════════════════════════════════

  "chapter3-introduccion": {
    initialZoom: 8.8,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 11,
    minZoom: 8.8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-78.0, 1.8, -76.5, 3.5] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter3-monocultivo": {
    initialZoom: 9,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 11,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.5, 2.7, -76.3, 4.0] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter3-encharcaron": {
    initialZoom: 10,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 15,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.3, 2.3, -76.2, 3.5] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter3-cali-deseca": {
    initialZoom: 10,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 15,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.3, 2.7, -76.0, 4.0] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter3-humedales": {
    initialZoom: 9,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 11,
    minZoom: 8,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-78.0, 2.5, -76.5, 4.5] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter3-arcilla": {
    initialZoom: 12,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18,
    minZoom: 10,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.0, 2.5, -75.8, 3.8] as [number, number, number, number],
    streetViewEnabled: true,
  },

  // ═══════════════════════════════════════════════════
  // Capítulo 4 — portado desde Atlas v17
  // ═══════════════════════════════════════════════════

  "chapter4-introduccion": {
    initialZoom: 7.0,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 15.4,
    minZoom: 7.0,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-77.5, 2.5, -76.0, 4.0] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-asoyoge": {
    initialZoom: 17.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 17.4,
    minZoom: 17.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.687, 2.930, -76.679, 2.942] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-el-buhido": {
    initialZoom: 17.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 17.4,
    minZoom: 17.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.686, 2.938, -76.678, 2.946] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-bosque-comestible": {
    initialZoom: 17.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 17.4,
    minZoom: 17.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.497, 3.439, -76.488, 3.446] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-los-bajios": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.443, 3.190, -76.438, 3.195] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-el-paso": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.675, 2.954, -76.670, 2.960] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-las-mercedes": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.689, 2.928, -76.683, 2.934] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-la-virginia": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.293, 3.222, -76.287, 3.228] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-centro-agropecuario": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.434, 3.184, -76.428, 3.190] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-la-caicedo": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.431, 3.182, -76.425, 3.188] as [number, number, number, number],
    streetViewEnabled: true,
  },

  "chapter4-problematicas": {
    initialZoom: 18.4,
    initialBearing: -90,
    dragPan: true,
    scrollZoom: true,
    maxZoom: 18.4,
    minZoom: 18.4,
    autoBounds: false,
    useTransformConstrain: true,
    viewportMaxBounds: [-76.505, 3.434, -76.498, 3.441] as [number, number, number, number],
    streetViewEnabled: true,
  },
};

export type GeographicBoundsTuple = [number, number, number, number];
export type RuntimeTilesBoundsStrategy = "configured" | "derived" | "auto";
export type RuntimeBoundsSource = "pgw" | "tiles-config" | "tiles-derived";

export interface RuntimeBoundsResolution {
  bounds: GeographicBoundsTuple;
  source: RuntimeBoundsSource;
  strategy: RuntimeTilesBoundsStrategy;
  maxDeltaDegrees?: number;
}

export interface ResolveRuntimeBoundsOptions {
  mapId: string;
  pgwBounds: GeographicBoundsTuple;
  imagePixels?: {
    width: number;
    height: number;
  };
  settings: Pick<
    MapSettings,
    | "initialBearing"
    | "boundsViewportForce"
    | "useTiles"
    | "tilesConfig"
    | "tilesBoundsStrategy"
  >;
}

const AUTO_DERIVED_MAX_DELTA_DEGREES = 0.001;

function toTuple(
  bounds: [number, number, number, number],
): GeographicBoundsTuple {
  return [bounds[0], bounds[1], bounds[2], bounds[3]];
}

/**
 * Deriva un bounds tipo "perfil rotado" desde PGW.
 * Para bearing de cuarto de giro (90/270), intercambia huella ancho/alto
 * alrededor del centro del bounds original.
 */
export function deriveTilesBoundsFromPgw(
  pgwBounds: GeographicBoundsTuple,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _bearing: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _imagePixels?: {
    width: number;
    height: number;
  },
): GeographicBoundsTuple {
  const [west, south, east, north] = pgwBounds;
  const longitudeSpan = east - west;
  const latitudeSpan = north - south;

  if (longitudeSpan <= 0 || latitudeSpan <= 0) {
    return pgwBounds;
  }

  // El bearing rota la CÁMARA de MapLibre, no el footprint geográfico de los tiles.
  // Los tiles existen en sus coordenadas geográficas fijas independientemente del bearing.
  // Para cualquier bearing (incluyendo cuartos de giro ±90°), el bounds derivado
  // es el mismo que el PGW bounds calculado con corrección de medio píxel.
  return pgwBounds;
}

function calculateBoundsMaxDelta(
  a: GeographicBoundsTuple,
  b: GeographicBoundsTuple,
): number {
  return Math.max(
    Math.abs(a[0] - b[0]),
    Math.abs(a[1] - b[1]),
    Math.abs(a[2] - b[2]),
    Math.abs(a[3] - b[3]),
  );
}

/**
 * Fuerza el bounds en ejes de pantalla (lateral / vertical) considerando bearing.
 * - bearing 0/180: lateral = longitudes, vertical = latitudes
 * - bearing +/-90: lateral = latitudes, vertical = longitudes
 */
export function applyViewportBoundsForce(
  bounds: GeographicBoundsTuple,
  bearing: number,
  force?: ViewportBoundsForce,
): GeographicBoundsTuple {
  if (!force) {
    return bounds;
  }

  const lateralInset = Math.max(0, force.lateralInset || 0);
  const verticalExpand = Math.max(0, force.verticalExpand || 0);

  let [west, south, east, north] = bounds;

  // Si el mapa está en orientación vertical por bearing +/-90,
  // los ejes visuales se intercambian.
  const normalized = ((bearing % 360) + 360) % 360;
  const isQuarterTurn = normalized === 90 || normalized === 270;

  if (isQuarterTurn) {
    // Laterales (pantalla) => latitudes
    south += lateralInset;
    north -= lateralInset;
    // Arriba/abajo (pantalla) => longitudes
    west -= verticalExpand;
    east += verticalExpand;
  } else {
    // Laterales (pantalla) => longitudes
    west += lateralInset;
    east -= lateralInset;
    // Arriba/abajo (pantalla) => latitudes
    south -= verticalExpand;
    north += verticalExpand;
  }

  // Guardrail para evitar bounds degenerados.
  if (west >= east || south >= north) {
    return bounds;
  }

  return [west, south, east, north];
}

/**
 * Resuelve bounds de runtime desde una fuente única y consistente.
 *
 * Regla actual de compatibilidad:
 * - para mapas en modo tiles, la base se decide por estrategia
 *   (`configured` | `derived` | `auto`).
 * - para el resto, la base es PGW.
 *
 * Luego aplica forzado visual de ejes (`boundsViewportForce`) en todos los casos.
 */
export function resolveRuntimeBounds(
  options: ResolveRuntimeBoundsOptions,
): RuntimeBoundsResolution {
  const { mapId, pgwBounds, settings, imagePixels } = options;
  const configuredTilesBounds = settings.tilesConfig?.bounds
    ? toTuple(settings.tilesConfig.bounds)
    : undefined;

  const strategy = settings.tilesBoundsStrategy ?? "configured";
  const shouldResolveTilesBounds = settings.useTiles === true;

  let source: RuntimeBoundsSource = "pgw";
  let baseBounds: GeographicBoundsTuple = pgwBounds;
  let maxDeltaDegrees: number | undefined;

  if (shouldResolveTilesBounds) {
    const derivedBounds = deriveTilesBoundsFromPgw(
      pgwBounds,
      settings.initialBearing,
      imagePixels,
    );

    if (strategy === "configured") {
      if (configuredTilesBounds) {
        baseBounds = configuredTilesBounds;
        source = "tiles-config";
      } else {
        baseBounds = derivedBounds;
        source = "tiles-derived";
      }
    } else if (strategy === "derived") {
      baseBounds = derivedBounds;
      source = "tiles-derived";
    } else {
      if (configuredTilesBounds) {
        maxDeltaDegrees = calculateBoundsMaxDelta(
          configuredTilesBounds,
          derivedBounds,
        );
        if (maxDeltaDegrees <= AUTO_DERIVED_MAX_DELTA_DEGREES) {
          baseBounds = derivedBounds;
          source = "tiles-derived";
        } else {
          logger.warn(
            "boundsResolver",
            "Delta alto entre bounds configurados y derivados; se mantiene tiles-config",
            {
              mapId,
              strategy,
              maxDeltaDegrees,
              threshold: AUTO_DERIVED_MAX_DELTA_DEGREES,
            },
          );
          baseBounds = configuredTilesBounds;
          source = "tiles-config";
        }
      } else {
        baseBounds = derivedBounds;
        source = "tiles-derived";
      }
    }
  }

  return {
    bounds: applyViewportBoundsForce(
      baseBounds,
      settings.initialBearing,
      settings.boundsViewportForce,
    ),
    source,
    strategy,
    maxDeltaDegrees,
  };
}

export function getMapSettings(mapId: string) {
  const overrides = mapSettings[mapId] || {};
  return { ...defaultSettings, ...overrides };
}

export default mapSettings;
