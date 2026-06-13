# Arquitectura del Proyecto — Atlas 2.0

> Atlas Pluriversal del Río Cauca · Visor cartográfico interactivo

---

## Resumen

Atlas 2.0 usa un patrón de **Domain Modules** planos: cada dominio agrupa su propia lógica (tipos, datos, hooks, servicios) sin depender de otros dominios. La coordinación entre dominios ocurre exclusivamente en los **Zustand stores**. La UI consume stores, no dominios directamente.

```
UI Components  ──── lean store ──▶  Zustand Stores
                                          │
                          orquesta via getState()
                                          │
                                   Domains (read-only)
```

---

## Árbol de carpetas

```
src/
├── domains/              # Módulos de dominio — lógica de negocio
│   ├── map/              # Motor cartográfico
│   ├── layers/           # Capas vectoriales GeoJSON
│   ├── chapters/         # Narrativa de capítulos
│   └── media/            # Imágenes y multimedia (Cloudinary)
│
├── lib/                  # Adaptadores de librerías externas
│   ├── maplibre/         # MapLibre GL JS wrapper
│   └── cloudinary/       # Cloudinary config + helpers
│
├── state/                # Stores Zustand globales
│   ├── mapStore.ts
│   ├── layersStore.ts
│   ├── chaptersStore.ts
│   └── uiStore.ts
│
├── ui/                   # Capa de presentación
│   ├── Atlas.tsx         # Shell principal del visor
│   ├── components/
│   │   ├── map/          # AtlasMapBuilder, MapControls, MapLegend, MapSelector
│   │   ├── layers/       # LayerControl, LayerPanel
│   │   ├── chapters/     # ChapterNav
│   │   └── sidebar/      # Sidebar (rail + panel)
│   └── themes/           # mapThemes.ts — paleta visual
│
└── pages/                # Páginas React Router
    └── MapTestPage/      # Ruta /test-maps/:mapId (testing)
```

---

## Dominios

### `domains/map/` — Motor cartográfico

Responsabilidad: toda la lógica técnica de georreferenciación.

| Subcarpeta  | Contenido                                                                                |
| ----------- | ---------------------------------------------------------------------------------------- |
| `config/`   | `mapConfig.ts`, `mapSettings.ts`, `mapStyles.ts`, `mapBounds.ts`, `mapConfigProvider.ts` |
| `context/`  | `MapContext.tsx` — React Context para la instancia `maplibregl.Map`                      |
| `data/`     | `atlasMapData.ts` — datos técnicos (PGW, imagePath, dimensiones)                         |
| `hooks/`    | `useAtlasMap`, `useMapConfiguration`, `useMapBounds`, `useMapDimensions`, `useMapZoom`   |
| `services/` | `MapRenderer`, `BoundsCalculator`, `ImageDimensions`, `MapLogger`                        |
| `utils/`    | `coordinatesRotator`, `zoomCalculator`                                                   |

**Regla crítica**: `atlasMapData.ts` NO tiene campos narrativos. Solo tiene datos técnicos (PGW, rutas de tiles, dimensiones).

**`mapConfigProvider.ts`** — única función:

```
mapId: string → MapConfig (lookup + merge + normalize)
```

Sin ifs basados en capítulo o territorio.

---

### `domains/layers/` — Capas vectoriales

| Subcarpeta  | Contenido                                                                  |
| ----------- | -------------------------------------------------------------------------- |
| `data/`     | 31 archivos GeoJSON + `index.ts` + `categories.ts`                         |
| `hooks/`    | `useGeoLayers` (índice estático), `useMapLayers` (sincroniza con MapLibre) |
| `services/` | `LayerManager` — registro de capas activas                                 |
| `types/`    | `geo.ts` — interfaz `GeoLayer`                                             |

`useMapLayers` observa `visibleLayers` del `layersStore` y aplica los cambios al mapa de forma reactiva.

---

### `domains/chapters/` — Narrativa

| Subcarpeta | Contenido                                                                  |
| ---------- | -------------------------------------------------------------------------- |
| `data/`    | `chaptersData.ts` — `CHAPTERS_DATA`, interfaces `Chapter`, `ChapterMapRef` |
| `hooks/`   | `useChapter` — wrapper reactivo del `chaptersStore`                        |

**Regla crítica**: `chaptersData.ts` ZERO imports de `@map`. Solo maneja strings (`mapId`) e información narrativa (títulos, descripciones).

---

### `domains/media/` — Multimedia

| Subcarpeta         | Contenido                                      |
| ------------------ | ---------------------------------------------- |
| `data/geo-images/` | Índice de imágenes Cloudinary (~3945 entradas) |
| `hooks/`           | `useGeoImages` — acceso al índice estático     |

---

## Stores (Zustand 5)

Todos usan `devtools` middleware. Los stores **no se importan desde dominios**; los componentes UI y hooks de integración los importan desde `@state`.

```typescript
// Siempre importar así:
import { useMapStore, useLayersStore } from "@state";
// Nunca directamente desde el dominio:
// ❌ import { useMapStore } from "../../state/mapStore";
```

### `mapStore`

```typescript
{
  activeMapId: string; // mapa activo actualmente
  mapBuilt: boolean; // imagen geo visible y lista
  loading: boolean; // cargando config/dimensiones
  error: string | null; // null si todo OK
}
```

### `layersStore`

```typescript
{
  visibleLayers: Set<string>; // IDs de capas visibles
  opacities: Record<string, number>; // opacidad por capa
  activeCategories: Set<string>; // categorías activas
}
```

### `chaptersStore`

```typescript
{
  activeChapter: number
  activeTerritory: string | null
  chapterMaps: string[]     // mapIds del capítulo activo
}
```

`goToChapter(n)` llama directamente `useMapStore.getState().setActiveMap()` y `useLayersStore.getState().applyChapterDefaults()`. Este es el único lugar donde un store orquesta a otro.

### `uiStore`

```typescript
{
  sidebarOpen: boolean;
  activeSidebarPanel: "chapters" | "layers" | "search" | null;
  activeModal: "territory-info" | "layer-info" | "media-gallery" | null;
  modalPayload: unknown;
}
```

---

## Instancia del mapa — `MapContext`

`maplibregl.Map` **no va en Zustand** porque no es serializable. Vive en estado local dentro de `MapContext` y se expone por React Context.

```
MapProvider                     ← envuelve todo en Atlas.tsx
  └── AtlasMapBuilder           ← llama registerMap() tras construir
        └── useMapContext()     ← cualquier componente accede a map
```

```typescript
// En hooks de integración:
const { map, isReady } = useMapContext();
if (isReady && map) map.flyTo({ center: [...] });
```

---

## Librería de adaptadores (`lib/`)

### `lib/maplibre/MapLibreAdapter.ts`

Encapsula la creación y destrucción de instancias MapLibre. `AtlasMapBuilder` lo usa; nada más debería crear `new maplibregl.Map()` directamente.

Exports: `createMapInstance`, `destroyMapInstance`, `registerMapEventHandlers`

### `lib/cloudinary/CloudinaryAdapter.ts`

Exports: `CLOUDINARY_CONFIG`, `getOptimizedImageUrl`

---

## Path Aliases

Definidos en `vite.config.ts` y `tsconfig.app.json`:

| Alias       | Resuelve a                       |
| ----------- | -------------------------------- |
| `@map`      | `src/domains/map`                |
| `@layers`   | `src/domains/layers`             |
| `@chapters` | `src/domains/chapters`           |
| `@media`    | `src/domains/media`              |
| `@spatial`  | `src/domains/spatial` _(futuro)_ |
| `@state`    | `src/state`                      |
| `@ui`       | `src/ui`                         |
| `@lib`      | `src/lib`                        |

---

## Flujo de datos principal

```
Usuario hace clic en un mapa en ChapterNav
      │
      ▼
useMapStore.setActiveMap("chapter1-formas-paisaje")
      │
      ▼
Atlas.tsx lee activeMapId (selector reactivo)
      │
      ▼
<AtlasMapBuilder key={activeMapId} mapId={activeMapId} />
  ── se remonta con la nueva key ──
      │
      ▼
getMapConfig(mapId)  →  mapConfigProvider  →  atlasMapData
      │
      ▼
MapRenderer.buildGeoreferencedMap()
  → getImageDimensions()
  → processBounds() (PGW → lng/lat)
  → new maplibregl.Map()
  → addSource / addLayer (tile raster)
      │
      ▼
map "load" event
  → registerMap(map)         // MapContext
  → storeSetMapBuilt(true)   // mapStore
  → setLoading(false)
```

---

## Reglas de dependencias

```
✅ Permitido:
  UI → @state (stores)
  UI → @map/context/MapContext
  Store → otro Store via getState()
  Dominio → @lib (adaptadores)
  Dominio → propio dominio (subcarpetas)

❌ Prohibido:
  Dominio → otro dominio (ej. @chapters → @map)
  Store → UI (componentes)
  @chapters/data → @map/data (chaptersData no conoce MapConfig)
  Componente UI → directamente un servicio de dominio (ir vía store o hook)
```

---

## Stack tecnológico

| Herramienta    | Versión | Rol                                          |
| -------------- | ------- | -------------------------------------------- |
| React          | 19      | UI                                           |
| TypeScript     | ~5.9    | Tipos estáticos                              |
| Vite           | 7       | Bundler/dev server                           |
| MapLibre GL JS | 5.17    | Motor de mapas                               |
| Zustand        | 5.0.11  | Estado global                                |
| React Router   | 6       | Routing                                      |
| Framer Motion  | 12      | Animaciones _(instalado, pendiente de usar)_ |
| Cloudinary     | SDK     | Imágenes optimizadas                         |

---

## Cómo añadir un nuevo mapa

1. **Datos técnicos** → `src/domains/map/data/atlasMapData.ts`
   - Añadir entrada con `pgwData`, `imagePath`, `tilesPath`

2. **Configuración** → `src/domains/map/config/mapSettings.ts`
   - Ajustar zoom, bearing, bounds si difiere del default

3. **Narrativa** → `src/domains/chapters/data/chaptersData.ts`
   - Añadir `{ mapId, title, description }` al `maps[]` del capítulo correspondiente

4. **Store** → `src/state/chaptersStore.ts`
   - Añadir el mapId al array `CHAPTER_MAPS[n]` _(ver deuda técnica en PENDIENTE.md para eliminar esta duplicación)_

5. **Tiles** → generar con `scripts/generate-tiles-simple.py` y depositar en `public/assets/maps/tiles/`

No se requiere ningún cambio en `mapConfigProvider.ts` ni en los componentes UI.

---

## Cómo añadir un nuevo capítulo

Mismos pasos que arriba + crear la entrada `CHAPTERS_DATA[n]` en `chaptersData.ts`. `ChapterNav` la renderizará automáticamente al leer `Object.keys(CHAPTERS_DATA)`.
