### Task 3: Data files — Shared sub-capas, groups, per-map, index, calibration, POIs

**Files:**
- Create: `src/data/layers/shared/ecosistemas.js` + `.d.ts`
- Create: `src/data/layers/groups/ecosistemas.js` + `.d.ts`
- Create: `src/data/layers/chapter1-ecosistemas.js` + `.d.ts`
- Create: `src/data/layers/calibration.js` + `.d.ts`
- Create: `src/data/layers/index.js` + `.d.ts`
- Create: `src/data/pois/bredunco.js` + `.d.ts`
- Create: `src/data/pois/index.js` + `.d.ts`

**Interfaces:**
- Consumes: `Layer`, `LayerGroup` types from Task 1
- Produces:
  - `ECOSYSTEMS_LAYERS: Layer[]` (29 individual sub-capas)
  - `ECOSYSTEMS_GROUPS: LayerGroup[]` (8 groups per official classification)
  - `LAYERS = { 'chapter1-ecosistemas': Layer[] }`
  - `LAYER_GROUPS = { 'chapter1-ecosistemas': LayerGroup[] }`
  - `getMapLayers(mapId): Layer[] | null`
  - `getLayerGroups(mapId): LayerGroup[] | null`
  - `LAYER_CALIBRATIONS: Record<string, { pgw: PGWData, width: number, height: number }>`
  - `POIS = { 'chapter1-bredunco': Poi[] }`
  - `getPois(mapId): Poi[] | null`

- [ ] **Step 1: Create `src/data/layers/shared/ecosistemas.js`**

```js
const ECOSYSTEMS_PGW = [0, 0.000441431774, 0.000441457732, 0, -77.621312825, 1.602929017]
const ECOSYSTEMS_DIMS = [1462, 2599]

const CDN = 'https://res.cloudinary.com/dvluvxfvn/image/upload'
const LOW = '/assets/img/Capas/ecosistemas/webp/low'

const layer = (id, name, url) => ({
  id: `ecosistemas-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: url,
  pgw: ECOSYSTEMS_PGW,
  width: ECOSYSTEMS_DIMS[0],
  height: ECOSYSTEMS_DIMS[1],
  opacity: 0.8,
  order: 0,
  visibleByDefault: false,
})

export const ECOSYSTEMS_LAYERS = [
  layer('agriculturaMixta', 'Agricultura mixta', `${CDN}/v1752614823/geoImages/ehxtmyhan6sxciwzeqq8.webp`),
  layer('aguaSuperficial', 'Agua superficial', `${CDN}/v1752615018/geoImages/uw21wuzdbrqiefckuf4d.webp`),
  layer('altoAndinos', 'Alto andinos', `${CDN}/v1752615317/geoImages/nsxeretli1c7vs11x6kc.webp`),
  layer('arbustal', 'Arbustal', `${CDN}/v1752616024/geoImages/jmzub122jv4yei2hpchp.webp`),
  layer('areasInundacion', 'Áreas de inundación', `${CDN}/v1752616054/geoImages/g6pgktggt7ni6xiyhupw.webp`),
  layer('bosqueFragmentado', 'Bosque fragmentado', `${CDN}/v1752616546/geoImages/gsvasgqvuszn6hz18ap4.webp`),
  layer('bosqueNiebla', 'Bosque de niebla', `${CDN}/v1752616666/geoImages/ccrcbspmilcmwnttnijk.webp`),
  layer('ganaderia', 'Ganadería', `${CDN}/v1752620553/geoImages/gtwqfz5u1o3kmbtl33a4.webp`),
  layer('glaciaresNivales', 'Glaciares y nivales', `${CDN}/v1752620635/geoImages/fucpwcprswkntuimp3ln.webp`),
  layer('herbazalPastos', 'Herbazal y pastos', `${CDN}/v1752620752/geoImages/ab8fmppquopvzo4t9ime.webp`),
  layer('humedales', 'Humedales', `${CDN}/v1752620855/geoImages/zabqishlczt4jhzan583.webp`),
  layer('humedosTropicales', 'Húmedos tropicales', `${LOW}/humedos-tropicales-low.webp`),
  layer('inundables', 'Inundables', `${LOW}/inundables-low.webp`),
  layer('laguna', 'Laguna', `${LOW}/laguna-low.webp`),
  layer('llanuraMareal', 'Llanura mareal', `${LOW}/llanura-mareal-low.webp`),
  layer('manglar', 'Manglar', `${LOW}/manglar-low.webp`),
  layer('monocultivos', 'Monocultivos', `${LOW}/monocultivos-low.webp`),
  layer('pantanoParamo', 'Pantano de páramo', `${LOW}/pantano-paramo-low.webp`),
  layer('Paramo', 'Páramo', `${LOW}/paramo-low.webp`),
  layer('playas', 'Playas', `${LOW}/playas-low.webp`),
  layer('regeneracionVegetal', 'Vegetación en regeneración', `${LOW}/regeneracion-vegetal-low.webp`),
  layer('rocasExpuestas', 'Rocas expuestas', `${LOW}/rocas-expuestas-low.webp`),
  layer('secosTropicales', 'Secos tropicales', `${LOW}/secos-tropicales-low.webp`),
  layer('sedimentosSubmarinos', 'Sedimentos submarinos', `${LOW}/sedimentos-submarinos-low.webp`),
  layer('subandinos', 'Subandinos', `${LOW}/subandinos-low.webp`),
  layer('subxerofitico', 'Subxerofítico', `${LOW}/subxerofitico-low.webp`),
  layer('xerofitico', 'Xerofítico', `${LOW}/xerofitico-low.webp`),
  layer('zonaPantanosa', 'Zona pantanosa', `${LOW}/zona-pantanosa-low.webp`),
  layer('zonaUrbanaIndustrial', 'Zona urbana industrial', `${LOW}/zona-urbana-industrial-low.webp`),
  layer('sinInformacion', 'Sin información', `${LOW}/sin-informacion-low.webp`),
]
```

- [ ] **Step 2: Create `src/data/layers/shared/ecosistemas.d.ts`**

```ts
import type { Layer } from '@types/layer'
export const ECOSYSTEMS_LAYERS: Layer[]
```

- [ ] **Step 3: Create `src/data/layers/groups/ecosistemas.js`**

```js
const g = (id, name, order) => ({ id, name, order })

export const ECOSYSTEMS_GROUPS = [
  g('eco-1.1', '1.1 Litoral y aguas poco profundas', 1),
  g('eco-1.2', '1.2 Vegetación de baja altura', 2),
  g('eco-1.3', '1.3 Bosques', 3),
  g('eco-1.4', '1.4 Altas cumbres', 4),
  g('eco-2.1', '2.1 Intervenciones moderadas', 5),
  g('eco-2.2', '2.2 Agricultura y ganadería', 6),
  g('eco-2.3', '2.3 Intervenciones severas', 7),
  g('eco-3', '3 Sin información', 8),
]
```

- [ ] **Step 4: Create `src/data/layers/groups/ecosistemas.d.ts`**

```ts
import type { LayerGroup } from '@types/layer'
export const ECOSYSTEMS_GROUPS: LayerGroup[]
```

- [ ] **Step 5: Create `src/data/layers/chapter1-ecosistemas.js`**

```js
import { ECOSYSTEMS_LAYERS } from './shared/ecosistemas.js'

const COMPOSITE_BASE = '/assets/maps/capas/ecosistemas'
const COMPOSITE_PGW = [0.000441457732, 0, 0, -0.000441431774, -77.623835249, 6.140675060]
const COMPOSITE_W = 1462
const COMPOSITE_H = 2599

const compositeLayer = (id, name, group, order, swatch) => ({
  id: `eco-composite-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: `${COMPOSITE_BASE}/${id}.webp`,
  pgw: COMPOSITE_PGW,
  width: COMPOSITE_W,
  height: COMPOSITE_H,
  opacity: 0.8,
  visibleByDefault: true,
  order,
  group,
  legend: { swatch, description: name },
})

export const CHAPTER1_ECOSYSTEMS_LAYERS = [
  compositeLayer('1.1_de_litoral_aguas', '1.1 Litoral y aguas', 'eco-1.1', 100, '#2b83ba'),
  compositeLayer('1.2_vegetacion_baja', '1.2 Vegetación baja', 'eco-1.2', 200, '#abdda4'),
  compositeLayer('1.3_bosques', '1.3 Bosques', 'eco-1.3', 300, '#1a9641'),
  compositeLayer('1.4_altas_cumbres', '1.4 Altas cumbres', 'eco-1.4', 400, '#d7191c'),
  compositeLayer('2.1_intervencion_moderada', '2.1 Intervención moderada', 'eco-2.1', 500, '#fdae61'),
  compositeLayer('2.3_intervencion_severa', '2.3 Intervención severa', 'eco-2.3', 600, '#a6cee3'),
  compositeLayer('3_sin_informacion', '3 Sin información', 'eco-3', 700, '#d9d9d9'),
]
```

- [ ] **Step 6: Create `src/data/layers/chapter1-ecosistemas.d.ts`**

```ts
import type { Layer } from '@types/layer'
export const CHAPTER1_ECOSYSTEMS_LAYERS: Layer[]
```

- [ ] **Step 7: Create `src/data/layers/index.js`**

```js
import { CHAPTER1_ECOSYSTEMS_LAYERS } from './chapter1-ecosistemas.js'
import { ECOSYSTEMS_GROUPS } from './groups/ecosistemas.js'

export const LAYERS = {
  'chapter1-ecosistemas': CHAPTER1_ECOSYSTEMS_LAYERS,
}

export const LAYER_GROUPS = {
  'chapter1-ecosistemas': ECOSYSTEMS_GROUPS,
}

export function getMapLayers(mapId) {
  return LAYERS[mapId] ?? null
}

export function getLayerGroups(mapId) {
  return LAYER_GROUPS[mapId] ?? null
}
```

- [ ] **Step 8: Create `src/data/layers/index.d.ts`**

```ts
import type { Layer, LayerGroup } from '@types/layer'
export const LAYERS: Record<string, Layer[]>
export const LAYER_GROUPS: Record<string, LayerGroup[]>
export function getMapLayers(mapId: string): Layer[] | null
export function getLayerGroups(mapId: string): LayerGroup[] | null
```

- [ ] **Step 9: Create `src/data/layers/calibration.js`**

```js
export const LAYER_CALIBRATIONS = {}
```

- [ ] **Step 10: Create `src/data/layers/calibration.d.ts`**

```ts
import type { PGWData } from '@services/BoundsCalculator'
export const LAYER_CALIBRATIONS: Record<string, { pgw: PGWData, width: number, height: number }>
```

- [ ] **Step 11: Create `src/data/pois/bredunco.js`**

```js
export const BREDUNCO_POIS = [
  {
    id: 'poi-bredunco-torre',
    numero: 1,
    name: 'Torre de Bredunco',
    coords: [-78.02, 2.35],
    capa: 'bredunco',
    popup: { title: 'Torre de Bredunco', body: 'Torre de vigilancia comunitaria en Bredunco.' },
  },
  {
    id: 'poi-bredunco-casa',
    numero: 2,
    name: 'Casa comunal',
    coords: [-78.01, 2.34],
    capa: 'bredunco',
    popup: { title: 'Casa comunal de Bredunco', body: 'Centro de reuniones comunitarias.' },
  },
]
```

- [ ] **Step 12: Create `src/data/pois/bredunco.d.ts`**

```ts
import type { Poi } from '@types/poi'
export const BREDUNCO_POIS: Poi[]
```

- [ ] **Step 13: Create `src/data/pois/index.js`**

```js
import { BREDUNCO_POIS } from './bredunco.js'

export const POIS = {
  'chapter1-bredunco': BREDUNCO_POIS,
}

export function getPois(mapId) {
  return POIS[mapId] ?? null
}
```

- [ ] **Step 14: Create `src/data/pois/index.d.ts`**

```ts
import type { Poi } from '@types/poi'
export const POIS: Record<string, Poi[]>
export function getPois(mapId: string): Poi[] | null
```

- [ ] **Step 15: Run typecheck to verify**

```bash
pnpm typecheck
```

- [ ] **Step 16: Commit**

```bash
git add src/data/layers/ src/data/pois/
git commit -m "feat: add layer data files (shared, groups, per-map, calibration, pois)"
```

---


