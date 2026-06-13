# Uso Rapido - Atlas 2.0

Guia corta para arrancar, desarrollar y validar el proyecto actual.

## Requisitos

- Node.js 20+
- npm 10+

## Comandos principales

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

## Rutas de aplicacion

Definidas en `src/App.tsx`:

- `/` pagina de inicio
- `/atlas` visor principal
- `/test-maps` pruebas de mapa (fallback `intro`)
- `/test-maps/:mapId` pruebas con mapa especifico

## Flujo tecnico minimo

1. `src/main.tsx` hace bootstrap y preload de rutas lazy.
2. `src/App.tsx` enruta a `Atlas` o `MapTestPage`.
3. `src/ui/Atlas.tsx` monta `MapProvider`, `LayerMapSync` y `AtlasMapBuilder`.
4. `src/domains/map/hooks/useAtlasMap.ts` construye el mapa georreferenciado.
5. `src/state/*` sincroniza estado global de mapa, capitulos, UI y capas.

## Agregar un nuevo mapa

1. Crear entrada en `src/domains/map/data/atlasMapData.ts`.
2. Ajustar settings en `src/domains/map/config/mapSettings.ts`.
3. Verificar config final con `src/domains/map/config/mapConfigProvider.ts`.
4. Probar en `/test-maps/:mapId`.

## Criterio de listo para merge

- Lint limpio: `npm run lint`
- Tests verdes: `npm run test`
- Build OK: `npm run build`
- Documentacion actualizada en `docs/` y `docs/investigaciones/` segun corresponda.

## Lecturas relacionadas

- `docs/ARQUITECTURA.md`
- `docs/GUIA_PROYECTO_SIN_CAPAS.md`
- `docs/ROTACION_MAPAS_ACTUAL.md`
- `docs/investigaciones/README.md`
