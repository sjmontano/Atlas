# BITACORA — Atlas Pluriversal

> Cronología histórica del proyecto, consolidada de atlas_3.0/docs/bitacora.md, TAREAS.md, DEBUG_FIXES_2026-04.md, e INVESTIGACION_ROTACION_TILES_MAPLIBRE.md.

---

## Timeline General

| Fecha | Hito | Fuente |
|-------|------|--------|
| 2026-02-21 | Investigación rotación sincronizada imagen base + tiles MapLibre | INVESTIGACION_ROTACION_TILES_MAPLIBRE.md |
| 2026-04 (early) | Debug fixes: lint, tests, chunk size warning, dependencias no usadas | DEBUG_FIXES_2026-04.md |
| 2026-04-13 | Interacciones 1-14: georreferenciación, bounds runtime, validación cuantitativa | bitacora.md (3.0) |
| 2026-04-14 | Interacciones 15-16: viewportMaxBounds con zoom, fix bearing-aware clamp ❌ DESCARTADA | bitacora.md (3.0) |
| 2026-04-15 | Interacción 17: setTransformConstrain elegido como solución clamping | bitacora.md (3.0) |
| 2026-05-16 | Interacciones 18-26: Migración v17 ← 3.0 (PGW, bounds, transformConstrain, zoom) | bitacora.md (3.0) |
| 2026-06-26 | Interacciones 27-30: Dimensiones Cloudinary reales, calibración Capítulo 1 definitiva | bitacora.md (3.0) |
| 2026-07-03 | Interacciones 31-33: PGW sub-capas raster transformadas, popup, calibración unRioCauca | bitacora.md (3.0) |
| 2026-07-15 | Interacción 34: Masivo PGW Ch2-4 transformado a estándar, 31 mapas configurados | bitacora.md (3.0) |
| — | Tarea 0: Auditoría 3 versiones (backend, atlas_3.0, v17) | TAREAS.md |
| — | Tarea 1: Definición de arquitectura y planificación (PLAN_ATLAS.md) | TAREAS.md |
| — | Tarea 2: Setup proyecto base Vite + React 19 + TypeScript + Zustand 5 | TAREAS.md |
| — | Tarea 3: Servicios core geo (BoundsCalculator, TransformConstrain, MapLogger) + tests | TAREAS.md |
| — | Tarea 4: Corrección hallazgos — v17 SÍ tiene source, clarificación PGW rotado vs estándar | TAREAS.md |
| — | Instalación 18 skills (autoskills + ui-ux-pro-max) en atlas/.opencode/skills/ | MEMORIA_TECNICA.md |
| — | Creación basemap dev tool: MapControls, BasemapManager, uiStore, MapRenderer blank style | MANUAL_TECNICO.md |
| — | Creación MEMORIA_TECNICA.md, PLAN_ATLAS.md, GLOSARIO.md, MANUAL_TECNICO.md, GUIDE.md | — |
| — | Build `pnpm build` pasando sin errores | — |

---

## Atlas 3.0 — Bitácora Original (34 Interacciones)

### Interacciones 1-14: Georreferenciación y Bounds Runtime (2026-04-13)

**Problema raíz:** Desalineación entre bounds PGW y bounds hardcodeados de tiles con bearing -90.

| # | Qué se hizo | Archivos | Resultado |
|---|-------------|----------|-----------|
| 1 | Diagnóstico inicial: discrepancia bounds PGW vs tiles | Ninguno (análisis) | Causa: semántica de bounds no alineada entre app y pipeline tiles |
| 2 | Estrategia configurable: configured/derived/auto con fallback delta | Ninguno (diseño) | Roadmap por fases aprobado |
| 3 | Contrato runtime tiles: tipos RuntimeTilesBoundsStrategy, deriveTilesBoundsFromPgw, resolveRuntimeBounds | `mapSettings.ts` | Decisión centralizada de bounds en API única |
| 4 | Orquestación en hook: resolvedor central, imagePixels, memo zoom, bounds precomputado | `useAtlasMap.ts` | Duplicación reducida, mismo criterio init/render |
| 5 | Integración renderer: reuso bounds precomputados, logging source/strategy/delta | `MapRenderer.ts` | Coherencia hook-renderer |
| 6 | Consolidación PGW: modelo afín, half-pixel, trazas detalladas | `BoundsCalculator.ts`, `useMapBounds.ts` | Base geométrica canónica |
| 7 | Normalización logging: console.* → logger, dedupe zoom/opacidad, epsilon | `useMapZoom.ts`, `LayerManager.ts`, `MapLibreAdapter.ts` | Consola útil sin spam |
| 8 | Validación con trazas reales: source tiles-config → tiles-derived tras ajuste | `mapSettings.ts` | Delta casi cero |
| 9 | Verificación técnica: lint sin errores en archivos clave | — | Validación OK |
| 10 | Plan Fase B: extender auto a chapter1, generalizar resolvedor, agregar tests | — | Plan listo |
| 11 | Estado entorno: cambios externos detectados en MapRenderer, useAtlasMap | — | Precaución antes de editar |
| 12 | Fase B implementada: auto en chapter1 con tiles, resolvedor generalizado, eliminar recalc renderer, tests resolveRuntimeBounds | `mapSettings.ts`, `useAtlasMap.ts`, `MapRenderer.ts`, `BoundsCalculator.ts`, `mapSettings.test.ts` | ESLint OK, Vitest 4/4 |
| 13 | Endurecimiento: métricas px, umbral intro (mean ≤0.5, max ≤1.0), aserción fallback chapter1, integración renderer mock, maxBounds tested | `mapSettings.test.ts`, `MapRenderer.runtime.test.ts`, `useAtlasMap.ts`, `useAtlasMap.runtime.test.ts`, `test/setup.ts` | Vitest 11/11 |
| 14 | Actualización antes-y-skills.md | `bitacora.md`, `antes-y-skills.md` | Skills documentados |

### Interacciones 15-16: ViewportMaxBounds + Bearing-Aware Clamp (2026-04-14)

| # | Qué se hizo | Archivos | Resultado |
|---|-------------|----------|-----------|
| 15 | Diagnóstico: setMaxBounds bearing-blind — LON clampeado con WIDTH (muy laxo), usuario sale arriba/abajo al zoom in. tilesConfig.bounds south=-0.02 es intencional (si south=6.202, MapLibre no pide tiles para lat < 6.202 → mitad izquierda sin tiles) | Ninguno (análisis) | Bug diagnosticado |
| 16 | Fix: installBearingAwareClamp() — desactiva setMaxBounds nativo, listener 'move' con unproject() 4 bordes canvas, setCenter() correctivo | `useAtlasMap.ts`, `mapSettings.ts`, `mapSettings.test.ts` | ❌ **DESCARTADA**: setCenter() dentro de 'move' crea loop feedback → jitter, zoom trabado, cámara errática. Tests 11/11 pasan pero navegador inútil |

### Interacción 17: Elección setTransformConstrain (2026-04-15)

Estrategias evaluadas para clamping con bearing=-90:

| Estrategia | Veredicto | Razón |
|------------|-----------|-------|
| setMaxBounds nativo | ❌ | Bearing-blind, ejes intercambiados |
| move + setCenter con unproject | ❌ | Loop feedback → jitter intrínseco |
| Imagen pre-rotada + bearing=0 | ✅ Viable (costosa) | Elimina problema raíz pero requiere regenerar tileset |
| **setTransformConstrain (MapLibre 3+)** | ✅ **CANDIDATA PRINCIPAL** | Pre-render, sin artifacts, bearing-aware. Disponible en v5.17.0 |
| moveend + easeTo snap-back | ⚠️ Alternativa suave | Snap visible pero sin jitter |
| minZoom forzado | ⚠️ Limitada | Restringe zoom in, no resuelve problema general |

**Decisión:** setTransformConstrain. Alerta: constraint opera sobre centro, no viewport. Requiere compensación half-extent viewport al zoom actual.

### Interacciones 18-26: Migración v17 ← 3.0 (2026-05-16)

| # | Qué se hizo | Archivos | Resultado |
|---|-------------|----------|-----------|
| 18 | Diagnóstico PGW half-pixel: V17 no tiene corrección half-pixel en getGeoCornersFromPGW | `boundsCalculator.js` | Half-pixel agregado |
| 19 | Debug opacity + street view: debugMapOpacity, OSM basemap toggle | `mapConfig.js`, `BaseMapImage.jsx`, `MapComponent.jsx`, `useMap.js` | Verificación visual |
| 20 | Remoción hasPgwRotation y mirrors forzados: bearing=-90 respetado, sin mirror | `geoUtils.js` | OSM + atlas alineados |
| 21 | Transformación PGW intro: rotado→estándar (A=B_old, E=-D_old, F calibrado 12.879) | `pgwData.js`, `mapConfig.js` | Imagen alineada |
| 22 | Bounds configurables: boundsPadding por lado (top/bottom/left/right) | `BaseMapImage.jsx`, `mapConfig.js`, `MapComponent.jsx` | Control fino navegable |
| 23 | Simplificación zoom: eliminado containZoom/coverZoom/centerOnZoomOut | `BaseMapImage.jsx` | Zoom controlado solo por mapConfig |
| 24 | setTransformConstrain implementado: port desde Atlas 3.0 a V17 | `useMap.js`, `mapConfig.js`, `BaseMapImage.jsx` | Constrain bearing-aware |
| 25 | Bug: setTransformConstrain no disponible en maplibre-gl@5.1.0. Fix: npm install maplibre-gl@^5.17.0 → v5.24.0, eliminar CDN v2.4.0 de index.html | `index.html`, `package.json` | Constrain funcional |
| 26 | Verificación: bounds funcionando con boundsPadding, constrain activo | — | ✅ Estable |

### Interacciones 27-30: Calibración Capítulo 1 Definitiva (2026-06-26)

| # | Qué se hizo | Archivos | Resultado |
|---|-------------|----------|-----------|
| 27 | Dimensiones Cloudinary reales vía fl_getinfo: 7 imágenes medidas | — | Base para bounds reales |
| 28 | Cómputo bounds reales + viewportMaxBounds por mapa | `mapConfig.js`, `pgwData.js` | viewportMaxBounds actualizados |
| 29 | Calibración visual fomasDelPaisaje: F 7.117→12.647 (norte) | `pgwData.js` | Imagen centrada |
| 30 | Consolidación Cap 1: 2 grupos (gran cobertura A≈0.001-0.002, detalle A≈0.0002-0.0005), 3 variantes VMB (marco completo/ancho/ajustado), F cluster (12.6-12.9 / 6.3-6.9 / 3.7) | `pgwData.js`, `mapConfig.js` | ✅ **DEFINITIVO: 7 mapas Cap 1 OK** |

### Interacciones 31-33: PGW Sub-capas Raster, Popup, unRioCauca (2026-07-03)

| # | Qué se hizo | Archivos | Resultado |
|---|-------------|----------|-----------|
| 31 | Transformación ~54 sub-capas rotado→estándar (A=D_old, E=-B_old, F=F_old+B×W). agregarRasterTiles.jsx ahora usa imageCoordinates (affine-transformadas) | `pgwData.js`, `agregarRasterTiles.jsx` | Sub-capas alineadas |
| 32 | Calibración C/F sub-capas por grupo: ecosistemas (29 capas, rangoEcosistemas=2.03, F_base=5.495+0.000217454×rango×1462), tejidosDelAgua (18, rango=2, F_base=3.452+0.000083191×rango×1462), unRioCauca (7, A/E reducidos 95.7%, C=-79.25795, F=12.11141) | `pgwData.js` | ~54 sub-capas calibradas |
| 33 | Popup encuadre: coordinates [-67.14,1.69] → [-76.0,5.0]. unRioCauca base: PGW calibrado C=-79.45795, F=12.71141. Sub-capas unificadas | `namesEncuadres.js`, `pgwData.js`, `mapConfig.js` | Popup visible, mapa alineado |

### Interacción 34: Masivo PGW Ch2-4 (2026-07-15)

| # | Qué se hizo | Archivos | Resultado |
|---|-------------|----------|-----------|
| 34 | ~31 mapas transformados rotado→estándar, bearing=-90 unificado, viewportMaxBounds por mapa. Cap 4 zoom extremo (17.4-18.4, bounds ±0.003-0.005°). PGW mixto convertido con misma fórmula | `pgwData.js`, `mapConfig.js` | ✅ 31 mapas configurados |
| — | **Riesgos**: MVillaRica F con W=3508 (medium, no high-res). humedalesCap3 vs humedalesCapa1970: mismas PGW, dimensiones 2559 vs 5118 → F distintos (3.57 vs 4.21). viewportMaxBounds requieren calibración visual | — | Pendiente |

---

## Debug Fixes — 2026-04 (atlas_3.0)

| Fix | Problema | Cambio |
|-----|----------|--------|
| 1 | Dependencias no usadas: framer-motion, @turf/turf, @types/react-router-dom, @types/maplibre-gl | `npm uninstall` |
| 2 | Test hidratación layersStore fallaba | Ajuste storage key y seed antes de import |
| 3 | Lint errors: refs en render, any explicitos, hooks deps, side effects en ternarios, setState en useEffect | 9 archivos corregidos |
| 4 | Chunk size warning vendor-maplibre | `vite.config.ts`: chunkSizeWarningLimit ajustado |
| — | **Validación final** | lint OK, test OK, build OK |

---

## Investigación Rotación Tiles MapLibre (2026-02-21)

**Problema:** Implementar sistema híbrido imagen base (baja res) + raster tiles (alta res) + rotación sincronizada + bounds funcionales.

**Hallazgos clave:**
- MapLibre bearing rota TODO (ImageSource, RasterTileSource, vectorial) con matriz WebGL unificada — sincronización automática GPU
- setMaxBounds es bearing-blind (axis-aligned siempre)
- Turf.js para rotar imagen crea sistema coordenadas dual que no existe en tiles pregenerados
- Solución correcta: bearing nativo + transformConstrain (no Turf.js para rotar)

**Stack propuesto:** MapLibre GL JS v2.3+ (bearing + transformConstrain) + Turf.js (solo validación geométrica) + GDAL (generación tiles sin rotación física)

**Lección:** Turf.js NO para transformar coordenadas de render, SÍ para validación espacial.

---

## Tareas del Proyecto Actual (TAREAS.md)

### Tarea 0 — Auditoría 3 Versiones

| Versión | Archivos | Hallazgo principal | Sentencia |
|---------|----------|--------------------|-----------|
| atlas_backend | 19 fuente | Credenciales expuestas, bug ruta uploads, informe.md inexacto | **Innecesario, todo estático** |
| atlas_3.0 | 177 fuente + 17 docs + 34 interacciones | Georreferenciación incorrecta (3 variantes test), bredunco F sin corregir, código duplicado, entry points duplicados | **Solo mapas útiles** |
| v17 | dist/ (12 bundles, 6 CSS, 304 assets, ~90 MB) | 31 mapas, 30 capas GeoJSON, 2 MP3, 73 iconos, 63 SVG | **Cantera de contenido** |

**Entregable:** MEMORIA_TECNICA.md (~1500 líneas): 38 lecciones, investigación setTransformConstrain (issues #4510, #4591, #6484), stack óptimo v6.

### Tarea 1 — Arquitectura y Planificación

| Decisión | Valor |
|----------|-------|
| Stack | pnpm + Vite + React 19 + TypeScript strict + MapLibre GL 6 + Zustand 5 + React Router 7 + Framer Motion + CSS Modules |
| Estructura | Plana: data/ services/ stores/ hooks/ components/ pages/ types/ styles/ utils/ |
| Regla híbrida | Datos en .js + .d.ts al lado (allowJs, checkJs false) |
| PGW | Rotado original como verdad, bearing -90 nativo, setTransformConstrain (nunca setMaxBounds) |
| Carga progresiva | 3 etapas: placeholder 512px → media Cloudinary → tiles XYZ |
| Viewport clamp | createBearingAwareConstrain() propio (no maplibre-xy) |

**Entregable:** PLAN_ATLAS.md (9 fases).

### Tarea 2 — Setup Proyecto Base

| Componente | Detalle |
|------------|---------|
| Template | `pnpm create vite atlas --template react-ts` |
| Dependencias | maplibre-gl@6.0.0, react@19, react-router-dom@7, zustand@5, framer-motion@12 |
| Dev | vitest, jsdom, @testing-library |
| TS config | strict + noUncheckedIndexedAccess + allowJs + paths |
| Vite config | alias + manualChunks (vendor-maplibre, vendor-react, vendor-zustand) |
| Datos iniciales | pgw.js (7 mapas Cap 1), images.js, configs.js, chapters.js (4 capítulos, 31 mapas) |
| Stores | mapStore, chapterStore, layerStore, uiStore |
| Páginas | DevMenu (grid 31 mapas), TestMapPage (/test/:mapId + prev/next) |
| **Validación** | `pnpm typecheck` ✓, `pnpm build` ✓ (710ms) |

### Tarea 3 — Servicios Core Georreferenciación

**Reorganización datos:**
- `geo.js` — MAP_GEO: { pgw, width, height } por mapa. Dimensiones portrait originales (Cloudinary fl_getinfo)
- `images.js` — URLs Cloudinary + placeholder (w_512,q_30,f_webp)
- `configs.js` — zoom/bearing/interacción por mapa

**BoundsCalculator.ts:**
- Transformación afín World File: `lng = A·col + B·row + C, lat = D·col + E·row + F`
- Half-pixel correction: `x0 = C − 0.5·A − 0.5·B, y0 = F − 0.5·D − 0.5·E`
- Fórmula genérica: funciona con PGW rotado SIN conversión
- API: calculateImageCoordinates, calculateGeographicBounds, calculateCenter, validateBounds, processBounds

**TransformConstrain.ts:**
- Port de createBearingAwareConstrain() desde Atlas 3.0 useAtlasMap.ts:100-183
- Paso A: minZoom bearing-aware (dpp = 360/(512·2^z), con bearing ±90° W cubre latSpan, H cubre lonSpan)
- Paso B: clamp zoom antes de calcular dpp
- Paso C: clamp centro restando half-extent viewport según bearing. Si span < viewport, centra
- Guardrail: lat ∈ [−89.9, 89.9], lng ∈ [−179.9, 179.9]

**MapLogger.ts:** Logger por entorno, categorías por servicio.

**Tests:** BoundsCalculator.test.ts (esquinas intro vs valores calculados a mano), TransformConstrain.test.ts (clamp centro, minZoom).

### Tarea 4 — Corrección Hallazgos v17 Source + PGW Clarification

**Descubrimiento:** v17 SÍ tiene source en `atlas_front/atlas_frontend_v17/src/` (App.jsx, InfoModal, AudioPlayer, GaleriaChapter2, Capas, Iconos, Entramados, pgwData.js, geoMapping.js, mapConfig.js).

**PGW clarification:**
- `v17/src/data/mapImages/pgwData.js` → formato **estándar convertido** (A≠0, E≠0, B=0, D=0)
- `atlas/src/data/maps/geo.js` → formato **rotado original** (A=0, E=0, D≠0, B≠0)
- **Regla:** NO usar pgwData.js de v17. Usar geo.js de atlas/. bearing: -90 de MapLibre maneja rotación.

**Archivos modificados:** MEMORIA_TECNICA.md, PLAN_ATLAS.md, TAREAS.md. Creado GUIDE.md.

**Pendientes extracción v17:** Modales (InfoModal layouts Luyaut1/Luyaut2), AudioPlayer, Galerías Cap 2, Iconos Cap 4, Entramados, GeoJSON capas backend, assets.

### Tarea 9 — Rotación de la imagen atlas en `chapter4-problematicas` (solo datos)

Había un mapa (`chapter4-problematicas`) cuya imagen atlas necesitaba rotarse para quedar en vertical; el basemap se deja en **−30°**. La rotación correcta es **no ortogonal** (≈ −30°, ni 0 ni −90). Resuelto con datos: `configs.js` → `initialBearing: -30`; `geo.js` → PGW con A≠0/B≠0/D≠0/E≠0 (`[1.194087e-6, -2.068220e-6, -2.068153e-6, -1.194048e-6, -76.485574, 3.436552]`). Regla: NO dejar A≈0/E≈0 o `processBounds` auto-convierte y borra la rotación. Commit `8761dce`.

### Tarea 10 — Panel de calibración compatible con mapas rotados

El panel (dev) rompía los mapas con rotación real: `stateToPGW` forzaba `[0,d,b,0,c,f]` (borraba A/E) y `clampCalibration` clampeaba D/B negativos a `1e-12` → polígono degenerado → crash `z=35` de MapLibre v6. Fix: `CalibrationState` con `a`/`e` (round-trip de 6 coeficientes), `clampScale` con signo, guard `isNonDegenerate` en `updateBounds` (omite `setCoordinates` si span < 2⁻²⁵), y `destroy()` remueve layers antes que sources. 39 tests ✓. Commit `2963e1c`.

---

## Instalación Skills (autoskills + ui-ux-pro-max)

18 skills instaladas en `atlas/.opencode/skills/`:
- **autoskills (11):** accessibility, composition-patterns, frontend-design, nodejs-backend-patterns, nodejs-best-practices, oxlint, react-best-practices, seo, typescript-advanced-types, vite, vitest
- **ui-ux-pro-max (7):** banner-design, brand, design, design-system, slides, ui-styling, ui-ux-pro-max

---

## Basemap Dev Tool

| Componente | Archivo | Función |
|------------|---------|---------|
| uiStore | `src/stores/uiStore.js` | basemapVisible, basemapStyle, imageOpacity + setters |
| BasemapManager | `src/services/BasemapManager.ts` | add/remove/setImageOpacity |
| MapControls | `src/components/map/MapControls.tsx` + CSS | Toolbar dev: toggle 🌐, 3 estilos (Light/Streets/Satellite), slider opacidad |
| AtlasMap | `src/components/map/AtlasMap.tsx` | UseEffects conectan store → BasemapManager |
| Env flags | `.env.development` (VITE_DEV_TOOLS=true), `.env.production` | Solo en dev |

---

## Documentación Creada

| Documento | Contenido |
|-----------|-----------|
| MEMORIA_TECNICA.md | Análisis profundo 3 versiones, 38 lecciones, stack óptimo |
| PLAN_ATLAS.md | 9 fases de implementación, decisiones arquitectura |
| GLOSARIO.md | Terminología técnica formal, 3 capas renderizado, tabla proveedores basemap |
| MANUAL_TECNICO.md | Arquitectura completa, PGW a fondo con ejemplo resuelto, bearing -90, notas vivas |
| GUIDE.md | Guía rápida localización archivos |
| TAREAS.md | Historial técnico tareas 0-10 (bitácora técnica por tarea) |
| BITACORA.md | Este documento — cronología consolidada |

---

---

## Investigación Profunda: Rotación en los 3 Proyectos (2026-07-30)

### Contexto
Se investigó a fondo cómo cada proyecto (atlas_3.0, v17, atlas/) maneja la rotación de mapas. Se leyeron todos los archivos relevantes: MapRenderer, useAtlasMap/useMap, mapConfig, pgwData/geo.js, BoundsCalculator, TransformConstrain.

### Hallazgo crítico: PGW rotado vs convertido

| Proyecto | Formato PGW | rotateImageCoordinates | setMaxBounds |
|----------|-------------|----------------------|--------------|
| **atlas_3.0** | Convertido estándar (A≠0, E≠0, B=0, D=0) | **Sí** — rota coordenadas de ImageSource para alinearse con bearing -90 | Fallback en ~3 mapas sin constrain |
| **v17** | Convertido estándar (A≠0, E≠0, B=0, D=0) | **No** — bearing -90 provee rotación visual | Red de seguridad con boundsPadding manual |
| **atlas/** | **Rotado original** (A=0, E=0, B≠0, D≠0) | **No** — el PGW rotado ya produce la geometría correcta para bearing -90 | **No se usa** |

**Implicación**: atlas_3.0 y v17 hicieron una conversión 90° horaria del PGW (`A_new=D_old, E_new=-B_old, F_new=F_old+B_old×W`), mientras atlas/ conserva el PGW tal como salió del GeoTIFF. Esto hace que:
- En atlas_3.0 las coordenadas de ImageSource sean un rectángulo north-up, y para que coincida con bearing -90 aplican `rotateImageCoordinates()`
- En v17 igual pero sin `rotateImageCoordinates()` — confían en que bearing -90 rota visualmente
- En atlas/ el PGW rotado ya produce coordenadas con ejes cruzados (ancho=latitud), y bearing -90 completa la alineación sin rotación adicional de coordenadas

### Hallazgo: TransformConstrain es idéntico en los 3

La función `createBearingAwareConstrain()` tiene la **misma lógica** en los 3 proyectos:
- Normalizar bearing, detectar cuarto de vuelta (90/270)
- minZoom bearing-aware: con ±90° usa W para latSpan y H para lonSpan
- Clamp centro con half-extent intercambiado según bearing
- Guardrail lat/lng

**Ubicación:**
- atlas_3.0: `src/domains/map/hooks/useAtlasMap.ts:100-183`
- v17: `src/Hooks/useMap.js:15-86`
- atlas/: `src/services/TransformConstrain.ts:34-117`

### Hallazgo: setMaxBounds solo en 2 de 3

- **atlas_3.0**: Solo en ~3 mapas sin `useTransformConstrain`. En los 28 restantes no se usa.
- **v17**: Siempre activo como "red de seguridad", con `boundsPadding` manual por mapa. Con bearing -90: top=east, bottom=west, left=north, right=south. Valores típicos: `{ top: -0.25, bottom: -0.25, left: 0.35, right: 0.35 }`.
- **atlas/**: No se usa `setMaxBounds` en ningún punto del pipeline. `transformConstrain` es la única restricción.

### Hallazgo: Turf.js no se usa en ningún proyecto

En los 3 proyectos se barajó Turf.js como posible solución de rotación (documentado en INVESTIGACION_ROTACION_TILES_MAPLIBRE.md), pero ninguno lo implementó. La arquitectura final usa bearing nativo + TransformConstrain sin Turf.js.

### Documentación actualizada

Los hallazgos quedaron documentados en:
- `MANUAL_TECNICO.md §9` — sección completa reescrita con tabla comparativa, explicación PGW, lógica TransformConstrain, setMaxBounds, boundsPadding, resumen estrategia
- `GUIDE.md` — tabla de rotación añadida en secciones de cada proyecto
- `INVESTIGACION.md §1-2` — ya cubría hallazgos de rotación y clamping
- Este documento — entrada cronológica

---

## Rotación −30° en `chapter4-problematicas` + panel compatible con rotación (2026-08-04)

### Contexto

Durante la revisión del Capítulo 4 apareció un mapa con una particularidad: **`chapter4-problematicas`** no se alineaba con bearing 0 ni con bearing −90 (ortogonales). Su imagen atlas trae una **rotación real de ≈ −30°** embebida en el PGW. Había que rotar la **imagen atlas** (no el basemap) para dejarla en vertical, con el basemap en −30°.

### Qué se hizo

1. **Solo datos** (TAREA 9): `configs.js` → `initialBearing: -30`; `geo.js` → PGW rotado con A≠0, B≠0, D≠0, E≠0. La imagen quedó vertical y el mapa quedó bien.
2. **Fix del panel dev** (TAREA 10): al abrir el panel, la rotación se borraba (el estado forzaba A=0/E=0) y al Reset los valores saltaban a `1e-12` (clamp solo-positivos sobre coeficientes negativos) → las 4 esquinas colapsaban → **crash `z=35`** de MapLibre v6. Se arregló preservando A/E en el estado, clamp con signo y un guard anti-degenerado en `updateBounds`; además se corrigió el orden layers→sources en `destroy()`.

### Resultado

- Mapa `chapter4-problematicas` vertical y correcto en producción (sin panel).
- Panel de calibración usable con mapas rotados en dev, sin crash.
- Verificación: 39 tests ✓ · lint ✓ · typecheck ✓ · build ✓.
- Commits en `atlas-upgrade`: `8761dce` (datos) y `2963e1c` (panel).

## Fix URLs 404 de `chapter2-m-villa-rica` (2026-08-04)

### Contexto

`chapter2-m-villa-rica` mostraba el mapa en blanco: las dos URLs de Cloudinary (base `qpexepxajsjxqrzff2bq` y full `hrqmjq5rgv9a23jrqaaj`) devolvían **404 en todos los formatos** (webp/png/jpg/avif y sin versión). Los IDs solo aparecían en `images.js` (introducidos en `a88a45f`, nunca verificados) y el artwork no existe en local ni en los proyectos viejos (3.0/v17). De las 55 URLs del archivo, solo estas 2 fallaban.

### Qué se hizo

Solo datos: se corrigieron los public_ids en `images.js` con las URLs correctas provistas desde Cloudinary:

- `base` → `pabcndrbg0gjx29iuccg` (v1759612261)
- `full` (high) → `knk721fgkqtvdxnppxzr` (v1767891949)
- `placeholder` = `ph(base)` → 200 ✓

El asset `medium` (`eljwekp0priwrtqsdhqv`) queda disponible en Cloudinary pero sin usar: `base` cubre la carga inicial y `full` el upgrade a alta resolución.

### Resultado

- Sweep completo de las URLs de `images.js`: **53/53 → 200**.
- Commit `c060693` en `atlas-upgrade` (solo `images.js`).
- **Nota**: `geo.js`/`configs.js` tienen cambios locales sin commitear (re-calibración con comentarios `← calibrado`, dims de `chapter2-valle` 1874×3318→7015×12472, toggles `useTransformConstrain`, maxZoom de bosque-comestible 15→18) — pendientes de revisión del usuario.
- **Fase futura**: la generación de raster tiles requerirá subir el artwork original a Cloudinary/local.

---

## Fix `chapter2-m-suarez` — el mapa de síntesis de Suárez se subió a Cloudinary con la rotación equivocada (2026-08-05)

### Contexto

Encontramos que el mapa de síntesis de Suárez (`chapter2-m-suarez`) se subió a Cloudinary con la rotación equivocada: el asset quedó en marco vertical (1329×2362) con el contenido landscape girado 90° (los textos se leen verticales), y el PGW data original ubicaba el mapa ~0.43° al este de Suárez. En pantalla el mapa aparecía lejos de su zona geográfica y "acostado". (Lo subido a Cloudinary y el PGW inicial fueron configurados por el equipo en su momento; de aquí en adelante el trabajo es mío.)

### Qué se hizo

1. Al probar variantes de PGW en el panel de calibración, el mapa se desplazaba pero nunca rotaba visualmente. Diagnóstico:
   - El asset de Cloudinary estaba físicamente rotado 90° (el contenido landscape quedó girado dentro de un marco vertical). Ningún PGW podía enderezar la imagen sin un cuadrilátero rotado (formato mixto, B/D≠0), que además complicaría la futura generación de raster tiles. Lo correcto era recuperar el recurso original.
   - El PGW quedó en formato retrato-puro (A≈0, E≈0): `processBounds` lo auto-convierte a ejes alineados y la orientación en pantalla la define el bearing del mapa, no los coeficientes.
2. Busqué nuevamente el recurso original (sin rotar) y lo coloqué en el proyecto como `public/assets/maps/m-suarez.png` (9448×5314, ~7.8 MB). Cambié `images.js` para servirlo local (`/assets/maps/m-suarez.png`), dejando de depender del asset rotado de Cloudinary.
3. Recalibré el mapa (commits `bd26598` y `773bd54` en `atlas-upgrade`):
   - `geo.js` → `pgw: [0, -0.000079124151, -0.000079131596, 0, -76.32673887696231, 3.119152348416211]`, `width: 9448`, `height: 5314` (escala calibrada original ≈7.91e-5 °/px sobre la imagen 4×).
   - `configs.js` → `initialBearing: 180`.
   - Huella efectiva (tras auto-conversión + bearing 180): lng [−77.074, −76.327], lat [2.699, 3.119]; centro (−76.700, 2.909); span 0.748° × 0.421°. El PGW estándar resultante queda girado 180° (A<0, E>0) y el bearing 180 lo compensa → el mapa se muestra norte-arriba en la zona de Suárez.

### Resultado

- El mapa de síntesis de Suárez se muestra correctamente: contenido en orientación correcta (textos legibles) y en su zona geográfica.
- Precedente nuevo: assets locales bajo `public/assets/maps/` como alternativa cuando un asset de Cloudinary está mal orientado (y sirven de insumo para la futura fase de raster tiles).
- Verificación: typecheck ✓ · lint ✓ · 39 tests ✓ · build ✓.

---

## Organización de originales por capítulo + glosario de mapas (2026-08-05)

### Contexto

La comunidad nombra los mapas de varias formas según la fuente (app, GIS, Drive, v17), y los originales PNG de máxima calidad estaban dispersos. Para la futura fase de raster tiles (faceta 2) y para indexar las equivalencias, organicé los originales por capítulo y creé un glosario.

### Qué se hizo

1. Creadas carpetas `public/assets/maps/{intro,cap1,cap2,cap3,cap4}/` para alojar los PNG originales por capítulo.
2. Renombrados los originales (ya aportados por la comunidad) a nombres canónicos kebab-case: 30/31 archivos (cap1 ×6, cap2 ×7, cap3 ×6, cap4 ×11). Quedan 2 sin renombrar en `cap1/` (los dos «cuenca») por ambigüedad y `intro/` vacío.
3. `chapter2-m-suarez`: movido de `m-suarez.png` a `cap2/modelo-territorial-suarez.png` y `images.js` actualizado a `/assets/maps/cap2/modelo-territorial-suarez.png`.
4. Creado `GLOSARIO_MAPAS.md` (docs raíz) con el mapeo completo: nombre canónico ↔ nombre en la comunidad ↔ archivo original (enlace) ↔ ID interno de `geo.js`, usando como fuente de verdad los comentarios de `atlas_front/atlas_frontend_v17/src/data/mapImages/pgwData.js`.

### Hallazgo importante

Casi todos los originales son **16:9 / 19:9 (apaisados)**, mientras que los PGW y dimensiones de `geo.js` corresponden a imágenes verticales (retrato). Para tiles (y/o usar estos PNG como base) habrá que **georreferenciar/recalibrar** cada uno; los PGW actuales no calzan 1:1 con los 16:9.

### Pendiente de confirmación

- `chapter1-encuadres` sigue sin PNG (dims 3389×6684; sus URLs en `images.js` están vacías). Conseguir el original.
- Los 31 mapas restantes quedaron asignados y renombrados; se confirmó que «MODELO PACIFICO FIN.png» = modelo territorial del Oriente de Cali, «cuenca cauca sin etiquetas.png» = intro y «Mapa de la cuenca sin etquetas.png» = Bredunco.

---

## Tiles XYZ de alta resolución — piloto Cap 1 (2026-08-05)

### Contexto

Faceta 2: raster tiles XYZ (WebP) de alta resolución que se superponen a la imagen base. El proyecto usa `C:\Program Files\GDAL` (v3.12.1 con driver WEBP); no hay bindings Python (`osgeo`) ni `gdal2tiles.py` funcional, así que se escribió un tiler propio en Node que invoca los binarios CLI (`gdal_translate`/`gdalwarp`).

### Qué se hizo

1. **Pipeline validado manualmente** con el piloto `chapter1-ecosistemas`: imagen full de Cloudinary → `gdal_translate -a_ullr` (footprint processBounds, EPSG:4326) → `gdalwarp` a EPSG:3857 (Web Mercator) → tiles 256px `-projwin`/`-outsize` con `-of WEBP -co QUALITY=90`.
2. **`scripts/generate-tiles.mjs`**: tiler Node que replica `BoundsCalculator.processBounds` (footprint idéntico a la capa base ImageSource), deriva el rango de zoom desde `configs.js` (z6..z11) y extrae tiles XYZ. Config por mapa en `src/data/maps/tiles.js`. Comando: `pnpm tiles`.
3. **657 tiles generados** en `public/assets/maps/tiles/mapas/chapter1-ecosistemas/{z}/{x}/{y}.webp` (z6:2, z7:6, z8:12, z9:35, z10:126, z11:476; ~8.3MB).
4. **Estructura ordenada**: `tiles/mapas/{mapId}/…` para mapas base y `tiles/capas/{layerId}/…` (reservado) para futuras capas temáticas.
5. **Runtime** (`MapRenderer.ts`): `addTilesLayer()` agrega un source `raster` (urlTemplate, tileSize 256, min/maxzoom, bounds desde geo.js) + capa con fade-in de 300ms, al final del pipeline georreferenciado.
6. **Vite** (`vite.config.ts`): `tilesServePlugin` sirve `/assets/maps/tiles/*.webp` en dev con `Cache-Control: public, max-age=31536000, immutable` y devuelve 404 real si el tile no existe (sin HTML fallback).
7. **Config de mapas**: `MapEntry.tiles` (`MapTilesConfig | null`) en `index.js`/`index.d.ts`.
8. **Verificación**: typecheck ✓ · lint ✓ (solo warning pre-existente) · 39 tests ✓ · dev server sirve tile existente con 200+immutable y tile inexistente con 404.

### Notas

- **NO se versionan tiles en git** (`.gitignore` → `public/assets/maps/tiles`); se regeneran con `pnpm tiles`.
- El piloto usa la imagen full de Cloudinary (5846×10394) porque los originales PNG son apaisados y no calzan con los dims retrato de `geo.js`. Integrar originales como fuente de tiles = calibración por mapa (pendiente, ver GLOSARIO_MAPAS.md).
- Mapa con rotación (`chapter4-problematicas` −30°, `chapter4-bosque-comestible` 180°) necesitarán enderezado (north-up) antes de tiling.
- `chapter1-encuadres` sin original y sin URLs → único mapa sin zoom alto (no bloquea).

---

## Plan exhaustivo faceta 2 — tiles, estética, rendimiento, CDN, contingencias (2026-08-05)

### Contexto

El usuario pidió un análisis completo de la faceta de tiles (raster XYZ) para
dejar la estructura de mapas "muy sólida", considerando que el proyecto se usará
en zonas rurales con computadores de bajos recursos y conectividad mala (3G rural,
latencia 200-800ms, <5 Mbps).

### Qué se hizo

1. **Documento maestro:** [`FACETA_2_TILES_PLAN.md`](FACETA_2_TILES_PLAN.md)
   con 8 secciones cubriendo todas las facetas de los tiles.

2. **Análisis de fade-in/estética (§1):**
   - Diagnóstico del doble-fade (base + tiles ambos con `raster-fade-duration: 300`)
   - 4 soluciones evaluadas → recomendación: 0 en base, 300 en tiles, cargar full antes de addTilesLayer
   - Análisis de seams/bordes, pop de imagen full, transición base→tiles

3. **Rendimiento en equipos rurales (§2-3):**
   - Perfil de máquina objetivo (Celeron/A4, 2-4GB RAM, GPU integrada)
   - Análisis de consumo: bundle ~1.2MB (gzip ~350KB), VRAM ~10-15MB, RAM JS ~30-50MB
   - Estrategias: `maxParallelImageRequests: 4`, Service Worker z6-z8, `lowPowerMode`
   - Análisis de cache: Cache-Control immutable, Service Worker, prefetch adyacente

4. **CDN/despliegue — 7 opciones evaluadas (§4):**
   - A: cPanel LiteSpeed (recomendado, fase 1)
   - C1: Cloudflare R2 (ideal, fase 2, egress gratuito + CDN LATAM)
   - E: Vercel (ya integrado, dev/transición)
   - Descartadas: S3+CloudFront (overkill), GitHub (sin CDN real), TileServer (overkill), Cloudinary (no diseñado para XYZ), BunnyCDN (menos PoPs en COL)

5. **Contingencias (§5):** tiles lentos, CDN caído, no WebGL, GPU crash,
   tiles desalineados, plan de recuperación (regeneración)

6. **Guía de regeneración (§6):** comandos, pipeline GDAL, tiempos estimados,
   cómo agregar un mapa nuevo

7. **Decisiones descartadas con justificación (§8):** gdal2tiles.py, TileServer,
   S3+CloudFront, GitHub CDN, PNG vs WebP, 512px tiles, MBTiles, etc.

8. **Referencias actualizadas:** TAREAS.md (TAREA 11), PLAN_ATLAS.md (Fase 8 detallada)

### Ejecución pasos 1-3 del roadmap (2026-08-05)

El usuario aprobó ejecutar los 3 primeros pasos del roadmap del plan faceta 2.

1. **Pulir fade-in (§1):**
   - `MapRenderer.ts`: `raster-fade-duration: 0` en la capa base (`atlas-base-image-layer`) — ya no hay doble-fade con la capa de tiles (que conserva `300`).
   - Pipeline reordenado: `buildGeoreferencedMap` ahora **espera** (`await preloadImage`) la imagen full y la actualiza en el ImageSource **antes** de llamar `addTilesLayer`. Antes era fire-and-forget: los tiles se agregaban sobre el placeholder y la full aparecía después (pop bajo tiles). Degradación elegante si full falla (continúa con placeholder).

2. **Rendimiento bajo (§2.3.1):**
   - `config.MAX_PARALLEL_IMAGE_REQUESTS = 4` (antes el default de MapLibre de 16). En v6 la API cambió: `setMaxParallelImageRequests()` fue reemplazada por la constante global `config` (exportada como `maplibregl.config`). Limita descargas/decodificaciones WebP simultáneas → menos picos de CPU y red 3G.

3. **QUALITY 90→95 + regeneración (§6):**
   - `generate-tiles.mjs`: `-co QUALITY=95`.
   - Regeneración completa con `pnpm tiles chapter1-ecosistemas --force`: 657 tiles, **10.51 MB** total (vs 8.3 MB a Q90, +26%), promedio 16.4 KB/tile. Distribución intacta (z6:2, z7:6, z8:12, z9:35, z10:126, z11:476). Tiles válidos 256×256 WebP (verificado con gdalinfo).

4. **Verificación:** `pnpm typecheck` ✓ · `pnpm lint` ✓ (solo warning pre-existente) · `pnpm test` 39/39 ✓ · dev server: tile existente 200 + `Cache-Control: immutable`, tile inexistente 404 real.

> **Nota API v6:** el método `setMaxParallelImageRequests()` no existe en maplibre-gl v6 (error TS2339). Equivalente: `config.MAX_PARALLEL_IMAGE_REQUESTS = N` con `import * as maplibregl` → `maplibregl.config`.

### Diagnóstico doble-build StrictMode + logging nivel Z (2026-08-05)

Al validar en el navegador aparecieron 2 síntomas: (a) "Mapa construido" **duplicado**
en consola, (b) decenas de `Uncaught (in promise) Error: A listener indicated an
asynchronous response by returning true, but the message channel closed before a
response was received`.

**Causa raíz:** `StrictMode` en dev (src/main.tsx) monta → desmonta → remonta el
effect. El cambio de "paso 1-3" hizo `buildGeoreferencedMap` **asíncrono de verdad**
(`await preloadImage(full)` antes de `addTilesLayer`). El `.then` que aplica el
resultado al estado se ejecutaba para ambas builds, la primera setteando estados
que la segunda sobreescribía.

**Fix (contador de generación):** `useMap` usa un contador `buildGen` (ref) que se
incrementa cada vez que el effect se ejecuta. Cada build captura su número de
generación en una variable local. Al resolver, el `.then` solo aplica el resultado
si `buildGen === buildGenRef.current` (es decir, si esta build es la más reciente).
Si no coincide (build descartada por StrictMode o cambio de mapId durante carga),
se llama `result.destroy()` y se retorna en silencio. Este enfoque es más simple y
robusto que `AbortSignal` (evita interferir con el `await load` de MapLibre, que
con BLANK_STYLE es sincrónico).

**Efecto visible:**
- La primera build (StrictMode) se completa pero su `.then` la descarta inmediatamente
  → su mapa se destruye con `map.remove()`.
- La **segunda build** es la que queda activa → "Mapa construido" aparece **una sola vez**
  (log de info), y el mapa se renderiza correctamente.
- Los errores "message channel closed" provienen de MapLibre interno al destruir la
  primera build (su worker tenía peticiones de tiles pendientes). Son cosméticos en
  dev, no afectan funcionalidad. Se pueden suprimir editando `main.tsx` (quitar
  `<StrictMode>`) si resultan molestos durante el desarrollo.

**Intento descartado:** `AbortSignal` en `buildGeoreferencedMap` + `useMap` creaba
una condición de carrera con la imagen full cacheada (resuelve en 80ms, antes del
cleanup de React) y además interfería con la resolución del `await load` de MapLibre
(BLANK_STYLE sincrónico), haciendo que el mapa no se renderizara.

### z12 + Service Worker + lowPowerMode + rename fadeDuration (2026-08-05)

Cuatro mejoras del roadmap faceta 2 (pasos 2b-2d del plan) ejecutadas en bloque:

1. **z12 (over-zoom eliminado):**
   - Tiler `generate-tiles.mjs`: `zTo` ahora deriva de `tiles.maxZoom` (fuente de verdad)
     en vez de `config.maxZoom + 1`. `tiles.maxZoom` para `chapter1-ecosistemas` cambió
     de 11→12. Regenerados 1760 tiles z12 nuevos (z6-z12: 2417 tiles, 26.46 MB).
   - `MapRenderer`: `maxZoom` del mapa = `Math.max(config.maxZoom, tiles.maxZoom)` para
     que el usuario pueda hacer zoom hasta donde hay tiles disponibles.

2. **Service Worker (`public/sw.js`):**
   - Cache-first para requests bajo `/assets/maps/tiles/mapas/`.
   - En visita repetida/sin-conexión los tiles se sirven del cache instantáneamente.
   - Registro en `main.tsx`: solo en producción o con `VITE_ENABLE_SW=true` en dev
     (para no interferir con HMR). `skipWaiting()` + `clients.claim()` para updated
     inmediato sin recarga.

3. **`fadeInDuration` → `fadeDuration`:**
   - Renombrado en `tiles.js`, `tiles.d.ts`, `MapRenderer.ts`. API más limpia.

4. **`lowPowerMode`:**
   - Toggle en `zustand/uiStore` (`toggleLowPowerMode()`).
   - Autodetección inicial: `navigator.hardwareConcurrency ≤ 4` → lowPowerMode `true`
     (Celeron/A4 con 2-4 núcleos).
   - `buildGeoreferencedMap` acepta `BuildOptions` con `lowPowerMode`. Cuando activo:
     `MAX_PARALLEL_IMAGE_REQUESTS = 2` (vs 4 normal) y `raster-fade-duration: 0` en tiles.
   - `useMap` lee `lowPowerMode` del store y lo pasa como opción; el effect se
     dispara al cambiar el toggle (rebuild del mapa).

**Verificación:** typecheck ✓ · lint ✓ (solo warning pre-existente) · 39/39 tests ✓ ·
build ✓ (SW 1.67 KB en `dist/sw.js`).

**Logging nivel Z:** `MapLogger` rediseñado con niveles ordenados
`trace`(=Z)→`debug`→`info`→`warn`→`error`→`silent`:
- Default: dev=`trace` (todo, nivel Z), prod=`warn`. En producción se puede activar
  temporalmente con `?log=trace` y apagar por completo con `?log=silent` o
  `VITE_LOG_LEVEL=silent`.
- Telemetría de tiles en `addTilesLayer`: `tile:request`, `tile:loaded`,
  `tile:aborted`, `tile:error`, `tile:duplicate` (misma coord solicitada 2+ veces sin
  cargarse/abortarse) y resumen agregado `Tiles resumen` al quedar el source idle
  (requested/loaded/aborted/failed/duplicates).
- Traza de lifecycle en `MapRenderer` (`build:start`, `build:bounds`, `map:loaded`,
  `map:jumpTo`, `base:placeholder`, `full:preload-start`, `map:destroy`) y en `useMap`
  (`effect:build-start`, `effect:build-ok`, `effect:cleanup`, `effect:build-descartado`,
  `effect:build-abortado`).

**Verificación:** typecheck ✓ · lint ✓ (solo warning pre-existente) · 39/39 tests ✓ ·
build prod ✓ · dev server sirve la app y el logger. Falta: revisión visual en el
navegador (con `?log=trace`) confirmando que no se repite "Mapa construido" ni el error
de channel, y que la telemetría no reporta tiles faltantes/duplicados.

**Cómo leer la telemetría:** al cargar `chapter1-ecosistemas` en z6-11 esperado:
`Tiles resumen` con `requested == loaded` (salvo over-zoom/pan), `duplicates: 0`
(duplicados reales) y `failed: 0`. Los re-requests por pan/zoom son normales (cache
eviction) y pueden contarse como duplicados benignos.

### Principio

Toda decisión debe estar explícita con alternativas documentadas, para que
ninguna decisión futura se tome por desconocimiento de lo que ya se evaluó.

---

## Crónica: la pantalla azul y el día que por fin vimos el mapa (2026-08-07)

> Escrito en primera persona de equipo. Más que un registro de cambios, es el
> relato de cómo un problema de "no se ve nada" nos llevó a leer el render
> desde cero, a perder el miedo al reset y a entender qué de lo que habíamos
> construido valía la pena conservar.

### La promesa

Este proyecto está pensado para una sala comunitaria en una vereda del Cauca:
un computador del gobierno de gama baja (Celeron o A4, 2-4 GB de RAM, GPU
integrada) conectado a un internet rural que en el mejor día baja a 3G y en el
peor se cae. Ese es el usuario final. No es un lujo: es una condición de
diseño. Todo lo que hacemos — tiles WebP en vez de PNG, fade sin doble-build,
modo bajo consumo, prefetch, service worker — existe para que ese equipo
alcance a mostrar el atlas sin colapsar.

### El síntoma

Pero por días, la pantalla no mostraba nada. Un azul profundo, `#03091e`,
bonito a la vista y devastador para el proyecto: el mapa entero era invisible.
"No se ve nada" es la frase que más frustra a un equipo, porque no es un error
que lanza un mensaje. Es un silencio. La consola no gritaba, los tiles se
pedían, el worker cargaba... y el ojo veía azul.

### Lo que fuimos descartando (uno por uno)

Primero sospechamos de StrictMode: React montaba, desmontaba y remontaba el
mapa, y la primera build se pisaba a sí misma. Ese era un problema real, y lo
resolvimos con un contador de generación (`buildGen`). Pero el azul siguió.

Luego sospechamos del worker de MapLibre v6. Bajo Vite, MapLibre deriva la URL
de su worker desde `import.meta.url`, que apunta a un archivo que Vite nunca
genera. Probamos `?worker&url`, lo descartamos (el canal de mensajes se cerraba
en dev), y terminamos copiando el worker y su módulo compartido como archivos
estáticos en `public/vendor/`. Verificamos en la red: worker 200, módulo
compartido cargado, tiles pidiéndose por HTTP. Todo "funcionaba". Y el azul
siguió.

Sospechamos del token `{r}` de CARTO: MapLibre v6 renombró el token retina a
`{ratio}`, y nuestro basemap pedía URLs con `{r}` literal que el servidor
respondía con 404. Lo corregimos. Y el azul siguió.

### El momento de la verdad

Un día, mirando los logs con calma, algo nos paró en seco:

```
canvas-dimensions [chapter1-ecosistemas]
{ containerW: 1400, containerH: 0, canvasW: 1400, canvasH: 300 }
```

`containerH: 0`. El div que contenía el mapa medía **cero píxeles de alto**.
MapLibre, sin altura que ocupar, creó un canvas con su altura por defecto de
300px, invisible detrás del fondo del contenedor. Todo ese tiempo habíamos
estado buscando bugs en el render... y el problema estaba en el CSS: `height:
100%` en un flexbox no resuelve cuando el padre solo tiene la altura "prestada"
de `flex: 1`. El porcentaje colapsaba a cero, y con él el mapa.

Y el azul no era del canvas: era el color de fondo del wrapper, idéntico al
fondo del estilo del mapa. Por eso nada "se veía": mirábamos el fondo de
pantalla, no el mapa.

### La decisión del reset

Íbamos a hacer `git reset --hard`. Perder el working tree entero y volver al
último commit. Pero antes de borrar, nos sentamos y escribimos todo: cada
hallazgo, cada archivo, cada decisión — porque sabíamos que entre el working
tree había cosas buenas que no queríamos perder. Documentamos qué valía la
pena conservar y qué era ruido.

Y entonces hicimos el reset.

### Lo que reconstruimos, ahora con conocimiento

Al reimplementar, ya no era copiar y pegar: era aplicar lecciones. Tres fixes
críticos para que el mapa exista, y las mejoras de red para que el mapa
sobreviva en la vereda:

1. **Vendor worker** — el worker de MapLibre v6 como estático, sin la
   maquinaria de Vite metida en el medio. Es la base: sin worker no hay tiles.
2. **CSS de la altura** — cadena flex anidada sin porcentajes
   (`flex: 1` → `min-height: 0`), para que el contenedor siempre tenga altura
   real, pase lo que pase con el layout.
3. **Basemap CARTO** — el token `{r}` fuera, para que el toggle de basemap no
   devuelva 404.
4. **Baja conectividad** — `connectionStore` que escucha la red en tiempo real,
   `useAutoLowPower` que baja la calidad de render si la señal empeora,
   `usePrefetchAdjacent` que precarga el mapa siguiente mientras el usuario
   lee, banner offline, y un modo `degraded` que avisa cuando los tiles tardan
   en llegar.

### La lección

La pantalla azul no era un bug del render: era un bug del layout, disfrazado
de bug del render, camuflado además por un color de fondo que coincidía con el
del mapa. Nos costó días porque buscábamos en el lugar equivocado: seguíamos
al worker y a las capas cuando debíamos medir el contenedor. El diagnóstico
que lo resolvió fue un simple log de dimensiones.

Y el reset no fue perder: fue separar lo que servía de lo que estorbaba. Todo
lo que valía la pena quedó documentado primero — y reconstruido después, mejor.

---

## Estado Actual

- **✅ Los mapas renderizan** (validado en navegador). Se cerró la pantalla azul con el fix de altura (`containerH: 0`) + vendor worker v6 + basemap CARTO. Cierre documentado en la crónica de arriba.
- **Build**: `pnpm build` pasando sin errores; typecheck ✓ · lint ✓ (0 errores)
- **Worker MapLibre v6**: vendor estático en `public/vendor/maplibre/` (worker + shared), `setWorkerUrl` en `main.tsx`, sync con `pnpm sync:maplibre`. Sin `?worker&url` (descartado: canal roto en dev).
- **CSS altura**: `.mapArea { min-height: 0 }` (TestMapPage) + `.wrapper { flex: 1; min-height: 0 }` (AtlasMap) — cadena flex sin porcentajes. Sin `height: 100%` que colapsa en flexbox.
- **Baja conectividad (rural)**: `connectionStore` (online/offline/slow reactivo), `useAutoLowPower` (lowPower auto al degradar la señal), `usePrefetchAdjacent` (precarga mapas adyacentes, sin saturar 2G), banner offline + banner degraded, `tilesStatus: loading|ready|degraded` con timeout de 8s.
- **Diagnósticos**: `canvas-dimensions`, `style-dump`, telemetría tiles INFO (`tile:request/loaded/duplicate/aborted`), `MapLibre error` listener, timeout degraded. Todos a nivel `?log=trace`.
- **Tiles (faceta 2)**: piloto `chapter1-ecosistemas` con 2417 tiles WebP (z6-z12, 26.46 MB, QUALITY=95) en `public/assets/maps/tiles/mapas/`; sin over-zoom. `maxZoom` dinámico (max de config y tiles). Runtime con `addTilesLayer` + `tilesServePlugin` inmutable + SW cache-first. Estructura reservada `tiles/capas/`. Fade-in sin doble-fade. `maxParallelImageRequests: 4` (2 en lowPowerMode). `lowPowerMode` con autodetección por `navigator.hardwareConcurrency`.
- **Originales**: 30/31 mapas PNG organizados por capítulo (`public/assets/maps/{intro,cap1,cap2,cap3,cap4}/`) y renombrados a canónico (falta el original de `chapter1-encuadres`); `GLOSARIO_MAPAS.md` con el mapeo comunidad↔canónico↔ID interno
- **Mapas**: `chapter2-m-suarez` recalibrado con asset local (`public/assets/maps/cap2/modelo-territorial-suarez.png`) y `initialBearing: 180`; imagen corregida en zona de Suárez
- **Imágenes**: images.js con 53/53 URLs verificadas (fix 404 de `chapter2-m-villa-rica`)
- **PGW data**: geo.js con rotados originales (fuente de verdad) + `chapter4-problematicas` con rotación no ortogonal −30°
- **Render pipeline**: MapRenderer con ImageSource + blank style + pipeline georreferenciado + guard anti-degenerado
- **Basemap**: OSM tiles con toggle, 3 estilos (Light/Streets/Satellite), slider opacidad. CARTO light sin `{r}` (v6 usa `{ratio}`)
- **Dev tool**: MapControls funcional solo en dev (VITE_DEV_TOOLS=true); panel de calibración compatible con mapas rotados (preserva A/E)
- **Pendiente**: Extraer contenido v17 (modales, audio, galerías, iconos, entramados, GeoJSON, assets)
