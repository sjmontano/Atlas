# PLAN ATLAS — Nueva Versión Unificada

> **Objetivo**: Reconstruir el Atlas Pluriversal desde cero con arquitectura limpia, TypeScript, monolítica. Usar v17 como cantera de contenido (assets, datos, textos). Sin nada nuevo — todo se extrae de v17.
> **Referencia**: `MEMORIA_TECNICA.md` · `GUIDE.md` (referencia rápida de archivos)
> **Estado**: Análisis completado. Pendiente inicio de reconstrucción.

---

## 0. NOTA IMPORTANTE: atlas_3.0

Se descubrió `atlas_front/atlas_3.0/` — una re-arquitectura en TypeScript (~12K líneas) que implementa el 70% de lo planeado. **Evaluación**: solo los subsistemas de mapas (31 configs, PGW, renderer, tiles, stores Zustand, MapLibreAdapter) son aprovechables. Todo lo demás (componentes legacy JSX, vistas, modales, audio, galerías, CSS) se reconstruye desde cero con CSS Modules + mobile-first. Ver `MEMORIA_TECNICA.md §3.1` para evaluación detallada.

## 0. DECISIONES DE ARQUITECTURA

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Package manager | **pnpm** | Atlas 3.0 ya lo usa. Más rápido que npm, estricto (sin phantom deps), disco eficiente |
| Lenguaje | **Híbrido: JS para datos, TS para lógica** | El equipo edita `.js` en `data/`. La lógica, stores, hooks y componentes son `.ts`/`.tsx`. `checkJs: true` + `.d.ts` para type-safety en datos. `allowJs: true`, sin `declaration` global |
| Framework | **React 19** + **Vite 6** | Últimas versiones estables |
| Mapas | **MapLibre GL 6.0.0** | `transformConstrain` en constructor, WebGL2, ESM-only |
| Estado | **Zustand 5.0.14** ✅ instalado | 4 stores: map, chapter, layer, ui. Sin boilerplate. `getState()` para orquestación |
| Estilos | **CSS Modules + variables CSS** | Nativo Vite, sin dependencias, design system de v17 portable |
| Router | **React Router 7** | SPA con lazy loading por capítulo |
| Animaciones | **Framer Motion 12** | Transiciones de modales, sidebar, cambio de mapas |
| Testing | **Vitest 3** + **jsdom** | Unitarios + integración. Mocks de MapLibre |
| Linting | **ESLint 9** flat config | Strict TypeScript rules |
| Backend | **Independiente, no se toca** | El frontend NO depende de él. Existe aparte como herramienta opcional |
| Hosting | **cPanel LiteSpeed** | `latinamericahosting.com.co`, Plan M2, subdominio `atlas.unriocauca.com` |
| **Contenido** | **Extraído de v17, no migrado** | Reconstruimos desde cero, usando v17 como fuente de assets, textos, datos. No se copia código de v17 |
| **No modificar** | **v17, 3.0, backend** | Solo se toca `atlas/` |
| **Responsive** | **Mobile-first, portrait + landscape** | Debe funcionar en celular en ambas orientaciones. Touch events, bottom sheets en vez de sidebars, modales a pantalla completa |

---

## 1. ESTRUCTURA DEL PROYECTO

```
atlas/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
│
├── public/
│   └── assets/
│       ├── maps/
│       │   ├── thumbnails/         # 31 thumbnails 512px WebP (5-15KB c/u)
│       │   ├── chapter-1/
│       │   │   ├── encuadres/
│       │   │   │   ├── base.webp
│       │   │   │   └── tiles/{z}/{x}/{y}.webp
│       │   │   ├── ecosistemas/
│       │   │   ├── formas-paisaje/
│       │   │   ├── bredunco/
│       │   │   ├── mosaicos-del-agua/
│       │   │   └── un-rio-cauca/
│       │   ├── chapter-2/
│       │   ├── chapter-3/
│       │   └── chapter-4/
│       ├── geo-layers/             # 30 archivos GeoJSON
│       ├── images/                 # Assets de contenido de v17
│       │   ├── carousel/           # Carrusel perfil + talleres
│       │   ├── gallery/            # Galerías Cap 2 (Suarez, Cali, Villa Rica)
│       │   ├── icons/              # iconsCap4 (73), IconosTejidosAgua (11)
│       │   ├── background/         # Fondos, thumbnails
│       │   └── logos/              # Logos de organizaciones (30)
│       ├── audio/                  # Cap 3 (Cali_47SNA.mp3, Salvajina_47SNA.mp3)
│       ├── map-layers/             # mapasMenuCap2 (63 SVGs)
│       └── ui/                     # interface/ (iconos, loaders, UI elements)
│
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Router principal + providers
│   │
│   ├── data/                       # DATOS — .JS (equipo edita esto) + .d.ts (tipos para TS)
│   │   ├── maps/
│   │   │   ├── pgw.js              # PGW fuente única (~90 entradas: 31 mapas + 54 sub-capas)
│   │   │   ├── pgw.d.ts            # Tipos: export type PGWData = readonly [number,...]
│   │   │   ├── images.js           # URLs de imágenes (Cloudinary + locales)
│   │   │   ├── images.d.ts
│   │   │   ├── configs.js          # Config por mapa (zoom, bearing, bounds)
│   │   │   ├── configs.d.ts
│   │   │   └── index.js            # Barrel: getMapData(mapId) → { pgw, images, config }
│   │   ├── chapters/
│   │   │   ├── chapters.js         # 4 capítulos, 31 mapas, territorios
│   │   │   ├── chapters.d.ts
│   │   │   └── index.js
│   │   ├── layers/
│   │   │   ├── index.js            # Registro 30 capas GeoJSON
│   │   │   ├── index.d.ts
│   │   │   └── categories.js       # 6 categorías (rivers, ecosystems, etc.)
│   │   └── content/
│   │       ├── carousel.js         # Datos carrusel perfil + talleres
│   │       ├── gallery.js          # Datos galerías Cap 2
│   │       ├── audio.js            # Referencias audio Cap 3/4
│   │       └── modals.js           # Contenido textual de modales
│   │
│   ├── services/                   # LÓGICA PURA (sin React, sin JSX)
│   │   ├── BoundsCalculator.ts     # PGW → corners (half-pixel) → coordinates
│   │   ├── MapRenderer.ts          # Construye ImageSource + RasterTileSource
│   │   ├── ZoomCalculator.ts       # Zoom óptimo desde bounds + viewport
│   │   ├── TileService.ts          # URLs de tiles, manejo de fallback
│   │   ├── TransformConstrain.ts   # createBearingAwareConstrain() — port de 3.0
│   │   └── MapLogger.ts            # Logger por entorno (debug/info/warn/error)
│   │
│   ├── stores/                     # ESTADO GLOBAL (Zustand)
│   │   ├── mapStore.ts             # activeMapId, mapBuilt, loading, error
│   │   ├── chapterStore.ts         # activeChapter, activeTerritory, chapterMaps
│   │   ├── layerStore.ts           # visibleLayers, opacities, activeCategories
│   │   ├── uiStore.ts              # activeModal, sidebarOpen, activePanel
│   │   └── index.ts                # Barrel exports
│   │
│   ├── hooks/                      # CUSTOM HOOKS (React + stores)
│   │   ├── useMap.ts               # Hook principal: pipeline init → render → ready
│   │   ├── useMapConfiguration.ts  # Resuelve config del mapa
│   │   ├── useMapBounds.ts         # PGW → bounds → coordinates
│   │   ├── useMapDimensions.ts     # Carga dimensiones de imagen
│   │   ├── useMapZoom.ts           # Calcula zoom óptimo
│   │   ├── useLayers.ts            # Sincroniza capas GeoJSON con MapLibre
│   │   ├── useChapter.ts           # Navegación de capítulos
│   │   ├── useAudio.ts             # Control de audio player
│   │   ├── useCarousel.ts          # Lógica de carrusel
│   │   └── useMedia.ts             # Imágenes Cloudinary optimizadas
│   │
│   ├── components/                 # COMPONENTES REACT (TSX + CSS Modules)
│   │   ├── map/
│   │   │   ├── AtlasMap.tsx              # Componente principal del mapa
│   │   │   ├── AtlasMap.module.css
│   │   │   ├── MapControls.tsx           # Zoom, home, capas
│   │   │   ├── MapLegend.tsx             # Leyenda de capas
│   │   │   ├── MapLoadingShell.tsx       # Shell durante carga (placeholder + spinner)
│   │   │   └── MapLoadingShell.module.css
│   │   ├── layers/
│   │   │   ├── LayerPanel.tsx            # Panel de capas con toggles
│   │   │   └── LayerToggle.tsx           # Toggle individual de capa
│   │   ├── navigation/
│   │   │   ├── ChapterNav.tsx            # Navegación entre capítulos
│   │   │   ├── Header.tsx                # Header global
│   │   │   └── Breadcrumb.tsx            # Migas de pan
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx               # Sidebar principal
│   │   │   └── TerritorySelector.tsx     # Selector de territorio dentro de capítulo
│   │   ├── modals/
│   │   │   ├── Modal.tsx                 # Shell de modal (backdrop, Escape, a11y)
│   │   │   ├── InfoModal.tsx             # Modal de información de capa/mapa
│   │   │   └── CarouselModal.tsx         # Modal con carrusel de imágenes
│   │   ├── carousel/
│   │   │   ├── Carousel.tsx              # Carrusel reutilizable
│   │   │   └── Carousel.module.css
│   │   ├── audio/
│   │   │   ├── AudioPlayer.tsx           # Reproductor flotante Cap 3/4
│   │   │   └── AudioPlayer.module.css
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Icon.tsx                  # Wrapper de iconos (SVG/WebP)
│   │   └── layout/
│   │       ├── PageLayout.tsx            # Layout base de página
│   │       └── MapLayout.tsx             # Layout con mapa a pantalla completa
│   │
│   ├── pages/                      # PÁGINAS (rutas)
│   │   ├── DevMenu.tsx                   # TEMPORAL: menú con los 31 mapas
│   │   ├── TestMapPage.tsx               # Visor individual: /test/:mapId
│   │   ├── HomePage.tsx                  # Home con mapa + grid de capítulos
│   │   ├── AtlasPage.tsx                 # Visor principal con navegación
│   │   ├── CreditsPage.tsx               # Créditos
│   │   └── EntramadosPage.tsx            # Entramados territoriales
│   │
│   ├── types/                      # TIPOS GLOBALES
│   │   ├── map.ts                       # MapConfig, PGWData, Bounds, MapLayers
│   │   ├── chapter.ts                   # Chapter, ChapterMap, Territory
│   │   ├── layer.ts                     # GeoLayer, LayerCategory
│   │   └── media.ts                     # MediaItem, AudioTrack, GalleryItem
│   │
│   ├── styles/                     # ESTILOS GLOBALES
│   │   ├── tokens.css                   # Design tokens (variables CSS de v17)
│   │   ├── globals.css                  # Reset, tipografía, utilidades
│   │   └── animations.css               # Keyframes compartidos
│   │
│   └── utils/                      # UTILIDADES
│       ├── cn.ts                        # Classname helper
│       └── constants.ts                 # Constantes globales
│
├── scripts/                       # Scripts de build
│   └── generate-tiles.py                # Generación de tiles (GDAL)
│
├── tests/                         # Tests
│   ├── setup.ts                        # jsdom + polyfills MapLibre
│   ├── services/
│   │   ├── BoundsCalculator.test.ts
│   │   └── MapRenderer.test.ts
│   └── stores/
│       ├── mapStore.test.ts
│       └── layerStore.test.ts
│
├── MEMORIA_TECNICA.md              # Investigación y lecciones (referencia)
└── PLAN_ATLAS.md                   # Este documento
```

---

## 2. SISTEMA DE CARGA PROGRESIVA DE MAPAS

### 2.1 Problema

- 31 mapas, imágenes de 2-22 MB en alta resolución
- Usuarios en zonas rurales con conexiones lentas (3G, alta latencia)
- No se puede mostrar pantalla en blanco mientras carga

### 2.2 Solución: 3 etapas progresivas

```
ETAPA 1: Placeholder (t=0ms, 5-15KB)
  └─ Thumbnail ultra-comprimido. Visible instantáneamente.
     Previene "pantalla en blanco".
     Fuente: Cloudinary transform w=512,q=30,f=webp
     O: archivos locales pre-generados en public/assets/maps/thumbnails/

ETAPA 2: Imagen principal (t=200ms-2s, 100-500KB)
  └─ Resolución media. Calidad suficiente para vista general.
     Reemplaza al placeholder con fade.
     Fuente: Cloudinary transform w=2048,q=70,f=webp
     O: archivos locales medium.webp

ETAPA 3: Tiles (t=500ms-5s, por zoom level)
  └─ Alta resolución. Carga progresiva por nivel de zoom.
     Solo se cargan los tiles visibles en el viewport actual.
     Fuente: XYZ tiles pre-generados en public/assets/maps/{id}/tiles/
     O: Cloudinary (mientras no haya tiles locales)
```

### 2.3 Flujo visual

```
Usuario hace clic en "Ecosistemas"
  │
  ├─ t=0ms   → Muestra placeholder (ya precargado o cargado en <100ms)
  │            El placeholder es un thumbnail de 512px que ocupa todo el viewport.
  │            Se ve pixelado pero muestra el mapa completo.
  │
  ├─ t=200ms → Placeholder visible. Imagen principal cargando en background.
  │            Se muestra un spinner sutil o pulso de opacidad.
  │
  ├─ t=800ms → Imagen principal lista. Fade de placeholder → imagen principal.
  │            El usuario ya ve el mapa con buena calidad.
  │            Los tiles empiezan a cargar.
  │
  ├─ t=1.5s  → Primeros tiles visibles. Se superponen a la imagen principal.
  │            Transición imperceptible porque cubren las mismas coordenadas.
  │
  └─ t=3s    → Todos los tiles del zoom actual cargados.
              Alta definición. Usuario puede hacer zoom y pan.
```

### 2.4 Implementación

```typescript
// src/types/map.ts
interface MapLayers {
  /** Thumbnail ultra-comprimido (5-15KB). Carga instantánea. */
  placeholder: string
  /** Imagen principal resolución media (100-500KB). */
  mainImage: string
  /** Template XYZ tiles para alta resolución (opcional, null si no hay tiles). */
  tilesUrl: string | null
  /** Dimensiones de la imagen para georreferenciación. */
  dimensions: { width: number; height: number }
}

// src/data/maps/images.ts
const MAP_LAYERS: Record<string, MapLayers> = {
  'chapter1-ecosistemas': {
    placeholder: '/assets/maps/thumbnails/chapter1-ecosistemas.webp',  // 8KB
    mainImage: 'https://res.cloudinary.com/dvluvxfvn/image/upload/w_2048,q_70,f_webp/v.../ecosistemas.webp',
    tilesUrl: '/assets/maps/chapter-1/ecosistemas/tiles/{z}/{x}/{y}.webp',  // null si no generados
    dimensions: { width: 10396, height: 5848 }
  }
}
```

```typescript
// src/components/map/AtlasMap.tsx (flujo simplificado)
function AtlasMap({ mapId }: { mapId: string }) {
  const layers = getMapLayers(mapId)
  const pgw = getPgwData(mapId)

  // ETAPA 1: Placeholder — se muestra inmediatamente
  // (el div tiene background-image con el placeholder)

  // ETAPA 2: Imagen principal — se carga en background
  const { coordinates } = useMapBounds(pgw, layers.dimensions)

  // ETAPA 3: Tiles — se agregan después de que la imagen principal está lista
  map.on('idle', () => {
    if (layers.tilesUrl && !tilesAdded) {
      map.addSource('tiles', {
        type: 'raster',
        tiles: [layers.tilesUrl],
        tileSize: 256,
        scheme: 'xyz'
      })
      tilesAdded = true
    }
  })
}
```

### 2.5 Thumbnails: estrategia de generación

**Opción A (recomendada para desarrollo): Cloudinary transforms**

```typescript
function getPlaceholderUrl(cloudinaryUrl: string): string {
  // Cloudinary transform: 512px ancho, calidad 30%, WebP
  return cloudinaryUrl.replace('/upload/', '/upload/w_512,q_30,f_webp/')
}
```

Ventajas: Sin build step. Funciona inmediatamente. Los thumbnails pesan 5-15KB.

**Opción B (recomendada para producción): Locales pre-generados**

Script de Node.js que descarga todas las imágenes de Cloudinary, genera thumbnails de 512px y los guarda en `public/assets/maps/thumbnails/`. Esto permite funcionamiento offline y elimina dependencia de Cloudinary para la carga inicial.

### 2.6 Precarga de mapas adyacentes

Mientras el usuario ve el mapa actual, precargar los thumbnails de los mapas adyacentes (siguiente/anterior en el capítulo). Así el cambio es instantáneo.

```typescript
// src/hooks/useMap.ts
function usePreloadAdjacentMaps(currentMapId: string, chapterMaps: string[]) {
  useEffect(() => {
    const currentIndex = chapterMaps.indexOf(currentMapId)
    const adjacent = [
      chapterMaps[currentIndex - 1],
      chapterMaps[currentIndex + 1]
    ].filter(Boolean)

    adjacent.forEach(mapId => {
      const img = new Image()
      img.src = getMapLayers(mapId).placeholder
    })
  }, [currentMapId])
}
```

---

## 3. PLAN DE IMPLEMENTACIÓN (FASES)

### Fase 1: Setup y datos (Día 1)

- [ ] `pnpm create vite atlas --template react-ts`
- [ ] Instalar dependencias
- [ ] Configurar tsconfig strict, path aliases (`@data`, `@services`, `@stores`, `@hooks`, `@components`)
- [ ] Configurar ESLint, Prettier, Vitest
- [ ] Crear estructura de carpetas
- [ ] Definir tipos (`src/types/map.ts`, `chapter.ts`, `layer.ts`)
- [ ] Migrar y tipar PGW data: de `pgwData.js` (655 líneas) a `src/data/maps/pgw.ts`
- [ ] Migrar configs de mapa: de `mapConfig.js` a `src/data/maps/configs.ts`
- [ ] Migrar URLs de imágenes: de `geoMapping.js` a `src/data/maps/images.ts`
- [ ] Migrar capítulos: de `chaptersData.ts` a `src/data/chapters/chapters.ts`
- [ ] Copiar GeoJSON layers: de `public/assets/geo-layers/` a `public/assets/geo-layers/`
- [ ] Copiar assets de v17: imágenes, iconos, audio, SVGs

### Fase 2: Servicios core + Stores (Día 2)

- [ ] `BoundsCalculator.ts` — PGW → coordinates con half-pixel
- [ ] `TransformConstrain.ts` — Port de `createBearingAwareConstrain()` desde 3.0
- [ ] `MapRenderer.ts` — Construye `ImageSource` con coordenadas desde PGW
- [ ] `ZoomCalculator.ts` — Zoom óptimo desde bounds y viewport
- [ ] `MapLogger.ts` — Logger por entorno
- [ ] Implementar stores: `mapStore`, `chapterStore`, `layerStore`, `uiStore`
- [ ] Tests unitarios de `BoundsCalculator` + `TransformConstrain`

### Fase 3: Hooks + Componente AtlasMap (Día 2-3)

- [ ] `useMapConfiguration.ts` — Resuelve config del mapa
- [ ] `useMapBounds.ts` — PGW → bounds → coordinates
- [ ] `useMapDimensions.ts` — Carga dimensiones de imagen
- [ ] `useMapZoom.ts` — Calcula zoom óptimo
- [ ] `useMap.ts` — Pipeline principal: init → bounds → render → ready
- [ ] `MapLoadingShell.tsx` — Placeholder + transición de carga
- [ ] `AtlasMap.tsx` — Componente principal que integra todo

### Fase 4: DevMenu + TestMapPage (Día 3)

- [ ] `DevMenu.tsx` — Grid organizado por capítulos con los 31 mapas
- [ ] `TestMapPage.tsx` — Ruta `/test/:mapId` que carga cualquier mapa
- [ ] Verificar georreferenciación de los 7 mapas del Cap 1
- [ ] Ajustar PGW donde sea necesario

### Fase 5: UI + Navegación (Día 4-5)

- [ ] `Header.tsx` + `ChapterNav.tsx` + `Breadcrumb.tsx`
- [ ] `Sidebar.tsx` + `TerritorySelector.tsx`
- [ ] `LayerPanel.tsx` + `LayerToggle.tsx`
- [ ] `MapControls.tsx` + `MapLegend.tsx`
- [ ] `AtlasPage.tsx` — Visor con navegación real

### Fase 6: Features v17 (Día 5-8)

- [ ] `Modal.tsx` + `InfoModal.tsx` (shell de modales)
- [ ] `CarouselModal.tsx` + `Carousel.tsx` (perfil + talleres)
- [ ] `AudioPlayer.tsx` (Cap 3 y 4)
- [ ] Galerías Cap 2 (Suarez, Cali, Villa Rica)
- [ ] `HomePage.tsx` (mapa interactivo + grid de capítulos)
- [ ] `CreditsPage.tsx` + `EntramadosPage.tsx`

### Fase 7: Capítulos 2-4 (Día 8-12)

- [ ] Verificar PGW de Cap 2 (4 mapas)
- [ ] Verificar PGW de Cap 3 (6 mapas)
- [ ] Verificar PGW de Cap 4 (11 mapas)
- [ ] Integrar iconos Cap 4 (73 SVGs)
- [ ] Integrar menú de capas Cap 2 (63 SVGs)
- [ ] Integrar sub-capas raster (54 capas)

### Fase 8: Tiles + Optimización (Día 12-15)

> **Documento detallado:** [`FACETA_2_TILES_PLAN.md`](FACETA_2_TILES_PLAN.md) —
>  8 secciones con análisis de alternativas, pros/contras, decisiones descartadas,
>  plan de contingencias, guía de regeneración, y estrategias de CDN.

- [ ] **8a — Pulir fade-in/estética**: `raster-fade-duration: 0` en base, reordenar pipeline (full antes de tiles), validar visual z6→z11 (ver §1 del plan)
- [ ] **8b — Optimizar rendimiento**: `maxParallelImageRequests: 4`, Service Worker precache z6-z8, `lowPowerMode` flag (ver §2-3 del plan)
- [ ] **8c — Cache y CDN**: `.htaccess`/`vercel.json` con `Cache-Control: immutable`, URLs redundantes con fallback local, Cloudflare R2 como CDN opcional (ver §4 del plan)
- [ ] **8d — Contingencias**: timeout/retry de tiles, fallback sin tiles, WebGL context lost, modo offline (ver §5 del plan)
- [ ] Generar thumbnails locales (512px) para los 31 mapas
- [ ] Generar tiles XYZ para Cap 1 (GDAL, 7 mapas) — piloto `chapter1-ecosistemas` ✓ (657 tiles, z6-z11)
- [ ] Generar tiles XYZ para Cap 2-4 (a medida que se validen)
- [ ] Code splitting: lazy loading por capítulo
- [ ] Auditoría de bundle size (< 1.5 MB inicial)
- [ ] Cache headers para tiles y assets estáticos

### Fase 9: Testing + Producción (Día 15-17)

- [ ] Tests de integración (renderizado de mapas con mocks MapLibre)
- [ ] Tests de snapshot (componentes UI)
- [ ] Build de producción: `pnpm build`
- [ ] Desplegar a cPanel (`atlas.unriocauca.com`)
- [ ] Verificar SSL, cache, CORS
- [ ] Eliminar `DevMenu.tsx` y ruta `/dev`

---

## 4. RUTAS DE LA APLICACIÓN

| Ruta | Componente | Descripción | Carga |
|------|-----------|-------------|-------|
| `/` | `HomePage` | Home con mapa interactivo y grid de 4 capítulos | Eager |
| `/atlas` | `AtlasPage` | Visor principal con navegación | Eager |
| `/test/:mapId` | `TestMapPage` | Visor individual de mapa (dev) | Eager |
| `/dev` | `DevMenu` | Menú con los 31 mapas (TEMPORAL) | Eager |
| `/capitulo/2` | `Chapter2Page` | Cap 2 - Tejidos y entramados | Lazy |
| `/capitulo/3` | `Chapter3Page` | Cap 3 - Caminos y conflictos | Lazy |
| `/capitulo/4` | `Chapter4Page` | Cap 4 - Actores y poderes | Lazy |
| `/creditos` | `CreditsPage` | Créditos y equipo | Lazy |
| `/entramados` | `EntramadosPage` | Galería de organizaciones | Lazy |

---

## 5. DEPENDENCIAS

### Runtime

```json
{
  "maplibre-gl": "^6.0.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "zustand": "^5.0.11",
  "framer-motion": "^12.4.0"
}
```

**6 dependencias runtime.** Nada más. Sin axios (sin backend). Sin prop-types (TypeScript). Sin Mapbox GL. Sin Turf.js. Sin Proj4 (todo en EPSG:4326).

### Dev

```json
{
  "@eslint/js": "^9.39.0",
  "@types/react": "^19.2.0",
  "@types/react-dom": "^19.2.0",
  "@vitejs/plugin-react": "^5.1.0",
  "eslint": "^9.39.0",
  "eslint-plugin-react-hooks": "^7.0.0",
  "eslint-plugin-react-refresh": "^0.4.0",
  "globals": "^16.5.0",
  "jsdom": "^27.0.0",
  "typescript": "~5.9.0",
  "typescript-eslint": "^8.46.0",
  "vite": "^6.2.0",
  "vitest": "^3.2.0"
}
```

---

## 6. CONVENCIONES DE CÓDIGO

### Naming

- **Archivos**: PascalCase para componentes (`AtlasMap.tsx`), camelCase para hooks/services (`useMap.ts`, `boundsCalculator.ts`)
- **Funciones**: camelCase (`getMapData`, `calculateBounds`)
- **Tipos**: PascalCase (`MapConfig`, `PGWData`)
- **Interfaces**: PascalCase, sin prefijo `I` (`Chapter`, no `IChapter`)
- **Constantes**: UPPER_SNAKE_CASE para valores fijos (`MAP_LAYERS`, `CHAPTER_DATA`)

### Imports

```typescript
// Path aliases (definidos en tsconfig + vite.config)
import { getMapData } from '@data/maps'
import { BoundsCalculator } from '@services/BoundsCalculator'
import { useMapStore } from '@stores/mapStore'
import { useMap } from '@hooks/useMap'
import { AtlasMap } from '@components/map/AtlasMap'
```

### CSS Modules

```typescript
// Un archivo .module.css por componente, co-localizado
import styles from './AtlasMap.module.css'

<div className={styles.container}>
  <div className={styles.map} ref={mapContainerRef} />
</div>
```

### Estado (Zustand)

```typescript
// Stores solo importan data/ y services/. No importan React.
// La orquestación entre stores usa getState():

// En chapterStore.ts:
goToChapter: (chapter: number) => {
  const maps = getChapterMapIds(chapter)
  set({ activeChapter: chapter, chapterMaps: maps })
  
  // Orquestación directa (sin React)
  useMapStore.getState().setActiveMap(maps[0])
  useLayerStore.getState().applyChapterDefaults(chapter)
}
```

### Datos

```typescript
// data/ NO importa services/, stores/, hooks/, ni components/.
// Solo exports de datos puros y tipos.

// src/data/maps/pgw.ts
export const PGW_DATA = {
  'chapter1-encuadres': [0.002291638, 0, 0, -0.002290735, -82.702961, -4.618418],
  'chapter1-ecosistemas': [0.000470689, 0, 0, -0.000470661, -77.717574, 4.258046],
  // ...
} as const satisfies Record<string, PGWData>
```

---

## 7. PREGUNTAS ABIERTAS (para decidir durante el desarrollo)

1. **¿Generamos thumbnails locales o usamos Cloudinary transforms para la etapa 1?**
   - Inicial: Cloudinary (`w_512,q_30,f_webp`) — sin build step
   - Producción: Locales pre-generados — offline support

2. **¿Los 31 mapas usan todos el mismo bearing=-90 o hay excepciones?**
   - v17 y 3.0 usan bearing=-90 unificado. Verificar si algún mapa (¿encuadres?) requiere bearing distinto.

3. **¿Cap 2-4 usan `dragPan: true` o son estáticos?**
   - v17: 5 mapas interactivos, 9 bloqueados. Decidir cuáles permiten interacción.

4. **¿Mantener la distinción DESC vs DINAMYC en modales?**
   - v17 tiene `type: 'DESC' | 'DINAMYC'` en ModalInfo. Revisar si es relevante.

---

## 8. COMANDOS

```bash
pnpm dev            # Desarrollo (Vite)
pnpm build          # TypeScript check + build producción
pnpm preview        # Preview del build
pnpm lint           # ESLint
pnpm lint:fix       # ESLint con auto-fix
pnpm test           # Vitest run
pnpm test:watch     # Vitest en modo watch
pnpm typecheck      # Solo TypeScript check (sin build)
```

---

## 9. REGLAS CLAVE

- **Reconstrucción desde cero, no migración**. No se copia código de v17. Se escribe código nuevo que usa los assets, datos y contenido de v17 como materia prima.
- **Nada nuevo**: todo el contenido (mapas, modales, galerías, audio, iconos, capas) se extrae de `atlas_front/atlas_frontend_v17/`.
- **PGW en `geo.js` de `atlas/` son los originales rotados** (A=0, E=0, D≠0, B≠0). No convertirlos. MapLibre con `bearing: -90` rota la vista.
- **El `pgwData.js` de v17 tiene PGW en formato convertido estándar** (A≠0, E≠0). No usar esos — usar los rotados originales que están en `atlas/src/data/maps/geo.js`.
- **Solo se modifica `atlas/`**. `atlas_front/`, `atlas_backend/` no se tocan.
- **Modales (texto)**: extraer de `atlas_front/atlas_frontend_v17/src/components/InfoModal/` (layouts Luyaut1/Luyaut2).
- **Assets**: copiar de `atlas_front/atlas_frontend_v17/dist/assets/`.
- **GeoJSON capas**: del backend o de archivos estáticos.
- **No hay backend dependency**: el frontend funciona 100% sin backend.
- **Responsive mobile-first**: portrait + landscape. Touch events, bottom sheets, modales fullscreen. Header, sidebar, paneles adaptativos.
- **El DevMenu (`/dev`) es temporal.** Se elimina cuando la navegación real esté lista.

---

## 10. PRIMER PASO (AHORA)

```bash
pnpm create vite atlas --template react-ts
cd atlas
pnpm add maplibre-gl react-router-dom zustand framer-motion
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

¿Procedo?
