# Reorganización de Contenido por Capítulo + Tema Central — Diseño

**Fecha:** 2026-08-15
**Alcance:** `atlas/` (frontend principal). Reorganiza los datos de contenido (mapas, capas, POIs) y separa los estilos en un tema central.
**Relación:** Refina `2026-08-10-layer-system-design.md` (que ya implementó el sistema de capas/POIs) reorganizando su ubicación, NO su comportamiento.

---

## 1. Objetivos

1. **Estructura que sirve al contenido, no al revés** — un mapa pequeño puede vivir en un solo archivo; un mapa grande se reparte en archivos opcionales. Solo una convención obligatoria: el punto de entrada `index.ts`.
2. **Organización por capítulo** — el proyecto crece a 4 capítulos (~30 mapas); cada mapa debe ser localizable por capítulo sin recorrer índices planos.
3. **Separar datos de lógica** — `LayerManager` / `PoiManager` son motores genéricos que solo conocen interfaces; agregar contenido nunca los modifica.
4. **Tema central de estilos** — colores, tamaños, radios y apariencia de POIs/capas viven en un solo lugar (`theme/`), no hardcodeados en managers ni repetidos por mapa.
5. **Auto-registro** — agregar un mapa = crear su carpeta con `index.ts`; sin editar índices centrales.

---

## 2. Estructura de Directorios

```
src/content/
  chapter-1/
    ecosistemas/
      index.ts          ← ÚNICO obligatorio: exporta MapContent
      geo.ts            ← opcional (pgw, width, height)
      images.ts         ← opcional (URLs Cloudinary/base/full/placeholder)
      config.ts         ← opcional (zoom/bearing/interacción)
      layers.ts         ← opcional (capas)
      pois.ts           ← opcional (POIs)
    mosaicos-del-agua/
      index.ts
      geo.ts
      layers.ts
      pois.ts
    formas-del-paisaje/
      index.ts          ← mapa chico: TODO inline, sin archivos extra
  chapter-2/
    suarez/
      index.ts
      geo.ts
      pois.ts
    ...
  chapter-3/ ...
  chapter-4/ ...
  theme/
    poi.ts              ← PoiTheme (colores, radios, tamaños, pulso)
    layers.ts           ← LayerStyle por categoría
    index.ts            ← re-exporta PoiTheme + LayerStyle
  index.ts              ← auto-registro vía import.meta.glob
  calibration/
    map.ts              ← overrides de PGW de mapa (dev-only, single file)
    layers.ts           ← overrides de PGW de capa (dev-only, single file)

src/types/
  content.ts            ← MapContent, Layer, LayerGroup, Poi (datos)
  theme.ts              ← PoiTheme, LayerStyle (estilos)

src/services/
  ContentRegistry.ts    ← auto-descubrimiento + acceso por mapId
  LayerManager.ts       ← motor genérico (sin cambios de comportamiento)
  PoiManager.ts         ← motor genérico (lee estilos del tema)
```

**Nomenclatura de carpetas:** `chapter-1/`, `chapter-2/`, etc. El `mapId` se declara explícito en cada `index.ts` (ej. `'chapter2-suarez'`), así la carpeta es solo organización y el `mapId` sigue siendo la clave única (sin acoplar nombre de carpeta ↔ mapId).

---

## 3. Punto de Entrada (`index.ts`)

Un solo contrato, dos grados de detalle según el tamaño del mapa.

### 3.1 Mapa grande — re-exporta archivos hermanos

```ts
// chapter-2/suarez/index.ts
import type { MapContent } from '../../types/content'
import { geo } from './geo'
import { images } from './images'
import { config } from './config'
import { pois } from './pois'

export default {
  mapId: 'chapter2-suarez',
  geo,
  images,
  config,
  pois,
} satisfies MapContent
```

### 3.2 Mapa chico — todo inline

```ts
// chapter-1/formas-del-paisaje/index.ts
import type { MapContent } from '../../types/content'

export default {
  mapId: 'chapter1-formas-paisaje',
  geo: { pgw: [0, -0.0002, -0.0002, 0, -76.7, 3.1], width: 3389, height: 6684 },
  images: { base: '...', full: '...', placeholder: '...' },
  config: { initialBearing: -90, minZoom: 5, maxZoom: 16 },
  pois: [ /* 2 POIs inline */ ],
} satisfies MapContent
```

**Regla:** `satisfies MapContent` garantiza typecheck de la estructura sin importar la granularidad de archivos.

---

## 4. Contrato `MapContent` (`src/types/content.ts`)

```ts
import type { PGWData } from '@services/BoundsCalculator'

export interface MapGeoEntry {
  /** PGW formato rotado [A, D, B, E, C, F] con A=0, E=0 */
  readonly pgw: PGWData
  readonly width: number
  readonly height: number
}

export interface MapImageUrls {
  base: string
  full: string
  placeholder: string
}

export interface MapConfig {
  initialZoom: number
  minZoom: number
  maxZoom: number
  initialBearing: number
  useTransformConstrain: boolean
  viewportMaxBounds: null | { west: number; south: number; east: number; north: number }
  dragPan: boolean
  scrollZoom: boolean
}

export interface MapTilesConfig {
  urlTemplate: string
  tileSize: number
  minZoom: number
  maxZoom: number
  fadeDuration?: number
}

export interface MapContent {
  mapId: string
  geo: MapGeoEntry
  images: MapImageUrls
  config: MapConfig
  tiles?: MapTilesConfig | null
  layers?: Layer[]
  groups?: LayerGroup[]
  pois?: Poi[]
}
```

- Obligatorios: `mapId`, `geo`, `images`, `config`.
- Opcionales: `tiles`, `layers`, `groups`, `pois` (un mapa puede no tener POIs, capas o tiles).
- `Layer`, `LayerGroup`, `Poi` se reutilizan de `types/layer.ts` y `types/poi.ts` (sin cambio de forma), solo se mueven a `types/content.ts` para co-localizar el contrato de contenido.---

## 5. Tema Central de Estilos (`src/content/theme/`)

### 5.1 `theme/poi.ts` — `PoiTheme`

```ts
export interface PoiTheme {
  radius: number          // 15
  radiusLarge: number     // 21
  textSize: number        // 14
  textSizeLarge: number   // 20
  circleBg: string        // '#03103a'  (número)
  iconBg: string          // '#0081a9'  (gota)
  pulse: {
    durationMs: number    // 2200
    maxScale: number      // 1.9
    opacity: number       // 0.55
  }
  gota: {
    url: string           // '/assets/interface/icons/line/svg/location.svg'
    height: number        // 21
  }
  tooltipBg: string       // '/assets/tooltip/fondo-tooltip.webp'
  minZoom: number         // 6
  maxZoom: number         // 14
  minScale: number        // 0.8
}

export const POI_THEME: PoiTheme = { /* valores actuales de PoiManager */ }
```

`PoiManager` reemplaza todas las constantes hardcodeadas (`POI_RADIUS`, `POI_TEXT_SIZE`, `PULSE_DURATION_MS`, etc.) por lecturas de `POI_THEME`.

### 5.2 `theme/layers.ts` — `LayerStyle`

```ts
export interface LayerStyle {
  defaultOpacity?: number
  fillOpacity?: number
  lineWidth?: number
  strokeColor?: string
  // ... estilos por tipo de geometría
}

export const LAYER_STYLES: Record<LayerCategory, LayerStyle> = {
  ecosystems: { defaultOpacity: 0.8 },
  nodes:      { defaultOpacity: 0.4 },
  // ...
}
```

Una capa declara `category` y, opcionalmente, sobreescribe un estilo puntual (p. ej. un `paint`/`swatch` propio). `LayerManager` resuelve el estilo efectivo = tema por categoría + override de la capa.

**Principio:** si un estilo aparece en 2+ capas o es una decisión de "marca" (colores de gota/número), vive en el tema. Si es único de una capa, vive en la capa.

---

## 6. Auto-registro (`src/content/index.ts`)

```ts
import type { MapContent } from '../types/content'

const modules = import.meta.glob<{ default: MapContent }>(
  './*/*/index.ts',      // mapas por capítulo: chapter-N/<mapa>/index.ts
  { eager: true },
)
const looseModules = import.meta.glob<{ default: MapContent }>(
  './*/index.ts',        // mapas sueltos: intro/index.ts
  { eager: true },
)

const CONTENT = new Map<string, MapContent>()
for (const mod of [...Object.values(modules), ...Object.values(looseModules)]) {
  const content = mod.default
  if (CONTENT.has(content.mapId)) {
    throw new Error(`mapId duplicado: ${content.mapId}`)
  }
  CONTENT.set(content.mapId, content)
}

export function getMapContent(mapId: string): MapContent | null {
  return CONTENT.get(mapId) ?? null
}
```

- `import.meta.glob('./*/*/index.ts')` matchea `chapter-N/<mapa>/index.ts` (dos niveles bajo `content/`); `./*/index.ts` matchea mapas sueltos de primer nivel (`intro/`).
- `eager: true` evita carga asíncrona — el contenido es datos estáticos livianos (~30 mapas), no justifica code-splitting aún (YAGNI).
- Colisión de `mapId` duplicado → error en build/dev (guard explícito que lanza si `CONTENT` ya tiene la clave).
- `chapters.ts` (tabla de contenidos/navegación, con títulos y orden) se mantiene y sigue apuntando a los mismos `mapId`.

### 6.1 API de acceso unificado

Reemplaza `getMapEntry` (maps/index.ts), `getMapLayers` (layers/index.ts) y `getPois` (pois/index.ts) por una sola:

```ts
export function getMapContent(mapId: string): MapContent | null
```

`AtlasMap.tsx` pasa de 3 llamadas (`getMapLayers` + `getLayerGroups` + `getPois`) a una: `const content = getMapContent(mapId)`.

---

## 7. Calibración (dev-only) — se mantiene en archivos únicos

El plugin de Vite (`calibrationSavePlugin`) reescribe **archivos únicos** vía `rewriteGeoEntry` / `rewriteLayerCalibration`. Al migrar `geo.ts` a per-map, el plugin ya no puede apuntar a un solo `geo.ts` central.

**Solución:** los overrides de calibración se mantienen centralizados en `src/content/calibration/`:
- `calibration/map.ts` → `MAP_CALIBRATIONS: Record<mapId, { pgw, width, height }>`
- `calibration/layers.ts` → `LAYER_CALIBRATIONS: Record<layerId, { pgw, width, height }>`

`ContentRegistry` / `LayerManager` hacen merge en runtime: si existe override, pisa los datos canónicos del mapa/capa. El plugin sigue reescribiendo estos dos archivos únicos (sin cambio de lógica de rewrite).

---

## 8. Migración de Datos Existentes

| Origen actual | Destino |
|---|---|
| `src/data/maps/geo.ts` (MAP_GEO) | `src/content/chapter-N/<mapa>/geo.ts` (por mapa) |
| `src/data/maps/images.ts` (MAP_IMAGES) | `src/content/chapter-N/<mapa>/images.ts` |
| `src/data/maps/configs.ts` (MAP_CONFIGS) | `src/content/chapter-N/<mapa>/config.ts` |
| `src/data/maps/tiles.ts` (MAP_TILES) | `src/content/chapter-N/<mapa>/tiles.ts` (o inline) |
| `src/data/layers/*.ts` | `src/content/chapter-N/<mapa>/layers.ts` + `groups.ts` |
| `src/data/pois/*.ts` | `src/content/chapter-N/<mapa>/pois.ts` |
| `src/data/layers/calibration.ts` | `src/content/calibration/layers.ts` |
| `src/data/maps/index.ts` (getMapEntry) | `src/content/index.ts` (getMapContent) |
| `src/data/chapters/chapters.ts` | se mantiene (tabla de contenidos/navegación) |

Mapas a migrar (por capítulo, según `chapters.ts`):

| Capítulo | Mapas |
|---|---|
| 1 | encuadres, ecosistemas, formas-paisaje, bredunco, mosaicos-del-agua, un-rio-cauca |
| 2 | valle, suarez, cali, villa-rica, m-oriente-cali, m-villa-rica, m-suarez |
| 3 | introduccion, monocultivo, encharcaron, cali-deseca, humedales, arcilla |
| 4 | introduccion, asoyoge, el-buhido, bosque-comestible, los-bajios, el-paso, las-mercedes, la-virginia, centro-agropecuario, la-caicedo, problematicas |

**Nota:** existe el mapa `intro` (portada) en `geo.ts`/`configs.ts`/`images.ts` que NO está en `chapters.ts`. Se migra a `content/intro/index.ts` (carpeta de primer nivel, fuera de `chapter-N/`), por lo que el glob de auto-registro debe cubrir tanto `./*/*/index.ts` (mapas por capítulo) como `./*/index.ts` (mapas sueltos como `intro`).

---

## 9. Consumidores a Actualizar

| Archivo | Cambio |
|---|---|
| `src/components/map/AtlasMap.tsx` | `getMapLayers`/`getLayerGroups`/`getPois` → `getMapContent` |
| `src/hooks/useMap.ts` | `getMapEntry` → `getMapContent` |
| `src/hooks/usePrefetchAdjacent.ts` / `useTilePrefetch.ts` | `getMapEntry` → `getMapContent` |
| `src/services/MapRenderer.ts` | acceso a geo/images/config/tiles vía `MapContent` |
| `src/services/PoiManager.ts` | leer estilos de `POI_THEME` |
| `src/services/LayerManager.ts` | leer estilos de `LAYER_STYLES` |
| `src/pages/DevMenu.tsx` / `TestMapPage.tsx` | listas de mapas vía `chapters.ts` + `getMapContent` |
| `vite.config.ts` | rutas de `geoPath`/`calibrationPath` → `content/calibration/*.ts` |

---

## 10. Fuera de Alcance (YAGNI)

- Code-splitting / `import.meta.glob` lazy por mapa (el contenido es liviano; se reintroduce si el bundle crece).
- Formatos externos de datos (JSON/YAML) o editor para no programadores (el contenido lo agrega el autor, ocasionalmente).
- `raster-tiles` como tipo de capa implementado (sigue tipado pero no soportado por `LayerManager` — fuera de este refactor).

---

## 11. Testing

| Archivo | Alcance |
|---|---|
| `tests/services/ContentRegistry.test.ts` | auto-descubrimiento, `getMapContent` (hit/miss), colisión de mapId lanza error, merge de calibración |
| `tests/services/PoiManager.test.ts` | estilos leídos de `POI_THEME` (no hardcoded) |
| `tests/services/LayerManager.test.ts` | resolución de estilo por categoría + override |

Los tests existentes de LayerManager/PoiManager/layerStore se actualizan a las nuevas rutas de import sin cambiar sus aserciones de comportamiento.

---

## 12. Orden de Implementación

1. `types/content.ts` + `types/theme.ts` (contrato y tema)
2. `content/theme/` (poi.ts, layers.ts, index.ts) con valores actuales
3. `content/index.ts` (auto-registro + `getMapContent`)
4. Migrar `maps/` → `content/chapter-N/<mapa>/` (geo/images/config/tiles)
5. Migrar `layers/` y `pois/` → carpetas por mapa
6. `content/calibration/` + ajustar `vite.config.ts`
7. Actualizar consumidores (AtlasMap, useMap, hooks, MapRenderer, DevMenu, TestMapPage)
8. Actualizar `PoiManager`/`LayerManager` para leer tema
9. Tests
10. Verificación: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` + navegador
