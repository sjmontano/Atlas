# TAREAS — Historial Técnico del Proyecto Atlas

> Documento de registro técnico: qué tarea había, qué se hizo y cómo se hizo.
> Referencia de contexto: `MEMORIA_TECNICA.md` (investigación) · `PLAN_ATLAS.md` (planificación)

---

## Convenciones del registro

Cada tarea documenta:
- **Qué había**: el problema o necesidad
- **Qué se hizo**: la solución aplicada
- **Cómo se hizo**: detalle técnico (archivos, fórmulas, decisiones)

---

## TAREA 0 — Análisis profundo de las 3 versiones existentes

**Qué había:** Tres proyectos (`atlas_backend`, `atlas_3.0`, `atlas_frontend_v17`) sin documentación consolidada. No se sabía qué funcionaba, qué estaba roto ni qué debía conservarse.

**Qué se hizo:** Auditoría completa de código fuente, bundles compilados, assets y documentación de las 3 versiones.

**Cómo se hizo:**
- Backend: revisión de los 19 archivos fuente. Hallazgos: credenciales expuestas en `.env`, bug de ruta en `uploads.route.js` (falta `/` inicial en `modal/:modalId`), `informe.md` documenta features inexistentes. **Sentencia: backend innecesario, todo es estático.**
- atlas_3.0: revisión de 177 archivos fuente + 17 docs + bitácora de 34 interacciones. Hallazgos: georreferenciación incorrecta por fórmula de conversión PGW (3 variantes test `intro-pgw-current/transformed/v17` en `atlasMapData.ts` lo admiten), `bredunco` con F sin corregir, código duplicado `components/` vs `ui/`, entry points duplicados.
- v17: catalogado completo del `dist/` (sin source). 12 bundles JS, 6 CSS, 304 assets (~90 MB) inventariados. 31 mapas, 30 capas GeoJSON, 2 MP3, 73 iconos Cap 4, 63 SVG menús Cap 2.
- **Entregable**: `MEMORIA_TECNICA.md` (~1500 líneas): análisis, 38 lecciones de bitácora, investigación de `setTransformConstrain` (issues #4510, #4591, #6484 de maplibre-gl-js), stack óptimo v6.

---

## TAREA 1 — Definición de arquitectura y planificación

**Qué había:** Necesidad de proyecto nuevo desde cero (no migración), aprovechando lo que funciona y corrigiendo lo que no.

**Qué se hizo:** Definición completa de stack, estructura, sistema de carga y convenciones.

**Cómo se hizo:**
- **Stack**: pnpm + Vite + React 19 + TypeScript strict + MapLibre GL 6 + Zustand 5 + React Router 7 + Framer Motion + CSS Modules. Solo 6 dependencias runtime.
- **Estructura plana**: `data/ services/ stores/ hooks/ components/ pages/ types/ styles/ utils/`.
- **Regla híbrida JS/TS**: datos en `.js` (equipo los edita) + `.d.ts` al lado (type-safety para servicios TS). `allowJs: true`, `checkJs: false`.
- **Georreferenciación**: PGW rotado original de v17 como fuente de verdad. `bearing: -90` nativo de MapLibre. `setTransformConstrain` (nunca `setMaxBounds`, bearing-blind). NO rotar imágenes físicamente (elimina GDAL del pipeline runtime).
- **Carga progresiva de mapas en 3 etapas**: placeholder 512px (~10KB) → imagen media Cloudinary (~300KB) → tiles XYZ alta resolución.
- **Viewport clamp**: `createBearingAwareConstrain()` propio (probado en 3.0, 34 iteraciones de debug), NO `maplibre-xy` (resuelve underzoom, no per-map bounds).
- **Entregable**: `PLAN_ATLAS.md` con 9 fases de implementación.

---

## TAREA 2 — Setup del proyecto base

**Qué había:** Nada. Repositorio sin código.

**Qué se hizo:** Proyecto Vite funcional con typecheck y build pasando.

**Cómo se hizo:**
- `pnpm create vite atlas --template react-ts`
- Dependencias: `maplibre-gl@6.0.0 react@19 react-router-dom@7 zustand@5 framer-motion@12` + dev `vitest jsdom @testing-library`.
- `tsconfig.app.json`: strict + `noUncheckedIndexedAccess` + `allowJs` + paths `@data @services @stores @hooks @components @pages @types @utils` (TS 6: paths relativos sin `baseUrl`, deprecated).
- `vite.config.ts`: alias + `manualChunks` por función (Vite 8 ya no acepta objeto) → `vendor-maplibre`, `vendor-react`, `vendor-zustand`.
- Datos iniciales migrados: `pgw.js` (7 mapas Cap 1), `images.js`, `configs.js`, `chapters.js` (4 capítulos, 31 mapas).
- Stores Zustand: `mapStore`, `chapterStore`, `layerStore`, `uiStore`.
- Páginas: `DevMenu` (grid de 31 mapas por capítulo), `TestMapPage` (`/test/:mapId` con navegación prev/next).
- **Validación**: `pnpm typecheck` ✓ · `pnpm build` ✓ (710ms).

---

## TAREA 3 — Servicios core de georreferenciación (Fase 2)

**Qué había:** Datos PGW sin servicios para consumirlos. El proyecto 3.0 tiene el código probado pero con deuda: trazas de debug masivas, imports de dominio, y datos convertidos incorrectamente.

**Qué se hizo:** Port limpio de `BoundsCalculator`, `createBearingAwareConstrain` y `MapLogger` desde atlas_3.0, más reorganización de datos.

**Cómo se hizo:**

### 3.1 Reorganización de datos (`src/data/maps/`)

Decisión: PGW y dimensiones van juntos en `geo.js` — la transformación afín es inútil sin dimensiones, y separarlos obliga a dos lookups.

- `geo.js` — `MAP_GEO`: `{ pgw, width, height }` por mapa. **Dimensiones portrait originales** (bitácora Interacción 27, medidas vía Cloudinary `fl_getinfo`): intro/bredunco 5649×11141, encuadres 3389×6684, formas 3389×6035, ecosistemas 5846×10394, mosaicos 5845×10393, un-rio-cauca 6082×10826.
- `images.js` — URLs Cloudinary + placeholder transform (`w_512,q_30,f_webp`).
- `configs.js` — zoom/bearing/interacción por mapa.
- `index.js` — `getMapEntry(mapId)` unificado.

### 3.2 `BoundsCalculator.ts` (servicio)

Transformación afín World File:
```
lng = A·col + B·row + C
lat = D·col + E·row + F
```

Esquinas con corrección half-pixel (C/F son centro del píxel (0,0), no esquina):
```
x0 = C − 0.5·A − 0.5·B
y0 = F − 0.5·D − 0.5·E
TL = [x0, y0]                    TR = [x0 + A·W, y0 + D·W]
BR = [x0 + A·W + B·H, y0 + D·W + E·H]
BL = [x0 + B·H, y0 + E·H]
```

**Clave**: la fórmula es genérica — funciona con PGW rotado (A=0, E=0, B≠0, D≠0) sin conversión. Con PGW rotado: lng depende de `row` (B·row), lat depende de `col` (D·col). La imagen tiene "norte a la derecha", y `bearing: -90` de MapLibre rota el viewport para alinearla. Cero GDAL, cero Turf.js.

API exportada: `calculateImageCoordinates`, `calculateGeographicBounds`, `calculateCenter`, `validateBounds`, `processBounds`.

### 3.3 `TransformConstrain.ts` (servicio)

Port de `createBearingAwareConstrain()` (`useAtlasMap.ts:100-183` de 3.0):

- **Paso A — minZoom bearing-aware**: `dpp(z) = 360/(512·2^z)`. Para que el viewport quepa en el bound: con bearing ±90° el ancho de pantalla W cubre `latSpan` y el alto H cubre `lonSpan` (ejes invertidos). `minZoom = max(log2(W·360/(512·latSpan)), log2(H·360/(512·lonSpan)))`.
- **Paso B — clamp zoom** antes de calcular dpp.
- **Paso C — clamp centro**: resta el half-extent del viewport (`(W/2)·dpp`, `(H/2)·dpp`) al bound según el bearing. Si el span es menor que el viewport, centra.
- **Guardrail**: lat ∈ [−89.9, 89.9], lng ∈ [−179.9, 179.9].

Por qué esto y no `setMaxBounds`: MapLibre clampea LON con viewport WIDTH y LAT con HEIGHT siempre (axis-aligned). Con bearing −90° los ejes visuales se intercambian → restricción errónea. `transformConstrain` ejecuta PRE-render cada frame, sin loop de feedback (lección #2 bitácora: `move`+`setCenter` es inviable).

### 3.4 `MapLogger.ts`

Logger por entorno: `debug/info` solo en DEV, `warn/error` siempre. Categorías por servicio.

### 3.5 Tests

- `BoundsCalculator.test.ts`: verifica esquinas y bounds del mapa intro contra valores calculados a mano (west=−78.9085, east=−65.7393, south=−0.2906, north=6.3864).
- `TransformConstrain.test.ts`: verifica clamp de centro fuera de bounds, minZoom, y que el centro dentro de bounds no se altera.

---

---

## TAREA 4 — Corrección de hallazgos: v17 SÍ tiene source + clarificación PGW

**Qué había:** MEMORIA_TECNICA.md afirmaba que v17 no tiene código fuente (solo dist/). PLAN_ATLAS.md decía "reconstruir desde cero".

**Qué se hizo:** Descubrimiento de que v17 SÍ tiene source en `atlas_front/atlas_frontend_v17/src/`. Corrección de documentos para reflejar que es una **migración** (no invención nueva) y clarificación del formato PGW.

**Cómo se hizo:**
- Se encontró que `atlas_front/atlas_frontend_v17/src/` tiene: `App.jsx`, `main.jsx`, `components/` (InfoModal, AudioPlayer, GaleriaChapter2, Capas, Iconos, etc.), `views/`, `data/mapImages/` (pgwData.js en formato CONVERTIDO, no rotado).
- Se verificó que el `pgwData.js` de v17 tiene PGW en **formato estándar convertido** (A≠0, E≠0, B=0, D=0) — ya rotados 90°.
- El `geo.js` de `atlas/` tiene los **originales rotados** (A=0, E=0, D≠0, B≠0) proporcionados por el usuario. Son correctos y no se convierten.
- Se creó `GUIDE.md` — guía rápida para localizar archivos sin gastar tokens.
- Se corrigió MEMORIA_TECNICA.md: sección de v17 ahora refleja que tiene source, y se añadió aclaración sobre los dos formatos PGW.
- Se corrigió PLAN_ATLAS.md: ahora dice "migración" no "reconstruir", y se agregaron reglas estrictas (nada nuevo, solo modificar atlas/).
- Se actualizó TAREAS.md con esta entrada.

**Archivos modificados**:
- `MEMORIA_TECNICA.md` — corrección sección 4 (v17 tiene source), añadida aclaración PGW sección 14.3, reemplazada sección 16 con reglas del proyecto y fuentes de datos.
- `PLAN_ATLAS.md` — objetivo cambiado a migración, tabla de decisiones actualizada, notas reemplazadas con reglas clave.
- `TAREAS.md` — esta entrada añadida.
- `GUIDE.md` — CREATED (nuevo): guía rápida con ubicación de todos los archivos clave.

### Archivos importantes descubiertos en v17 source

| Archivo | Contenido |
|---------|-----------|
| `.../src/App.jsx` | Router principal v17 |
| `.../src/main.jsx` | Entry point v17 |
| `.../src/components/InfoModal/` | Modales con layouts Luyaut1/Luyaut2 (texto completo) |
| `.../src/components/AudioPlayer/` | Reproductor de audio |
| `.../src/components/GaleriaChapter2/` | Galerías de imágenes Cap 2 |
| `.../src/components/Capas/` | Gestión de capas SVG |
| `.../src/components/Iconos/` | Iconos Cap 4 |
| `.../src/components/Entramados/` | Vista de entramados |
| `.../src/data/mapImages/pgwData.js` | PGW en formato CONVERTIDO (estándar, 880 líneas) |
| `.../src/data/mapImages/geoMapping.js` | URLs de imágenes por mapa |
| `.../src/data/mapImages/mapConfig.js` | Configs de mapa (zoom, bearing, interacción) |

### Pendiente

- [ ] Extraer modales (texto) de v17 source `components/InfoModal/`
- [ ] Extraer galerías Cap 2 de v17 source `components/GaleriaChapter2/`
- [ ] Extraer audio player de v17 source `components/AudioPlayer/`
- [ ] Extraer Iconos Cap 4 de v17 source `components/Iconos/`
- [ ] Extraer Entramados de v17 source `components/Entramados/`
- [ ] Extraer GeoJSON capas del backend
- [ ] Copiar assets de `v17/dist/assets/` a `atlas/public/assets/`
- [ ] Implementar sistema de modales
- [ ] Implementar sistema de capas
- [ ] Implementar sistema de puntos

---

## TAREA 5 — Panel de calibración inline + fix de fuga de estado entre mapas

**Qué había:** El usuario calibraba manualmente los mapas copiando valores a `geo.js` con el flujo: editar `geo.js` → recargar → verificar. Lento e impreciso. No había feedback visual en tiempo real de cómo afectaba cada parámetro del PGW (escala, posición, dimensiones) a la imagen sobre el mapa base.

**Qué se hizo:** Panel dev-only (`VITE_DEV_TOOLS`) superpuesto al mapa con steppers, drag-to-move, readout vivo y export a clipboard. Fix de fuga de estado que causaba que al navegar entre mapas el panel aplicara los valores del mapa anterior al nuevo.

**Cómo se hizo:**

### 5.1 Servicios de calibración (`MapCalibration.ts`)

Funciones puras sin estado:
- `pgwToState(pgw, width, height)` → estado del panel `{ d, b, c, f, width, height }`
- `stateToPGW(state)` → PGW `[0, d, b, 0, c, f]` (A/E siempre 0, solo mapas rotados)
- `shiftOrigin(pgw, dLng, dLat)` → desplaza C/F en grados
- `scaleParam(pgw, 'd'|'b', factor)` → multiplica D o B por factor (escala %)
- `resizeDims(width, height, dW, dH)` → ajusta dimensiones en píxeles
- `clampCalibration(state)` → sanitiza valores (D/B ∈ [1e-12, 1], C ∈ [−180, 180], F ∈ [−90, 90], dims ∈ [1, 100000])

Tests: 15 tests en `MapCalibration.test.ts` (shift, scale, clamp, roundtrip pgwToState/stateToPGW).

### 5.2 Panel UI (`CalibrationPanel.tsx` + `.module.css`)

- **Steppers**: botones −−/−/+/++ para cada parámetro.
  - D/B: paso % configurable (0.01% default, selector 0.01%–10%); fino ×0.1
  - C/F: paso 0.0005° deg (≈55 m en el ecuador), fino ×0.2
  - width/height: paso 10px (fino 1px)
- **Modo mover** (drag-to-move): desactiva `dragPan` del mapa, captura `pointerdown/move/up` vía `map.unproject([x,y])` y aplica `shiftOrigin(-dLng, -dLat)`. Cursor cambia a `move`. Al desactivar, restaura `dragPan`.
- **Readout vivo**: `F_std` (F + B·H), coordenadas NW/SE, spans lon/lat, aspecto geo, px/°.
- **Copiar**: snippet formato geo.js con `// ← calibrado` si hay cambios.
- **Reset**: restaura al `originalRef` (valores de geo.js al montar el panel).
- **Aplicar** (ver TAREA 6): guarda en geo.js vía middleware dev + reconstruye mapa.

Estilo: panel flotante top-right, vidrio esmerilado `rgba(3,9,30,0.88)`, borde `rgba(5,153,183,0.35)`.

### 5.3 Integración con MapRenderer (`MapController`)

Interfaz `MapController = { map: Map, updateBounds(pgw, width, height): BoundsResult }` expuesta en `BuildMapResult.controller`. `updateBounds()` recalcula coordenadas vía `processBounds` y las aplica al `ImageSource` con `source.setCoordinates()` sin reconstruir el mapa (live preview).

### 5.4 Wiring (`TestMapPage.tsx`)

- `AtlasMap` con `controllerRef` opcional.
- `CalibrationPanel` con `mapId`, `controllerRef`, `onRebuild` (bump `rebuildKey`).
- Navegación prev/next entre los 31 mapas.

### 5.5 Fix de fuga de estado (bug crítico)

**Problema:** El CalibrationPanel no estaba keyed por `mapId` (solo AtlasMap lo estaba). Al cambiar de mapa, `seedState(mapId, state ?? undefined)` reutilizaba el `state` del mapa anterior (non-null), nunca leyendo `geo.js` del nuevo mapa. `originalRef` tampoco se resiembraba → Reset volvía a valores del primer mapa. Esto causaba que chapter2-cali "saltara" al calibrar y que chapter2-valle mostrara D/B idénticos a chapter1-un-rio-cauca (copia del leak).

**Fix:**
- `TestMapPage.tsx:45`: `<CalibrationPanel key={currentMap.mapId} .../>` para remount limpio.
- `CalibrationPanel.tsx:79`: efecto `[mapId]` resiembra siempre desde geo.js (`seedState(mapId)` sin el segundo argumento) y resetea `originalRef`, `dirty`, `moveMode`.

**Archivos nuevos:**
- `src/services/MapCalibration.ts`
- `src/components/calibration/CalibrationPanel.tsx`
- `src/components/calibration/CalibrationPanel.module.css`
- `tests/services/MapCalibration.test.ts`

**Archivos modificados:**
- `src/services/MapRenderer.ts` — interfaz `MapController`, `updateBounds()`
- `src/hooks/useMap.ts` — `controllerRef` opcional
- `src/components/map/AtlasMap.tsx` — prop `controllerRef`
- `src/pages/TestMapPage.tsx` — wiring del panel + `rebuildKey`

**Verificación:** 29 tests (14 BoundsCalculator + 15 MapCalibration) ✓ · lint ✓ · typecheck ✓ · build (389ms) ✓.

---

## TAREA 6 — "Aplicar" persiste calibración en `geo.js` (dev-only middleware)

**Qué había:** El botón "Aplicar" solo hacía `onRebuild()` → el mapa se reconstruía desde `geo.js` original, descartando la calibración del panel. La única forma de persistir era "Copiar" y pegar manualmente en el archivo fuente.

**Qué se hizo:** Middleware en el dev server de Vite (`POST /__calibration/save`) que recibe los valores del panel y reescribe la entrada del mapa en `src/data/maps/geo.js`. El botón "Aplicar" ahora guarda + reconstruye, aplicando los cambios al código real.

**Cómo se hizo:**

### 6.1 `geoRewrite.ts` (función pura, testeable)
- `rewriteGeoEntry(src, mapId, { pgw, width, height })` → valida `mapId` con `/^[A-Za-z0-9_-]+$/`, localiza el bloque con regex `^  'id': \{[\s\S]*?\r?\n  \},` (compatible CRLF/LF) y reemplaza por bloque regenerado en formato 2-space indent.
- Error claro si la entrada no existe o el id es inválido.
- 7 tests en `tests/services/geoRewrite.test.ts` (reemplazo, último entry, CRLF, round width/height, id inválido, id inexistente, preservación del resto del archivo).

### 6.2 `SaveCalibration.ts` (fetch helper)
- `saveCalibration({ mapId, pgw, width, height })` → `POST /__calibration/save` con JSON; lanza error legible si falla.

### 6.3 Plugin Vite (`vite.config.ts`)
- `calibrationSavePlugin()`: `apply: 'serve'`, `configureServer` con middleware en `/__calibration/save`.
- Valida body (mapId string alfanumérico, pgw array de 6 números finitos, width/height positivos).
- `readFileSync` → `rewriteGeoEntry` → `writeFileSync` → responde `{ ok: true }`.
- Ruta fija, sin path traversal. Solo en dev server.

### 6.4 Panel wiring (`CalibrationPanel.tsx`)
- Nuevo handler `apply()`: `saveCalibration(...)` → si OK: `originalRef = state`, dirty → false, `onRebuild()` → el mapa se reconstruye leyendo geo.js actualizado.
- Nuevo estado `saveError` + display de error en el panel.
- Botón "Aplicar" con nuevo title "Guardar valores en geo.js y reconstruir mapa".

**Archivos nuevos:**
- `src/services/geoRewrite.ts`
- `src/services/SaveCalibration.ts`
- `tests/services/geoRewrite.test.ts`

**Archivos modificados:**
- `vite.config.ts` — plugin `calibration-save`
- `src/components/calibration/CalibrationPanel.tsx` — handler `apply`, `saveError`
- `src/components/calibration/CalibrationPanel.module.css` — clase `.error`

**Verificación:** 36 tests (29 previos + 7 geoRewrite) ✓ · lint ✓ · typecheck ✓ · build (529ms) ✓.

**Diagnóstico de calibraciones (análisis, sin modificar geo.js):**
- **chapter2-cali**: datos correctos (span 0.079°×0.140° ≈ 8.8×15.6 km, aspect imagen = geo = 1.7786). 4960×8822 no es "demasiado grande" — los píxeles son resolución de escaneo; el tamaño geográfico lo determinan D/B (~1.77 m/px). El "salto al calibrar" era el bug de fuga de estado (TAREA 5.5).
- **chapter2-valle**: D/B reportados por el usuario = idénticos a chapter1-un-rio-cauca → artefacto de la fuga, no calibración real. Datos actuales de geo.js: span 0.615°×1.089°, aspect 1.7704≈1.7705, consistentes.
- **chapter1-un-rio-cauca**: calibración fine-tune plausible (D +0.2%, width +10px, B≈D) reportada por el usuario. No aplicada a geo.js por decisión del usuario.
- **Hallazgo estructural**: 4 mapas comparten dims 4960×8822 (chapter2-cali, chapter2-villa-rica, chapter3-encharcaron, chapter3-cali-deseca) → sospecha de template/escaneo compartido.

---

## TAREA 7 — Corrección de errores de consola (AbortError + doble montaje)

**Qué había:** La consola mostraba cientos de `Uncaught (in promise) AbortError: signal is aborted without reason` desde MapLibre, más un doble log `[MapRenderer] Mapa construido` por el doble montaje de React Strict Mode (dev). Aunque el mapa funcionaba correctamente, la consola quedaba saturada de ruido rojo.

**Qué se hizo:** Supresión global de AbortErrors, cleanup ordenado del basemap antes de destruir el mapa, y try/catch en `addBasemap`.

**Cómo se hizo:**

### 7.1 Causa raíz de los AbortError

MapLibre internamente lanza `AbortError` cuando:
1. `map.remove()` destruye el contexto WebGL mientras tiles del basemap (raster) están en vuelo.
2. El `RasterTileSource` aborta tiles que salen del viewport durante la renderización.

El basemap `useEffect` no tenía cleanup → las fuentes raster se eliminaban dentro de `map.remove()` (junto con el contexto GL), impidiendo la cancelación ordenada de requests HTTP.

### 7.2 Fix 1 — Cleanup del basemap (`AtlasMap.tsx:27-38`)

```ts
useEffect(() => {
  const map = mapRef.current
  if (!map) return
  if (basemapVisible) {
    addBasemap(map, basemapStyle)
  } else {
    removeBasemap(map)
  }
  return () => { removeBasemap(map) }  // ← NUEVO
}, [basemapVisible, basemapStyle, mapRef])
```

Ahora el basemap se remueve explícitamente antes de que `map.remove()` destruya el contexto, permitiendo a MapLibre cancelar tiles ordenadamente.

### 7.3 Fix 2 — try/catch en `addBasemap` (`BasemapManager.ts:17`)

`removeBasemap` ya tenía try/catch pero `addBasemap` no. Envolver `map.addSource()` y `map.addLayer()` para evitar excepciones no capturadas si el mapa está en proceso de destrucción.

### 7.4 Fix 3 — Graceful destroy (`MapRenderer.ts:172-184`)

`destroy()` ahora remueve todas las fuentes del estilo antes de llamar `map.remove()`:

```ts
destroy: () => {
  try {
    const style = map.getStyle()
    if (style?.sources) {
      for (const id of Object.keys(style.sources)) {
        try { if (map.getSource(id)) { map.removeSource(id) } } catch { }
      }
    }
  } catch { }
  try { map.remove() } catch { }
}
```

Esto reduce aún más la ventana de race condition entre tiles HTTP y destrucción de WebGL.

### 7.5 Fix 4 — Supresión global de AbortError (`main.tsx`)

Handler `unhandledrejection` que captura `DOMException` con `name === 'AbortError'` y llama `event.preventDefault()`. Esto silencia los AbortError residuales que MapLibre emite internamente fuera del alcance de nuestro código. Solo aplica a AbortError (no a otros errores), y solo a promesas no manejadas (nuestro código sigue capturando sus propios AbortErrors con `.catch()`).

**Archivos modificados:**
- `src/services/BasemapManager.ts` — try/catch en `addBasemap`
- `src/components/map/AtlasMap.tsx` — cleanup en basemap `useEffect`
- `src/services/MapRenderer.ts` — `destroy()` remueve fuentes antes de `map.remove()`
- `src/main.tsx` — handler global `unhandledrejection`

**Verificación:** 36 tests ✓ · lint ✓ · typecheck ✓ · build (400ms) ✓.

---

## TAREA 8 — Slider de escala por % en el panel de calibración

**Qué había:** El tamaño de imagen (width/height) solo se ajustaba con steppers manuales (+10/±1 px). Escalar un mapa al 80% o 120% implicaba calcular y escribir los dos valores a mano.

**Qué se hizo:** Deslizador "Tamaño %" en el panel que escala **width y height juntos** (escala uniforme) en base a un porcentaje relativo a los valores originales de `geo.js`.

**Cómo se hizo:**

### 8.1 Handler `onSizeScale` (`CalibrationPanel.tsx`)

- Rango del slider 5%–500% (paso 1%), seguro frente al clamp de 100000px.
- Al mover: `width = Math.round(orig.width * pct/100)`, `height = Math.round(orig.height * pct/100)` donde `orig` es `originalRef.current` (valores de geo.js al montar).
- Pasa por `clampCalibration` + `applyAndUpdate` → actualiza bounds del mapa en vivo y flags dirty.
- El % mostrado se deriva del estado actual: `state.width / original.width * 100` (si se calibró width manualmente, el slider refleja el % equivalente).

### 8.2 UI

- Fila `Tamaño %` con `<input type="range">` + label + valor actual, colocada justo después de las filas width/height.
- CSS `.sizeSlider`: `flex: 1`, `accent-color: var(--primary-blue)`, `cursor: pointer`.

**Archivos modificados:**
- `src/components/calibration/CalibrationPanel.tsx` — `onSizeScale`, `sizePct`, fila slider
- `src/components/calibration/CalibrationPanel.module.css` — `.sizeSlider`

**Verificación:** 36 tests ✓ · lint ✓ · typecheck ✓ · build (597ms) ✓. Commit `d1c2aaf` (con TAREA 7 y calibraciones de datos).

---

## TAREA 9 — Rotación de la imagen atlas en `chapter4-problematicas` (solo datos)

**Contexto / análisis:** El objetivo original (dejar el basemap norte-arriba con bearing 0) se corrigió con el usuario: el basemap ya quedó bien, **lo que debe rotar es la imagen atlas** para dejarla en vertical. El ángulo efectivo correcto es ≈ **−30°** (no 0 ni −90).

**Resolución final (datos):**
- `configs.js` — `chapter4-problematicas`: `initialBearing: -30` (se conservan `initialZoom: 10`, `minZoom: 10`, `maxZoom: 13`).
- `geo.js` — `chapter4-problematicas`: PGW rotado `[1.194087e-6, -2.068220e-6, -2.068153e-6, -1.194048e-6, -76.485574, 3.436552]` (A≠0, B≠0, D≠0, E≠0 → rotación real embebida).

**Cómo funciona sin tocar código:** al tener A≠0 y E≠0, `isRotatedPGW()` es false → `processBounds` usa la transformada afín general (BoundsCalculator.ts:128-148) y la imagen se renderiza ya rotada. **Advertencia crítica:** el PGW NO debe quedar con A≈0 y E≈0 (formato retrato puro), porque `processBounds` lo auto-convertiría a norte-arriba con `convertRotatedPGW` y **desharía la rotación**. Verificado: `processBounds` genera las 4 esquinas en Cali (~−76.485/−76.504, 3.415/3.437), span tile ≈ 2.8e-5 Mercator → zoom tile ≈ 11, sin NaN ni desbordes.

**Diagnóstico del crash `z=35` del panel (dev-tools):** NO lo causa el PGW actual. En maplibre-gl v6, `ImageSource.setCoordinates` → `getCoordinatesCenterTileID` calcula `zoom = floor(−log2(span Mercator de las 4 esquinas))` (maplibre-gl-dev.mjs:3884) y `CanonicalTileID` lanza "outside of bounds" para `z > 25` (maplibre-gl-dev.mjs:25166). El trigger real: el PGW rotado tiene `d`/`b` **negativos** (−2.068e-6), pero `clampCalibration` los forzaba al rango positivo `[1e-12, 1]` → al reset se mostraban `D=B=1e-12` y el polígono colapsaba a un punto (span ~2⁻³⁵) → z=35 → crash. El `x/y` reportados a z=35 decodifican exactamente al centro de la imagen.

**Archivos modificados:**
- `src/data/maps/configs.js` — `initialBearing: -30`
- `src/data/maps/geo.js` — PGW rotado de `chapter4-problematicas`

**Verificación:** lint ✓ · typecheck ✓ · tests ✓ · build ✓. Commit `8761dce`.

---

## TAREA 11 — Plan exhaustivo de faceta 2 (tiles, estética, rendimiento, CDN, contingencias)

> **Documento maestro:** [`FACETA_2_TILES_PLAN.md`](FACETA_2_TILES_PLAN.md)
>
> Cubre 8 secciones con análisis completo de alternativas, pros/contras,
> decisiones descartadas con justificación, e instrucciones paso a paso.

### Resumen de sub-tareas

| Subtarea | Descripción | Doc § |
|----------|-------------|-------|
| 11a — Pulir fade-in/estética | Eliminar doble-fade (base=0, tiles=300), reordenar pipeline, validar visualmente z6→z11 | §1 |
| 11b — Rendimiento bajo | maxParallelImageRequests=4, Service Worker z6-z8, lowPowerMode | §2, §3 |
| 11c — CDN/despliegue | .htaccess immutable, vercel.json headers, URLs redundantes, Cloudflare R2 opcional | §4 |
| 11d — Contingencias | Timeout/retry, fallback sin tiles, WebGL context lost, modo sin conexión | §5 |
| 11e — Regenerar tiles existentes | QUALITY 90→95, generar z12 para over-zoom, re-pipeline con full antes de tiles | §6 |

### Estado actual

- [x] Piloto `chapter1-ecosistemas`: 2417 tiles WebP (z6-z12, 26.46 MB) generados y validados
- [x] Runtime integrado: `addTilesLayer` en `MapRenderer.ts` con cache inmutable
- [x] Vite tilesServePlugin con 404 real + Cache-Control immutable
- [x] **11a (parcial)** — Fade-in: `raster-fade-duration: 0` en capa base + pipeline reordenado (full antes de `addTilesLayer`). Pendiente: validación visual z6→z11
- [x] **11a (fix)** — Doble-build bajo StrictMode: contador de generación `buildGen` en `useMap`
- [x] **11a (logging nivel Z)** — `MapLogger` con niveles + telemetría por-tile + `?log=<nivel>`
- [x] **11b (parcial)** — `config.MAX_PARALLEL_IMAGE_REQUESTS = 4` (2 en lowPowerMode). Pendiente: Service Worker precache activo
- [x] **11e** — QUALITY 90→95 + regeneración con z12 (2417 tiles, 26.46 MB). `fadeInDuration` → `fadeDuration`. Tiler ahora usa `tiles.maxZoom` como fuente de verdad.
- [x] **Service Worker** — `public/sw.js` con cache-first para tiles XYZ. Registro en `main.tsx` (prod o `VITE_ENABLE_SW=true` en dev).
- [x] **lowPowerMode** — Toggle en `uiStore` (auto-detecta `navigator.hardwareConcurrency ≤ 4`). Reduce `MAX_PARALLEL_IMAGE_REQUESTS` a 2 y `raster-fade-duration` a 0 en modo bajo consumo. Pasado como `BuildOptions` desde `useMap`.
- [ ] **11c** — CDN / multi-URL con fallback
- [ ] Generar tiles del resto de Cap 1 (6 mapas más)
- [ ] Generar tiles Cap 2-4 (a medida que se calibren originales)

**Ver referencia completa:** [`FACETA_2_TILES_PLAN.md`](FACETA_2_TILES_PLAN.md)

---

## TAREA 10 — Panel de calibración compatible con mapas rotados (A/E + clamp con signo)

**Qué había:** El panel (dev-tools, `VITE_DEV_TOOLS=true`) rompía los mapas con rotación real (A≠0, E≠0):
1. `stateToPGW` forzaba `[0, d, b, 0, c, f]` (MapCalibration.ts) → al montar, `CalibrationPanel` re-llamaba `updateBounds` con A=0/E=0 → `processBounds` detectaba PGW "retrato" y aplicaba una rotación rígida de 90°, **deshaciendo el −30° manual** de `chapter4-problematicas`.
2. `clampCalibration` clampeaba `d`/`b` a `[1e-12, 1]` (solo positivos) → los coeficientes negativos de un PGW rotado se mostraban como `1e-12` al Reset → polígono degenerado → **crash `z=35`** en maplibre-gl v6.
3. `destroy()` removía sources antes que layers → `Error: Source "basemap-devtool" cannot be removed while layer "basemap-devtool-layer" is using it.` al cambiar de mapa.

**Qué se hizo:**
- `CalibrationState` ahora incluye `a` y `e`; `pgwToState` extrae los 6 coeficientes y `stateToPGW` reconstruye el PGW completo. La rotación sobrevive al round-trip del panel (montar, drag, nudge, reset, aplicar).
- `clampScale()` preserva el signo y la magnitud exacta `0` (PGW retrato legítimo con A=0/E=0), clampeando solo la magnitud a `[1e-12, 1]` para escalas no nulas.
- `copyPGW` emite los 6 coeficientes: `pgw: [a, d, b, e, c, f]`.
- Guard anti-degenerado en `MapRenderer.updateBounds` (`isNonDegenerate`): si el span Mercator de las 4 esquinas es < 2⁻²⁵, **no** llama `source.setCoordinates` (evita el crash z>25 ante cualquier estado extremo, p. ej. width/height = 1 con escala mínima).
- `destroy()` remueve primero todas las **layers** y después las **sources** (evita el error de la source en uso).

**Cómo se hizo (archivos):**
- `src/services/MapCalibration.ts` — `CalibrationState` +`a`/`e`, `pgwToState`/`stateToPGW` de 6 coeficientes, `clampScale` con signo.
- `src/components/calibration/CalibrationPanel.tsx` — `copyPGW` con los 6 coeficientes (los steppers siguen exponiendo solo D/B/C/F; A/E se preservan sin editar).
- `src/services/MapRenderer.ts` — `isNonDegenerate()` + guard en `updateBounds`; orden layers→sources en `destroy()`.
- `tests/services/MapCalibration.test.ts` — casos nuevos: round-trip de PGW con rotación real, clamp con signo, `processBounds` NO auto-convierte un PGW A≠0/E≠0.

**Verificación:** 39 tests ✓ · lint ✓ · typecheck ✓ · build ✓. Commit `2963e1c`.
