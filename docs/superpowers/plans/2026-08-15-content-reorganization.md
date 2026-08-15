# Reorganización de Contenido por Capítulo + Tema Central — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar los datos de contenido (mapas, capas, POIs) en `src/content/` por capítulo, separar los estilos en un tema central (`src/content/theme/`), y dejar los managers (LayerManager/PoiManager) como motores genéricos que solo conocen interfaces.

**Architecture:** Cada mapa vive en una carpeta `src/content/<chapter>/<slug>/` con un único punto de entrada obligatorio `index.ts` (exporta `MapContent`). Los estilos de POI y capas se centralizan en `theme/`. El registro es automático vía `import.meta.glob`. Los overrides de calibración (dev-only) viven en `src/content/calibration/` como archivos únicos con merge en runtime.

**Tech Stack:** Vite + React 19 + TypeScript strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`) + MapLibre GL v6 + Zustand 5 + Vitest.

## Global Constraints

- `verbatimModuleSyntax: true` → los imports de solo-tipo usan `import type`.
- `noUncheckedIndexedAccess: true` → accesos indexados devuelven `T | undefined`.
- `erasableSyntaxOnly: true` → no usar `enum`, `namespace` ni parámetros de constructor (solo tipos borrables).
- `allowImportingTsExtensions: true` → los imports relativos de datos llevan extensión `.ts`.
- `satisfies MapContent` en cada `index.ts` de mapa para garantizar el contrato.
- `mapId` se declara explícito en cada `index.ts`; el nombre de carpeta es solo organización.
- Convención de alias existente: `@content` (nuevo), `@data`, `@services`, `@stores`, `@hooks`, `@components`, `@pages`, `@types`, `@utils`.
- El glob de registro cubre `./*/*/index.ts` (mapas por capítulo) y `./*/index.ts` (mapas sueltos como `intro`); los módulos que no exportan `default.mapId` (p. ej. `theme/index.ts`) se omiten en runtime.

---

## Estructura de Archivos

```
src/content/
  index.ts                        ← auto-registro + getMapContent (NUEVO)
  intro/index.ts                  ← mapa suelto (portada)
  chapter-1/{encuadres,ecosistemas,formas-paisaje,bredunco,mosaicos-del-agua,un-rio-cauca}/index.ts
  chapter-2/{valle,suarez,cali,villa-rica,m-oriente-cali,m-villa-rica,m-suarez}/index.ts
  chapter-3/{introduccion,monocultivo,encharcaron,cali-deseca,humedales,arcilla}/index.ts
  chapter-4/{introduccion,asoyoge,el-buhido,bosque-comestible,los-bajios,el-paso,las-mercedes,la-virginia,centro-agropecuario,la-caicedo,problematicas}/index.ts
  theme/poi.ts                    ← PoiTheme + POI_THEME (NUEVO)
  theme/layers.ts                 ← LayerStyle + LAYER_STYLES (NUEVO)
  theme/index.ts                  ← re-export (NUEVO)
  calibration/map.ts              ← MAP_CALIBRATIONS (NUEVO)
  calibration/layers.ts           ← LAYER_CALIBRATIONS (MOVED desde data/layers/calibration.ts)

src/types/content.ts              ← MapContent + re-export Layer/LayerGroup/Poi (NUEVO)
src/types/theme.ts                ← PoiTheme, LayerStyle (NUEVO)

src/services/rewriteCalibration.ts   ← reemplaza geoRewrite.ts + rewriteLayerCalibration.ts
src/services/LayerManager.ts         ← lee LAYER_STYLES + LAYER_CALIBRATIONS desde @content
src/services/PoiManager.ts           ← lee POI_THEME desde @content/theme
src/services/MapRenderer.ts          ← MapEntry → MapContent
src/hooks/useMap.ts                  ← getMapEntry → getMapContent
src/hooks/useTilePrefetch.ts         ← getMapEntry → getMapContent
src/hooks/usePrefetchAdjacent.ts     ← getMapEntry → getMapContent
src/components/map/AtlasMap.tsx      ← getMapLayers/getLayerGroups/getPois → getMapContent
src/components/map/LayerMenu.tsx     ← getMapLayers/getLayerGroups → getMapContent
src/components/calibration/CalibrationPanel.tsx  ← getMapEntry/getMapLayers → getMapContent
vite.config.ts                       ← rutas de calibración → content/calibration/*.ts + alias @content
vitest.config.ts                     ← alias @content
tsconfig.app.json                    ← alias @content

BORRAR (tras migración):
  src/data/maps/{geo,images,configs,tiles,index}.ts
  src/data/layers/{index,chapter1-ecosistemas,chapter1-mosaicos-del-agua,chapter1-un-rio-cauca,cap2-nodos,calibration}.ts
  src/data/layers/groups/*.ts
  src/data/layers/shared/*.ts
  src/data/pois/{index,bredunco,formas-paisaje,cap2-valle,cap2-suarez,cap2-villa-rica,cap2-cali}.ts
  src/services/geoRewrite.ts
  src/services/rewriteLayerCalibration.ts

MANTENER:
  src/data/chapters/chapters.ts   ← tabla de contenidos/navegación (mapId → title)
  src/types/layer.ts, src/types/poi.ts, src/types/chapter.ts
```

### Regla de layout por mapa

- `index.ts` **siempre**: exporta `default` con `mapId`, `geo`, `images`, `config` inline y `tiles?`, `layers?`, `groups?`, `pois?` (importados de archivos hermanos opcionales).
- `layers.ts` (solo si el mapa tiene capas): exporta `LAYERS: Layer[]`.
- `groups.ts` (solo si el mapa tiene grupos): exporta `GROUPS: LayerGroup[]`.
- `pois.ts` (solo si el mapa tiene POIs): exporta `POIS: Poi[]`.

Mapas con capas: `chapter1-ecosistemas`, `chapter1-mosaicos-del-agua`, `chapter1-un-rio-cauca`, `chapter2-valle`, `chapter2-m-suarez`, `chapter2-m-villa-rica`, `chapter2-m-oriente-cali`.

Mapas con POIs: `chapter1-bredunco`, `chapter1-formas-paisaje`, `chapter2-valle`, `chapter2-suarez`, `chapter2-villa-rica`, `chapter2-cali`.

Mapa con tiles: `chapter1-ecosistemas`.

---

## Task 1: Tipos de contenido y tema + alias `@content`

**Files:**
- Create: `src/types/content.ts`
- Create: `src/types/theme.ts`
- Modify: `tsconfig.app.json`
- Modify: `vite.config.ts`
- Modify: `vitest.config.ts`

**Interfaces:**
- Produce: `MapContent`, `MapGeoEntry`, `MapImageUrls`, `MapConfig`, `MapTilesConfig` (re-export de `Layer`/`LayerGroup`/`Poi`); `PoiTheme`, `LayerStyle`, `PoiTheme`/`LAYER_STYLES` consumidos después.

- [ ] **Step 1: Crear `src/types/content.ts`**

```ts
import type { PGWData } from '@services/BoundsCalculator'
import type { Layer, LayerGroup } from './layer'
import type { Poi } from './poi'

export type { Layer, LayerGroup } from './layer'
export type { Poi } from './poi'

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

- [ ] **Step 2: Crear `src/types/theme.ts`**

```ts
import type { LayerCategory } from './layer'

export interface PoiTheme {
  radius: number
  radiusLarge: number
  textSize: number
  textSizeLarge: number
  circleBg: string
  iconBg: string
  pulse: { durationMs: number; maxScale: number; opacity: number }
  gota: { url: string; height: number }
  tooltipBg: string
  minZoom: number
  maxZoom: number
  minScale: number
}

export interface LayerStyle {
  defaultOpacity?: number
}

export type LayerStyleMap = Record<LayerCategory, LayerStyle>
```

- [ ] **Step 3: Agregar alias `@content`**

En `tsconfig.app.json` → `"paths"`:
```json
"@content/*": ["./src/content/*"],
```
En `vite.config.ts` → `resolve.alias`:
```ts
'@content': resolve(__dirname, 'src/content'),
```
En `vitest.config.ts` → `resolve.alias`:
```ts
'@content': resolve(__dirname, 'src/content'),
```

- [ ] **Step 4: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS (sin consumidores aún)

---

## Task 2: Tema central (`src/content/theme/`)

**Files:**
- Create: `src/content/theme/poi.ts`
- Create: `src/content/theme/layers.ts`
- Create: `src/content/theme/index.ts`

**Interfaces:**
- Consumes: `PoiTheme`, `LayerStyle` de `@types/theme`.
- Produces: `POI_THEME` (const), `LAYER_STYLES` (const), re-export en `@content/theme`.

- [ ] **Step 1: Crear `src/content/theme/poi.ts`**

```ts
import type { PoiTheme } from '@types/theme'

export const POI_THEME: PoiTheme = {
  radius: 15,
  radiusLarge: 21,
  textSize: 14,
  textSizeLarge: 20,
  circleBg: '#03103a',
  iconBg: '#0081a9',
  pulse: { durationMs: 2200, maxScale: 1.9, opacity: 0.55 },
  gota: {
    url: '/assets/interface/icons/line/svg/location.svg',
    height: 21,
  },
  tooltipBg: '/assets/tooltip/fondo-tooltip.webp',
  minZoom: 6,
  maxZoom: 14,
  minScale: 0.8,
}
```

- [ ] **Step 2: Crear `src/content/theme/layers.ts`**

```ts
import type { LayerStyle, LayerStyleMap } from '@types/theme'

export const LAYER_STYLES: LayerStyleMap = {
  ecosystems: { defaultOpacity: 0.8 },
  rivers: { defaultOpacity: 0.8 },
  nodes: { defaultOpacity: 0.4 },
  boundaries: {},
  conflicts: {},
  other: {},
}
```

- [ ] **Step 3: Crear `src/content/theme/index.ts`**

```ts
export { POI_THEME } from './poi'
export { LAYER_STYLES } from './layers'
```

- [ ] **Step 4: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS

---

## Task 3: Registro automático + calibración centralizada

**Files:**
- Create: `src/content/index.ts`
- Create: `src/content/calibration/map.ts`
- Create: `src/content/calibration/layers.ts`
- Create: `src/services/rewriteCalibration.ts`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: `MapContent` de `@types/content`; `CalibrationEntry` (definido local en `calibration/layers.ts`).
- Produce: `getMapContent(mapId: string): MapContent | null`; `rewriteCalibrationEntry(src, id, data): string`.

- [ ] **Step 1: Crear `src/content/calibration/layers.ts`** (mover contenido de `data/layers/calibration.ts`)

```ts
import type { PGWData } from '@services/BoundsCalculator'

export interface CalibrationEntry {
  pgw: PGWData
  width: number
  height: number
}

export const LAYER_CALIBRATIONS: Record<string, CalibrationEntry> = {}
```

- [ ] **Step 2: Crear `src/content/calibration/map.ts`**

```ts
import type { CalibrationEntry } from './layers'

export const MAP_CALIBRATIONS: Record<string, CalibrationEntry> = {}
```

- [ ] **Step 3: Crear `src/services/rewriteCalibration.ts`** (reemplaza `geoRewrite.ts` + `rewriteLayerCalibration.ts`)

```ts
export interface CalibrationEntryData {
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
}

export function rewriteCalibrationEntry(
  src: string,
  id: string,
  data: CalibrationEntryData,
): string {
  const valid = /^[A-Za-z0-9_-]+$/.test(id)
  if (!valid) throw new Error(`id inválido: "${id}"`)
  const [a, d, b, e, c, f] = data.pgw
  const block = [
    `  '${id}': {`,
    `    pgw: [${a}, ${d}, ${b}, ${e}, ${c}, ${f}],`,
    `    width: ${Math.round(data.width)},`,
    `    height: ${Math.round(data.height)},`,
    `  },`,
  ].join('\n')

  const re = new RegExp(`^  '${escapeRegex(id)}': \\{[\\s\\S]*?\\r?\\n  \\},`, 'm')
  if (re.test(src)) {
    return src.replace(re, block)
  }

  const closingBraceIdx = src.lastIndexOf('}')
  if (closingBraceIdx === -1) throw new Error('Formato inválido: archivo de calibración')
  return src.slice(0, closingBraceIdx) + '\n' + block + '\n' + src.slice(closingBraceIdx)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
```

- [ ] **Step 4: Actualizar `vite.config.ts`** — rutas y función de rewrite

Reemplazar imports:
```ts
import { rewriteCalibrationEntry } from './src/services/rewriteCalibration.ts'
```
Reemplazar rutas:
```ts
const mapCalibrationPath = resolve(__dirname, 'src/content/calibration/map.ts')
const layerCalibrationPath = resolve(__dirname, 'src/content/calibration/layers.ts')
```
En el middleware: para `target === 'layers'`, usar `layerCalibrationPath` y `rewriteCalibrationEntry`; para `target === 'map'`, leer/escribir `mapCalibrationPath` con `rewriteCalibrationEntry` (en vez de `geo.ts` + `rewriteGeoEntry`). El fallback para un archivo de calibración inexistente es el string con `import type { PGWData } ...` (igual que hoy para layers).

- [ ] **Step 5: Crear `src/content/index.ts`** (auto-registro)

```ts
import type { MapContent } from '@types/content'
import { MAP_CALIBRATIONS } from './calibration/map'

const mapModules = import.meta.glob<{ default: MapContent }>('./*/*/index.ts', { eager: true })
const looseModules = import.meta.glob<{ default: MapContent }>('./*/index.ts', { eager: true })

const CONTENT = new Map<string, MapContent>()

for (const mod of [...Object.values(mapModules), ...Object.values(looseModules)]) {
  const content = mod.default
  if (!content || typeof content.mapId !== 'string') continue
  if (CONTENT.has(content.mapId)) {
    throw new Error(`mapId duplicado en content: ${content.mapId}`)
  }
  CONTENT.set(content.mapId, content)
}

export function getMapContent(mapId: string): MapContent | null {
  const content = CONTENT.get(mapId)
  if (!content) return null
  const calib = MAP_CALIBRATIONS[mapId]
  if (!calib) return content
  return {
    ...content,
    geo: { ...content.geo, pgw: calib.pgw, width: calib.width, height: calib.height },
  }
}
```

- [ ] **Step 6: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS

---

## Task 4: Migrar `intro` y capítulo 1

**Files:** create `src/content/intro/index.ts` y 6 carpetas de `chapter-1/`. Mover capas/grupos/POIs.

Datos fuente: `src/data/maps/geo.ts`, `images.ts`, `configs.ts`, `tiles.ts`; `src/data/layers/chapter1-ecosistemas.ts`, `chapter1-mosaicos-del-agua.ts`, `chapter1-un-rio-cauca.ts`, `groups/*.ts`; `src/data/pois/bredunco.ts`, `formas-paisaje.ts`.

- [ ] **Step 1: `src/content/intro/index.ts`** (geo+images+config inline, de `intro` en los 3 sources)

- [ ] **Step 2: `chapter-1/encuadres/index.ts`**, `chapter-1/bredunco/index.ts`, `chapter-1/formas-paisaje/index.ts` (inline; bredunco y formas-paisaje con `pois.ts`)

- [ ] **Step 3: `chapter-1/ecosistemas/`** — `index.ts` (geo+images+config+tiles inline) + `layers.ts` (7 composites) + `groups.ts` (8 grupos)

- [ ] **Step 4: `chapter-1/mosaicos-del-agua/`** — `index.ts` + `layers.ts` (7) + `groups.ts` (3)

- [ ] **Step 5: `chapter-1/un-rio-cauca/`** — `index.ts` + `layers.ts` (7) + `groups.ts` (7)

- [ ] **Step 6: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS (aún no consumidores, pero los nuevos archivos compilan)

> Nota: `src/data/layers/shared/ecosistemas.ts` (29 sub-capas, no referenciado por `LAYERS`) se conserva moviéndolo a `src/content/chapter-1/ecosistemas/layers-shared.ts` con el mismo export `ECOSYSTEMS_LAYERS`, sin cablear (igual que hoy).

---

## Task 5: Migrar capítulos 2, 3 y 4

**Files:** create 7 carpetas `chapter-2/`, 6 `chapter-3/`, 11 `chapter-4/`.

- [ ] **Step 1: `chapter-2/`** — `valle` (index + layers.ts con 3 nodos + pois.ts con 3 nodos-icon), `suarez` (index + pois.ts 7 flechas), `cali` (index + pois.ts 9 flechas), `villa-rica` (index + pois.ts 5 flechas), `m-oriente-cali` (index + layers.ts nodo-oriente-cali), `m-villa-rica` (index + layers.ts nodo-villa-rica), `m-suarez` (index + layers.ts nodo-suarez)

- [ ] **Step 2: `chapter-3/`** — 6 mapas, todos solo `index.ts` (geo+images+config inline)

- [ ] **Step 3: `chapter-4/`** — 11 mapas, todos solo `index.ts` (geo+images+config inline)

- [ ] **Step 4: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS

---

## Task 6: Actualizar consumidores

**Files:** Modify `useMap.ts`, `useTilePrefetch.ts`, `usePrefetchAdjacent.ts`, `MapRenderer.ts`, `AtlasMap.tsx`, `LayerMenu.tsx`, `CalibrationPanel.tsx`.

- [ ] **Step 1: `useMap.ts`** — `import { getMapEntry } from '@data/maps'` → `import { getMapContent } from '@content'`; `getMapEntry(mapId)` → `getMapContent(mapId)`.

- [ ] **Step 2: `useTilePrefetch.ts`** — `getMapEntry` → `getMapContent`.

- [ ] **Step 3: `usePrefetchAdjacent.ts`** — `getMapEntry` → `getMapContent`.

- [ ] **Step 4: `MapRenderer.ts`** — `import type { MapEntry } from '@data/maps'` → `import type { MapContent } from '@types/content'`; cambiar tipos de `entry: MapEntry` → `entry: MapContent` en `buildGeoreferencedMap` y `addTilesLayer`.

- [ ] **Step 5: `AtlasMap.tsx`** — reemplazar 3 imports por `getMapContent`:
```ts
import { getMapContent } from '@content'
```
y dentro del componente:
```ts
const content = useMemo(() => getMapContent(mapId), [mapId])
const layers = content?.layers ?? null
const groups = content?.groups ?? null
const pois = content?.pois ?? null
```

- [ ] **Step 6: `LayerMenu.tsx`** — `getMapLayers(mapId)`/`getLayerGroups(mapId)` → `getMapContent(mapId)?.layers`/`?.groups`.

- [ ] **Step 7: `CalibrationPanel.tsx`** — `getMapEntry`/`getMapLayers` → `getMapContent` (`entry.geo` → `content.geo`, `getMapLayers(mapId)` → `getMapContent(mapId)?.layers`).

- [ ] **Step 8: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS

---

## Task 7: Motores leen el tema

**Files:** Modify `src/services/PoiManager.ts`, `src/services/LayerManager.ts`.

- [ ] **Step 1: `PoiManager.ts`** — importar `POI_THEME` de `@content/theme` y reemplazar constantes hardcodeadas: `POI_RADIUS`→`POI_THEME.radius`, `POI_RADIUS_LARGE`→`POI_THEME.radiusLarge`, `POI_TEXT_SIZE`→`POI_THEME.textSize`, `POI_TEXT_SIZE_LARGE`→`POI_THEME.textSizeLarge`, `POI_BG`→`POI_THEME.circleBg`, `POI_ICON_BG`→`POI_THEME.iconBg`, `PULSE_DURATION_MS`→`POI_THEME.pulse.durationMs`, `PULSE_MAX_SCALE`→`POI_THEME.pulse.maxScale`, pulse opacity `0.55`→`POI_THEME.pulse.opacity`, `GOTA_ICON_URL`→`POI_THEME.gota.url`, `GOTA_ICON_HEIGHT`→`POI_THEME.gota.height`, `TOOLTIP_BG`→`POI_THEME.tooltipBg`, `POI_MIN_ZOOM`/`POI_MAX_ZOOM`/`POI_MIN_SCALE`→campos del tema. Conservar `GOTA_ICON_ID` y los IDs de capa (son IDs internos, no estilos).

- [ ] **Step 2: `LayerManager.ts`** — importar `LAYER_CALIBRATIONS` desde `@content/calibration/layers` (en vez de `@data/layers/calibration.ts`); importar `LAYER_STYLES` y resolver opacidad efectiva: `opacity = store.opacities[id] ?? layer.opacity ?? LAYER_STYLES[layer.category].defaultOpacity ?? 1` (usar en `addLayer` y `sync`).

- [ ] **Step 3: Verificar typecheck**

Run: `pnpm typecheck`
Expected: PASS

---

## Task 8: Borrar archivos viejos y actualizar tests

**Files:** delete `src/data/maps/*`, `src/data/layers/*` (salvo nada), `src/data/pois/*`, `src/services/geoRewrite.ts`, `src/services/rewriteLayerCalibration.ts`; update tests.

- [ ] **Step 1: Borrar** `src/data/maps/`, `src/data/layers/`, `src/data/pois/` y `src/services/geoRewrite.ts`, `src/services/rewriteLayerCalibration.ts` (mantener `src/data/chapters/`).

- [ ] **Step 2: `tests/services/BoundsCalculator.test.ts`** — quitar `import { MAP_GEO } from '@data/maps/geo.js'`; definir `INTRO` como literal:
```ts
const INTRO = {
  pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033] as const,
  width: 5649,
  height: 11141,
}
```

- [ ] **Step 3: `tests/services/LayerManager.test.ts`** — el import de calibración `await import('@data/layers/calibration.js')` → `await import('@content/calibration/layers')`.

- [ ] **Step 4: `tests/components/LayerMenu.test.tsx`** — `vi.mock('@data/layers', ...)` → `vi.mock('@content', ...)` devolviendo `getMapContent` que retorna `{ layers, groups }`.

- [ ] **Step 5: `tests/components/CalibrationPanel.test.tsx`** — `vi.mock('@data/maps')` + `vi.mock('@data/layers')` → un solo `vi.mock('@content', ...)` con `getMapContent` que retorna `geo`, `config`, `layers`.

- [ ] **Step 6: Borrar `tests/services/geoRewrite.test.ts` y `tests/services/rewriteLayerCalibration.test.ts`**; crear `tests/services/rewriteCalibration.test.ts` con los mismos casos (reemplazo, append, id inválido, CRLF, redondeo) usando `rewriteCalibrationEntry`.

- [ ] **Step 7: Crear `tests/services/ContentRegistry.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'

describe('getMapContent', () => {
  it('devuelve contenido para un mapa existente', async () => {
    const { getMapContent } = await import('@content')
    const content = getMapContent('chapter1-ecosistemas')
    expect(content).not.toBeNull()
    expect(content?.mapId).toBe('chapter1-ecosistemas')
    expect(content?.geo).toBeDefined()
    expect(content?.images).toBeDefined()
    expect(content?.config).toBeDefined()
    expect(content?.layers).toBeDefined()
  })

  it('devuelve null para un mapa inexistente', async () => {
    const { getMapContent } = await import('@content')
    expect(getMapContent('no-existe')).toBeNull()
  })

  it('aplica el override de calibración de mapa', async () => {
    const { MAP_CALIBRATIONS } = await import('@content/calibration/map')
    MAP_CALIBRATIONS['chapter3-introduccion'] = {
      pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555, 2.198599777],
      width: 1754,
      height: 3118,
    }
    const { getMapContent } = await import('@content')
    const content = getMapContent('chapter3-introduccion')
    expect(content?.geo.pgw).toEqual([0, 0.000239511553, 0.000239528625, 0, -77.387345555, 2.198599777])
  })
})
```

- [ ] **Step 8: Ejecutar tests**

Run: `pnpm test`
Expected: PASS (95+ tests)

---

## Task 9: Verificación completa

- [ ] **Step 1: `pnpm typecheck`** — PASS
- [ ] **Step 2: `pnpm lint`** — solo warning pre-existente
- [ ] **Step 3: `pnpm test`** — todos PASS
- [ ] **Step 4: `pnpm build`** — PASS
- [ ] **Step 5: Navegador** — cargar `/test/chapter2-suarez` y `/test/chapter1-ecosistemas`: mapa + POIs + capas renderizan, sin errores de consola.
- [ ] **Step 6: Commit**
