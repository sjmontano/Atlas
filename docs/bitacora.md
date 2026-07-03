# Bitacora persistente del chat - georreferenciacion y bounds

Fecha de cierre de esta version: 2026-04-13
Estado: Activa (seguir anexando nuevas interacciones al final)

## Objetivo global del chat
Consolidar una fuente unica y coherente para resolver bounds runtime en mapas georreferenciados (PGW + tiles), reducir ruido de logs, evitar duplicacion de calculos y preparar despliegue por fases sin regresiones visuales.

## Historial de interacciones (resumen operativo)

### Interaccion 1 - Diagnostico inicial de consola
- Que se pidio: Analizar trazas y explicar la causa de desalineacion con bearing -90.
- Que se hizo: Se reviso la discrepancia entre bounds PGW y bounds hardcodeados de tiles.
- Archivos modificados: Ninguno (analisis).
- Finalidad/resultado: Se definio que la causa principal era semantica de bounds no alineada entre app y pipeline de tiles.

### Interaccion 2 - Definicion de estrategia viable
- Que se pidio: Elegir opcion tecnica mas viable.
- Que se hizo: Se propuso resolver bounds en runtime con estrategia configurable (configured/derived/auto) y fallback por delta.
- Archivos modificados: Ninguno (diseno).
- Finalidad/resultado: Se aprobo roadmap por fases para implementacion incremental y verificable.

### Interaccion 3 - Implementacion de contrato de bounds
- Que se hizo:
  - Se agregaron tipos y contrato runtime para tiles.
  - Se incorporo derivacion de bounds desde PGW y criterio de fallback por delta.
- Archivos modificados:
  - src/domains/map/config/mapSettings.ts
- Donde se modifico:
  - Tipos RuntimeTilesBoundsStrategy/RuntimeBoundsResolution.
  - Funciones deriveTilesBoundsFromPgw, resolveRuntimeBounds.
- Finalidad/resultado: Quedo centralizada la decision de fuente de bounds en una API unica.

### Interaccion 4 - Orquestacion en hook principal
- Que se hizo:
  - El hook uso resolvedor central.
  - Se paso imagePixels para derivacion consistente con dimensiones reales.
  - Se memoizaron parametros de zoom para estabilidad de referencia.
  - Se inyecto bounds precomputado al renderer para evitar recalculo.
- Archivos modificados:
  - src/domains/map/hooks/useAtlasMap.ts
- Finalidad/resultado: Menos duplicacion y mismo criterio de bounds entre init y render.

### Interaccion 5 - Integracion en renderer
- Que se hizo:
  - Se ajusto el renderer para reutilizar bounds precomputados cuando existen.
  - Se dejo logging de source/strategy/delta en flujo de armado de mapa.
- Archivos modificados:
  - src/domains/map/services/MapRenderer.ts
- Finalidad/resultado: Coherencia hook-renderer y trazabilidad de decisiones de bounds.

### Interaccion 6 - Consolidacion PGW y trazas tecnicas
- Que se hizo:
  - Se centralizo el modelo afín y trazas detalladas de calculo PGW con correccion de medio pixel.
  - Se estructuro salida de bounds, coordinates y center.
- Archivos modificados:
  - src/domains/map/services/BoundsCalculator.ts
  - src/domains/map/hooks/useMapBounds.ts
- Finalidad/resultado: Base geometrica canonica reutilizable y verificable.

### Interaccion 7 - Normalizacion de logging y reduccion de ruido
- Que se hizo:
  - Migracion de console.* a logger en servicios/mapa.
  - Dedupe de logs de zoom/opacidad y epsilon para evitar recalculos insignificantes.
- Archivos modificados:
  - src/domains/map/hooks/useMapZoom.ts
  - src/domains/layers/services/LayerManager.ts
  - src/lib/maplibre/MapLibreAdapter.ts
- Finalidad/resultado: Consola util para diagnostico real, sin spam continuo.

### Interaccion 8 - Validacion con trazas reales del usuario
- Que se observo:
  - Inicialmente source tendia a tiles-config por delta alto.
  - Tras ajuste semantico de derivacion, source paso a tiles-derived con delta casi cero.
- Archivos impactados por el ajuste:
  - src/domains/map/config/mapSettings.ts
- Finalidad/resultado: Alineacion practica entre derivacion app y semantica del generador de tiles.

### Interaccion 9 - Verificacion tecnica
- Que se hizo: Se corrio lint/errores del editor sobre archivos clave de mapa.
- Archivos verificados:
  - src/domains/map/config/mapSettings.ts
  - src/domains/map/hooks/useAtlasMap.ts
  - src/domains/map/services/MapRenderer.ts
- Finalidad/resultado: Sin errores reportados en la validacion ejecutada.

### Interaccion 10 - Continuacion del plan (Fase B)
- Que se planifico:
  - Extender estrategia auto a mapas chapter1 con tiles.
  - Generalizar condicion del resolvedor para no depender solo de intro.
  - Agregar pruebas unitarias de consistencia (intro + chapter1).
- Archivos objetivo definidos:
  - src/domains/map/config/mapSettings.ts
  - src/domains/map/data/atlasMapData.ts
  - src/domains/map/services/BoundsCalculator.ts
  - src/domains/map/config/mapSettings.test.ts (nuevo)
- Finalidad/resultado: Plan de ejecucion listo, pendiente de aplicacion en modo edicion.

### Interaccion 11 - Estado mas reciente del entorno
- Que ocurrio: Se detectaron cambios externos recientes en:
  - src/domains/map/services/MapRenderer.ts
  - src/domains/map/hooks/useAtlasMap.ts
- Implicacion: Antes de nuevas ediciones, hay que releer contenido actual para no pisar cambios del usuario o herramientas.

### Interaccion 12 - Inicio de implementacion Fase B
- Que se hizo:
  - Se activo tilesBoundsStrategy auto en los mapas chapter1 con useTiles.
  - Se generalizo la activacion del resolvedor runtime para todos los mapas tiles (ya no solo intro).
  - Se elimino el recalc de decision runtime en el camino principal del renderer, reutilizando el resultado precomputado desde useAtlasMap.
  - Se actualizaron comentarios tecnicos desalineados con el bearing runtime real.
  - Se agregaron pruebas unitarias de resolveRuntimeBounds para intro y chapter1.
- Archivos modificados:
  - src/domains/map/config/mapSettings.ts
  - src/domains/map/hooks/useAtlasMap.ts
  - src/domains/map/services/MapRenderer.ts
  - src/domains/map/services/BoundsCalculator.ts
  - src/domains/map/config/mapSettings.test.ts
- Validacion ejecutada:
  - eslint sin errores en archivos tocados.
  - vitest: 4/4 pruebas pasando en mapSettings.test.ts.
- Finalidad/resultado:
  - Contrato runtime mas consistente entre hook y renderer.
  - Fase B iniciada con cobertura automatica base para estrategia configured/derived/auto y fallback por delta.

### Interaccion 13 - Endurecimiento de validaciones y cobertura runtime
- Que se hizo:
  - Se incorporaron metricas cuantitativas en pixeles para comparar bounds configured vs derived.
  - Se agrego asercion de umbral para intro (error medio <= 0.5 px y max <= 1.0 px).
  - Se agrego validacion explicita de fallback para chapter1 cuando el error en pixeles es alto.
  - Se creo suite de integracion de renderer con mock de MapLibre para verificar consumo de runtime precomputado, centro final y fijacion de minZoom en intro.
  - Se extrajo contrato de maxBounds inicial/final en helpers puros de useAtlasMap y se cubrio con pruebas unitarias.
  - Se agrego polyfill de URL.createObjectURL en setup de tests para permitir import de maplibre-gl en jsdom.
- Archivos modificados:
  - src/domains/map/config/mapSettings.test.ts
  - src/domains/map/services/MapRenderer.runtime.test.ts
  - src/domains/map/hooks/useAtlasMap.ts
  - src/domains/map/hooks/useAtlasMap.runtime.test.ts
  - src/test/setup.ts
- Validacion ejecutada:
  - eslint sin errores en archivos nuevos/actualizados.
  - vitest: 11/11 pruebas pasando en suites de mapa (config + renderer + hook runtime).
- Finalidad/resultado:
  - Queda trazabilidad cuantitativa de precision por fase.
  - Contrato de maxBounds queda testeado y desacoplado del efecto principal del hook.

### Interaccion 14 - Actualizacion de antes y skills
- Que se pidio:
  - Actualizar, crear o agregar el resumen de "antes" y "skills" segun el estado real del trabajo.
- Que se hizo:
  - Se consolidaron los cambios recientes en una lectura "antes vs ahora".
  - Se explicitaron skills tecnicos ya dominados, skills en consolidacion y skills pendientes para Fase C.
  - Se creo un archivo operativo dedicado para consulta rapida del equipo.
- Archivos modificados:
  - docs/bitacora.md
  - docs/antes-y-skills.md
- Finalidad/resultado:
  - Queda documentado que esta pasando ahora, que se quiere lograr y que capacidades ya estan listas para ejecutar la siguiente fase.

## Estado actual
- Intro: estable con estrategia auto y seleccion efectiva tiles-derived (delta minimo observado).
- Chapter1 tiles: ya entra en estrategia auto y resolvedor central runtime.
- Arquitectura: hook y renderer consumen el mismo resultado runtime en el camino principal.
- Validaciones: suites de mapa con cobertura de precision en pixeles, comportamiento runtime de renderer y contrato maxBounds.
- Pendiente principal: automatizar reporte de metricas por mapa para CI y avanzar Fase C (chapter2) sin retirar overrides.

## Objetivos inmediatos
1. Emitir reporte automatizado de metricas por mapa (mean/max px) para seguimiento por fase.
2. Definir gate de CI para no retirar overrides mientras maxPx > 1.0 o meanPx > 0.5.
3. Iniciar Fase C en chapter2 con modo compatible (sin eliminar fallback configured).
4. Reducir ruido de logs de tests de bounds con opcion de traza desactivada por suite cuando no aporta diagnostico.

## Antes y Skills (estado y objetivo)

### Antes (estado inicial)
- La decision de bounds tiles estaba concentrada practicamente en intro.
- Habia dualidad entre calculo runtime en hook y decision redundante en renderer.
- No existian validaciones cuantitativas en pixeles para aprobar o rechazar derivacion.
- No habia pruebas de contrato para maxBounds inicial/final.

### Ahora (estado actual)
- Chapter1 con tiles ya entra en estrategia auto y fallback configurado por delta.
- Hook y renderer usan el mismo runtime bounds en el camino principal.
- Existe validacion cuantitativa en pruebas (intro con umbral <= 0.5 px mean y <= 1.0 px max).
- Existen pruebas de integracion del renderer y pruebas unitarias del contrato maxBounds.

### Skills aplicados y consolidados
- Modelado PGW con correccion de medio pixel y trazabilidad de geometria.
- Diseno de resolvedor runtime con estrategias configured/derived/auto y guardrail por delta.
- Integracion de pruebas Vitest con mocks de MapLibre para comportamiento runtime.
- Hardening de entorno de pruebas (polyfill temprano para createObjectURL).

### Skills en consolidacion
- Automatizacion de reporte de metricas por mapa para gate de CI.
- Criterios de despliegue por fases con umbrales cuantitativos de precision.

### Skills pendientes para Fase C
- Migracion gradual de chapter2 manteniendo compatibilidad y sin retirar overrides antes de pasar metricas.
- Normalizacion de logs de pruebas para diagnostico util con ruido minimo.

### Interaccion 15 - Diagnostico comportamiento viewportMaxBounds con zoom (2026-04-14)
- Que se pidio:
  - Explicar por que viewportMaxBounds funciona en zoom normal pero se rompe al hacer zoom in (usuario puede salir por arriba/abajo).
  - Explicar por que tilesConfig.bounds south=-0.02 funciona y south=6.202 corta la mitad de los tiles.
- Que se hizo: Analisis tecnico, sin modificar codigo.
- Archivos modificados: Ninguno.
- Donde se modifico: N/A.
- Finalidad/resultado:
  - Bug diagnosticado: MapLibre internamente usa viewport_width para el eje LON y viewport_height para el eje LAT al calcular el rango permitido del centro. Con bearing=-90 los ejes visuales estan intercambiados (LON = arriba/abajo, LAT = izquierda/derecha). MapLibre aplica un padding de LON usando WIDTH (demasiado grande) => restriccion LON demasiado laxa => el usuario puede salir por arriba y abajo al hacer zoom in.
  - Por que funciona en zoom normal: El viewport llena practicamente todo el extent de los tiles. No hay espacio fisico para moverse. La restriccion parece funcionar pero es una ilusion.
  - Bug secundario detectado: tilesConfig.bounds south valor -0.02 es aparentemente incorrecto (PGW real = 6.202), pero es NECESARIO. El viewportMaxBounds south=3.202 permite mostrar el mapa hasta esa latitud. Con bearing=-90, esa latitud cae en el lado IZQUIERDO de la pantalla. Si tilesConfig.bounds south=6.202, MapLibre no solicita tiles para lat < 6.202, lo cual deja la mitad izquierda de la pantalla sin tiles. Con south=-0.02 los tiles se solicitan para todo el rango visible.
- Riesgos/pendientes: Implementar fix real del eje LON (custom move handler).

### Interaccion 16 - Fix bearing-aware viewport clamping via move handler (2026-04-14) ❌ DESCARTADA
- Que se pidio:
  - No permitir que al hacer zoom el viewport se abra mas alla de los limites establecidos (arriba/abajo con bearing=-90).
- Que se hizo:
  - Se implemento installBearingAwareClamp(): desactiva setMaxBounds nativo e instala listener 'move' con unproject() sobre los 4 bordes del canvas para calcular desborde real y corregir con setCenter().
  - Se corrigio bug colateral: verticalExpand:100 → 0 y viewportMaxBounds west/east alineados con tile footprint.
- Archivos modificados:
  - src/domains/map/hooks/useAtlasMap.ts
  - src/domains/map/config/mapSettings.ts
  - src/domains/map/config/mapSettings.test.ts
- Finalidad/resultado: NO FUNCIONO EN PRACTICA.
  - El listener 'move' con setCenter() genera artifacts visuales graves: zoom lento y trabado, camara que no se centra correctamente, comportamiento erratico de camara en general.
  - El problema es intrinseco al patron: setCenter() dentro de 'move' retroalimenta el evento creando un loop de correccion perceptible aunque haya flag _clamping.
  - Tests pasaban (11/11) pero en el navegador la experiencia era inutilizable.
- Estado del codigo: los cambios quedaron aplicados pero deben ser revertidos o reemplazados.
- Leccion aprendida: el patron listener 'move' + setCenter() NO es viable para clamping de viewport en MapLibre. Produce artifacts de camara independientemente de la implementacion del calculo geometrico. El problema no es el calculo (bearing/ejes/unproject) sino el patron mismo de intervenir el movimiento desde el evento 'move'.
- Proxima estrategia a explorar: NO usar eventos de movimiento. Alternativas: (1) fijar minZoom tal que el contenido siempre llene el viewport sin dejar zona vacía accesible; (2) usar 'moveend' en lugar de 'move' para correccion snap-back menos agresiva; (3) aceptar que setMaxBounds nativo es la unica solucion robusta y derivar los valores correctos para que funcione con bearing=-90 en todos los niveles de zoom.

### Interaccion 17 - Analisis de estrategias de clamping para bearing=-90 (2026-04-15)

#### Contexto del problema
- `setMaxBounds` nativo de MapLibre es bearing-blind: clampea LON con viewport WIDTH y LAT con viewport HEIGHT.
- Con bearing=-90 los ejes visuales estan intercambiados (LON = arriba/abajo, LAT = izq/der).
- Resultado: restriction LON demasiado laxa => al hacer zoom in el usuario sale por arriba/abajo.
- `tilesConfig.bounds south=-0.02` es INTENCIONAL. Si south=6.202, MapLibre no pide tiles para lat < 6.202 y la mitad izquierda de la pantalla queda sin tiles (con bearing=-90, lat 3.2° cae en el borde izquierdo).

#### Estrategias evaluadas

| Estrategia | Estado | Razon |
|---|---|---|
| `setMaxBounds` nativo con valores ajustados | ❌ DESCARTADA | Bearing-blind. Ningun valor corrige el problema de eje invertido al hacer zoom |
| `move` + `setCenter` con unproject() | ❌ DESCARTADA | Loop de feedback → jitter, camara erratica, zoom trabado. Intrinseco al patron, no al calculo |
| `Turf.js` | ❌ NO APLICA | No instalado. No resuelve el problema de clamping en cliente MapLibre |
| Imagen pre-rotada en pipeline + bearing=0 | ✅ VIABLE (costosa) | Elimina el problema de raiz. Requiere regenerar tileset con imagen rotada 90° en GDAL/Python y recalcular PGW |
| `setTransformConstrain` (MapLibre 3+) | ✅ CANDIDATA PRINCIPAL | Pre-render, sin artifacts, bearing-aware. Disponible en maplibre-gl ^5.17.0 |
| `moveend` + `easeTo` snap-back | ⚠️ ALTERNATIVA SUAVE | Post-interaccion → snap visible pero sin jitter. Menor prioridad |
| `minZoom` forzado para que el contenido llene siempre el viewport | ⚠️ ALTERNATIVA LIMITADA | Funciona pero restringe zoom in. No resuelve el problema general |

#### Decision: implementar `setTransformConstrain`

- API disponible: `maplibregl.Map.setTransformConstrain(fn)` desde v3.x. Version actual: ^5.17.0. ✅
- No usado en codebase actualmente.
- Executa PRE-render cada frame → intercepta antes de aplicar transformacion de camara.
- Sin loop de feedback (a diferencia de `move` + `setCenter`).

#### Alerta critica de implementacion

El constraint opera sobre el **centro** del mapa, no sobre las esquinas del viewport.
Sin compensacion de viewport, al hacer zoom in las esquinas salen del bound aunque el centro este dentro.

Correccion necesaria: los limites del clamp deben restar el half-extent del viewport al nivel de zoom actual:

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

Sin este ajuste el constraint es de centro, no de viewport. Mismo problema que `setMaxBounds`.

#### Siguiente paso
Implementar `setTransformConstrain` en `useAtlasMap.ts` en el bloque `onLoad`, sustituyendo `applyFinalMaxBounds` para mapas con bearing de cuarto de giro + `viewportMaxBounds` definido.
NO usar `maxBounds` nativo en paralelo (compiten y crean comportamiento extrano).

---

## Plantilla para nuevas interacciones
Agregar al final bloques como este:

### Interaccion N - <titulo>
- Que se pidio:
- Que se hizo:
- Archivos modificados:
- Donde se modifico:
- Finalidad/resultado:
- Riesgos/pendientes:

---

## Historial de migración V17 ← 3.0 (2026-05-16)

### Objetivo global
Migrar la lógica de georreferenciación (PGW→bounds), restricción de cámara bearing-aware y configuración de mapas desde Atlas 3.0 hacia Atlas_frontend_v17, manteniendo compatibilidad con la arquitectura existente de V17.

---

### Interaccion 18 - Diagnóstico PGW y half-pixel
- Que se pidió: Analizar cómo se calcula PGW→bounds en ambos proyectos e iniciar migración.
- Que se hizo: Se comparó `BoundsCalculator.ts` (3.0) con `boundsCalculator.js` (V17). Se detectó ausencia de corrección half-pixel (`x0 = C - 0.5*A - 0.5*B`) en V17.
- Archivos modificados:
  - `src/utils/boundsCalculator.js` — agregada corrección half-pixel en `getGeoCornersFromPGW()`
- Finalidad: Eliminar shift sistemático de ~0.5px en coordenadas de imagen.
- Impacto: `mapUtils.js` ya usaba `processBounds()` → corrección se propaga automáticamente.

### Interaccion 19 - Debug opacity y street view
- Que se pidió: Agregar opción de opacidad semitransparente para verificar alineación visual.
- Que se hizo:
  - `mapConfig.js` intro → agregado `debugMapOpacity: 0.5` y `streetViewEnabled: true`
  - `BaseMapImage.jsx` → acepta `debugMapOpacity`, aplica opacidad fija a capas raster + tiles
  - `MapComponent.jsx` → pasa `debugMapOpacity`, `minzoom`, `maxzoom` a BaseMapImage
  - `useMap.js` → acepta `streetViewEnabled`, inyecta OSM basemap cuando true
- Finalidad: Verificar visualmente que imagen atlas y OSM basemap coinciden.

### Interaccion 20 - Remoción de hasPgwRotation y mirrors forzados
- Que se pidió: Corregir rotación del mapa — bearing=-90 para ambos (OSM + atlas).
- Que se hizo:
  - `geoUtils.js` → eliminado `hasPgwRotation` que forzaba `initialBearing: 0`. El bearing ahora se respeta de `mapConfig.js`.
  - `geoUtils.js` → eliminados `mirrorHorizontal: true, mirrorVertical: true` de `interactionOverrides` (causaban rotación 180°).
- Finalidad: OSM basemap y atlas image comparten bearing=-90, alineados geográficamente.

### Interaccion 21 - Transformación PGW intro
- Que se pidió: Corregir desalineamiento de la imagen (doble rotación). PGW crudo (rotado, A=0, E=0) no corresponde a la imagen landscape real.
- Que se hizo:
  - `pgwData.js` intro → PGW transformado de rotado a estándar: `A_new=B_old, E_new=-D_old, F calibrado a 12.879` (misma F que Atlas 3.0)
  - `mapConfig.js` intro → ajustado `initialZoom: 7.8, minZoom: 7, maxZoom: 9`
- Fórmula de conversión 90° horario: `F_new = F_old + D_old × W_portrait` (W_portrait=5649). Pero F se calibró manualmente a 12.879 para coincidir con tileset.
- Riesgo: Otros mapas rotados (encuadres, bredunco, ecosistemas, etc.) quedan sin transformar — pendiente.

### Interaccion 22 - Bounds configurables (boundsPadding)
- Que se pidió: Poder ajustar los bounds por lado (abrir arriba, cerrar laterales).
- Que se hizo:
  - `BaseMapImage.jsx` → `setMaxBounds` ahora usa factores por lado desde `boundsPadding`
  - `mapConfig.js` intro → `boundsPadding: { top: -0.25, bottom: -0.25, left: 0.338, right: 0.338 }`
  - `MapComponent.jsx` → pasa `boundsPadding` a BaseMapImage
- Finalidad: Control fino del área navegable. Valores encontrados empíricamente para bearing=-90.
- Nota: Con bearing=-90, `right` controla "arriba" en pantalla, `left` controla "abajo", `top`/`bottom` controlan laterales.

### Interaccion 23 - Simplificación del zoom
- Que se pidió: Eliminar zoom automático que peleaba con el usuario y deformaba el viewport.
- Que se hizo:
  - `BaseMapImage.jsx` → eliminado efecto `updateMinZoom` (containZoom, coverZoom, setMinZoom, jumpTo, resize listener). Reemplazado por efecto simple que solo aplica `setMaxBounds`.
  - `BaseMapImage.jsx` → eliminado `centerOnZoomOut` (flyTo en cada zoomend).
- Finalidad: Zoom controlado exclusivamente por `mapConfig.js` (initialZoom, minZoom, maxZoom). Sin recálculos ni saltos.

### Interaccion 24 - setTransformConstrain implementado
- Que se pidió: Restricción de cámara bearing-aware que no deforme el viewport al hacer zoom.
- Que se hizo:
  - `useMap.js` → portado `createBearingAwareConstrain()` desde `useAtlasMap.ts:100-183` (Atlas 3.0)
  - `useMap.js` → llama `map.setTransformConstrain()` en `onLoad` si configurado
  - `mapConfig.js` intro → `useTransformConstrain: true, viewportMaxBounds: [...]` (mismos valores que 3.0 intro-pgw-current)
  - `BaseMapImage.jsx` → `setMaxBounds` siempre aplica como red de seguridad (sin importar useTransformConstrain)
- Finalidad: Constrain pre-render cada frame, bearing-aware, sin deformación del viewport.

### Interaccion 25 - Bug: setTransformConstrain no disponible
- Que se observó: Consola mostraba `setTransformConstrain available: false`. El constrain no se ejecutaba.
- Diagnóstico: `maplibre-gl@5.1.0` (npm) no tiene `setTransformConstrain` en el prototipo. CDN v2.4.0 ya estaba eliminado de index.html.
- Que se hizo:
  - `index.html` → eliminado `<script src="maplibre-gl@2.4.0...">` (CDN JS)
  - `npm install maplibre-gl@^5.17.0` → actualizado a v5.24.0
  - Verificado: `Map.prototype.setTransformConstrain: function` ✅
  - Limpiada caché de Vite: `node_modules/.vite/`
- Finalidad: `setTransformConstrain` ahora disponible y activo. Constrain bearing-aware funcional.

### Interaccion 26 - Verificación y bounds funcionando
- Que se observó: `setTransformConstrain ACTIVADO` en consola. Bounds funcionan correctamente con `boundsPadding: { top: -0.25, bottom: -0.25, left: 0.35, right: 0.35 }`.
- Estado: `setTransformConstrain` (bearing-aware) + `setMaxBounds` (red de seguridad) coexisten. Zoom estable, sin deformación del viewport.

---

### Interaccion 27 - Dimensiones reales de imágenes Cloudinary (2026-06-26)
- Que se pidió: Obtener dimensiones reales de cada imagen para computar bounds correctos.
- Que se hizo:
  - Se usó `fl_getinfo` de Cloudinary para extraer width/height de cada imagen high.
  - Se parsearon headers AVIF/WebP para imágenes que no respondían con fl_getinfo.
- Dimensiones obtenidas:
  - intro: 5649×11141
  - encuadres: 3389×6684
  - bredunco: 5649×11141 (misma imagen que intro)
  - fomasDelPaisaje: 3389×6035
  - ecosistemas: 5846×10394
  - tejidosDelAgua: 5845×10393
  - unRioCaucaMuchosMundos: 6082×10826
- Finalidad: Base para calcular imageBounds reales desde PGW + dimensiones.

### Interaccion 28 - Cómputo de bounds reales y viewportMaxBounds
- Que se pidió: Derivar viewportMaxBounds correctos para cada mapa, validando contra marco de encuadres.
- Que se hizo:
  - Script Node.js que computa `processBounds()` para cada mapa.
  - ImageBounds = [x0, y0+E×H, x0+A×W, y0] con corrección half-pixel.
  - viewportMaxBounds = intersección de imageBounds con marco encuadres.
- Marco encuadres de referencia: `[-78.908544, -0.020898, -71.289352, 12.879199]`
- Archivos modificados:
  - `src/data/mapImages/mapConfig.js` — viewportMaxBounds actualizados
  - `src/data/mapImages/pgwData.js` — F calibrados
  - `src/data/mapImages/mapConfig.js` — bredunco `minZoom` duplicado corregido

### Interaccion 29 - Calibración visual de fomasDelPaisaje
- Que se pidió: Corregir imagen "Pliegues, llanuras y otras Formas del paisaje" corrida a la izquierda.
- Que se hizo:
  - Se ajustó F (latitud origen) en pgwData.js: `7.117097 → 12.647097` (desplazamiento norte de ~600km)
  - El ajuste coloca la imagen en la misma región latitudinal que intro/bredunco
  - viewportMaxBounds north ajustado a `12.739199`
- Lección: Con bearing=-90, izquierda en pantalla = norte geográfico → desplazar a derecha = disminuir F. Pero visualmente el mapa necesitaba IR al NORTE, no al sur. El F final es más alto que el original, no más bajo. La referencia visual del usuario primó sobre la teoría de ejes.

### Interaccion 30 - Consolidación definitiva Capítulo 1
- Que se pidió: Analizar el patrón completo y documentar estado final.
- Que se hizo:
  - Se ejecutó script de análisis de todos los mapas, generando tabla comparativa.
  - Se documentó esta interacción en la bitácora.
- Patrones encontrados:
  - **2 grupos de mapas**: Gran cobertura (A≈0.001-0.002, escala 47-92 m/px) y detalle (A≈0.0002-0.0005, escala 7-19 m/px)
  - **3 variantes de VMB**: Marco completo (intro), Marco ancho (encuadres), Ajustado a imagen (ecosistemas, tejidos)
  - **F cluster**: ~12.6-12.9 (norte Colombia), ~6.3-6.9 (Cauca medio), ~3.7 (sur Cauca)
  - Centros geográficos consistentes: maps de gran cobertura centrados en ~-75.57°, ~6.3°N
  - Maps de detalle: ecosistemas centrado en -76.34°, 3.90°N (sur Cauca); tejidos en -76.48°, 2.83°N (sur extremo)
- bug: `rangoEcosistemas = 2.03` se había eliminado accidentalmente → agregado de nuevo.
- bug: fomasDelPaisaje usaba F=6.117097 (demasiado sur) → corregido a 12.647097.
- Estado: ✅ DEFINITIVO — todos los mapas del Capítulo 1 funcionando correctamente.

---

## Estado actual (2026-06-26) — DEFINITIVO ✅
- **Todos los 7 mapas del Capítulo 1** con PGW estándar (B=D=0, A>0, E<0), bearing=-90, setTransformConstrain activo, OSM basemap disponible.
- **viewportsMaxBounds consolidados** en 3 variantes:
  1. **Marco completo** (intro values): intro, bredunco, fomasDelPaisaje, unRioCaucaMuchosMundos
  2. **Marco ancho** (east=-71.289): encuadres
  3. **Ajustado a imagen** (crop 0): ecosistemas, tejidosDelAgua
- **PGW calibrados** con F ajustado al marco de encuadres (región Cauca: -78.909° a -71.289°, -0.021° a 12.879°).
- **Imágenes reales** medidas vía Cloudinary fl_getinfo (todas verificadas).
- **Zoom** controlado por mapConfig.js, cada mapa con initialZoom propio.
- **bug fix**: `rangoEcosistemas` estaba ausente → agregado (causaba ReferenceError).
- **bug fix**: bredunco tenía `minZoom` duplicado → corregido.

## Pendientes (futuro)
- Implementar `calculateBoundsPadding()` automática
- Remover `setMaxBounds` cuando setTransformConstrain esté 100% verificado en todos los mapas
- Remover logs de debug de useMap.js y debugMapOpacity de mapConfig.js para producción
