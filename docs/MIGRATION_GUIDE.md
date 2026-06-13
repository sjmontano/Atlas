# Migration Guide - Estado Actual

## Objetivo

Registrar el estado real de la migracion del Atlas hacia un modelo sin dependencia de backend para navegacion principal.

## Resumen ejecutivo

- Carga de mapas y capas principales desde archivos estaticos del proyecto.
- Render georreferenciado en frontend con MapLibre + pipeline de dominio `map`.
- Sin llamadas obligatorias a MongoDB para navegar mapas base.
- Hooks y stores sincronizados con datos locales del repositorio.

## Estado por area

| Area | Estado | Fuente actual |
| --- | --- | --- |
| Configuracion de mapas | Migrado | `src/domains/map/config/*` |
| Datos tecnicos de mapas (`mapId`, PGW, dimensiones) | Migrado | `src/domains/map/data/atlasMapData.ts` |
| Render georreferenciado | Migrado | `src/domains/map/services/MapRenderer.ts` |
| Gestion de capas y visibilidad | Migrado | `src/domains/layers/hooks/*`, `src/state/layersStore.ts` |
| Imagenes de media | Migrado | `src/domains/media/data/geo-images/*`, `src/domains/media/hooks/useGeoImages.ts` |
| Orquestacion de UI/flujo | Migrado | `src/state/*`, `src/ui/*` |

## Cambios relevantes vs esquema anterior

### Antes

- Documentacion y ejemplos con rutas tipo `src/shared/*` y `src/services/maps/*`.
- Dependencia conceptual de backend para capas y media.

### Ahora

- Dominios reales: `src/domains/map`, `src/domains/layers`, `src/domains/media`, `src/domains/chapters`.
- Adaptadores reales: `src/lib/maplibre/MapLibreAdapter.ts`, `src/lib/cloudinary/CloudinaryAdapter.ts`.
- Estado global con Zustand en `src/state/*`.

## API de uso actual (ejemplos)

### 1) Hook de capas

```ts
import { useGeoLayers, useMapLayers } from "@layers/hooks";
```

### 2) Hook de media

```ts
import { useGeoImages } from "@media";
```

### 3) Ruta principal del visor

```txt
/atlas
```

## Rutas activas

Definidas en `src/App.tsx`:

- `/`
- `/atlas`
- `/test-maps`
- `/test-maps/:mapId`
- fallback `*`

## Criterios de cierre de migracion

La migracion se considera operativamente estable cuando:

1. `npm run lint` pasa en limpio.
2. `npm run test` pasa en limpio.
3. `npm run build` compila sin errores.
4. La documentacion no referencia rutas antiguas en guias activas.

## Notas

- La carpeta `docs/investigaciones/` conserva investigacion y postmortems, pero no reemplaza las guias activas de uso.
- Si se reactiva un backend para funcionalidades adicionales, documentarlo como extension, no como dependencia base del flujo de mapas.
