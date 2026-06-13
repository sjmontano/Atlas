# Guia operativa Atlas 2.0 (sin capas)

## Objetivo
Esta guia resume como funciona el proyecto para consultas rapidas de arquitectura, rutas y flujo del mapa, sin revisar todo el codigo cada vez.

## Alcance incluido
- Rutas y navegacion React Router.
- Shell principal del visor (Atlas).
- Motor de mapas georreferenciados (dominio map + MapLibre).
- Dominios chapters y media.
- Stores de estado map, chapters y ui.
- Adaptadores de libreria (maplibre y cloudinary).
- Aliases de importacion y estructura de carpetas.

## Fuera de alcance
- Logica de capas vectoriales en src/domains/layers.
- Componentes de capas en src/ui/components/layers.
- Detalle interno de src/state/layersStore.ts.

## Rutas activas
Fuente principal: src/App.tsx.

- / -> HomePage
- /atlas -> Atlas (visor completo)
- /test-maps -> MapTestPage (usa fallback intro)
- /test-maps/:mapId -> MapTestPage para mapa especifico
- * -> HomePage

## Precarga de rutas
Fuente: src/main.tsx.

- Se hace preload de ui/Atlas y pages/MapTestPage/MapTestPage despues del load del navegador.
- Se usa lazy + Suspense en App.tsx para dividir bundles y evitar costo inicial alto.

## Flujo funcional de /atlas
1. App.tsx enruta a Atlas.
2. Atlas.tsx lee activeMapId desde useMapStore.
3. Atlas.tsx monta MapProvider y AtlasMapBuilder con key=activeMapId.
4. AtlasMapBuilder delega inicializacion a useAtlasMap.
5. useAtlasMap ejecuta pipeline:
   - configuracion (useMapConfiguration)
   - dimensiones (useMapDimensions)
   - bounds (useMapBounds)
   - zoom (useMapZoom)
   - createMapInstance (MapLibre)
   - buildGeoreferencedMap (MapRenderer)
6. Al terminar, registra mapa en MapContext y marca mapBuilt=true en mapStore.

## Flujo funcional de /test-maps/:mapId
Fuente: src/pages/MapTestPage/MapTestPage.tsx.

1. Lee mapId por useParams.
2. Si no existe mapId, usa intro.
3. Monta MapProvider + AtlasMapBuilder con controles y leyenda habilitados.

## IDs de mapa tecnicos disponibles
Fuente: src/domains/map/data/atlasMapData.ts.

- intro
- chapter1-encuadres
- chapter1-ecosistemas
- chapter1-formas-paisaje
- chapter1-bredunco
- chapter1-mosaicos-del-agua
- chapter1-un-rio-cauca
- chapter2-valle
- chapter2-suarez
- chapter2-cali
- chapter2-villa-rica

## Narrativa por capitulos
Fuente: src/domains/chapters/data/chaptersData.ts.

- Capitulo 1 incluye 6 mapas (chapter1-*).
- Capitulo 2 incluye valle y suarez.
- chapter2-cali y chapter2-villa-rica existen en atlasMapData pero aun no estan en CHAPTERS_DATA ni CHAPTER_MAPS de chaptersStore.

## Stores relevantes (sin capas)
- mapStore: mapa activo, loading, error, mapBuilt.
- chaptersStore: capitulo activo, territorio activo, chapterMaps; orquesta cambio de mapa.
- uiStore: sidebar, panel activo, modales.

## Aliases de importacion
Fuentes: vite.config.ts y tsconfig.app.json.

- @map -> src/domains/map
- @chapters -> src/domains/chapters
- @media -> src/domains/media
- @state -> src/state
- @ui -> src/ui
- @lib -> src/lib
- @shared -> src/shared

## Buenas practicas aplicadas (tomadas del documento base)
Tomado de docs/buenas-practicas-y-codigo-limpio.md.

- Mantener bajo acoplamiento.
- Preferir simplicidad (KISS).
- Evitar repeticion (DRY).
- Nombramiento claro y consistente.
- Comentarios minimos y utiles.
- Refactor recurrente sin romper logica funcional.

## Nota de coherencia detectada
Fuente: src/ui/components/map/MapSelector.tsx.

- MapSelectorGrid usa navigate("/map/:mapId") cuando openInFullscreen=true.
- Las rutas activas actuales en App.tsx usan /test-maps/:mapId.
- Si se usa openInFullscreen, hoy no coincide con la ruta configurada.
