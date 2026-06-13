# Rotacion de Mapas - Estado Actual

Resumen operativo de la implementacion vigente (no historica).

## Donde vive la logica

- Configuracion: `src/domains/map/config/mapSettings.ts`
- Datos tecnicos por mapa: `src/domains/map/data/atlasMapData.ts`
- Render georreferenciado: `src/domains/map/services/MapRenderer.ts`
- Calculo de bounds: `src/domains/map/services/BoundsCalculator.ts`
- Orquestacion de lifecycle: `src/domains/map/hooks/useAtlasMap.ts`

## Como funciona hoy

1. Se resuelve `mapId` -> `MapConfig` en `mapConfigProvider`.
2. `MapRenderer` crea source/capa de imagen georreferenciada y tiles.
3. Bounds y zoom se calculan con hooks del dominio `map`.
4. El estado se sincroniza via `mapStore` (`loading`, `error`, `mapBuilt`).

## Parametros clave de rotacion

En `mapSettings.ts`:

- `imageRotation`
- `flipVertical`
- `autoBounds`
- `initialZoom` (si se requiere override)

## Checklist para cambiar rotacion de un mapa

1. Editar `mapSettings[mapId]`.
2. Probar `/test-maps/:mapId`.
3. Verificar que no se salga del area valida al pan/zoom.
4. Ejecutar `npm run lint`, `npm run test`, `npm run build`.

## Nota sobre documentacion historica

La investigacion historica y postmortems tecnicos se mantienen en `docs/investigaciones/` para no mezclar historia con implementacion vigente.
