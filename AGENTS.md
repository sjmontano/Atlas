# Atlas Pluriversal — Project Memory

## Identity
Este proyecto es una **copia mejorada y optimizada** de `atlas_frontend_v17` (la versión funcional del Atlas). El objetivo es mantener la misma lógica y datos que v17, pero en una arquitectura limpia, escalable y sin código muerto.

## Arquitectura (Convención)

### Regla de oro: JS para datos, TS para lógica

| Tipo | Lenguaje | Ubicación | Ejemplo |
|------|----------|-----------|---------|
| **Datos** (PGW, URLs de imágenes, configs de mapas) | **JS** | `src/data/` | `pgwData.js`, `geoMapping.js`, `mapConfig.js` |
| **Lógica** (servicios, hooks, stores, utils) | **TS** | `src/domains/`, `src/lib/`, `src/state/` | `MapRenderer.ts`, `geoUtils.ts`, `chaptersStore.ts` |
| **UI** (componentes) | **TSX** | `src/ui/` | `AtlasMapBuilder.tsx` |

**¿Por qué?** El equipo de contenido edita datos (PGW, rutas de imágenes). JS es más simple y directo para eso. La lógica compleja (cálculos geo, stores, render) se beneficia del tipado de TS.

### Estructura de datos (refleja v17)

```
src/data/maps/
  pgwData.js        → georreferenciación [A, D, B, E, lon, lat] por mapa
  geoMapping.js     → URLs de imágenes (base, low, medium, high) por mapa
  mapConfig.js      → config por mapa (zoom, bearing, bounds, interacciones)
  mapDefaults.js    → valores por defecto globales
  index.js          → barrel export
```

```
src/lib/
  geoUtils.ts       → orquestador: generateMapConfig(name) combina pgwData + geoMapping + mapConfig
```

### Estado actual del port desde v17

| Capítulo | Mapas | PGW | Imágenes | Estado |
|----------|-------|-----|----------|--------|
| Introducción | 1 | ✅ v17 | ✅ Local | ✅ |
| Cap 1 | 6 | ✅ v17 | ✅ Local + tiles | ✅ |
| Cap 2 | 4 | ✅ v17 | ☁️ Cloudinary | ✅ Datos, ⏳ Assets locales |
| Cap 3 | 6 | ✅ v17 | ☁️ Cloudinary | ✅ Datos, ⏳ Assets locales |
| Cap 4 | 11 | ✅ v17 | ☁️ Cloudinary | ✅ Datos, ⏳ Assets locales |
| Test | 3 | ✅ | ✅ Local | ✅ |

**Total: 31 mapas definidos**

## Decisiones clave (bitácora)

### 1. PGW — bearing -90 nativo
Todos los mapas usan `initialBearing: -90` (retrato). La rotación se aplica como bearing nativo de MapLibre, NO como rotación de coordenadas. El constrain bearing-aware (`useTransformConstrain`) reemplaza a `setMaxBounds`.

### 2. Cloudinary para Cap 2-4
v17 usa Cloudinary para todas las imágenes de Cap 2-4. Pluriversal usa las mismas URLs. **Pendiente**: descargar copias locales para funcionamiento offline.

### 3. Sin duplicación de datos
`chaptersStore.ts` NO tiene un `CHAPTER_MAPS` hardcodeado. Deriva los mapas desde `chaptersData.ts` via `getChapterMapIds()`.

### 4. Sin patch de Cloudinary
Las funciones `mapImageResolver.ts` y `mapImageConfigPatch.ts` fueron eliminadas. El sistema usa rutas directas.

### 5. assets copiados desde atlas_3.0
Solo existen assets locales para Cap 1 (imágenes base + tiles). Los demás capítulos requieren Cloudinary.

## Comandos

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # tsc -b && vite build (typecheck + bundle)
pnpm lint         # eslint
pnpm preview      # vista previa del build
pnpm test         # vitest
```

## Errores que no repetir (lecciones de v17)

1. **No mezclar datos con lógica** — `atlasMapData.ts` tenía PGW + imagePaths + config todo junto. Ahora están separados como en v17.
2. **No duplicar estado** — `CHAPTER_MAPS` en chaptersStore duplicaba a chaptersData. Ahora hay una sola fuente de verdad.
3. **No dejar archivos huérfanos** — media domain, mapBoundsConfig.js, driver.js, etc. fueron eliminados.
4. **No mezclar vite.configs** — `vite.config.js` (v17 legacy) fue eliminado. Solo existe `vite.config.ts`.
