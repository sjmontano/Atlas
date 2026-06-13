# Debug Fixes - 2026-04

Registro de correcciones aplicadas durante depuracion tecnica previa al commit.

## 1) Limpieza de dependencias no usadas

### Problema

Paquetes declarados sin uso real en el proyecto raiz.

### Cambios

Se removieron:

- `framer-motion`
- `@turf/turf`
- `@types/react-router-dom`
- `@types/maplibre-gl`

### Validacion

- `npm ls ... --depth=0` sin esos paquetes
- `npm run build` OK

## 2) Fix de test en hidracion de layersStore

### Problema

Fallaba el test de hidratacion por clave y orden de importacion/hidratacion de `localStorage`.

### Cambios

- Ajuste en `src/state/layersStore.test.ts` para usar `LAYERS_MAP_OVERRIDES_STORAGE_KEY` y semilla de storage antes del import efectivo del store.

### Validacion

- `npm run test` -> 3/3 tests OK

## 3) Correcciones de lint (React hooks, refs, tipos)

### Problemas corregidos

- Acceso a refs durante render.
- `any` explicitos.
- dependencias incompletas de hooks.
- expresiones con side effects en ternarios.
- estado seteado sincronicamente dentro de `useEffect`.

### Archivos principales ajustados

- `src/domains/layers/hooks/useMapLayers.ts`
- `src/domains/map/context/MapContext.tsx`
- `src/domains/map/hooks/useMapZoom.ts`
- `src/domains/map/hooks/useMapDimensions.ts`
- `src/domains/map/services/MapRenderer.ts`
- `src/lib/maplibre/MapLibreAdapter.ts`
- `src/state/layersStore.ts`
- `src/ui/components/map/MapLoadingShell.tsx`
- `src/ui/components/map/SimpleMapViewer.tsx`

### Validacion

- `npm run lint` OK

## 4) Ruido de warning por chunk grande de MapLibre

### Problema

Warning recurrente por chunk grande esperado (`vendor-maplibre`).

### Cambio

- Se ajusto `chunkSizeWarningLimit` en `vite.config.ts`.

### Validacion

- Build sin warning de chunk-size por umbral anterior.

## Estado final de validacion

- `npm run lint` OK
- `npm run test` OK
- `npm run build` OK
