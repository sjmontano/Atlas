# GUÍA RÁPIDA — Archivos Clave del Atlas

> Para minimizar búsquedas. Solo lo que importa.

---

## PROYECTO ACTIVO: `atlas/` (lo que modificamos)

| Qué | Dónde |
|-----|-------|
| PGW data (rotado original) | `atlas/src/data/maps/geo.js` |
| Configs (zoom, bearing) | `atlas/src/data/maps/configs.js` |
| Imágenes URLs | `atlas/src/data/maps/images.js` |
| Barrel data maps | `atlas/src/data/maps/index.js` |
| Capítulos y jerarquía | `atlas/src/data/chapters/chapters.js` |
| Stores Zustand | `atlas/src/stores/` (4 stores) |
| Servicios core | `atlas/src/services/` (BoundsCalculator, MapRenderer, TransformConstrain) |
| Hook principal mapa | `atlas/src/hooks/useMap.ts` |
| Componente mapa | `atlas/src/components/map/AtlasMap.tsx` |
| Páginas | `atlas/src/pages/` (DevMenu, TestMapPage) |
| Tipos | `atlas/src/types/` (map.ts, layer.ts, chapter.ts) |
| Router | `atlas/src/App.tsx` |
| Tiles config | `atlas/src/data/maps/tiles.js` (+ tiles.d.ts) |
| Tiler GDAL | `atlas/scripts/generate-tiles.mjs` (`pnpm tiles`) |
| Tiles generados | `atlas/public/assets/maps/tiles/mapas/` (capas futuras → `capas/`) |

---

## V17 FUENTE: `atlas_front/atlas_frontend_v17/src/` (NO MODIFICAR)

> Tiene source! No solo dist/.
> Sacar de aquí: modales, galerías, audio, iconos, capas, puntos.

| Qué | Dónde |
|-----|-------|
| PGW data (convertido estándar) | `.../data/mapImages/pgwData.js` |
| URLs imágenes | `.../data/mapImages/geoMapping.js` |
| Configs mapa | `.../data/mapImages/mapConfig.js` |
| Índice de recursos | `.../components/library/resources.jsx` |
| Modales (texto) | `.../components/InfoModal/` (buscar layouts Luyaut1/Luyaut2) |
| Home/Bienvenidos | `.../views/` |
| Audio player | `.../components/AudioPlayer/` |
| Galerías Cap 2 | `.../components/GaleriaChapter2/` |
| Iconos Cap 4 | `.../components/Iconos/` |
| Capas SVG menú | `.../components/Capas/` |
| Assets (img, svg, audio) | `.../assets/` (en dist/) |
| Entramados | `.../components/Entramados/` |
| Créditos | `.../components/CreditsApp/` |

---

## BACKEND: `atlas_backend/` (NO MODIFICAR, referencia)

| Qué | Dónde |
|-----|-------|
| API endpoints | `.../src/routes/` |
| Modelos MongoDB | `.../src/models/` |
| GeoJSON en BD | `GET /api/v1/location/:name` — datos geográficos vectoriales |

**Regla**: Backend independiente. Frontend NO depende de él. Solo consultar si necesitamos GeoJSON vectorial de capas.

---

## V17 ASSETS (sacar de aquí)

| Asset | Ruta |
|-------|------|
| Fondos UI | `dist/assets/img/background/` |
| Logos | `dist/assets/img/logo/` |
| Perfiles SVG carrusel | `dist/assets/img/perfil/` (3 archivos ~20MB) |
| Talleres | `dist/assets/img/talleres/` |
| Mapas base (alta) | `dist/assets/img/maps/` (homeCap4, humedales, sintesisCali) |
| Capas ecosistemas (38) | `dist/assets/img/Capas/ecosistemas/` |
| Capas río Cauca (22) | `dist/assets/img/CapasUnriocauca/` |
| Iconos Cap 4 (73) | `dist/assets/iconsCap4/` |
| Menú capas Cap 2 (63) | `dist/assets/mapasMenuCap2/` |
| Iconos UI (66) | `dist/assets/interface/icons/` |
| UI elements (29) | `dist/assets/interface/ui/` |
| Audio (2 MP3) | `dist/assets/audiosChapters/` |
| Tramos Cap 3 (4) | `dist/assets/tramosCap3/` |
| SVG generales (44) | `dist/assets/svg/` |
| Iconos tejidos agua (11) | `dist/assets/IconosTejidosAgua/` |
| Entramados logos (30) | `dist/assets/img/entramados/` |
| Galerías Cap 2 (21) | `dist/assets/img/imgcarruselcap2/` |

---

## 3.0 REFERENCIA: `atlas_front/atlas_3.0/src/` (NO MODIFICAR)

| Qué | Dónde |
|-----|-------|
| BoundsCalculator | `.../src/domains/map/services/BoundsCalculator.ts` |
| TransformConstrain | `.../src/domains/map/hooks/useAtlasMap.ts:100-183` |
| MapRenderer | `.../src/domains/map/services/MapRenderer.ts` |
| Stores | `.../src/state/` |
| Atlas shell | `.../src/ui/Atlas.tsx` |
| Tiles generados | `.../public/assets/maps/tiles/` |
| GeoJSON layers | `.../public/assets/geo-layers/` |

---

---

## ROTACIÓN: diferencias entre los 3 proyectos

> Hallazgo crítico de 2026-07-30. Documentado en detalle en `MANUAL_TECNICO.md §9`.
> **Actualización 2026-07-30**: Se implementó conversión automática PGW rotado→estándar en `BoundsCalculator.ts`.

| Aspecto | atlas_3.0 | v17 | atlas/ (ACTUAL) |
|---------|-----------|-----|-----------------|
| **PGW en datos** | Convertido estándar (A≠0, E≠0) | Convertido estándar (A≠0, E≠0) | **Rotado original** (A=0, E=0) en `geo.js` |
| **Conversión PGW** | Manual en `atlasMapData.ts` | Manual en `pgwData.js` | **Automática en `BoundsCalculator.ts`** — `convertRotatedPGW()` |
| **rotateImageCoordinates** | Sí — rota coordenadas para alinearse con bearing | No | No |
| **setMaxBounds** | Fallback ~3 mapas | Red seguridad con boundsPadding manual | **No se usa** |
| **TransformConstrain** | `useAtlasMap.ts:100-183` | `useMap.js:15-86` | `TransformConstrain.ts:34-117` |
| **Lógica** | Idéntica (bearing-aware, half-extent, guardrail) | Idéntica | Idéntica |

**Regla clave (actualizada)**: El PGW rotado original (`geo.js`) se mantiene intacto como fuente de verdad. `BoundsCalculator.processBounds()` detecta automáticamente el formato rotado (A=0, E=0) y convierte a estándar antes de calcular coordenadas para MapLibre. Esto replica exactamente la estrategia de v17 que está probada en producción.

---

## REGLAS ESTRICTAS

1. **Solo modificar `atlas/`**. NUNCA tocar `atlas_front/`, `atlas_backend/`, `atlas_frontend_v17/`, `atlas_3.0/`.
2. **El PGW de geo.js es el original rotado** (A=0, E=0, D≠0, B≠0). La conversión la hace MapLibre con `bearing: -90`.
3. **Nothing new**: todo lo que implementamos ya existe en v17. Es migración, no invención.
4. **Frontend monolítico**: sin dependencia del backend. Backend es aparte y opcional.
5. **Datos de modales, contenido**: sacar de bundles de v17 (dist/ o source).
6. **Capas GeoJSON**: sacar del backend (`GET /api/v1/location/:name`) o de archivos estáticos.
