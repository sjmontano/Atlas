# Sistema de Capas, Menú Desplegable, Calibración Multi-Capa y POIs — Diseño

**Fecha:** 2026-08-10
**Alcance:** `atlas/` (frontend principal). Solo lectura de `atlas_front/atlas_frontend_v17/`.
**Enfoque:** Spec completa en orden de dependencias (tipos → datos → store → servicios → componentes → integración → tests).

---

## 1. Modelo de Datos

### 1.1 Tipos (`src/types/layer.ts` extendido)

```ts
type LayerType = 'raster-pgw' | 'raster-tiles' | 'geojson'

interface LayerBase {
  id: string; name: string; category: LayerCategory
  group?: string; visibleByDefault?: boolean; opacity?: number
  order: number
  legend?: { swatch?: string; description?: string; longText?: string }
}

interface RasterPgwLayer extends LayerBase {
  type: 'raster-pgw'
  image: string; pgw: PGWData; width: number; height: number
}

interface RasterTilesLayer extends LayerBase {
  type: 'raster-tiles'
  urlTemplate: string; tileSize: number; minZoom: number; maxZoom: number
  fadeDuration?: number
}

interface GeojsonLayer extends LayerBase {
  type: 'geojson'
  url: string; geometry: 'fill' | 'line' | 'symbol' | 'circle'
  paint: Record<string, unknown>
}

interface LayerGroup {
  id: string; name: string; parent?: string; order: number
}
```

### 1.2 POIs (`src/types/poi.ts`)

```ts
interface Poi {
  id: string; numero?: number; name: string
  coords: [number, number]; capa?: string
  popup: { title: string; body?: string; image?: string; audio?: string }
  angle?: number; icon?: string
}
```

---

## 2. Archivos de Datos

```
src/data/layers/
  index.js / index.d.ts       → LAYERS, LAYER_GROUPS, getMapLayers(mapId), getLayerGroups(mapId)
  calibration.js              → LAYER_CALIBRATIONS (solo overrides de PGW calibrados, dev-only)
  chapter1-ecosistemas.js     → 7 composites como raster-pgw
  groups/ecosistemas.js       → 7 grupos (clasificación oficial de la comunidad)
  shared/ecosistemas.js       → 29 sub-capas individuales (data-ready, no visibles por defecto)

src/data/pois/
  index.js / index.d.ts       → POIS, getPois(mapId)
  bredunco.js                 → unos pocos POIs de prueba
```

**Reglas:**
- `shared/*.js` exporta la lista canónica SIN duplicar.
- El archivo por mapa decide qué capas usa y ajusta `order`/`visibleByDefault`/overrides.
- `calibration.js` es la ÚNICA fuente de PGW calibrados para capas; `LayerManager` hace merge en runtime.
- Sin calibración → se usan los datos de `shared/` o del archivo por mapa.

---

## 3. Store (`src/stores/layerStore.js` extendido)

```ts
interface LayerState {
  visibleLayers: Set<string>
  opacities: Record<string, number>
  activeCategories: Set<string>       // existente
  selectedForCalibration: Set<string> // multi-selección para calibrar
  expandedGroups: Record<string, boolean>

  toggleLayer(id)
  setLayerOpacity(id, opacity)
  setLayerGroupVisible(groupId, visible) // tri-state derivado en UI
  toggleCalibrationSelection(id)
  setCalibrationSelection(ids)
  clearCalibrationSelection()
  toggleGroupExpanded(groupId)
  resetAll(mapId) // reconfigura clave de persistencia al cambiar de mapa
}
```

**Tri-state del checkbox de grupo:** Derivado en el componente, no almacenado. Si todas las capas visibles → checked; ninguna → unchecked; algunas → indeterminate.

**Persistencia:** `visibleLayers` + `opacities` en `localStorage` con clave `atlas:layers:{mapId}`, vía `subscribe` manual (no middleware `persist` de Zustand — incompatible con clave dinámica por mapa). `selectedForCalibration` y `expandedGroups` NO se persisten (estado efímero).

---

## 4. Servicios

### 4.1 LayerManager (`src/services/LayerManager.ts`)

Servicio puro (sin React), patrón BasemapManager:

```ts
sync(map, mapId, layers, groups, storeState): void
addLayer(map, layer, state): void
updateLayerPGW(map, layerId, pgw, width, height): void
removeLayer(map, layerId): void
removeAll(map): void
```

**Source IDs:** `atlas-layer-{layerId}`.

**Z-order determinista:**

| Z | Capa | ID |
|---|---|---|
| 0 | background | `background` |
| 1 | basemap | `basemap-devtool-layer` |
| 2 | imagen base | `atlas-base-image-layer` |
| 3 | tiles base | `atlas-tiles-layer` |
| 4+ | capas temáticas | `atlas-layer-{id}` por `order` ascendente |
| N | POIs | `atlas-pois-layer` |

**Inserción:** `map.addLayer(def, beforeId)` donde `beforeId` es la capa con el siguiente `order` mayor, o `atlas-pois-layer` si es la última.

**Carga on-demand:** Los sources de capas con `visibleByDefault: false` NO se agregan hasta el primer toggle. `visibleByDefault: true` se precargan en `sync` inicial.

**Merge de calibración:** Al cargar una capa, si `LAYER_CALIBRATIONS[layerId]` existe, pisa `pgw`/`width`/`height`.

### 4.2 PoiManager (`src/services/PoiManager.ts`)

```ts
addPois(map, mapId, pois): void   // 1 capa symbol data-driven
removePois(map): void
```

Capa única `atlas-pois-layer`, source `geojson` construido en runtime. Click → popup nativo o callback `onPoiClick`. Siempre visible, z-order máximo.

### 4.3 SaveCalibration (`src/services/SaveCalibration.ts` extendido)

```ts
interface SaveCalibrationPayload {
  target: 'map' | 'layers'
  mapId: string
  layerIds?: string[]
  entries?: { id: string; pgw: PGWData; width: number; height: number }[]
}
```

---

## 5. Componentes

### 5.1 LayerMenu (`src/components/map/LayerMenu.tsx` + CSS Module)

Panel flotante colapsable:
- Header "🗂 Capas" + toggle
- Checkbox maestro "Todas" (tri-state derivado)
- Árbol desde `LAYER_GROUPS[mapId]` + `LAYERS[mapId]`
- Grupo: checkbox tri-state + nombre + badge `(N)` + flecha expandir
- Capa: checkbox + swatch + nombre + tooltip description
- Slider opacidad al hover
- Botón modo calibración → checkboxes pasan a `selectedForCalibration`, CTA "✨ Calibrar selección (N)"
- Si `!LAYERS[mapId]` → no se renderiza

### 5.2 CalibrationPanel multi-capa (extensión de `CalibrationPanel.tsx`)

- Selector: `[🗺 Mapa base] | [📐 Capas: N]`
- Estado por capa: `Map<string, CalibrationState>` + `originalRef: Map<string, CalibrationState>`
- Mini-selector: "Capa 2/3 ▾"
- Drag en grupo: `shiftOrigin` a todas
- Delta compartida al aplicar a todas:
  - **C/F → delta absoluta** (Δ = nuevo − original, mismo Δ para todas)
  - **D/B → delta multiplicativa** (factor = nuevo / original, mismo factor para todas)
- Solo visible con `VITE_DEV_TOOLS=true`

### 5.3 PoiModal (`src/components/map/PoiModal.tsx`)

Título, cuerpo, imagen opcional, audio opcional. Abierto desde `activePoi` en AtlasMap.

### 5.4 AtlasMap.tsx (integración)

```tsx
const layers = useMemo(() => getMapLayers(mapId), [mapId])
const groups = useMemo(() => getLayerGroups(mapId), [mapId])
const pois = useMemo(() => getPois(mapId), [mapId])
const [activePoi, setActivePoi] = useState<Poi | null>(null)

useEffect(() => { layerStore.resetAll(mapId) }, [mapId])           // cambio de mapa
useEffect(() => { LayerManager.sync(map, mapId, layers, groups, storeState) }, [visibleLayers, opacities, map])
useEffect(() => { if (pois) PoiManager.addPois(map, mapId, pois) }, [pois, map])

{hasLayers && <LayerMenu />}
{activePoi && <PoiModal poi={activePoi} onClose={() => setActivePoi(null)} />}
```

---

## 6. Dev Tooling

### 6.1 `calibration.js` + `rewriteLayerCalibration`

`src/data/layers/calibration.js` — solo overrides de PGW calibrados:

```js
export const LAYER_CALIBRATIONS = {
  'ecosistemas-manglar': { pgw: [a,d,b,e,c,f], width: 1462, height: 2599 },
}
```

`src/services/rewriteLayerCalibration.ts` — misma lógica que `geoRewrite.ts`: regex seguro con validación de IDs.

### 6.2 Vite plugin extendido

`calibrationSavePlugin` acepta `target: 'layers'` → reescribe `calibration.js` vía `rewriteLayerCalibration`. Validación de `mapId`/`layerIds` con `/^[A-Za-z0-9_-]+$/`.

---

## 7. PGW Reference Data [PENDIENTE VERIFICACIÓN]

> **⚠️ Los valores de esta sección no están validados en navegador.** Los PGW de composites
> (§7.1) e individuales (§7.2) producen footprints distintos (sur vs norte) cuando deberían
> cubrir la misma área. La fórmula `F = 5.49530180558 + PH × 1462` en §7.1 multiplica pixel
> height por el ancho (1462) en vez de la altura (2599), posible origen del desfase.
> **Validar visualmente con el panel de calibración antes de darlos por definitivos.**
> El sistema está diseñado para PGW independiente por capa, así que esto no bloquea la
> implementación.

### 7.1 Composites (7 archivos, todos 1462×2599)

PGW estándar (no rotado, A≠0, E≠0):

```
[A=0.000441457732, B=0, C=−77.623835249, D=0, E=−0.000441431774, F=6.140675060]
```

Donde `A = 0.000217466863×2.03`, `E = −(0.000217454076×2.03)`, `F = 5.49530180558 + 0.000441431774×1462`.

### 7.2 Sub-capas individuales (29, desde v17 pgwData.js)

PGW rotado (A=0, E=0, B≠0, D≠0) — `processBounds` + `convertRotatedPGW` lo convierten automáticamente:

```
[A=0, D=0.000441431774, B=0.000441457732, E=0, C=−77.621312825, F=1.602929017]
```

Todas 1462×2599.

### 7.3 Mapa base `chapter1-ecosistemas` (geo.js)

```
[A=0, D=0.000470661915, B=0.000470689590, E=0, C=−77.717574037, F=1.505615411]
```

5729×10186. Cubre footprint mucho mayor que los composites (esperado — cada capa tiene su propio PGW).

### 7.4 Mapeo grupos ↔ composites (piloto, composities as-is)

| Grupo oficial | Composite | Capas incluidas (generate_eco_tiles.py) |
|---|---|---|
| 1.1 Litoral | `1.1_de_litoral_aguas` | 10 capas (aprox: incluye humedales, inundables, laguna) |
| 1.2 Vegetación baja | `1.2_vegetacion_baja` | 6 capas (aprox: incluye pantanoParamo, secosTropicales) |
| 1.3 Bosques | `1.3_bosques` | 4 capas (aprox: incluye bosqueFragmentado, regeneracionVegetal) |
| 1.4 Altas cumbres | `1.4_altas_cumbres` | 5 capas (aprox: incluye rocasExpuestas, subandinos) |
| 2.1 Intervención moderada | `2.1_intervencion_moderada` | 2 capas (aprox) |
| 2.3 Intervención severa | `2.3_intervencion_severa` | 2 capas (aprox) |
| 3 Sin información | `3_sin_informacion` | 1 capa |

### 7.5 Clasificación oficial de la comunidad (BITACORA)

**1. Amenazados y en estado vulnerable**
- 1.1 Litoral: sedimentosSubmarinos, manglar, llanuraMareal, playas, zonaPantanosa
- 1.2 Vegetación baja: rocasExpuestas, humedales, arbustal, herbazalPastos
- 1.3 Bosques: xerofitico, subxerofitico, inundables, secosTropicales, humedosTropicales, subandinos, bosqueNiebla, altoAndinos
- 1.4 Altas cumbres: pantanoParamo, Paramo, laguna, glaciaresNivales

**2. Entornos del ser humano que transforman ecosistemas**
- 2.1 Intervenciones moderadas: bosqueFragmentado, regeneracionVegetal
- 2.2 Agricultura y ganadería: agriculturaMixta, areasInundacion, monocultivos, ganaderia
- 2.3 Intervenciones severas: zonaUrbanaIndustrial, aguaSuperficial

**3. Sin información:** sinInformacion

---

## 8. Testing

Siguiente patrón existente: `vitest` + `jsdom` + `@testing-library/react`, archivos en `tests/`.

| Archivo | Alcance |
|---|---|
| `tests/services/LayerManager.test.ts` | add/remove/sync por tipo, z-order, toggle visibility en vivo, updateLayerPGW, carga on-demand, merge calibración |
| `tests/stores/layerStore.test.ts` | toggle, grupos tri-state, selección calibración, persistencia localStorage con clave por mapa, resetAll reconfigure clave |
| `tests/components/LayerMenu.test.tsx` | árbol, checkboxes, tri-state grupo, expandir/colapsar, CTA calibración, sin capas → no renderiza |
| `tests/components/CalibrationPanel.test.tsx` | selector objetivo, delta C/F absoluta + D/B multiplicativa, aplicar a todas, arrastre grupo |
| `tests/services/PoiManager.test.ts` | capa symbol única, click handler, z-order |
| `tests/services/rewriteLayerCalibration.test.ts` | reemplazo, último entry, CRLF, id inválido, id inexistente, preservación del resto del archivo |
| `tests/services/geoRewrite.test.ts` | extender existente con entrada de capa |

---

## 9. Orden de Implementación

1. Tipos: `types/layer.ts` (extender), `types/poi.ts`
2. Datos: `data/layers/` (index, groups/ecosistemas.js, shared/ecosistemas.js, chapter1-ecosistemas.js, calibration.js) + `data/pois/`
3. `layerStore.js` extendido + persistencia
4. `LayerManager.ts`
5. `PoiManager.ts` + `PoiModal.tsx`
6. `LayerMenu.tsx`
7. `CalibrationPanel.tsx` multi-capa
8. `SaveCalibration.ts` + `rewriteLayerCalibration.ts` + Vite plugin
9. Integración `AtlasMap.tsx`
10. Copiar composites a `public/assets/maps/capas/ecosistemas/`
11. Tests
12. Verificación: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`
