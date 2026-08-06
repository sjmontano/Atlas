# MEMORIA TÉCNICA — Atlas Pluriversal

> **Documento de memoria persistente para el desarrollo de la versión unificada.**
> Fecha de investigación: Julio 2026
> Basado en el análisis profundo de los 3 proyectos existentes.

---

## ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Análisis de atlas_backend](#2-análisis-de-atlas_backend)
3. [Análisis de atlas_3.0](#3-análisis-de-atlas_30)
4. [Análisis de atlas_frontend_v17](#4-análisis-de-atlas_frontend_v17)
   - 4.1 [Catálogo de Bundles JS](#41-catálogo-de-bundles-js)
   - 4.2 [Catálogo de Bundles CSS](#42-catálogo-de-bundles-css)
   - 4.3 [Contenido del Bundle Principal](#43-contenido-del-bundle-principal-index-dkc-r5ufjs)
   - 4.4 [Arquitectura de Rutas](#44-arquitectura-de-rutas)
   - 4.5 [Catálogo de Assets (304 archivos)](#45-catálogo-de-assets-304-archivos-90-mb)
   - 4.6 [Otros Archivos](#46-otros-archivos)
   - 4.7 [Dependencias](#47-dependencias-de-v17-que-no-están-en-30)
   - 4.8 [Hallazgos Clave](#48-hallazgos-clave-de-v17)
   - 4.9 [Resumen de Tamaños](#49-resumen-de-tamaños)
5. [Problemas Críticos Detectados](#5-problemas-críticos-detectados)
6. [Sistema de Georreferenciación (PGW)](#6-sistema-de-georreferenciación-pgw)
7. [Sistema de Tiles](#7-sistema-de-tiles)
8. [Features de v17 que NO están en 3.0](#8-features-de-v17-que-no-están-en-30)
9. [Arquitectura Recomendada (Nueva Versión)](#9-arquitectura-recomendada-nueva-versión)
10. [Plan de Migración](#10-plan-de-migración)
11. [Análisis Detallado de la Conversión PGW](#11-análisis-detallado-de-la-conversión-pgw-causa-raíz-de-la-georreferenciación-incorrecta)
12. [Lecciones de la Bitácora (34 interacciones)](#12-lecciones-de-la-bitácora-34-interacciones-documentadas)
    - 12.1 [Georreferenciación y Bounds](#121-lecciones-de-georreferenciación-y-bounds)
    - 12.2 [MapLibre y Renderizado](#122-lecciones-de-maplibre-y-renderizado)
    - 12.3 [Arquitectura y Código](#123-lecciones-de-arquitectura-y-código)
    - 12.4 [Bugs Concretos](#124-bugs-concretos-encontrados-y-corregidos)
    - 12.5 [Patrones que Funcionan](#125-patrones-que-funcionan-conservar)
13. [Hallazgos y Sentencias](#13-hallazgos-y-sentencias)
14. [Resumen para Memoria de Agente](#resumen-para-memoria-de-agente)

---

## 1. RESUMEN EJECUTIVO

### Estado actual del proyecto Atlas Pluriversal

El proyecto **Atlas Pluriversal: Un Río Cauca, Muchos Mundos** es una plataforma de cartografía digital interactiva desarrollada por la Universidad Mayor de Colombia. Explora las dinámicas socio-ambientales del Valle Alto del Río Cauca a través de 4 capítulos con 31 mapas georreferenciados, capas vectoriales, galerías, audio y modales informativos.

### Los 3 proyectos

| Proyecto | Rol | Estado | Calidad |
|----------|-----|--------|---------|
| `atlas_backend` | API REST (MongoDB + Cloudinary) | Funcional, mínima | Básica — hecho aprendiendo |
| `atlas_3.0` | Reescritura en TypeScript (~12K líneas) | ~70% arquitectura lista, mapas OK | Domina TS, mapas con bearing -90, tiles. Solo mapas útiles; UI/componentes legacy obsoletos |
| `atlas_frontend_v17` | Versión completa funcional (4 capítulos) | 100% funcional | Monolito JS sin tipado, **SÍ tiene source** en `atlas_front/atlas_frontend_v17/src/` |

### Objetivo de la nueva versión

Crear **un proyecto unificado, limpio, con arquitectura sólida** que:
- Incluya TODO el contenido de v17 (4 capítulos + audio + carrusel + galerías + modales)
- Use el sistema de tiles optimizado de 3.0 (carga rápida, buena latencia)
- Tenga georreferenciación **correcta** (corregir lo que está mal en 3.0)
- Elimine el backend innecesario (todo es estático)
- Use TypeScript + React 19 + Zustand + MapLibre GL correctamente

---

## 2. ANÁLISIS DE atlas_backend

### Estructura

```
atlas_backend/
├── app.js                    # Entry point (6 líneas)
├── package.json              # Node.js + Express + Mongoose + Cloudinary
├── .env                      # CREDENCIALES EXPUESTAS (MongoDB + Cloudinary)
├── informe.md                # Documentación de 869 líneas
└── src/
    ├── config/
    │   ├── server.config.js  # Clase Server (Express + middlewares + rutas)
    │   ├── database.config.js # Conexión Mongoose a MongoDB Atlas
    │   └── cloudinary.config.js # SDK Cloudinary
    ├── controllers/
    │   ├── location.controller.js  # CRUD de GeoJSON FeatureCollections
    │   ├── modalInfo.controller.js # CRUD de info modal
    │   └── upload.controller.js    # Subida a Cloudinary
    ├── models/
    │   ├── location.model.js    # GeoCollection (FeatureCollection + Features)
    │   ├── modalInfo.model.js   # ModalInfo (title, description, imgRef, type)
    │   ├── modalPicture.model.js # Imágenes de modales
    │   └── geoImage.model.js    # Imágenes geolocalizadas
    ├── routes/
    │   ├── location.routes.js
    │   ├── modalInfo.route.js
    │   └── uploads.route.js
    └── helpers/
        └── removeExtension.js
```

### Stack tecnológico

- Node.js + Express 4.21
- MongoDB Atlas (cloud) via Mongoose 8.9
- Cloudinary SDK 2.5
- express-fileupload 1.5
- Sin TypeScript, sin tests, sin autenticación

### API Endpoints

```
POST   /api/v1/location          → Crear GeoJSON FeatureCollection
GET    /api/v1/location/:term    → Buscar por ID o nombre (regex)
POST   /api/v1/modal             → Crear info modal
GET    /api/v1/modal             → Listar todos (populated)
GET    /api/v1/modal/:id         → Obtener uno (populated)
POST   /api/v1/uploads/modal/:modalId  → Subir imagen a Cloudinary + vincular a modal
POST   /api/v1/uploads/geoImage  → Subir imagen geo a Cloudinary
```

### Problemas detectados

1. **CREDENCIALES EXPUESTAS**: `.env` contiene MongoDB URI, Cloudinary keys en texto plano en el repo
2. **BUG en ruta**: `uploads.route.js` línea 8: `uploadsRouter.post('modal/:modalId', ...)` — **falta el `/` inicial**, nunca matcheará requests a `/api/v1/uploads/modal/:id`
3. **Inconsistencia de naming**: `location.routes.js` (plural) vs `modalInfo.route.js` (singular)
4. **Sin autenticación**: Cualquiera puede modificar datos
5. **Sin validación**: express-validator instalado pero NO usado
6. **Sin TypeScript**: JS puro, sin tipos
7. **Informe.md miente**: Describe features que no existen (JWT, rate limiting, Sharp, Swagger)
8. **Backend innecesario**: Toda la data es estática, solo se usa Cloudinary para imágenes
9. **getLocation bug**: Cuando `isArray`, toma `geoCollection[0]` pero eso podría ser `undefined` si el array está vacío

### Sentencia sobre el backend

> **El backend NO es necesario para la nueva versión.** Toda la información es estática (archivos JSON, imágenes, tiles). Cloudinary puede consumirse directamente desde el frontend. MongoDB solo almacena GeoJSON que podría ser archivos `.json` estáticos. Mantener este backend agrega latencia, costo y complejidad sin beneficio.

---

## 3. ANÁLISIS DE atlas_3.0

### Estructura

```
atlas_3.0/
├── src/                       # 177 archivos fuente (~12,000 líneas TS/JS)
│   ├── domains/               # 41 archivos - Lógica de negocio (TS)
│   │   ├── chapters/          # data/ + hooks/
│   │   ├── layers/            # config/ + data/ + hooks/ + services/ + types/
│   │   └── map/               # config/ + context/ + data/ + hooks/ + services/ + types/ + utils/
│   ├── state/                 # 6 archivos - Zustand stores
│   │   ├── mapStore.ts        # activeMapId, mapBuilt, loading, error
│   │   ├── layersStore.ts     # visibleLayers, opacities, activeCategories
│   │   ├── chaptersStore.ts   # activeChapter, activeTerritory, chapterMaps
│   │   └── uiStore.ts         # UI state
│   ├── ui/                    # 18 archivos - Componentes UI modernos (TSX)
│   │   ├── Atlas.tsx          # Shell del visor principal
│   │   └── components/        # map/, layers/, chapters/, sidebar/
│   ├── lib/                   # 4 archivos - Adaptadores
│   │   ├── maplibre/          # MapLibreAdapter
│   │   └── cloudinary/        # CloudinaryAdapter
│   ├── components/            # 35 archivos - Componentes legacy JSX (OBSOLETO)
│   ├── views/                 # 13 archivos - Vistas legacy (OBSOLETO)
│   ├── data/                  # 26 archivos - Datos estáticos JS (OBSOLETO)
│   ├── utils/                 # 5 archivos (OBSOLETO)
│   ├── Hooks/                 # 4 hooks legacy (OBSOLETO)
│   └── styles/                # 10 archivos CSS (OBSOLETO)
├── public/assets/             # Assets estáticos (tiles, imágenes, íconos)
├── scripts/                   # 9 scripts Python/JS
├── docs/                      # 17 documentos
└── package.json               # React 19 + TypeScript 5.9 + Zustand 5 + Vite 7
```

### Stack tecnológico

- React 19.2 + TypeScript 5.9 + Vite 7.2
- MapLibre GL 5.17 (exclusivo, wrapper via adapter)
- Zustand 5.0.11 (4 stores)
- react-router-dom 7.13
- Vitest 3.2 + jsdom 27
- ESLint 9

### Arquitectura: Domain Modules + Zustand Stores

```
UI Components ──── leen store ──▶  Zustand Stores
                                        │
                        orquestan via getState()
                                        │
                                 Domains (read-only)
```

**Regla de oro**: JS para datos (editables por equipo de contenido), TS para lógica.
**Regla crítica**: Los dominios NO se importan entre sí. La orquestación ocurre en los stores.

### Flujo de renderizado de mapas

```
1. Usuario cambia de mapa → chaptersStore.goToChapter() o mapStore.setActiveMap()
2. Atlas.tsx recibe activeMapId → monta AtlasMapBuilder con key={activeMapId}
3. useAtlasMap ejecuta pipeline:
   a. useMapConfiguration(mapId) → getCompleteMapConfig() → MapConfig
   b. useMapDimensions() → obtiene dimensiones de la imagen
   c. useMapBounds() → processBounds() → BoundsCalculator.buildAffineGeometry()
   d. useMapZoom() → calcula zoom inicial
   e. createMapInstance() → MapLibreAdapter
   f. MapRenderer.buildGeoreferencedMap() → agrega image source + fitBounds
4. setMapBuilt(true)
```

### Mapas definidos (31 total)

| Capítulo | Mapas | IDs |
|----------|-------|-----|
| Intro | 1 | `intro` |
| Cap 1 | 6 | `chapter1-encuadres`, `chapter1-ecosistemas`, `chapter1-formas-paisaje`, `chapter1-bredunco`, `chapter1-mosaicos-del-agua`, `chapter1-un-rio-cauca` |
| Cap 2 | 4 | `chapter2-valle`, `chapter2-suarez`, `chapter2-cali`, `chapter2-villa-rica` |
| Cap 3 | 6 | `chapter3-*` (6 mapas) |
| Cap 4 | 11 | `chapter4-*` (11 mapas) |
| Test | 3 | `test-*` |

**Assets locales**: Solo Cap 1 + Intro (imágenes base + tiles generados). Cap 2-4 usan Cloudinary URLs.

### Lo que FUNCIONA bien

1. **Sistema de tiles**: Carga rápida y progresiva (capa base 30KB + tiles de alta resolución)
2. **Arquitectura de dominios**: Separación clara de responsabilidades
3. **TypeScript en lógica**: Buen tipado en stores, servicios, hooks
4. **Zustand**: Manejo de estado simple y eficiente
5. **Code splitting**: 5 chunks manuales reducen el bundle inicial
6. **MapLogger**: Sistema de logging por entorno
7. **Tests**: Vitest configurado con tests para stores y renderer
8. **PGW bearing -90 nativo**: Rotación aplicada como bearing de MapLibre, no como rotación de coordenadas
9. **Constrain bearing-aware**: Reemplaza setMaxBounds para mapas retrato

### Lo que NO funciona / está MAL

1. **GEORREFERENCIACIÓN INCORRECTA**: Los mapas del Cap 1 están mal geográficamente. Las coordenadas PGW en `atlasMapData.ts` fueron convertidas de los PGW rotados originales (v17) aplicando una rotación de 90° que NO es correcta para todos los casos.

2. **Datos PGW duplicados**: Existen dos fuentes de PGW:
   - `src/domains/map/data/atlasMapData.ts` (TS, formato estándar, valores convertidos)
   - `src/data/mapImages/pgwData.js` (JS, formato rotado original de v17, con PGW por capa individual)

3. **La rotación de coordenadas no resuelve el problema**: `coordinatesRotator.ts` rota las coordenadas de la imagen pero las coordenadas PGW no coinciden porque la conversión fue incorrecta.

4. **El mapa del Cap 1 fue rotado físicamente** con GDAL antes de generar tiles, pero los PGW en `atlasMapData.ts` no reflejan esa rotación correctamente.

5. **Inconsistencia de rutas**: `MapSelectorGrid` usa `/map/:mapId` pero las rutas reales son `/test-maps/:mapId`.

6. **Cap 2-4 sin assets locales**: Solo existen en Cloudinary. No hay fallback offline.

7. **Código duplicado**: `components/` (JSX legacy) vs `ui/` (TSX nuevo). Muchos componentes existen en ambas carpetas.

8. **Dos entry points**: `main.jsx` y `main.tsx` — inconsistencia.

9. **`App.jsx` y `App.tsx`**: Dos versiones del mismo archivo.

10. **`pgwData.js` NO se usa en el pipeline actual**: Es el dato original de v17 pero está huérfano.

### 3.1 Evaluación de utilidad (lo que SIRVE y lo que NO)

Descubrimiento: **`atlas_3.0` ya implementó el ~70% de la arquitectura que estábamos reconstruyendo**. Tiene ~12,000 líneas de TypeScript con dominio limpio, Zustand, MapLibre bearing -90, 31 mapas configurados, builder de mapa, sidebar con capítulos/capas. Sin embargo, solo ciertos subsistemas son aprovechables en el rebuild.

| Componente/Archivo | ¿Válido? | Razón |
|---|---|---|
| **`domains/map/data/atlasMapData.ts`** — 31 mapas con PGW convertido (A≠0, E<0) + dimensiones + rutas | ✅ **VÁLIDO** | Contiene los 31 mapas con PGW estándar, dimensiones y paths. Fuente única de verdad para datos de mapas. |
| **`domains/map/services/MapRenderer.ts`** — Renderiza ImageSource + TileSource con soporte LQIP | ✅ **VÁLIDO** | Algoritmo sólido: coordenadas rotadas → source → capa raster → tiles. Usa eventos MapLibre. |
| **`domains/map/services/BoundsCalculator.ts`** — PGW → bounds con corrección half-pixel | ✅ **VÁLIDO** | Transformación afín correcta: x=C-A/2-B/2, y=F-D/2-E/2. Aplica bearing -90. |
| **`domains/map/services/ImageDimensions.ts`** — Carga dimensions via `new Image()` con cache LRU | ✅ **VÁLIDO** | Servicio autónomo con caché, manejo de errores y timeouts. |
| **`domains/map/services/TilePrefetcher.ts`** — Precarga tiles en idle | ✅ **VÁLIDO** | `requestIdleCallback` con priorización de tiles centrales. |
| **`domains/map/config/mapSettings.ts`** — Perfiles por mapa (zoom, bearing, bounds, tiles) | ✅ **VÁLIDO** | Config detallada por mapa con soporte para tiles y constrain transform. |
| **`domains/layers/`** — 33 capas GeoJSON con lazy load, LayerManager, perfiles | ✅ **VÁLIDO** | Sistema completo con lazy fetch, visibilidad, opacidad, categorías, persistencia localStorage. |
| **`state/`** — 4 stores Zustand (map, chapters, layers, ui) | ✅ **VÁLIDO** | Stores limpias con orquestación via `getState()`. Patrón correcto. |
| **`lib/maplibre/MapLibreAdapter.ts`** — createMapInstance con bearing -90, interacciones bloqueadas | ✅ **VÁLIDO** | Configura MapLibre con `bearing: -90`, `dragRotate: false`, estilo base opcional OSM. |
| **`lib/cloudinary/CloudinaryAdapter.ts`** — URLs Cloudinary para Caps 2-4 | ✅ **VÁLIDO** | Genera URLs con transformaciones de tamaño/calidad/formato. |
| **`ui/Atlas.tsx`** — Shell del visor (Sidebar + AtlasMapBuilder) | ✅ **VÁLIDO** | Layout funcional con stores, loading shell y error states. |
| **`ui/components/map/AtlasMapBuilder.tsx`** — Builder del mapa con controles y leyenda | ✅ **VÁLIDO** | Orquesta el pipeline completo con loading/error/success states. |
| **`ui/components/map/MapControls.tsx`** — Botones zoom/reset/rotar/fullscreen | ✅ **VÁLIDO** | Componente funcional con SVG inline y eventos. |
| **`ui/components/map/MapLegend.tsx`** — Leyenda de capas con checkboxes + opacidad | ✅ **VÁLIDO** | Panel de capas funcional con refresh periódico. |
| **`ui/components/map/MapLoadingShell.tsx`** — Overlay de carga con nombre del mapa | ✅ **VÁLIDO** | Fade in/out, barra de progreso, nombre del mapa. |
| **`ui/components/sidebar/Sidebar.tsx`** — Rail lateral + panel deslizante | ✅ **VÁLIDO** | Tabs (Capítulos/Capas/Buscar), animación de panel. |
| **`ui/components/chapters/ChapterNav.tsx`** — Árbol de capítulos con sus mapas | ✅ **VÁLIDO** | Navegación por capítulos y territorios con checkboxes de capas. |
| **`ui/components/layers/LayerControl.tsx` + `LayerPanel.tsx`** — Checkboxes por categoría | ✅ **VÁLIDO** | Búsqueda, filtro por categoría, toggle de capas. |
| **`ui/themes/mapThemes.ts`** — Temas visuales | ✅ **VÁLIDO** | Colores y estilos por tipo de mapa. |
| **`data/mapImages/pgwData.js`** — PGW rotados originales v17 | 🟡 **Referencia** | No se usa en pipeline actual. Útil para verificar conversión. |
| **`data/toponimos/`** — 8 archivos JS con topónimos | 🟡 **Referencia** | Migrar a formato estructurado TS. |
| **`data/titles/`** — Títulos narrativos por capítulo | 🟡 **Referencia** | Migrar a `domains/chapters/data/`. |
| **`data/rasterTiles/`** — Config de tiles por mapa | 🟡 **Referencia** | Ya integrado en `mapSettings.ts`. |
| **`components/`** — 35 archivos JSX legacy | ❌ **OBSOLETO** | Duplicado de `ui/`. No tocar. |
| **`views/`** — 13 vistas legacy | ❌ **OBSOLETO** | Mezclan datos, lógica y UI. No reusar. |
| **`utils/`** — mapUtils, geoUtils, etc. | ❌ **OBSOLETO** | Lógica migrada a `domains/map/services/`. |
| **`Hooks/`** — useMap, useMapProps, etc. | ❌ **OBSOLETO** | Reemplazados por `domains/map/hooks/`. |
| **`context/`** — ShadowContext, ContextModal | ❌ **OBSOLETO** | Reemplazado por Zustand stores + MapContext. |
| **`styles/`** — CSS legacy | ❌ **OBSOLETO** | No usa CSS Modules. |

### 3.2 Veredicto

**atlas_3.0 tiene mapas optimizados con tiles y bearing -90, y ahí acaba su utilidad.** Los subsistemas que valen la pena son:

1. `domains/map/` — 31 mapas, PGW, renderer, bounds calculator, tiles
2. `state/` — 4 stores Zustand
3. `lib/` — MapLibreAdapter + CloudinaryAdapter
4. `ui/` — AtlasMapBuilder, MapControls, MapLoadingShell (el resto de UI es legacy y se reconstruye)

**No sirven** (se reconstruyen desde cero con CSS Modules + mobile-first):
- `components/` (35 archivos JSX legacy)
- `views/` (13 vistas legacy)
- `domains/layers/` (se reescribe más simple)
- `domains/chapters/` (se reescribe con datos de v17)
- Todo el CSS legacy
- Toda la UI legacy (modales, galerías, audio, tooltips)

---

## 4. ANÁLISIS DE atlas_frontend_v17

### Estado

- **SÍ tiene código fuente** en `atlas_front/atlas_frontend_v17/src/` (no en el workspace raíz)
- También existe `dist/` compilado (521 archivos en dist/assets/ + docs + configs)
- Tiene historial Git completo con remote origin
- Rama activa: `master` tracking `origin/master`

### Git remotos

```
origin    → https://github.com/ReyGaRGoL/frontend.git
sjmontano → https://github.com/sjmontano/Atlas.git
```

### Estructura del Source

```
atlas_frontend_v17/src/
├── App.jsx                      # Router con createBrowserRouter
├── main.jsx                     # Entry point
├── components/                  # Componentes React
│   ├── InfoModal/               # Modales con layouts Luyaut1/Luyaut2 (texto completo)
│   ├── AudioPlayer/             # Reproductor de audio
│   ├── GaleriaChapter2/         # Galerías de imágenes
│   ├── Capas/                   # Gestión de capas SVG
│   ├── Iconos/                  # Iconos Cap 4
│   ├── Entramados/              # Vista de entramados territoriales
│   ├── CreditsApp/              # Créditos
│   ├── MapaInteraccion/         # Mapas interactivos
│   ├── Sidebars/                # Sidebars
│   ├── library/                 # resources.jsx (índice de recursos)
│   └── ...                      # Más componentes
├── views/                       # Vistas/páginas
├── data/
│   ├── mapImages/
│   │   ├── pgwData.js           # PGW en formato CONVERTIDO (estándar, A≠0, E≠0)
│   │   ├── geoMapping.js        # URLs de imágenes
│   │   └── mapConfig.js         # Configs de mapa
├── context/                     # React Context
├── Hooks/                       # Custom hooks
├── styles/                      # CSS
└── utils/                       # Utilidades
```

**Importante**: El `pgwData.js` de v17 tiene PGW en **formato convertido estándar** (A≠0, E≠0, B=0, D=0), NO el formato rotado original. Los valores fueron convertidos con la fórmula de rotación 90°, y algunos (como `intro` con F calibrado manualmente a `12.878607862918`) tienen correcciones manuales. Esta es la fuente original que después se transformó para el build.

### Stack (inferido del package.json y dist/ y source)

- React 18.3 + Vite 5.4
- JavaScript ES6+ (sin TypeScript)
- MapLibre GL 5.24 + Mapbox GL 3.10 (dual)
- react-router-dom 7.2
- Framer Motion 12.4
- Axios 1.8 (proxy al backend)
- Proj4 2.15 (proyecciones)
- react-tsparticles 2.12 (partículas)
- driver.js 1.3 (tours guiados)
- react-icons 5.4
- react-map-gl 8.0
- PropTypes
- vite-plugin-svgr

### CDN externas

```
Google Fonts:     Krub, Noto Sans, Roboto
Bootstrap Icons:  1.11.3 (cdn.jsdelivr.net)
Material Symbols: Outlined (fonts.googleapis.com)
MapLibre GL CSS:  2.4.0 (cdn.jsdelivr.net)
Backend API:      https://atlas-backend-a4m1.onrender.com/api/v1/
Cloudinary CDN:   https://res.cloudinary.com/dvluvxfvn/
```

---

### 4.1 CATÁLOGO DE BUNDLES JS

| Archivo | Tamaño | Ruta | Rol |
|---------|--------|------|-----|
| `index-DKc-R5UF.js` | 1,865 KB | Bundle principal | React 18 + ReactDOM + React Router 7 + MapLibre GL + Framer Motion + TODOS los componentes compartidos |
| `Chapter2-B1Dr7YK9.js` | 19 KB | `/chapter2` | Cap 2: 9 nodos, 7 capas de mapa, navegación entre sub-mapas |
| `Chapter4-BrQW4SSh.js` | 19 KB | `/chapter4` | Cap 4: 9 nodos, 11 capas, marcadores popup + audio |
| `Chapter3-9Wcmhei8.js` | 16 KB | `/chapter3` | Cap 3: 5 encuadres, 6 capas, audio player integrado |
| `Bienvenidos-D03m5hBu.js` | 13 KB | `/Bienvenidos` | Intro + entrada Cap 1, carga 3 mapas iniciales |
| `Home-BS4U3fwn.js` | 12 KB | `/Home` | Home con markers animados + grid de 4 capítulos |
| `AudioPlayer-CDJvKlmc.js` | 7 KB | Compartido Ch3/Ch4 | Reproductor flotante con marquee, 5 ubicaciones + 5 tramos |
| `CreditsApp-k6OtE6EH.js` | 6 KB | `/creditos` | Equipos de trabajo, links externos a nodos |
| `entramadosApp-itxzfUFr.js` | 4 KB | `/entramados` | Galería de logos por territorio (Suárez, Villa Rica, Oriente Cali) |
| `galeriasChapter2-D-YqV48O.js` | 4 KB | Compartido Ch2/Ch3/Ch4 | Datos de galerías: Suarez 6 img, VillaRica 6 img, OrienteCali |
| `modelo-DiHGwtc9.js` | 2 KB | Compartido Ch2/Ch4 | Imagen base64 WebP del modelo conceptual |
| `Index-DJXnMRgR.js` | 338 B | `/` | Navegación dev con links a Home y Chapter1 |

**Total JS:** ~1,970 KB (1.9 MB)

### 4.2 CATÁLOGO DE BUNDLES CSS

| Archivo | Tamaño | Ruta | Rol |
|---------|--------|------|-----|
| `index-CUtQbtwE.css` | 26 KB | Global | Design system, header, sidebar, modales, mapas, responsive |
| `CreditsApp-BJWWQ4Qz.css` | 5 KB | `/creditos` | Layout créditos, equipo cards |
| `Home-CfkH5jqB.css` | 4 KB | `/Home` | Markers animados, títulos home, grid capítulos |
| `entramadosApp-DDcUkbMz.css` | 4 KB | `/entramados` | Secciones, logos grid, líneas decorativas |
| `Bienvenidos-kB2GJ1Ax.css` | 3 KB | `/Bienvenidos` | Mapa mini circular, botones navegación |
| `AudioPlayer-eAJhVUBL.css` | 3 KB | Compartido | Reproductor flotante con blur |

**Total CSS:** ~45 KB

### 4.3 CONTENIDO DEL BUNDLE PRINCIPAL (index-DKc-R5UF.js)

El bundle de 1.8 MB contiene inline:

- **React 18** (producción) + ReactDOM + JSX Runtime + Scheduler
- **React Router 7.2**: createBrowserRouter, Link, NavLink, useNavigate, useParams, Outlet
- **MapLibre GL** (v2.4.0+): renderizado completo con terrain, popups, markers
- **Framer Motion**: AnimatePresence, motion.div, spring
- **Componentes compartidos** (inline, no lazy-loaded):
  - `MapaInteraccion` — mapa interactivo con popups, tooltips, navegación
  - `MapaInteraccionC4` — variante Cap 4
  - `Header` — header con back button + título
  - `Sidebar` — índice de capítulos lateral
  - `ModalInfo` — modal rico con layouts Luyaut1/Luyaut2
  - `LoadingScreen` — loading bar con logo
  - `MapChapterSelector` — tabs de navegación
  - `GaleriaModal` — carrusel de imágenes
  - `MapaVista` — vista con encuadres
- **~30 modales de contenido** con texto completo en español sobre el río Cauca, cuenca, ecosistemas, tejidos, movimientos sociales
- **Sistema de iconos** (.icons array)
- **Capítulo 1 completo** (6 mapas) INLINE en este bundle (no lazy)
- **Dependency map** de Vite para lazy chunks [0]-[14]

### 4.4 ARQUITECTURA DE RUTAS

```
/                          → Index-DJXnMRgR.js (338 B, dev-only)
/Home                      → Home-BS4U3fwn.js (12 KB) + Home-CfkH5jqB.css (4 KB)
/Bienvenidos               → Bienvenidos-D03m5hBu.js (13 KB) + Bienvenidos-kB2GJ1Ax.css (3 KB)
/chapter1                  → INLINE en index-DKc-R5UF.js (1.8 MB)
/chapter2                  → Chapter2-B1Dr7YK9.js (19 KB) + modelo.js (2 KB) + galeriasChapter2.js (4 KB)
/chapter3                  → Chapter3-9Wcmhei8.js (16 KB) + AudioPlayer.js (7 KB) + AudioPlayer.css (3 KB) + galeriasChapter2.js (4 KB)
/chapter4                  → Chapter4-BrQW4SSh.js (19 KB) + AudioPlayer.js (7 KB) + modelo.js (2 KB) + galeriasChapter2.js (4 KB)
/creditos                  → CreditsApp-k6OtE6EH.js (6 KB) + CreditsApp-BJWWQ4Qz.css (5 KB)
/entramados                → entramadosApp-itxzfUFr.js (4 KB) + entramadosApp-DDcUkbMz.css (4 KB)
```

### 4.5 CATÁLOGO DE ASSETS (304 archivos, ~90 MB)

#### 4.5.1 `img/` — 160 archivos

**`img/background/` (38 archivos):**
Fondos visuales, thumbnails de mapas, SVGs de UI y títulos.

| Archivo | Tipo | Tamaño | Uso |
|---------|------|--------|-----|
| `home.png` | PNG | 2,096 KB | Fondo home (el más pesado) |
| `home.webp` | WebP | 66 KB | Alternativa webp home |
| `indice-capas-menu.svg` | SVG | 215 KB | Menú de índice de capas |
| `tituloBienvenidos.svg` | SVG | 129 KB | Título página bienvenidos |
| `tituloEntramados.png` | PNG | 245 KB | Título entramados |
| `menuCapasFinal.webp` | WebP | 68 KB | Menú capas final |
| `capitulo1.webp` | WebP | 65 KB | Fondo capítulo 1 |
| `aguas3.webp` | WebP | 59 KB | Fondo temático agua |
| `fondoBtnHome.webp` | WebP | 35 KB | Botón home |
| `fondoMancha.webp` | WebP | 33 KB | Mancha decorativa fondo |
| `cali.webp` | WebP | 12 KB | Thumbnail Cali |
| `suarez.webp` | WebP | 16 KB | Thumbnail Suarez |
| `villaRica.webp` | WebP | 13 KB | Thumbnail Villa Rica |
| `miniMapaEncuadre.webp` | WebP | 18 KB | Miniatura encuadre |
| `miniMapCuenca.png` | PNG | 54 KB | Miniatura cuenca |
| `miniMapSur.webp` | WebP | 6 KB | Miniatura sur |
| `miniMapValle.webp` | WebP | 6 KB | Miniatura valle |
| `sidebarLeftItem.webp` | WebP | 22 KB | Item sidebar |
| `next.svg` | SVG | 5 KB | Flecha navegación |
| `footer-img.webp` | WebP | 36 KB | Imagen footer |
| `taller1.webp` / `taller2.png` | — | 48/667 KB | Imágenes talleres |
| `mapita2.webp` | WebP | 44 KB | Mapa pequeño decorativo |
| `mapitaColombia.webp` | WebP | 6 KB | Mapa Colombia |
| `politicas.webp` | WebP | 3 KB | Ícono políticas |
| `menuAgregados.webp` | WebP | 13 KB | Menú agregados |
| `tituloMapa2.webp` | WebP | 55 KB | Título mapa 2 |
| `tituloPequeñoMapas.webp` | WebP | 46 KB | Título pequeño |

**`img/background/iconos/` (10 archivos):** Íconos de capítulos y UI.
`arbol.svg`, `chapter1.svg` (58 KB), `chapter2.svg` (44 KB), `chapter3.svg` (50 KB), `chapter4.svg` (42 KB), `credits.svg`, `datos.svg`, `info.svg`, `next.svg`, `presentationCap4.svg`

**`img/logo/` (2 archivos):**
`logo.webp` (410 KB), `logo-loader.svg` (54 KB)

**`img/perfil/` (3 archivos — Carrusel de perfil):**
`perfil-1.svg` (6,636 KB), `perfil-2.svg` (7,596 KB), `perfil-3.svg` (6,360 KB)

> ⚠️ **Problema**: Los 3 SVGs de perfil suman ~20 MB. Son enormes para ser SVGs. Necesitan optimización urgente (posiblemente tienen imágenes raster embebidas).

**`img/talleres/` (3 archivos — Carrusel de talleres):**
`taller-1.webp` (93 KB), `taller-2.webp` (25 KB), `taller-3.webp` (42 KB)

**`img/maps/` (3 archivos — Mapas base de alta resolución):**
`homeCap4-high.webp` (22,147 KB), `humedales-high.webp` (21,687 KB), `sintesisCali.webp` (6,306 KB)

> ⚠️ **Problema**: Estos 3 mapas suman ~50 MB sin tiles. No tienen versión progresiva (low/medium). Necesitan generación de tiles XYZ.

**`img/Capas/ecosistemas/` (38 archivos):**
Capas de ecosistemas para el mapa del Cap 1. 19 capas en alta resolución + 19 en baja:
`humedos-tropicales`, `inundables`, `laguna`, `llanura-mareal`, `manglar`, `monocultivos`, `pantano-paramo`, `paramo`, `playas`, `regeneracion-vegetal`, `rocas-expuestas`, `secos-tropicales`, `sedimentos-submarinos`, `sin-informacion`, `subandinos`, `subxerofitico`, `xerofitico`, `zona-pantanosa`, `zona-urbana-industrial`

**`img/CapasUnriocauca/` (22 archivos):**
Capas del mapa "Un Río Cauca":
- Root (12): `Aguas superficiales`, `Areas metropolitanas`, `Cuenca del rio Cauca` (con -medium), `Paramosnivales y volcanes` (con -medium), `Parteaguas y estrellas fluviales` (con -medium), `Planicies` (con -medium), `Vias` (con -medium)
- `aguasSuperficiales/` (5): base, high, low, medium + original
- `areasMetropolitanas/` (5): base, high, low, medium + original

**`img/entramados/` (30 archivos):**
Logos de organizaciones para la vista de entramados territoriales: ACCN, Afroyoga, Alianza por la agrobiodiversidad, asocoms, asomuafroyo, Asoyoge, Casilda candumi, chicas, chicasComunicativas, Colectivo socio juvenil huellas, Comité por la defensa del territorio, Consejo comunitario, Consejo municipal de juventud, El chontaduro, fundacionHuellas, Guardia cimarrona, la laguna, Logo_Consejo_río_Ovejas, logoCredits1/2, matamba, mujer, mujeresDelOriente, Plataforma de juventudes, privacidad, Redmunorca (PNG+WebP), Semillas, Un río Cauca, Uoafroc

**`img/imgcarruselcap2/` (21 archivos):**
Galerías de imágenes para Cap 2:
- `imgCali/` (7): cali1-7.webp (sin cali3) + desCali.txt
- `imgSuarez/` (7): suarez1-7.webp (sin suarez5) + desSuares.txt
- `imgVillaRica/` (7): villaRica1-6.webp + descripciones.txt

> **Nota**: Las descripciones se almacenan en archivos `.txt`, no en JSON. Cali y Suarez tienen gaps en la numeración.

#### 4.5.2 `svg/` — 44 archivos

- **`inicio/` (10):** audio.svg, btnHome.svg, circuloNumero.svg, credits.svg, fondoIcon.svg, linea.svg, logohome2.svg, metadata.svg, play.svg, salir.svg
- **`sidebar-resources/` (18):** fondos tooltip, siluetas de mapa cap 1-4, ilustraciones, markers, modal grande.png
- **`todos/Hud/` (14):** convert_svg_to_webp.bat + icons/icon-line-webp (13 iconos HUD en webp+svg)
- `fondo.webp` (2,496 KB), `imageCredits.webp` (7 KB)

#### 4.5.3 `iconsCap4/` — 73 archivos (32 MB)

**49 SVGs** de marcadores para features del Cap 4: `aguaResidual`, `aljibe`, `areaUrbana`, `bosques`, `botadero`, `Canales`, `compuertaVertedero`, `criaAnimales`, `cuerposAgua`, `cultivoDiverso`, `curvaNivel`, `delimitacion`, `disposicionResiduos`, `entradaPredio`, `estanque`, `extraccionOro`, `fincaTradicional`, `huertas`, `humedalesPot`, `mineria`, `monocultivoAzucar`, `nidoHormiga`, `ocupacionFranjas`, `palenke`, `pastoreo`, `popupNode`, `semillero`, `sistemaRiego`, `transformacionProduc`, `trocha`, `viviendas`, `zocabonOro`, `zonaBasura`, `zonaColmatada`, `zonaVerdes2014`, etc.

**21 PNGs** de mapas/nodos del Cap 4: `asoyogue-09.png` (1 MB), `datoIntroCap4.png` (2.7 MB), fincas (El buhido, El Paso, La Caicedo, La Virginia, Las Mercedes, Los Bajios), `guachene.png`, `oriente cali.png`, `suarez.png`, `villa rica.png`

**1 ZIP:** `drive-download-20260122T164148Z-1-001.zip` (10,484 KB) — backup original de Google Drive

#### 4.5.4 `icons/` — 4 archivos

`Capas_1_1.png` (84 KB), `eye_icon_off.png` (2 KB), `eye_icon_on.png` (3 KB), `infoicon.svg` (23 KB)

#### 4.5.5 `IconosTejidosAgua/` — 11 archivos

SVGs temáticos de agua numerados `1.svg` a `11.svg` (~12 KB total)

#### 4.5.6 `mapasMenuCap2/` — 63 archivos (269 KB)

Menú de capas SVG para Cap 2, organizados por territorio:
- **Base (36):** `areasMixtas`, `cali`, `canaAzucar`, `construccion`, `cuerposAgua`, `curvasNivel`, `diques`, `entramados`, `fincaTradi`, `humedales`, `monocultivos`, `quebradas`, `redVial`, `riosPrincipales`, `suarez`, `veredas`, `villaRica`, `zonasUrbanas`, etc.
- **`menuCapasMoCali/` (9):** `flujoMigra`, `manglares`, `orienteCali`, `palafitos`, `palmeras`, `poblacionesValle`, `regionPacifica`, `tendederos`, `visionExtractivista`
- **`menuCapasMoSuarez/` (4):** `coca`, `concejoSuarez`, `trayectorias`, `zonaInfluencia`
- **`menuCapasMoVillaRica/` (14):** `canaAzucar`, `casaNina`, `concejoComunitario`, `consejoTitulado`, `fincaTradicional`, `ganaderia`, `haciendas`, `ingenios`, `lagosMineria`, `lugaresEmblematicos`, `panamericana`, `proyectosUrbanizacion`, `zonaIndustrial`

#### 4.5.7 `interface/` — 101 archivos (7.9 MB)

**`loaders/` (1):** `loading-background.svg` (2,891 KB)

**`icons/` (66):**
- `icons.js` (5 KB) — índice de iconos con paths SVG+WebP
- `frame/svg/` (4): `icon-frame-1` a `icon-frame-4` — íconos de capítulo
- `frame/webp/` (4): versiones WebP de los frame icons
- `line/svg/` (34): 28 iconos de UI + extras (arrow-down, arrow-up, back, chapter-info, close, credits, download, fichatecnica, general-info, hide/show, home_bottom, iconInfo, iconPresentation, layers, levels, location, map-gallery, map-info, metadata, north, play, presentation, question-mark, roman-i/ii/iii/iv, technical-sheet)
- `line/webp/` (28): versiones WebP de los line icons

**`ui/` (29):**
- `uiElements.js` (2 KB) — índice de 13 elementos UI con paths SVG+WebP
- `svg/` (13): `button-expansion-ink`, `chapter-section-blob`, `credits-label`, `intro-location-map`, `label-wave-1/2/3`, `layer-background-strip`, `layer-button`, `map-local`, `networking-banner`, `separator-wave`, `title-texture`
- `webp/` (15): versiones WebP + `fondoBtnHome.webp`, `fondoCredits.webp`

#### 4.5.8 `audiosChapters/` — 2 archivos (21.5 MB)

`audiosChapter3/Cali_47SNA.mp3` (4,827 KB) — Narración Cali
`audiosChapter3/Salvajina_47SNA.mp3` (16,706 KB) — Narración Salvajina

#### 4.5.9 `tramosCap3/` — 4 archivos (14.9 MB)

`tramo1humedales.webp` (4,118 KB), `tramo2humedales.webp` (3,702 KB), `tramo3humedales.webp` (3,910 KB), `tramo4humedales.webp` (3,475 KB)

#### 4.5.10 `library/` — 1 archivo

`resources.jsx` (2 KB) — Índice de recursos con paths a SVGs del HUD y siluetas de capítulos (MapaCap1-4). Usa alias `@svg` para importar siluetas y paths relativos `/assets/...` para iconos dinámicos.

#### 4.5.11 `styles/` — 1 archivo

`base.css` (4 KB) — Estilos globales: reset body, variables CSS (`--screamin-green`, `--cyan`, `--sea-green`, `--steel-blue`, `--fondo-oscuro: #03091e`), estilos de popups MapLibre (`transparent background`, texto blanco), animación fadeIn, media queries responsive para `#map`

### 4.6 OTROS ARCHIVOS

| Archivo | Líneas | Contenido |
|---------|--------|-----------|
| `vercel.json` | 5 | SPA rewrite `/(.*)` → `/` |
| `.vscode/tasks.json` | 10 | Task vacío "append_css" |
| `dist/logo.svg` | 117 | Logo Atlas Pluriversal: 49 paths, 6 colores (#3c80a6, #2b8e3a, #aa7613, #97c226, #5f3021, #fcc415) |
| `dist/index.html` | 36 | HTML producción con bundles hasheados |
| `index.html` (root) | 35 | HTML desarrollo con `/src/main.jsx` |
| `dist/docs/` | 8 files | Figma comments CSV (469 líneas), Word, Excel, PDFs |

### 4.7 DEPENDENCIAS DE v17 QUE NO ESTÁN EN 3.0

| Librería | Uso | ¿Necesaria? |
|----------|-----|-------------|
| `axios` | Llamadas al backend | NO — si eliminamos backend |
| `framer-motion` | Animaciones | SÍ — transiciones, modales, sidebar |
| `proj4` | Conversión de proyecciones | SÍ — si hay datos en múltiples CRS |
| `react-tsparticles` | Efectos de partículas | OPCIONAL |
| `driver.js` | Tours guiados | OPCIONAL |
| `react-icons` | Iconos | REEMPLAZABLE por SVGs inline |
| `react-map-gl` | Wrapper de MapLibre | NO — usar MapLibre directo |
| `mapbox-gl` | Motor de mapas alternativo | NO — solo MapLibre |
| `image-size` | Dimensiones de imágenes | ÚTIL — si se necesita en runtime |
| `prop-types` | Validación de props | NO — TypeScript lo reemplaza |

### 4.8 HALLAZGOS CLAVE DE v17

1. **v17 NO usa sistema de tiles XYZ** — usa imágenes Cloudinary directas con variantes `low/medium/high` por mapa. No hay generación de tiles piramidales.
2. **5 mapas interactivos** (drag+zoom habilitado), **9 mapas bloqueados** (vista fija con solo toggle de capas).
3. **Cap 1 está INLINE en el bundle principal de 1.8 MB** — no es lazy-loaded como los demás capítulos. Esto penaliza la carga inicial.
4. **El audio player** es un componente compartido entre Cap 3 y Cap 4, con 5 ubicaciones de audio + 5 tramos de río con coordenadas.
5. **3 mapas base enormes** (~50 MB en `img/maps/`) sin tiles ni versiones progresivas — necesitan tiles XYZ urgentemente.
6. **Los 3 SVGs de perfil** pesan ~20 MB — probablemente contienen imágenes raster embebidas. Necesitan optimización.
7. **Las descripciones de galerías** están en archivos `.txt` (no JSON estructurado).
8. **73 iconos del Cap 4** son el set más rico de assets, incluyendo un ZIP de 10 MB con el backup original de Drive.
9. **El backend proxy** en `vite.config.js` apunta a `https://atlas-backend-a4m1.onrender.com/` — este es el backend analizado en sección 2.
10. **Dos remotes Git**: `ReyGaRGoL/frontend.git` (principal) + `sjmontano/Atlas.git` (fork de Santiago).

### 4.9 RESUMEN DE TAMAÑOS

| Categoría | Archivos | Tamaño total |
|-----------|----------|-------------|
| JS bundles | 12 | ~1.9 MB |
| CSS bundles | 6 | ~45 KB |
| Assets (img, svg, icons) | 304 | ~90 MB |
| Audio | 2 | ~21.5 MB |
| **Total** | **324** | **~113 MB** |

---

## 5. PROBLEMAS CRÍTICOS DETECTADOS

### Problema #1: GEORREFERENCIACIÓN INCORRECTA [CRÍTICO]

**Descripción**: Los mapas del Cap 1 en atlas_3.0 están mal geográficamente. Las coordenadas no coinciden con las ubicaciones reales en el mapa.

**Causa raíz**: Los PGW originales de v17 estaban en formato "rotado" (A=0, E=0, D y B no-cero) porque las imágenes base estaban rotadas 90°. Al migrar a 3.0, se aplicó una conversión de 90° a las coordenadas PGW y se rotaron físicamente las imágenes con GDAL. Pero la conversión no fue precisa para todos los mapas.

**Datos**: 
- `atlasMapData.ts` tiene PGW en formato estándar `[A, D, B, E, C, F]` donde D=0 y B=0 (no rotado)
- `pgwData.js` tiene los PGW originales de v17 con formato rotado donde A=0, E=0
- La conversión entre ambos formatos fue: rotar 90° clockwise + ajustar half-pixel

**Solución**: 
1. Verificar los PGW originales de v17 contra las coordenadas reales de cada mapa
2. Regenerar los tiles desde las imágenes originales sin rotar
3. O usar los PGW de v17 directamente si las imágenes se dejan sin rotar
4. Aplicar `bearing: -90` como bearing nativo de MapLibre (no rotar datos)

### Problema #2: DATOS PGW DUPLICADOS Y HUÉRFANOS [ALTO]

- `src/domains/map/data/atlasMapData.ts` — fuente actual (TS, 580 líneas)
- `src/data/mapImages/pgwData.js` — fuente original v17 (JS, 655 líneas, NO usado)
- `src/data/mapImages/geoMapping.js` — URLs de imágenes (JS)
- `src/data/mapImages/mapConfig.js` — config por mapa (JS)
- `src/data/mapImages/mapDefaults.js` — defaults globales (JS)

El pipeline actual usa `atlasMapData.ts`, pero `pgwData.js` contiene PGW **por capa individual** (ej. capas de ríos, ecosistemas) que no están en `atlasMapData.ts`.

### Problema #3: CÓDIGO DUPLICADO ENTRE components/ Y ui/ [ALTO]

La carpeta `components/` (35 archivos JSX legacy) y `ui/` (18 archivos TSX nuevo) contienen versiones duplicadas de los mismos componentes:
- `components/MapController/` vs `ui/components/map/`
- `components/Sidebars/` vs `ui/components/sidebar/`
- `components/Home/` — no existe equivalente en `ui/`

Esto genera confusión y deuda técnica.

### Problema #4: BACKEND INNECESARIO CON CREDENCIALES EXPUESTAS [CRÍTICO]

- `.env` con MongoDB URI y Cloudinary keys en texto plano
- BUG en ruta de uploads
- Sin uso real en 3.0 (es fully static)
- v17 lo usa via proxy pero solo para datos que podrían ser estáticos

### Problema #5: INCONSISTENCIA DE ENTRY POINTS [MEDIO]

- `main.jsx` vs `main.tsx`
- `App.jsx` vs `App.tsx`
- Ambos pares existen, generando confusión sobre cuál es el activo

### Problema #6: MAPSELECTOR USA RUTAS INCORRECTAS [MEDIO]

`MapSelectorGrid` navega a `/map/:mapId` pero las rutas definidas son `/test-maps/:mapId`.

---

## 6. SISTEMA DE GEORREFERENCIACIÓN (PGW)

### Formato PGW (World File)

Un archivo `.pgw` contiene 6 líneas:
```
A  — pixel X size (map units per pixel in X direction)
D  — rotation about Y axis (usually 0)
B  — rotation about X axis (usually 0)
E  — pixel Y size (negative, map units per pixel in Y direction)
C  — X coordinate of center of upper-left pixel
F  — Y coordinate of center of upper-left pixel
```

### Los dos formatos en el proyecto

**Formato v17 (rotado)** — `pgwData.js`:
```
A = 0      (no escala en X)
D = valor  (rotación/desplazamiento en Y)
B = valor  (rotación/desplazamiento en X)  
E = 0      (no escala en Y)
C = X origin
F = Y origin
```
Imagen rotada 90°. El bearing se aplicaba como rotación de coordenadas.

**Formato 3.0 (estándar)** — `atlasMapData.ts`:
```
A = valor   (escala en X, positivo)
D = 0       (sin rotación)
B = 0       (sin rotación)
E = valor   (escala en Y, negativo)
C = X origin
F = Y origin
```
Imagen NO rotada. El bearing se aplica como bearing nativo de MapLibre (`bearing: -90`).

### Corrección half-pixel

`BoundsCalculator.buildAffineGeometry()` aplica:
```
x0 = C - 0.5*A - 0.5*B
y0 = F - 0.5*D - 0.5*E
```
Esto corrige el centro del píxel superior-izquierdo a la esquina superior-izquierda.

### El problema de la conversión

Para convertir de formato rotado a estándar, se necesita:
1. Rotar físicamente la imagen 90° clockwise (hecho con GDAL)
2. Recalcular los PGW para la imagen rotada

La conversión manual que se hizo al crear `atlasMapData.ts` NO fue precisa para todos los mapas. Los valores de A, E, C, F no coinciden exactamente con lo que deberían ser después de la rotación física.

### Solución propuesta para la nueva versión

**NO rotar las imágenes.** Usar el formato original de v17 con `bearing: -90` nativo de MapLibre. Esto:
- Elimina la necesidad de GDAL
- Mantiene los PGW originales (que sí funcionan en v17)
- Simplifica el pipeline de renderizado
- MapLibre maneja la rotación del viewport nativamente

---

## 7. SISTEMA DE TILES

### Arquitectura (atlas_3.0)

**2 capas superpuestas:**
1. **Capa base** (imagen completa, ~30KB): Siempre visible, carga instantánea
2. **Capa de tiles** (XYZ tiles, alta resolución): Carga progresiva por niveles de zoom

```
Capa de Tiles (z0-z6, 256px, WebP)
    ↑ superpuesta sobre
Capa Base (imagen completa, baja resolución)
```

### Generación de tiles

Usa GDAL (`gdal2tiles.py` o `gdal_translate` + scripts Python):
1. Imagen GeoTIFF + .pgw → `gdal2tiles.py --xyz --zoom=0-6 --tilesize=256 --processes=4`
2. Tiles se almacenan en `public/assets/maps/tiles/{mapId}/{z}/{x}/{y}.webp`
3. MapLibre source tipo `raster` con `tileSize: 256` y `scheme: 'xyz'`

### Mapas con tiles generados (Cap 1)

```
maps/tiles/
├── bredunco/
├── ecosistemas/
├── encuadres/
├── formas-del-paisaje/
├── intro/
├── layers/
├── mosaicos-del-agua/
└── un-rio-cauca/
```

### Vite tile cache plugin

`vite.config.ts` incluye `tileCacheHeadersPlugin` que:
- Agrega headers de cache para `.webp` tiles (1 año)
- Maneja 404 gracefully (no rompe el mapa si falta un tile)

### Mapas sin tiles (Cap 2-4)

Usan solo imagen base desde Cloudinary. No tienen tiles generados. Esto significa:
- Carga más lenta
- Sin zoom progresivo
- Dependencia de Cloudinary (sin offline)

---

## 8. FEATURES DE V17 QUE NO ESTÁN EN 3.0

### Completamente ausentes

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| **Audio Player** | Narraciones MP3 para Cap 3 y 4 | ALTA |
| **Carrusel de perfil** | 3 SVG en SidebarLeft con navegación | ALTA |
| **Carrusel de talleres** | 3 WEBP con descripciones en InfoModal | ALTA |
| **Galerías Cap 2** | Imágenes de Suarez, Villa Rica, Oriente Cali | ALTA |
| **Cap 3 completo** | 6 mapas + tramos + audio | ALTA |
| **Cap 4 completo** | 11 mapas + 73 iconos + audio | ALTA |
| **Entramados territoriales** | Vista de tejidos con logos | MEDIA |
| **Home con markers** | Mapa interactivo con markers animados | MEDIA |
| **Modelo conceptual** | Imagen base del modelo (base64) | MEDIA |
| **Framer Motion** | Animaciones y transiciones | MEDIA |
| **Suarez maps + capas** | Mapas específicos con menú de capas | ALTA |

### Parcialmente presentes

| Feature | Estado en 3.0 |
|---------|---------------|
| **Cap 2 mapas** | Datos PGW e imágenes existen pero sin assets locales (solo Cloudinary) |
| **Modales de info** | No implementados (listados en PENDIENTE.md Fase 5) |
| **Creditos** | Vista existe pero sin el contenido completo |
| **Bienvenidos** | Vista existe pero sin integración de capítulos |
| **Navegación entre capítulos** | ChapterNav existe pero sin Cap 2-4 completos |
| **LayerControl** | Existe para Cap 1 pero no para capas de Cap 2-4 |

---

## 9. ARQUITECTURA RECOMENDADA (NUEVA VERSIÓN)

### Principios

1. **Monolito estático**: Sin backend. Todo es archivos estáticos.
2. **TypeScript estricto**: Todo tipado, sin `any`, strict mode.
3. **Una sola fuente de verdad**: No duplicar datos ni componentes.
4. **Dominios planos**: Misma arquitectura de 3.0 pero corregida.
5. **Optimizado para mala conexión**: Tiles progresivos + lazy loading + imágenes WebP.

### Estructura propuesta

```
atlas/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .env.example                 # Sin secretos, solo URLs públicas
│
├── public/
│   └── assets/
│       ├── maps/                # Imágenes base + tiles por mapa
│       │   ├── chapter-1/
│       │   │   ├── encuadres/
│       │   │   │   ├── base.webp
│       │   │   │   └── tiles/{z}/{x}/{y}.webp
│       │   │   ├── ecosistemas/
│       │   │   └── ...
│       │   ├── chapter-2/
│       │   ├── chapter-3/
│       │   └── chapter-4/
│       ├── geo-layers/          # GeoJSON layers
│       ├── images/              # Imágenes de contenido
│       │   ├── carousel/
│       │   ├── gallery/
│       │   ├── icons/
│       │   └── profiles/
│       ├── audio/               # MP3 narrations
│       └── ui/                  # UI icons, loaders
│
├── src/
│   ├── main.tsx                 # ÚNICO entry point
│   ├── App.tsx                  # ÚNICO app component
│   │
│   ├── config/                  # Configuración global
│   │   ├── constants.ts         # Constantes de la app
│   │   ├── routes.ts            # Definición de rutas
│   │   └── cloudinary.ts        # Config Cloudinary (pública)
│   │
│   ├── types/                   # Tipos globales
│   │   ├── map.ts               # MapConfig, PGW, Bounds
│   │   ├── chapter.ts           # Chapter, ChapterMap
│   │   ├── layer.ts             # GeoLayer
│   │   ├── media.ts             # MediaItem, Audio
│   │   └── ui.ts                # UI state types
│   │
│   ├── data/                    # DATOS ESTÁTICOS (JS/TS)
│   │   ├── maps/
│   │   │   ├── pgw.ts           # PGW data — fuente única
│   │   │   ├── images.ts        # URLs de imágenes por mapa
│   │   │   ├── configs.ts       # Config por mapa (zoom, bearing, bounds)
│   │   │   └── index.ts         # Barrel: getMapData(mapId) → { pgw, images, config }
│   │   ├── chapters/
│   │   │   ├── chapters.ts      # Definición de capítulos y sus mapas
│   │   │   └── index.ts
│   │   ├── layers/
│   │   │   ├── index.ts         # Registro de capas GeoJSON
│   │   │   └── categories.ts    # Categorías de capas
│   │   └── content/
│   │       ├── carousel.ts      # Datos de carrusel
│   │       ├── gallery.ts       # Datos de galerías
│   │       ├── audio.ts         # Referencias de audio
│   │       └── modals.ts        # Contenido de modales
│   │
│   ├── services/                # LÓGICA DE NEGOCIO (TS)
│   │   ├── map/
│   │   │   ├── MapRenderer.ts        # Renderizado de mapa georreferenciado
│   │   │   ├── BoundsCalculator.ts   # Cálculo de bounds desde PGW
│   │   │   ├── ZoomCalculator.ts     # Cálculo de zoom óptimo
│   │   │   ├── CoordinateUtils.ts    # Utilidades de coordenadas
│   │   │   ├── TileService.ts        # Servicio de tiles
│   │   │   └── MapLogger.ts          # Logger específico
│   │   ├── layers/
│   │   │   └── LayerManager.ts       # Gestión de capas GeoJSON
│   │   └── media/
│   │       ├── CloudinaryService.ts  # URLs optimizadas Cloudinary
│   │       └── AudioService.ts       # Control de audio
│   │
│   ├── stores/                  # ESTADO GLOBAL (Zustand)
│   │   ├── mapStore.ts          # activeMapId, mapBuilt, loading, error
│   │   ├── chapterStore.ts      # activeChapter, activeTerritory, navigation
│   │   ├── layerStore.ts        # visibleLayers, opacities
│   │   ├── uiStore.ts           # modals, sidebar, panels
│   │   └── index.ts             # Barrel exports
│   │
│   ├── hooks/                   # CUSTOM HOOKS
│   │   ├── useMap.ts            # Hook principal del mapa
│   │   ├── useMapConfiguration.ts
│   │   ├── useMapBounds.ts
│   │   ├── useMapDimensions.ts
│   │   ├── useMapZoom.ts
│   │   ├── useLayers.ts
│   │   ├── useChapter.ts
│   │   ├── useAudio.ts
│   │   ├── useCarousel.ts
│   │   └── useMedia.ts
│   │
│   ├── adapters/                # WRAPPERS DE LIBRERÍAS
│   │   └── MapLibreAdapter.ts   # createMap, destroyMap, addImage, addTiles
│   │
│   ├── components/              # COMPONENTES REACT (TSX)
│   │   ├── map/
│   │   │   ├── AtlasMap.tsx          # Componente principal del mapa
│   │   │   ├── MapControls.tsx       # Zoom, home, capas
│   │   │   ├── MapLegend.tsx         # Leyenda
│   │   │   └── MapSelector.tsx       # Selector de mapas
│   │   ├── layers/
│   │   │   ├── LayerPanel.tsx        # Panel de capas
│   │   │   └── LayerToggle.tsx       # Toggle individual
│   │   ├── navigation/
│   │   │   ├── ChapterNav.tsx        # Navegación de capítulos
│   │   │   ├── Header.tsx            # Header global
│   │   │   └── Breadcrumb.tsx        # Migas de pan
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx           # Sidebar principal
│   │   │   └── TerritorySelector.tsx # Selector de territorio
│   │   ├── modals/
│   │   │   ├── Modal.tsx             # Shell de modal
│   │   │   ├── InfoModal.tsx         # Modal de información
│   │   │   └── CarouselModal.tsx     # Modal con carrusel
│   │   ├── carousel/
│   │   │   ├── Carousel.tsx          # Componente carrusel reutilizable
│   │   │   └── CarouselDot.tsx       # Indicadores
│   │   ├── audio/
│   │   │   └── AudioPlayer.tsx       # Reproductor de audio
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Tooltip.tsx
│   │   └── layout/
│   │       ├── PageLayout.tsx        # Layout principal
│   │       └── MapLayout.tsx         # Layout con mapa
│   │
│   ├── pages/                   # PÁGINAS (rutas)
│   │   ├── HomePage.tsx
│   │   ├── AtlasPage.tsx
│   │   ├── ChapterPage.tsx
│   │   ├── CreditsPage.tsx
│   │   ├── EntramadosPage.tsx
│   │   └── TestMapPage.tsx      # Testing individual
│   │
│   ├── styles/                  # ESTILOS
│   │   ├── globals.css          # Variables CSS, reset, tipografía
│   │   ├── tokens.css           # Design tokens
│   │   └── components/          # CSS modules por componente
│   │
│   └── utils/                   # UTILIDADES
│       ├── cn.ts                # Classname helper
│       ├── format.ts            # Formateo
│       └── constants.ts         # Constantes
│
├── scripts/                     # Scripts de build/procesamiento
│   └── generate-tiles.py        # Generación de tiles
│
├── docs/                        # Documentación
│   └── MEMORIA_TECNICA.md       # Este documento
│
└── tests/                       # Tests
    ├── setup.ts
    ├── services/
    └── stores/
```

### Reglas de arquitectura

1. **`data/` → solo exports de datos**: Sin lógica, sin imports de services/stores.
2. **`services/` → solo lógica pura**: Sin imports de React, sin JSX. Funciones puras y clases.
3. **`stores/` → Zustand stores**: Pueden importar `data/` y `services/`. Coordinan entre sí via `getState()`.
4. **`hooks/` → React hooks**: Importan stores y services. No tienen JSX.
5. **`components/` → React components (TSX)**: Solo importan hooks y stores. No importan services directamente.
6. **`adapters/` → Wrappers**: Aíslan librerías externas (MapLibre).
7. **NO domains que se importen entre sí**: La coordinación es via stores.
8. **UNA sola fuente de verdad**: PGW, configs de mapa, datos de capítulos existen en UN solo lugar.

### Stack tecnológico recomendado

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Runtime | React | ^19.x | Última versión, concurrent features |
| Lenguaje | TypeScript | ^5.x | Strict mode, tipos para todo |
| Build | Vite | ^6.x | Rápido, code splitting nativo |
| Mapas | MapLibre GL | ^5.x | Solo MapLibre, sin Mapbox |
| Estado | Zustand | ^5.x | Simple, sin boilerplate |
| Router | react-router | ^7.x | Última versión |
| Animaciones | framer-motion | ^12.x | Para transiciones y modales |
| Testing | Vitest | ^3.x | Compatible con Vite |
| Linting | ESLint | ^9.x | Flat config |
| Estilos | CSS Modules + CSS Variables | — | Sin runtime de CSS-in-JS |

### Lo que NO se incluye

- **Sin backend**: Cero dependencia de servidor. Todo estático.
- **Sin MongoDB**: Datos en archivos `.ts`/`.json`.
- **Sin axios**: Sin llamadas HTTP (solo Cloudinary URLs directas).
- **Sin prop-types**: TypeScript reemplaza.
- **Sin Mapbox GL**: Solo MapLibre (open source).
- **Sin react-map-gl**: Usar MapLibre directo.
- **Sin express-fileupload**: No hay uploads (si se necesitan, Cloudinary widget directo).

---

## 10. PLAN DE MIGRACIÓN

### Fase 1: Setup y datos (prioridad CRÍTICA)

1. **Inicializar proyecto** con Vite + React + TypeScript strict
2. **Migrar y CORREGIR PGW data**: Tomar los PGW de v17 (`pgwData.js`), verificar coordenadas, crear `src/data/maps/pgw.ts` como fuente única. NO rotar las imágenes.
3. **Migrar configs de mapas**: Zoom, bearing, bounds, tiles de `mapSettings.ts` a `src/data/maps/configs.ts`
4. **Migrar URLs de imágenes**: De `atlasMapData.ts` y `geoMapping.js` a `src/data/maps/images.ts`
5. **Migrar estructura de capítulos**: De `chaptersData.ts` a `src/data/chapters/chapters.ts`
6. **Crear tipos**: `MapConfig`, `PGWData`, `Chapter`, `GeoLayer`, etc.

### Fase 2: Servicios core (prioridad CRÍTICA)

1. **BoundsCalculator**: Migrar de `BoundsCalculator.ts` — revisar fórmula half-pixel
2. **ZoomCalculator**: Migrar de `useMapZoom.ts`
3. **MapRenderer**: Reimplementar buildGeoreferencedMap SIN coordinate rotation
4. **MapLibreAdapter**: Migrar createMap, addImage, addTiles
5. **TileService**: Manejo de tiles con fallback a imagen base
6. **MapLogger**: Sistema de logging por entorno

### Fase 3: Stores y hooks (prioridad CRÍTICA)

1. **mapStore**: activeMapId, mapBuilt, loading, error
2. **chapterStore**: activeChapter, activeTerritory, navigation
3. **layerStore**: visibleLayers, opacities
4. **uiStore**: modals, sidebar, panels
5. **Hooks**: useMap, useChapter, useLayers, useAudio, useCarousel

### Fase 4: Componentes y UI (prioridad ALTA)

1. **AtlasMap**: Componente principal del visor de mapas (basado en AtlasMapBuilder de 3.0)
2. **MapControls**: Zoom, home, capas
3. **ChapterNav**: Navegación entre capítulos
4. **LayerPanel**: Panel de capas con toggles
5. **Sidebar**: Sidebar principal
6. **Header**: Header global
7. **Modal system**: Shell + InfoModal + CarouselModal
8. **Carousel**: Componente reutilizable

### Fase 5: Features v17 (prioridad ALTA)

1. **Cap 1**: Verificar georreferenciación con PGW originales
2. **Cap 2**: Mapas + galerías + capas
3. **Cap 3**: Mapas + tramos + audio
4. **Cap 4**: Mapas + iconos + audio
5. **Carrusel de perfil**: 3 SVG en sidebar
6. **Carrusel de talleres**: 3 WEBP en InfoModal
7. **Audio Player**: Reproductor de audio para Cap 3 y 4
8. **Entramados territoriales**: Vista completa
9. **Home con markers**: Mapa interactivo animado

### Fase 6: Assets y tiles (prioridad ALTA)

1. **Copiar assets de v17**: Imágenes, iconos, audio, SVGs
2. **Generar tiles para Cap 1**: Verificar/regenerar tiles con coordenadas correctas
3. **Generar tiles para Cap 2-4**: Desde imágenes Cloudinary o locales
4. **Optimizar imágenes**: WebP, tamaños responsivos, lazy loading
5. **Servir Cloudinary para fallback**: URLs de Cloudinary como respaldo

### Fase 7: Testing y calidad (prioridad MEDIA)

1. **Tests unitarios**: BoundsCalculator, MapRenderer, stores
2. **Tests de integración**: Renderizado de mapas con mocks de MapLibre
3. **Tests de snapshot**: Componentes UI
4. **Lint**: ESLint strict config
5. **Build**: Verificar chunks, bundle size, code splitting

### Fase 8: Despliegue (prioridad MEDIA)

1. **Build de producción**: `tsc -b && vite build`
2. **Desplegar a hosting**: cPanel de latinamericahosting.com.co (según PENDIENTE.md)
3. **Configurar CDN**: Para tiles y assets grandes
4. **Monitoreo**: Google Analytics o similar

---

## 11. ANÁLISIS DETALLADO DE LA CONVERSIÓN PGW (CAUSA RAÍZ DE LA GEORREFERENCIACIÓN INCORRECTA)

### El problema en concreto

Los mapas del atlas tienen imágenes en formato **portrait** (vertical). Los PGW originales de v17 están en formato **rotado** porque las imágenes se usaban rotadas 90°:

```
Formato PGW rotado (v17 - pgwData.js):
  A = 0           (sin escala horizontal)
  D = valor ≠ 0   (desplazamiento/rotación en Y)  
  B = valor ≠ 0   (desplazamiento/rotación en X)
  E = 0           (sin escala vertical)
  C = X origin
  F = Y origin
```

En 3.0, se decidió **rotar físicamente las imágenes 90° horario** (con GDAL) y recalcular los PGW a formato estándar. La fórmula documentada en `atlasMapData.ts:18-29`:

```
Conversión 90° HORARIO (landscape desde portrait):
  A_new = B_old
  E_new = -D_old
  C_new = C_old
  F_new = F_old + D_old × W_portrait
```

### Ejemplo concreto: mapa intro

**PGW original v17 (rotado):**
```
A=0, D=0.001181998411, B=0.001182047579, E=0
C=-78.907953240108, F=-0.290036434033
```
Ancho portrait = 5649px

**Conversión según fórmula:**
```
A_new = 0.001182047579
E_new = -0.001181998411
F_new = -0.290036434033 + 0.001181998411 × 5649 = 6.387072589706
```

**Resultado de la fórmula (F=6.387):** ❌ INCORRECTO — la imagen quedaba anclada demasiado al sur. Los tiles no alineaban.

**Corrección manual aplicada (F=12.878):** ✅ El valor F se ajustó manualmente a `12.878607862918` para que coincidiera con el extent de los tiles generados.

### Evidencia del problema

`atlasMapData.ts` contiene **tres variantes de test** para el mapa intro, creadas específicamente para comparar valores de F:

| Variante | F value | Resultado |
|----------|---------|-----------|
| `intro-pgw-current` | `12.878607862918` | ✅ Correcto (ajuste manual) |
| `intro-pgw-transformed` | `6.387072589706` | ❌ Fórmula da mal |
| `intro-pgw-v17` | `-0.290036434033` | ❌ Original sin convertir |

Esto es una admisión explícita en el código de que **la fórmula de conversión NO es correcta** y requirió ajuste manual.

### Mapa bredunco: mismo PGW que intro, ¿misma corrección?

El mapa `chapter1-bredunco` usa el **mismo PGW original** que `intro`. Pero en `atlasMapData.ts` su F es `6.387072589706` (el valor de la fórmula, SIN corregir). Esto significa que **bredunco probablemente también está mal georreferenciado**.

### La lección

**NO convertir los PGW.** La estrategia correcta:

1. Usar los PGW originales de v17 en formato rotado
2. NO rotar físicamente las imágenes (eliminar dependencia de GDAL)
3. Aplicar `bearing: -90` como bearing nativo de MapLibre (el motor rota la vista, no los datos)
4. Implementar `BoundsCalculator` que soporte PGW rotados (A=0, E=0, D≠0, B≠0)

Esto elimina:
- La necesidad de GDAL para rotar imágenes
- La fórmula de conversión propensa a errores
- El ajuste manual de coordenadas
- Los scripts de generación de tiles desde imágenes rotadas

### PGW por capa individual (perdidos en 3.0)

`pgwData.js` de v17 contiene PGW para capas **individuales** que NO están en `atlasMapData.ts`:
- Capas de ecosistemas (ríos individuales: rioCali, rioOvejas, rioPalo, rioPiendamo, etc.)
- Capas de tejidos del agua (acuifero1, acuifero2, nubosidad)
- Capas generales (aguasSuperficiales, areasMetropolitanas, cuencaRioCauca, paramosNivalesVolcanes, planicies, vias)
- Capas de menú Cap 2 (TNATransformadoras, ASuarez, VDOrienteCali, AVillaRica, MOrienteCali, MVillaRica, MSuarez)

Estos PGW son necesarios para posicionar correctamente las capas vectoriales superpuestas sobre los mapas base.

---

## 12. LECCIONES DE LA BITÁCORA (34 interacciones documentadas)

> Extraídas de `docs/bitacora.md` (534 líneas), `docs/antes-y-skills.md` y `docs/investigaciones/`. Cubren el período completo de desarrollo de atlas_3.0 y la migración v17 ← 3.0.

### 12.1 LECCIONES DE GEORREFERENCIACIÓN Y BOUNDS

| # | Lección | Severidad | Detalle |
|---|---------|-----------|---------|
| 1 | **setMaxBounds es bearing-blind** | CRÍTICA | MapLibre clampea LON con viewport WIDTH y LAT con viewport HEIGHT. Con bearing=-90 los ejes están intercambiados → restricción LON demasiado laxa → usuario sale por arriba/abajo al hacer zoom in |
| 2 | **move + setCenter para clamping NO funciona** | CRÍTICA | El listener 'move' con setCenter() genera artifacts visuales graves: zoom trabado, cámara errática, loop de feedback. El patrón es inviable, no es un problema de cálculo sino del patrón mismo |
| 3 | **setTransformConstrain es LA solución** | CRÍTICA | API de MapLibre 3+ (disponible en ^5.17.0). Ejecuta PRE-render cada frame, bearing-aware, sin loop de feedback. Requiere compensación de viewport en el constraint (restar half-extent del viewport al nivel de zoom actual) |
| 4 | **NO usar maxBounds y transformConstrain en paralelo** | ALTA | Compiten y crean comportamiento extraño. Usar solo transformConstrain para mapas con bearing=-90 |
| 5 | **La fórmula PGW rotado→estándar es determinista pero F necesita calibración manual** | CRÍTICA | `A_new=B_old`, `E_new=-D_old`, `F_new=F_old+D_old×W_portrait`. A y E funcionan. F falla para varios mapas y requiere ajuste manual contra el extent de tiles |
| 6 | **Corrección half-pixel es obligatoria** | ALTA | `x0=C-0.5*A-0.5*B`, `y0=F-0.5*D-0.5*E`. Ausente en v17 original. Elimina shift sistemático de ~0.5px |
| 7 | **BoundsPadding por lado para control fino** | MEDIA | Con bearing=-90 los lados se invierten: `right` controla "arriba" en pantalla, `left` controla "abajo", `top`/`bottom` controlan laterales. Valores encontrados empíricamente |
| 8 | **viewportMaxBounds en 3 variantes** | MEDIA | Marco completo (intro), Marco ancho (encuadres), Ajustado a imagen (ecosistemas, tejidos). Cada mapa puede requerir una estrategia diferente |
| 9 | **3 clusters de latitud F** | MEDIA | Norte Colombia (~12.6-12.9), Cauca medio (~6.3-6.9), Sur Cauca (~3.7). Los mapas del mismo cluster comparten región geográfica |

### 12.2 LECCIONES DE MAPLIBRE Y RENDERIZADO

| # | Lección | Severidad | Detalle |
|---|---------|-----------|---------|
| 10 | **Versión CDN vs npm de MapLibre** | ALTA | CDN v2.4.0 NO tiene `setTransformConstrain`. npm v5.17+ SÍ. Usar siempre npm, nunca CDN |
| 11 | **Eliminar zoom automático** | ALTA | El zoom recalculado (containZoom, coverZoom, setMinZoom, jumpTo) pelea con el usuario y deforma el viewport. El zoom debe ser estático desde config: initialZoom, minZoom, maxZoom |
| 12 | **Debug opacity para verificación visual** | MEDIA | Capa de mapa semitransparente (0.5) sobre OSM basemap permite verificar alineación geográfica visualmente |
| 13 | **Sub-capas raster tienen A/E/C/F propios** | ALTA | No heredan del mapa base. `A_sub=A_main×factor_escala`, `C_sub=C_main+Δ_lon`, `F_sub=F_main+Δ_lat`. Cada grupo define su factor y offset |
| 14 | **Ch4 zoom extremo (17.4-18.4)** | MEDIA | Bounds muy ajustados (±0.003°-0.005°). Requiere precisión milimétrica en PGW |
| 15 | **CDN de MapLibre CSS v2.4.0** | BAJA | v17 usaba CSS desde CDN. Mejor embeber en bundle |

### 12.3 LECCIONES DE ARQUITECTURA Y CÓDIGO

| # | Lección | Severidad | Detalle |
|---|---------|-----------|---------|
| 16 | **No mezclar datos con lógica** | ALTA | `atlasMapData.ts` mezcla PGW + URLs + configs + dimensiones. Separar en archivos独立: `pgw.ts`, `images.ts`, `configs.ts` |
| 17 | **No duplicar estado entre stores y data** | ALTA | `chaptersStore.CHAPTER_MAPS` duplicaba `chaptersData.ts`. Derivar de una sola fuente con `getChapterMapIds()` |
| 18 | **Resolver bounds en runtime, no hardcodear** | ALTA | Estrategia configurable (configured/derived/auto) con fallback por delta. Centralizado en un resolvedor, consumido por hook y renderer sin recalcular |
| 19 | **Logger estructurado, no console.log** | MEDIA | `MapLogger` con niveles debug/info/warn/error. Debug e info solo en desarrollo. Categorías consistentes (MAP_INIT, mapRenderer, hooks) |
| 20 | **Polyfill createObjectURL para tests** | MEDIA | jsdom no tiene `URL.createObjectURL`. Necesario en `setup.ts` para que MapLibre corra en Vitest |
| 21 | **Mocks de MapLibre para tests de integración** | MEDIA | Tests de renderer con mock de `maplibregl.Map` permiten validar consumo de bounds precomputados, centro final y fijación de minZoom |
| 22 | **Métricas cuantitativas en píxeles** | MEDIA | `meanPx <= 0.5` y `maxPx <= 1.0` como gate de CI para aprobar derivación de bounds. Sin esto, no hay criterio objetivo |

### 12.4 BUGS CONCRETOS ENCONTRADOS Y CORREGIDOS

| # | Bug | Causa | Fix |
|---|-----|-------|-----|
| 23 | `rangoEcosistemas` borrado accidentalmente | ReferenceError en pgwData.js | Re-agregar `const rangoEcosistemas = 2.03` |
| 24 | `bredunco` minZoom duplicado | Entrada duplicada en mapConfig | Eliminar duplicado |
| 25 | `fomasDelPaisaje` desplazado al sur | F=6.117 en vez de 12.647 | Calibrar F manualmente |
| 26 | Popup encuadre en el Amazonas | Coordenadas `[-67.14, 1.69]` en vez de centro Cauca | Corregir a `[-76.0, 5.0]` |
| 27 | `hasPgwRotation` forzaba bearing=0 | Lógica legacy de v17 | Eliminar flag, respetar bearing de config |
| 28 | `mirrorHorizontal: true, mirrorVertical: true` | Causaban rotación 180° | Eliminar overrides de interacción |
| 29 | Ruta uploads sin `/` inicial | `router.post('modal/:modalId')` → nunca matchea | Agregar `/`: `router.post('/modal/:modalId')` |
| 30 | `pgwData.js` no se usaba en 3.0 | PGW duplicados en `atlasMapData.ts` | Unificar en una sola fuente |
| 31 | MapSelectorGrid usa `/map/:mapId` | Ruta incorrecta vs `/test-maps/:mapId` | Unificar rutas |

### 12.5 PATRONES QUE FUNCIONAN (CONSERVAR)

| # | Patrón | Descripción |
|---|--------|-------------|
| 32 | **Resolvedor runtime de bounds** | Estrategia auto: intenta derivar de PGW, fallback a configured si delta > umbral. Centralizado, sin duplicación |
| 33 | **Tiles progresivos 2-capas** | Capa base 30KB siempre visible + tiles alta resolución carga progresiva. Funciona excelente para mala conexión |
| 34 | **bearing=-90 nativo + setTransformConstrain** | Sin rotar imágenes. MapLibre rota el viewport. Constrain bearing-aware para clamping. Elimina dependencia de GDAL |
| 35 | **Dominios planos sin dependencias cruzadas** | `map/`, `layers/`, `chapters/` no se importan entre sí. Orquestación vía Zustand stores con `getState()` |
| 36 | **Dimensiones de imagen vía Cloudinary fl_getinfo** | Obtener width/height real sin descargar la imagen. Necesario para calcular bounds correctos |
| 37 | **Estrategia de migración por fases** | Fase A (intro), Fase B (chapter1 tiles), Fase C (chapter2+). Cada fase con gate de métricas antes de avanzar |
| 38 | **Tile cache headers en Vite** | Plugin `tileCacheHeadersPlugin`: Cache-Control: max-age=31536000 para .webp, manejo graceful de 404 |

---

### 12.6 INVESTIGACIÓN: `setTransformConstrain` — La API que resolvió el problema de bearing

> **Fuentes**: [MapLibre GL JS API docs](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/TransformConstrainFunction/), [Ejemplo oficial](https://maplibre.org/maplibre-gl-js/docs/examples/customize-the-map-transform-constrain/), [Issue #6484](https://github.com/maplibre/maplibre-gl-js/issues/6484), [Issue #4510](https://github.com/maplibre/maplibre-gl-js/issues/4510), [Issue #4591](https://github.com/maplibre/maplibre-gl-js/issues/4591)

#### El problema: `setMaxBounds()` es bearing‑blind

`map.setMaxBounds([[west, south], [east, north]])` funciona con bounding boxes **axis‑aligned** (siempre norte‑arriba). Internamente MapLibre calcula:

```
lon_range = east - west   → clampeado con viewport WIDTH
lat_range = north - south → clampeado con viewport HEIGHT
```

Al aplicar `bearing: -90`, los ejes visuales se **intercambian**:
- El eje HORIZONTAL de la pantalla = LAT (norte‑sur geográfico)
- El eje VERTICAL de la pantalla = LON (este‑oeste geográfico)

Pero `setMaxBounds` **no sabe esto**. Sigue clampeando LON con el WIDTH del viewport (demasiado laxo → el usuario puede salir por arriba/abajo al hacer zoom in) y LAT con el HEIGHT (demasiado restrictivo → corta tiles en los bordes laterales).

Este es **exactamente el problema** que la bitácora documenta en la interacción 15: *"Diagnóstico comportamiento viewportMaxBounds con zoom"*.

#### Las soluciones que NO funcionaron

| Estrategia | Resultado | Razón |
|-----------|-----------|-------|
| `setMaxBounds` con valores ajustados | ❌ | Bearing‑blind. Ningún valor corrige el problema de ejes invertidos |
| `move` + `setCenter` con `unproject()` | ❌ | Loop de feedback → jitter, cámara errática, zoom trabado. Inviable |
| Turf.js para rotar coordenadas | ❌ | No resuelve clamping en cliente MapLibre. Solo rota geometrías |
| Imagen pre‑rotada en build (GDAL) + bearing=0 | ⚠️ Funciona pero es costoso | Requiere regenerar tileset entero con imagen rotada 90°. Elimina el problema de raíz pero agrega paso de build |

#### La solución: `setTransformConstrain` (MapLibre ≥ v3.0, API estable en v5.17+)

**Tipo oficial**: [`TransformConstrainFunction`](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/TransformConstrainFunction/)

```typescript
type TransformConstrainFunction = (
  lngLat: LngLat,
  zoom: number
) => {
  center: LngLat
  zoom: number
}
```

**Qué hace**: Callback que se ejecuta **PRE‑render en cada frame**. Recibe el centro y zoom que MapLibre quiere aplicar, y debe devolver el centro y zoom permitidos. Ocurre **antes** de dibujar el frame, sin loop de feedback.

**Cómo usarlo**:

```typescript
const map = new maplibregl.Map({
  // Opción 1: en constructor (v5.17+)
  transformConstrain: (lngLat, zoom) => {
    // Aplicar lógica bearing‑aware aquí
    return { center: constrainedCenter, zoom: constrainedZoom }
  }
})

// Opción 2: después de crear el mapa
map.setTransformConstrain((lngLat, zoom) => {
  return { center: constrainedCenter, zoom: constrainedZoom }
})
```

**Historia de la feature**:
- **Ago 2024**: [Issue #4510](https://github.com/maplibre/maplibre-gl-js/issues/4510) — larsmaxfield propone "extender viewport más allá de bounds para underzooming"
- **Ago 2024**: [Issue #4591](https://github.com/maplibre/maplibre-gl-js/issues/4591) — mismo problema: zoom out sin límites de bounds
- **Oct 2025**: [Issue #6484](https://github.com/maplibre/maplibre-gl-js/issues/6484) — Se implementa `transformConstrain` como hook oficial. Cerrado con PR #6485. Se crea el paquete [`maplibre-xy`](https://github.com/larsmaxfield/maplibre-xy)
- **Oct 2025**: [Ejemplo oficial](https://maplibre.org/maplibre-gl-js/docs/examples/customize-the-map-transform-constrain/) publicado en la documentación

#### Cómo lo implementó el Atlas (bitácora #24)

El archivo `useAtlasMap.ts` (línea 100-183) contiene `createBearingAwareConstrain()`:

```typescript
// Dentro del transformConstrain — ANTES de clampear:
const scale = Math.pow(2, zoom);
const vpHalfLon = (canvas.width / 2) / (scale * PIXELS_PER_DEGREE_LON);
const vpHalfLat = (canvas.height / 2) / (scale * PIXELS_PER_DEGREE_LAT);

// Con bearing=-90: eje horizontal pantalla = LAT, eje vertical = LON
// → vpHalfLon se resta del halfHeight del bound (eje vertical visual)
// → vpHalfLat se resta del halfWidth del bound (eje horizontal visual)
const clampedRotX = Math.max(-(halfWidth - vpHalfLat), Math.min(halfWidth - vpHalfLat, rotX));
const clampedRotY = Math.max(-(halfHeight - vpHalfLon), Math.min(halfHeight - vpHalfLon, rotY));
```

**Punto crítico**: El constraint opera sobre el **centro** del mapa, no sobre las esquinas. Sin compensación de viewport, al hacer zoom in las esquinas se salen del bound aunque el centro esté dentro. Por eso se restan `vpHalfLon` y `vpHalfLat` del half‑extent del bound.

#### Comparación de versiones de MapLibre

| Versión | `setTransformConstrain` | `setMaxBounds(bearing)` | Usada en |
|---------|------------------------|------------------------|----------|
| v2.4.0 (CDN) | ❌ No existe | ❌ Bearing‑blind | v17 original |
| v5.1.0 (npm) | ❌ No disponible en prototype | ❌ Bearing‑blind | v17 antes de migración |
| v5.17.0+ (npm) | ✅ Disponible y estable | ❌ Bearing‑blind | atlas_3.0 |
| v5.24.0 (npm) | ✅ Con correcciones | ❌ Bearing‑blind | v17 post‑migración |
| v6.0.0 | ✅ Opción `transformConstrain` en constructor | ❌ Bearing‑blind | Última versión |

#### Conclusión

> **`setTransformConstrain` es LA API correcta para restringir viewport con bearing≠0.** No requires rotar imágenes, no requiere GDAL, no requiere Turf.js. Es la razón por la que "al actualizar MapLibre todo funcionó". Implementarlo desde el inicio en la nueva versión, sin perder tiempo con `setMaxBounds`.

---

### 12.7 INVESTIGACIÓN: Stack óptimo para mapas rotados con georreferenciación funcional

> **Objetivo**: Determinar la mejor combinación de versión de MapLibre, APIs, librerías y enfoque arquitectónico para mapas portrait con georreferenciación PGW, bearing=-90 y tiles progresivos.

#### 12.7.1 MapLibre GL JS — Estado actual (Julio 2026)

**v6.0.0** fue publicado ayer (22 Julio 2026). Cambios relevantes para el Atlas:

| Cambio | Impacto en Atlas |
|--------|-----------------|
| **ESM-only** (`maplibre-gl.mjs`) | `import * as maplibregl from 'maplibre-gl'` en vez de `import maplibregl from 'maplibre-gl'`. Sin UMD. |
| **WebGL2 requerido** | WebGL1 eliminado. Mejor rendimiento en renderizado de capas. |
| **`transformConstrain` en constructor** | Antes solo `map.setTransformConstrain()`. Ahora se puede pasar como opción `new Map({ transformConstrain: fn })`. Más limpio. |
| **TypeScript target ES2022** | Bundles más pequeños, mejor runtime perf. |
| **Map compone Camera** | `map.transform` interno eliminado. Usar API pública. Si el Atlas accedía a `map.transform`, toca migrar. |
| **Eventos son clases reales** | `MapMovementEvent` para move/zoom/rotate/drag. Mejor tipado. |
| **`RasterTileSource.setPremultiplyAlpha(false)`** | Preserva valores RGBA crudos. Útil si los tiles usan alpha para datos, no opacidad. |
| **`fill-layer-opacity` / `line-layer-opacity`** | Nuevas paint properties para opacidad uniforme de capa entera. |

**⚠️ Migración v5 → v6**: El Atlas usa `import maplibregl from 'maplibre-gl'` (default import). v6 requiere `import * as maplibregl from 'maplibre-gl'` o named imports. El worker URL en CDN es auto-detectado (sin `setWorkerUrl()`). En Vite hay que configurar `setWorkerUrl()` explícitamente.

#### 12.7.2 Versión recomendada para el nuevo Atlas

```
maplibre-gl@^6.0.0
```

**Justificación**: v6.0.0 es la última estable. Incluye `transformConstrain` en constructor, WebGL2, mejor tipado TypeScript, y todos los fixes de bearing de v5.17+. No hay razón para quedarse en v5.

**Riesgo**: v6 es nueva (1 día). Si hay bugs bloqueantes, fallback a `maplibre-gl@^5.24.0`.

#### 12.7.3 Estrategia de renderizado: `ImageSource` + `RasterTileSource` en capas

El patrón actual del Atlas funciona correctamente:

```typescript
// 1. Imagen base georreferenciada (baja resolución, carga instantánea)
map.addSource('image-base', {
  type: 'image',
  url: '/assets/maps/chapter-1/intro/base.webp',
  coordinates: [           // 4 esquinas desde PGW
    [C, F],               // top-left
    [C + A*W, F],         // top-right
    [C + A*W, F + E*H],   // bottom-right
    [C, F + E*H]          // bottom-left
  ]
})

// 2. Tiles de alta resolución (carga progresiva)
map.addSource('tiles', {
  type: 'raster',
  tiles: ['/assets/maps/chapter-1/intro/tiles/{z}/{x}/{y}.webp'],
  tileSize: 256,
  scheme: 'xyz',
  minzoom: 0,
  maxzoom: 6
})

// 3. Aplicar bearing de MapLibre (rotar viewport, no datos)
map.setBearing(-90)

// 4. Restringir cámara con bearing-aware constrain
map.setTransformConstrain(createBearingAwareConstrain(bounds))
```

**Ventajas de este enfoque**:
- La imagen base se carga instantáneamente (típicamente 30-50 KB WebP)
- Los tiles se cargan progresivamente por nivel de zoom
- `setCoordinates()` permite actualizar la georreferenciación en runtime sin recargar la imagen
- El bearing de MapLibre rota el viewport entero, manteniendo la georreferenciación intacta
- `setTransformConstrain` restringe la cámara considerando el bearing

#### 12.7.4 Alternativa evaluada: COG (Cloud Optimized GeoTIFF)

MapLibre soporta COG vía `@geomatico/maplibre-cog-protocol`:

```typescript
import * as maplibregl from 'maplibre-gl'

maplibregl.addProtocol('cog', MaplibreCOGProtocol.cogProtocol)

map.addSource('cogSource', {
  type: 'raster',
  url: 'cog://https://example.com/map.tif',
  tileSize: 256
})
```

| COG | vs | ImageSource + Tiles |
|-----|----|---------------------|
| GeoTIFF con georreferenciación embebida | | PGW externo + coordenadas manuales |
| Sin necesidad de GDAL/gdal2tiles | | Requiere generación de tiles offline |
| El servidor debe soportar HTTP Range requests | | Archivos estáticos, cualquier servidor |
| Carga bajo demanda desde el GeoTIFF | | Tiles pre-generados, carga más rápida |
| Ideal para pocos mapas | | Ideal para 31 mapas |
| Dependencia extra (`maplibre-cog-protocol`) | | Sin dependencias extra |

**Veredicto**: **NO usar COG para el Atlas.** Son 31 mapas, los tiles pre-generados son más rápidos en carga y no requieren HTTP Range requests en el servidor. COG es mejor para escenarios con pocos mapas o cuando no se quiere pre-procesar.

#### 12.7.5 Librería recomendada: `maplibre-xy`

[`maplibre-xy`](https://github.com/larsmaxfield/maplibre-xy) es una librería creada específicamente para "flat single-copy maps and non-maps like high-resolution image tilesets" — **exactamente el caso de uso del Atlas**.

```typescript
import { Underzoom } from 'maplibre-xy'

const underzoom = new Underzoom(maplibregl, {
  extendScale: 0.9,   // Cuánto zoom out permitir (0-1)
  extendPan: 0.2,     // Cuánto pan fuera de bounds (0-1)
  extend: true         // Activar/desactivar
})

const map = new maplibregl.Map({
  transformConstrain: underzoom.transformConstrain,
  renderWorldCopies: false,
  ...
})
```

**Lo que resuelve**: Permite al usuario hacer zoom out para ver el mapa completo aunque el viewport no coincida con el aspect ratio de los bounds. El Atlas tiene mapas portrait (más altos que anchos) con bearing=-90, y los viewports de escritorio son landscape — sin underzoom, el usuario no puede ver el mapa entero.

**⚠️ NOTA**: `maplibre-xy` reemplaza la necesidad de implementar `createBearingAwareConstrain()` manualmente. Usa su `Underzoom.transformConstrain` directamente como `transformConstrain` del mapa. Si se necesita lógica custom adicional (como bounds específicos por mapa), se puede componer.

#### 12.7.6 La fórmula PGW → ImageSource coordinates

Para un PGW `[A, D, B, E, C, F]` con corrección half-pixel:

```typescript
function pgwToCoordinates(pgw: [number,number,number,number,number,number], width: number, height: number) {
  const [A, D, B, E, C, F] = pgw
  
  // Corrección half-pixel: centro → esquina del píxel top-left
  const x0 = C - 0.5 * A - 0.5 * B
  const y0 = F - 0.5 * D - 0.5 * E
  
  // 4 esquinas en clockwise desde top-left
  return [
    [x0, y0],                     // top-left
    [x0 + A * width, y0 + D * width],   // top-right  
    [x0 + A * width + B * height, y0 + D * width + E * height], // bottom-right
    [x0 + B * height, y0 + E * height]  // bottom-left
  ]
}
```

Para PGW estándar sin skew (B=0, D=0):
```typescript
// Simplificado:
const coordinates = [
  [C - 0.5*A, F - 0.5*E],               // top-left
  [C - 0.5*A + A*W, F - 0.5*E],          // top-right
  [C - 0.5*A + A*W, F - 0.5*E + E*H],    // bottom-right
  [C - 0.5*A, F - 0.5*E + E*H]           // bottom-left
]
```

#### 12.7.7 Stack final recomendado

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| Map engine | `maplibre-gl` | `^6.0.0` | Renderizado WebGL2, `transformConstrain` nativo |
| Underzoom | `maplibre-xy` | `^1.0.0` | Permitir zoom out para ver mapa completo |
| Image source | `ImageSource` (nativo) | — | Imagen base georreferenciada |
| Tiles | `RasterTileSource` (nativo) | — | Tiles XYZ progresivos |
| Georreferenciación | PGW → `coordinates` (custom) | — | Fórmula half-pixel |
| Bearing | `map.setBearing(-90)` (nativo) | — | Rotación del viewport |
| Constrain | `transformConstrain` (nativo) | — | Restricción de cámara bearing-aware |
| GDAL | NO USAR | — | Eliminar del pipeline |
| Turf.js | NO USAR | — | Eliminar, no necesario |
| COG | NO USAR | — | Tiles pre-generados son mejores para 31 mapas |

#### 12.7.8 Lo que NO se necesita (eliminar del stack)

| Tecnología | Por qué eliminarla |
|-----------|-------------------|
| **GDAL** | No rotar imágenes. Bearing=-90 nativo de MapLibre. Los tiles se generan desde la imagen original sin rotar. |
| **Turf.js** | `transformConstrain` reemplaza la rotación de coordenadas. `maplibre-xy` reemplaza el underzoom manual. |
| **Mapbox GL** | Solo MapLibre. Un motor de mapas. |
| **react-map-gl** | Usar MapLibre directo. Menos abstracción, más control. |
| **Proj4** | Solo necesario si hay datos en múltiples CRS. Si todo está en EPSG:4326, no se necesita. |
| **setMaxBounds** | Bearing-blind. `transformConstrain` lo reemplaza completamente. |
| **move + setCenter clamping** | Inviable. Ya documentado en bitácora. |
| **Rotación física de imágenes** | Elimina dependencia de GDAL y scripts Python innecesarios. |

#### 12.7.9 Pipeline de build simplificado

```
ANTES (3.0):                          AHORA (v6):
─────────────                         ─────────
Imagen portrait                       Imagen portrait (sin tocar)
  │                                     │
  ├─ GDAL: rotar 90°                    ├─ gdal2tiles.py (si se usa)
  ├─ GDAL: generar tiles                │  genera tiles desde
  ├─ Python: calibrar PGW               │  imagen original sin rotar
  │                                     │
  ▼                                     ▼
Imagen landscape + tiles              Tiles XYZ + PGW original
  │                                     │
  ├─ PGW convertido (fórmula)           ├─ PGW original (rotado)
  ├─ F calibrado manualmente            ├─ Bearing=-90 nativo MapLibre
  │                                     ├─ setTransformConstrain
  ▼                                     ▼
MapLibre con bearing=-90              MapLibre con bearing=-90
+ setMaxBounds (roto)                 + transformConstrain (funciona)
```

---

## 13. HALLAZGOS Y SENTENCIAS

### Sentencias definitivas

1. **El backend se ELIMINA.** Toda la data es estática. MongoDB no aporta valor. Cloudinary se consume directo con URLs públicas.

2. **La arquitectura de dominios de 3.0 es buena pero se simplifica.** En lugar de `domains/` con subcarpetas profundas, usamos `data/` (datos), `services/` (lógica), `stores/` (estado), `hooks/` (React), `components/` (UI). Más plano, más navegable.

3. **Los PGW de v17 son la fuente de verdad.** Los de 3.0 (`atlasMapData.ts`) están mal convertidos. NO rotar imágenes. Usar `bearing: -90` nativo de MapLibre con `setTransformConstrain`.

4. **El sistema de tiles de 3.0 SÍ funciona bien.** La estrategia de 2 capas (base + tiles progresivos) es correcta. Mantenerla pero con coordenadas correctas.

5. **NO duplicar código.** Una sola carpeta `components/`. Sin `ui/` separado. Sin `components/` legacy vs nuevo.

6. **TypeScript strict para todo.** Incluso datos (usar `as const` y tipos inferidos).

7. **CSS Modules + CSS Variables.** Sin styled-components ni runtime de CSS-in-JS. Performance primero.

8. **Sin dependencias innecesarias.** Cada librería debe justificarse. Menos de 10 dependencias runtime.

9. **Assets locales primero, Cloudinary como fallback.** Descargar todas las imágenes de Cloudinary a `public/assets/` para funcionamiento offline.

10. **Una sola fuente de verdad para cada dato.** PGW en un solo archivo. Configs de mapa en uno solo. Capítulos en uno solo.

### Lecciones aprendidas (errores que NO repetir)

1. **No mezclar datos con lógica** — `atlasMapData.ts` de 3.0 mezcla PGW + URLs + configs
2. **No duplicar estado** — `chaptersStore` de 3.0 tenía CHAPTER_MAPS duplicado (bitácora #17)
3. **No tener archivos huérfanos** — `pgwData.js` de 3.0 tiene 655 líneas de PGW que no se usan (bitácora #30)
4. **No tener entry points duplicados** — `main.jsx` y `main.tsx`
5. **No tener componentes duplicados** — `components/` y `ui/`
6. **No mezclar tecnologías de mapa** — v17 usa MapLibre Y Mapbox, solo usar MapLibre
7. **No rotar datos cuando el motor puede rotar la vista** — bearing nativo de MapLibre con setTransformConstrain (bitácora #3)
8. **No exponer credenciales** — `.env` del backend en el repo con MongoDB URI y Cloudinary keys
9. **No crear un backend para datos estáticos** — es innecesario y agrega latencia
10. **No tener docs que mientan** — `informe.md` del backend describe features inexistentes
11. **No usar fórmulas de conversión PGW sin verificar** — el caso intro demuestra que fallan (bitácora #5, #21)
12. **No generar tiles desde imágenes con coordenadas incorrectas** — todo el pipeline se contamina
13. **No usar setMaxBounds con bearing≠0** — es bearing-blind, no funciona (bitácora #1)
14. **No usar move + setCenter para clamping** — patrón inviable, produce artifacts (bitácora #2)
15. **No usar maxBounds y transformConstrain juntos** — compiten (bitácora #4)
16. **No implementar zoom automático** — pelea con el usuario, usar solo valores estáticos de config (bitácora #11)
17. **No forzar bearing=0 con flags legacy** — `hasPgwRotation`, `mirrorHorizontal`, `mirrorVertical` (bitácora #27, #28)
18. **No olvidar la corrección half-pixel** — shift de 0.5px en coordenadas (bitácora #6)

### Verificación de georreferenciación requerida

Para CADA uno de los 31 mapas, verificar:
1. Que el PGW del archivo original de v17 produzca coordenadas correctas en el mapa
2. Que la imagen base se cargue en la posición correcta
3. Que los tiles se alineen con la imagen base
4. Que los bounds calculados por `BoundsCalculator` coincidan con los bounds visuales
5. Que el zoom inicial muestre el mapa completo

### Archivos de assets que DEBEN copiarse de v17

De `atlas_front/atlas_frontend_v17/dist/assets/`:
- `img/` → 160 imágenes (fondos, capas, logos, mapas, perfil, talleres, carrusel)
- `iconsCap4/` → 73 iconos especializados Cap 4
- `IconosTejidosAgua/` → 11 iconos temáticos
- `mapasMenuCap2/` → 63 imágenes de menú capas
- `tramosCap3/` → 4 imágenes de tramos
- `audiosChapters/` → 2 archivos MP3
- `svg/` → 44 SVGs
- `interface/` → UI icons, loaders

De `atlas_3.0/public/assets/`:
- `maps/tiles/` → tiles generados (si las coordenadas son correctas)
- `maps/base-images/` → imágenes base
- `geo-layers/` → 27 archivos GeoJSON

---

## RESUMEN PARA MEMORIA DE AGENTE

> **El proyecto es un atlas cartográfico digital con 31 mapas en 4 capítulos sobre el Valle Alto del Río Cauca.**
>
> **Backend**: Innecesario. Se elimina. Todo es estático. .env expuesto con credenciales. BUG en ruta uploads.
>
> **v17**: Versión funcional completa con todo el contenido (audio, carrusel, iconos, 4 capítulos, 521 assets en dist/, 304 archivos de assets ~90 MB). Pero es JS puro, monolítico, sin código fuente (solo dist/). Usa imágenes Cloudinary directas (sin tiles XYZ). Cap 1 inline en bundle principal de 1.8 MB.
>
> **3.0**: Reescritura con buena arquitectura (TypeScript, Zustand, dominios, tiles progresivos, 177 archivos fuente). Pero **georreferenciación incorrecta** (PGW convertidos con fórmula que falla, 3 variantes test en el código lo demuestran), solo Cap 1 con assets locales, código duplicado entre components/ y ui/.
>
> **Bitácora**: 34 interacciones documentadas con lecciones críticas: setMaxBounds es bearing-blind, move+setCenter es inviable, setTransformConstrain es la solución, la fórmula PGW necesita calibración manual de F, sub-capas tienen A/E/C/F propios, el zoom automático pelea con el usuario.
>
> **Nueva versión**: Unificar contenido de v17 + arquitectura corregida de 3.0 + sin backend.
> - TypeScript strict, React 19, Zustand 5, MapLibre GL 5, Vite 6
> - Estructura plana: data/ | services/ | stores/ | hooks/ | components/
> - PGW originales de v17 (formato rotado). NO rotar imágenes. `bearing: -90` + `setTransformConstrain`
> - Tiles progresivos (base + alta resolución) con coordenadas correctas
> - Un solo entry point. Sin código duplicado. Sin backend.
> - 38 lecciones documentadas de la bitácora como guía de lo que NO repetir
>
> **Lo más crítico**: Corregir la georreferenciación usando los PGW originales de v17. El mapa `bredunco` tiene el mismo PGW que `intro` pero con F sin corregir. Implementar `setTransformConstrain` desde el inicio (no perder tiempo con setMaxBounds). Separar datos de lógica desde el día 1.

---

## 14. ESTADO ACTUAL DEL PROYECTO ATLAS PLURIVERSAL (Julio 2026)

### 14.1 Estructura Actual del Repositorio

```
atlas-pluriversal/
├── atlas/                          # Frontend React + TypeScript + MapLibre
│   ├── src/
│   │   ├── App.tsx                 # Router con 3 rutas (/, /dev-menu, /test/:mapId)
│   │   ├── main.tsx                # Entry point único
│   │   ├── data/
│   │   │   ├── maps/               # geo.js, configs.js, images.js, index.js
│   │   │   └── chapters/           # chapters.js
│   │   ├── services/               # MapRenderer, BoundsCalculator, TransformConstrain
│   │   ├── stores/                 # mapStore, layerStore, uiStore, chapterStore
│   │   ├── hooks/                  # useMap.ts
│   │   ├── components/map/         # AtlasMap.tsx
│   │   ├── pages/                  # DevMenu, TestMapPage
│   │   ├── types/                  # map.ts, layer.ts, chapter.ts
│   │   └── styles/                 # tokens.css, globals.css
│   ├── public/                     # (vacío sin assets aún)
│   ├── package.json
│   └── vite.config.ts
│
├── atlas_backend/                  # API REST Node.js + Express + MongoDB + Cloudinary
│   ├── src/
│   │   ├── config/                 # server, database, cloudinary configs
│   │   ├── controllers/            # location, modalInfo, upload controllers
│   │   ├── models/                 # Location, ModalInfo, GeoImage, ModalPicture
│   │   └── routes/                 # location, modalInfo, uploads routes
│   ├── .env                        # Credenciales MongoDB + Cloudinary
│   ├── app.js                      # Entry point
│   └── informe.md                  # Documentación (869 líneas, desactualizada)
│
└── MEMORIA_TECNICA.md              # Este documento
```

### 14.2 Backend Atlas Backend — Análisis Completo del Código

El backend está implementado en Node.js + Express 4.21 con Mongoose 8.9 (MongoDB Atlas) y Cloudinary SDK 2.5.

#### 14.2.1 API Endpoints (7 endpoints)

```
POST   /api/v1/location              → Crear GeoJSON FeatureCollection
GET    /api/v1/location/:term        → Buscar por ID Mongo o nombre (regex)
POST   /api/v1/modal                 → Crear información modal
GET    /api/v1/modal                 → Listar todos los modales (populated con imgUrl)
GET    /api/v1/modal/:id             → Obtener modal por ID (populated)
POST   /api/v1/uploads/modal/:modalId → Subir imagen Cloudinary + asociar a modal
POST   /api/v1/uploads/geoImage      → Subir imagen georreferenciada a Cloudinary
```

#### 14.2.2 Modelos de Datos (MongoDB)

**geocollections**: GeoJSON FeatureCollections importados de Shapefiles
```javascript
{
  type: "FeatureCollection",
  name: String,           // Nombre de la colección
  crs: { type, properties: { name } },
  features: [{            // Array de Features individuales
    type: "Feature",
    properties: { name, status, project, symbol, date, dispersion, length },
    geometry: { type, coordinates }  // GeoJSON geometry
  }]
}
```

**modalinfos**: Información para modales emergentes
```javascript
{
  idCss: String,          // Identificador CSS (único)
  title: String,          // Título del modal
  description: String,    // Contenido/descripción
  imgUrl: ObjectId,       // Referencia a ModalPicture
  type: String,           // Enum: 'DESC' | 'DINAMYC', default 'DESC'
}
```

**geoimages**: Imágenes georreferenciadas en Cloudinary
```javascript
{
  name: String,           // Nombre único
  fileName: String,       // Nombre sin extensión
  url: String,            // URL de Cloudinary
}
```

**modalpictures**: Imágenes asociadas a modales
```javascript
{
  modal: ObjectId,        // Referencia a ModalInfo
  url: String,            // URL de Cloudinary
}
```

#### 14.2.3 Credenciales Expuestas

El archivo `.env` contiene credenciales en texto plano:
```
MONGO_USER=atlaspluriversal
MONGO_PASSWORD=Do2S9fh6mcLrit41
MONGO_URL=mongodb+srv://atlaspluriversal:Do2S9fh6mcLrit41@cluster0.mvsfdqh.mongodb.net/
CLOUDINARY_URL=cloudinary://628137656897332:tIhwDlGp_TivIZA3zZl_t7uA3sg@dvluvxfvn
CLOUDINARY_CLOUD=dvluvxfvn
CLOUDINARY_API_KEY=628137656897332
CLOUDINARY_API_SECRET=tIhwDlGp_TivIZA3zZl_t7uA3sg
```

#### 14.2.4 Problemas Detectados

1. **BUG en ruta uploads**: `uploadsRouter.post('modal/:modalId', ...)` — **falta el `/` inicial**, nunca matchea requests
2. **Inconsistencia de naming**: `location.routes.js` (plural) vs `modalInfo.route.js` (singular)
3. **Sin autenticación ni validación**: `express-validator` instalado pero no usado
4. **El `informe.md` describe features que NO existen**: JWT, rate limiting, Sharp, Swagger
5. **getLocation bug**: Si hay múltiples coincidencias por nombre, solo retorna la primera (`geoCollection[0]`), potencialmente `undefined`
6. **Sin TypeScript**: JS puro sin tipos

#### 14.2.5 Datos Actualmente en la BD (verificados via API)

- **Una colección** existe con nombre `"Encuadre cuenca alta"` (48 features): Un MultiPolygon que delimita toda la cuenca del río Cauca
- **Cero modales** en la BD: `GET /api/v1/modal` → `{"modals":[]}`
- Las imágenes de Cloudinary se usan desde URLs directas en el frontend (no via API)

#### 14.2.6 Decisión sobre el Backend

**CONTRARIO a lo documentado en secciones anteriores, el backend NO se elimina.** Se mantiene como capa opcional para:

1. **GeoJSON dinámicos**: Si se necesitan añadir/modificar capas vectoriales sin re-deploy (Shapefiles importados por administradores)
2. **Modales con imágenes**: Subida de imágenes por usuarios no-técnicos
3. **Extensibilidad futura**: Si el proyecto crece, tener una API facilita la integración

Pero: el frontend debe funcionar **100% sin backend** (datos estáticos + Cloudinary directo). El backend es opcional, no necesario.

### 14.3 Nuevos Datos PGW Proporcionados por el Cliente

El cliente proporcionó PGW actualizados que **reemplazan** a los de v17 y 3.0. Cambios clave:

| Mapa | Archivo | Cambio en F |
|------|---------|-------------|
| `intro` | `geo.js` actual: `-0.290036434033` | **Nuevo: `-0.248036434033`** |
| `chapter1-encuadres` | PGW completamente cambiado para coincidir con intro | B y D ahora igual que intro |
| `chapter1-ecosistemas` | A=0, D/B/F cambiaron significativamente | A=0 (antes nonzero), D/B ~0.000579 |
| `chapter1-mosaicos-del-agua` | D/B/F cambiaron | F=2.021300451509 (antes 2.161908918459) |
| `chapter2-valle` | Cambios en D, B, F | F=1.624394586117 (antes 1.870309514817) |
| `chapter2-suarez` | Cambios en D, B, F | F=2.704011104944 (antes 2.758437617084) |
| `chapter2-cali` | Cambios en D, B, F | F=3.271850493610 (antes 3.348181582808) |
| `chapter2-villa-rica` | Cambios en D, B, F | F=2.931841644195 (antes 2.974893043424) |
| `chapter2-m-oriente-cali` | A=0, cambios en D/B/F | Valores completamente diferentes |
| `chapter4-introduccion` | A=0, E=0 (antes nonzero) | Antes tenía A/E ≠ 0, ahora es estándar |

**Aclaración crítica**: Los PGW en `geo.js` de `atlas/` son los **originales rotados** (A=0, E=0, D≠0, B≠0) proporcionados por el usuario. Estos son los que se deben usar. No hay que reemplazarlos por los de v17 (`pgwData.js`) porque esos ya están en **formato convertido estándar**. Nuestro pipeline (BoundsCalculator + MapLibre bearing=-90) trabaja con los rotados directamente.

**Diferencia clave entre formatos**:

| Fuente | Formato | A | E | B | D | Uso |
|--------|---------|---|---|---|---|-----|
| `v17 pgwData.js` | Convertido estándar | ≠0 | ≠0 | =0 | =0 | V17 en producción (ya rotado) |
| `atlas/src/data/maps/geo.js` | Original rotado | =0 | =0 | ≠0 | ≠0 | Nuestra app (bearing=-90 lo rota) |
| `atlas_3.0 atlasMapData.ts` | Convertido (mal) | ≠0 | ≠0 | =0 | =0 | Falló por F mal calibrado |

**Regla**: Los valores en `geo.js` NO se tocan. Son los originales rotados. La rotación visual la hace MapLibre con `bearing: -90`.

### 14.4 Nuevos Mapas de Territorio

El cliente proporcionó definiciones para mapas de modelo territorial por territorio:

| Mapa | ID | PGW | Topónimos |
|------|-----|-----|-----------|
| **Valle del Cauca** | `chapter2-valle-modelo` | D=0.000779026, B=0.000779180, F=1.726466041 | 1 topónimo: "Valle del Cauca" (-76.291009, 3.703354) |
| **Suárez** | `chapter2-suarez-modelo` | D=0.000352734, B=0.000352798, F=2.411671179 | 5 topónimos |
| **Cali** | `chapter2-cali-modelo` | D=0.000269891, B=0.000269940, F=3.110680624 | 5 topónimos |
| **Villa Rica** | `chapter2-villa-rica-modelo` | D=0.000166381, B=0.000166445, F=2.780697475 | 5 topónimos |

### 14.5 Topónimos (Puntos de Interés)

El cliente proporcionó puntos con coordenadas exactas para mapas específicos. Estructura:

```javascript
{
  id: string,            // Identificador único
  name: string,          // Nombre del topónimo
  lng: number,           // Longitud
  lat: number,           // Latitud
  mapId: string,         // Mapa al que pertenece
  type: string,          // Tipo (ciudad, rio, montaña, etc.)
  modal: {               // Opcional: modal que se abre al hacer click
    title: string,
    content: string,
    imageUrl?: string
  }
}
```

Ejemplos de puntos proporcionados:
- **Cap 1**: Un Río Cauca (ciudades, ríos, cuencas, etc. ~15 puntos)
- **Cap 2 Suárez**: Suárez, Tarqui, Venecia, Buenos Aires, La Talla
- **Cap 2 Cali**: Cali, Yumbo, Jamundí, Candelaria
- **Cap 2 Villa Rica**: Villa Rica, Guachené, Puerto Tejada, Miranda, Padilla
- **Cap 2 Valle**: Cali, Buga, Tuluá, Cartago, Palmira, Yumbo, Jamundí, Candelaria, Santander de Quilichao, Puerto Tejada, Florida, Pradera, Roldanillo, Zarzal

### 14.6 Estructura de Contenido Completa (Tabla Maestra)

El cliente proporcionó una tabla completa que documenta TODO el contenido del Atlas:

**Campos de la tabla**:
- `Section`: Capítulo/Sección (Intro, Cap 1-4, Home, Créditos, Entramados)
- `Element`: Elemento específico (Mapa, Carrusel, Galería, Header, Audio, Capa, Modal, Popup)
- `Type`: Tipo sémantico (map, carousel, gallery, header, audio, layer, modal, popup, info, etc.)
- `Interaction`: Interacciones (click, hover, scroll, toggle, play, pause, next, prev)
- `Links to / Relation`: Relaciones con otros elementos
- `Imgs / Photos`: Archivos multimedia asociados

**Resumen por sección**:

| Sección | Elementos | Tipos clave |
|---------|-----------|-------------|
| **Intro/Bienvenidos** | 3 mapas, navegación, header | map (static), header, nav |
| **Cap 1** | 6 mapas, 19 capas ecosistemas, 10 capas río, sidebar, modal, carrusel | map, layer, modal, carousel, sidebar |
| **Cap 2** | 4 territorios, 4 mapas, 7 sub-mapas, galerías, modelo, capas por territorio | map, gallery, layer, territory-selector |
| **Cap 3** | 6 mapas, audio player, tramos, capas | map, audio, tramo, layer |
| **Cap 4** | 9 nodos, 11 mapas, 73 iconos, audio, capas | map, node, icon, audio, layer, modal |
| **Home** | Mapa interactivo, markers animados, grid capítulos | map, marker, grid |
| **Créditos** | Equipos, cards, links | info, card |
| **Entramados** | Galería logos, líneas decorativas | gallery, svg |

---

## 15. ARQUITECTURA DE CAPAS Y PUNTOS

### 15.1 Problema a Resolver

El Atlas necesita:
1. **Capas vectoriales (GeoJSON)**: Polígonos/líneas sobre el mapa base (ríos, ecosistemas, fincas)
2. **Puntos/Marcadores**: Topónimos con coordenadas que abren modales al hacer click
3. **Ambos deben ser asociables a mapas específicos**
4. **Los datos deben ser editables por equipo de contenido** (no programadores)
5. **Los puntos deben poder cargarse desde el backend o desde archivos estáticos**

### 15.2 Estructura de Datos Propuesta

#### 15.2.1 Capas (Layers)

```typescript
// types/layer.ts
interface LayerDefinition {
  id: string                    // Único por capa (ej: 'rios', 'ecosistemas-humedos')
  mapId: string                 // Mapa al que pertenece (ej: 'chapter1-ecosistemas')
  name: string                  // Nombre visible (ej: 'Ríos principales')
  category: LayerCategory       // Categoría para agrupar en UI
  type: 'geojson' | 'image'    // Tipo: GeoJSON vectorial o imagen raster
  source: LayerSource           // Origen de datos
  style: LayerStyle             // Estilo visual
  visible: boolean              // Visible por defecto
  minZoom?: number              // Zoom mínimo para mostrar
  maxZoom?: number              // Zoom máximo para mostrar
}

type LayerCategory = 'ecosistemas' | 'rios' | 'infraestructura' | 'conflictos' | 'nodos' | 'territorio' | 'other'

interface LayerSource {
  type: 'static' | 'backend'   // De archivo estático o de API
  url?: string                  // URL del GeoJSON (estático o endpoint)
  geoJSON?: GeoJSON             // GeoJSON inline (para datos pequeños)
  pgw?: PGWData                 // PGW específico para capas tipo 'image'
}

interface LayerStyle {
  color: string                 // Color principal
  opacity: number               // Opacidad (0-1)
  fillColor?: string            // Color de relleno (polígonos)
  fillOpacity?: number          // Opacidad de relleno
  lineWidth?: number            // Ancho de línea
  lineColor?: string            // Color de línea
  pointSize?: number            // Tamaño de punto
  pointImage?: string           // URL de imagen para marcador
}
```

#### 15.2.2 Puntos (Points / Markers)

```typescript
// types/point.ts
interface PointDefinition {
  id: string                    // Único global (ej: 'toponimo-cali')
  mapId: string                 // Mapa al que pertenece
  name: string                  // Nombre visible
  lng: number                   // Longitud
  lat: number                   // Latitud
  type: PointType               // Tipo semántico
  category?: string             // Categoría para filtros
  icon?: string                 // URL del ícono
  size?: 'small' | 'medium' | 'large'
  modal?: PointModal            // Modal que abre al hacer click
  source: 'static' | 'backend'  // Origen
}

type PointType = 'ciudad' | 'rio' | 'montaña' | 'finca' | 'nodo' | 'humedal' | 'infraestructura' | 'other'

interface PointModal {
  title: string                 // Título del modal
  content: string               // Contenido HTML o markdown
  imageUrl?: string             // Imagen opcional
  videoUrl?: string             // Video opcional
  audioUrl?: string             // Audio opcional
  links?: { text: string, url: string }[]  // Links relacionados
}
```

### 15.3 Fuentes de Datos

#### Static (archivos locales)

Los datos se almacenan como archivos TS/JS en `src/data/`:

```
src/data/
├── maps/
│   ├── geo.js                  # PGW data (mapa base)
│   ├── configs.js              # Configs de mapa
│   ├── images.js               # URLs de imágenes
│   └── index.js
├── chapters/
│   └── chapters.js             # Jerarquía de capítulos
├── layers/
│   ├── index.ts                # Registro de todas las capas
│   ├── ecosistemas.ts          # Capas del Cap 1
│   ├── rio-cauca.ts            # Capas de Un Río Cauca
│   ├── territorio-suarez.ts    # Capas de Suárez
│   ├── territorio-cali.ts      # Capas de Cali
│   └── territorio-villa-rica.ts # Capas de Villa Rica
└── points/
    ├── index.ts                # Registro de todos los puntos
    ├── toponimos.ts            # Topónimos generales
    ├── nodos-cap4.ts           # Nodos del Cap 4
    └── fincas.ts               # Fincas (Cap 4)
```

#### Backend (API)

Para datos que deben ser editables sin re-deploy:

```
GET /api/v1/location/:mapId     → Retorna GeoJSON de capas para un mapa
GET /api/v1/points/:mapId       → Retorna puntos de interés para un mapa
GET /api/v1/modal/:mapId        → Retorna modales para un mapa
```

**Nota**: Si el backend actual no tiene estos endpoints, se crean nuevos.

### 15.4 Pipeline de Renderizado

```
1. useMap(mapId) hook:
   ├── getMapEntry(mapId) → { geo, images, config }
   ├── buildGeoreferencedMap() → MapLibre map
   └── setMapBuilt(true)

2. Cuando mapBuilt = true, cargar capas:
   ├── useLayers(mapId) hook:
   │   ├── getLayersByMap(mapId) → LayerDefinition[]
   │   ├── Para cada capa:
   │   │   ├── Si static: cargar GeoJSON local
   │   │   ├── Si backend: fetch /api/v1/location/:name
   │   │   └── map.addSource() + map.addLayer()
   │   └── layerStore gestiona visibilidad/opacidad
   │
   └── usePoints(mapId) hook:
       ├── getPointsByMap(mapId) → PointDefinition[]
       ├── Para cada punto:
       │   ├── Crear marker en coordenadas [lng, lat]
       │   └── Si tiene modal: agregar click handler
       └── uiStore gestiona apertura/cierre de modales

3. Modal system:
   └── Cuando usuario hace click en punto:
       ├── uiStore.openModal(point.modal)
       └── <Modal> se renderiza con title + content + image
```

### 15.5 Estrategia de Carga

1. **Carga perezosa**: Las capas y puntos se cargan SOLO cuando el mapa está construido (`mapBuilt = true`)
2. **Agrupación por mapa**: Cada mapa tiene su propio set de capas/puntos
3. **Caché**: Una vez cargados, se mantienen en memoria
4. **Backend como fallback**: Intentar estático primero, backend si no hay datos locales

### 15.6 Beneficios de esta Arquitectura

1. **Separación de concerns**: Datos (points/layers) separados del renderizado (MapLibre)
2. **Editabilidad**: Equipo de contenido edita archivos JS/JSON sin tocar React
3. **Escalabilidad**: Añadir nuevos mapas = añadir archivos de datos, no modificar componentes
4. **Rendimiento**: Solo se cargan datos del mapa activo
5. **Backend opcional**: Funciona 100% estático, pero permite actualizaciones vía API
6. **Tipado estricto**: TypeScript valida que cada punto tenga coordenadas válidas

---

## 16. REGLAS DEL PROYECTO (ACORDADAS)

### Reglas estrictas

1. **Solo se modifica `atlas/`**. No tocar `atlas_front/`, `atlas_3.0/`, `atlas_backend/`, `atlas_frontend_v17/`.
2. **No hay nada nuevo**. Todo el contenido ya existe en v17. Es migración, no invención.
3. **Frontend monolítico, backend independiente**. El frontend NUNCA depende del backend.
4. **PGW en `geo.js` son los originales rotados** (A=0, E=0). No se convierten. MapLibre con `bearing: -90` maneja la rotación.
5. **Datos de contenido (modales, galerías, audio)**: extraer de los bundles/source de v17.
6. **GeoJSON de capas**: del backend (`GET /api/v1/location/:name`) o de archivos estáticos locales.
7. **Assets**: copiar de `atlas_front/atlas_frontend_v17/dist/assets/`.

### Fuentes de datos

| Dato | Fuente |
|------|--------|
| PGW (rotados originales) | Proporcionados por el usuario → `atlas/src/data/maps/geo.js` |
| URLs de imágenes | `atlas_front/atlas_frontend_v17/src/data/mapImages/geoMapping.js` |
| Configs de mapa | `atlas_front/atlas_frontend_v17/src/data/mapImages/mapConfig.js` |
| Jerarquía de capítulos | `atlas_front/atlas_frontend_v17/src/data/` |
| Modales (texto) | Source v17 `components/InfoModal/` layouts Luyaut1/Luyaut2 |
| Galerías Cap 2 | Source v17 `components/GaleriaChapter2/` |
| Audio | `dist/assets/audiosChapters/` (2 MP3) |
| Iconos Cap 4 | `dist/assets/iconsCap4/` (73 archivos) |
| Capas SVG Cap 2 | `dist/assets/mapasMenuCap2/` (63 archivos) |
| Capas ecosistemas | `dist/assets/img/Capas/ecosistemas/` (38 archivos) |
| Capas río Cauca | `dist/assets/img/CapasUnriocauca/` (22 archivos) |
| GeoJSON vectorial | Backend `GET /api/v1/location/:name` |
| Assets UI | `dist/assets/interface/`, `dist/assets/svg/` |
| Assets visuales | `dist/assets/img/` (fondos, logos, perfiles, talleres, entramados) |
