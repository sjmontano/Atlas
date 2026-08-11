### Task 5: POI system — PoiManager + PoiModal + test

**Files:**
- Create: `src/services/PoiManager.ts`
- Create: `src/components/map/PoiModal.tsx` + `.module.css`
- Create: `tests/services/PoiManager.test.ts`

**Interfaces:**
- Consumes: `Poi` type (Task 1), POI data (Task 3)
- Produces: `addPois(map, mapId, pois, onPoiClick): void`, `removePois(map): void`, `<PoiModal poi={Poi} onClose={() => void} />`

- [ ] **Step 1: Write the failing PoiManager test**

Create `tests/services/PoiManager.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { addPois, removePois } from '@services/PoiManager'
import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '@types/poi'

function makeMap() {
  const sources = new Map()
  const layers = new Map()
  return {
    getSource: vi.fn((id) => sources.get(id) ?? null),
    getLayer: vi.fn((id) => layers.get(id) ?? null),
    addSource: vi.fn((id, def) => { sources.set(id, def) }),
    addLayer: vi.fn((def) => { layers.set(def.id, def) }),
    removeLayer: vi.fn((id) => { layers.delete(id) }),
    removeSource: vi.fn((id) => { sources.delete(id) }),
    on: vi.fn(),
    off: vi.fn(),
    getStyle: vi.fn(() => ({ sources: Object.fromEntries(sources), layers: [...layers.values()] })),
    _sources: sources,
    _layers: layers,
  } as unknown as maplibregl.Map
}

const POIS: Poi[] = [
  {
    id: 'p-1',
    name: 'Point A',
    coords: [-77, 2],
    popup: { title: 'A', body: 'Body A' },
    numero: 1,
  },
  {
    id: 'p-2',
    name: 'Point B',
    coords: [-78, 3],
    popup: { title: 'B' },
  },
]

describe('PoiManager', () => {
  it('addPois creates a single geojson source and symbol layer', () => {
    const map = makeMap()
    addPois(map, 'test', POIS, vi.fn())
    expect(map.addSource).toHaveBeenCalledWith(
      'atlas-pois-source',
      expect.objectContaining({ type: 'geojson' }),
    )
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'atlas-pois-layer', type: 'symbol' }),
    )
  })

  it('removePois removes layer and source', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    map._sources.set('atlas-pois-source', { type: 'geojson' })
    removePois(map)
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
    expect(map.removeSource).toHaveBeenCalledWith('atlas-pois-source')
  })

  it('addPois removes existing POIs before adding new', () => {
    const map = makeMap()
    map._layers.set('atlas-pois-layer', { id: 'atlas-pois-layer' })
    addPois(map, 'test', POIS, vi.fn())
    expect(map.removeLayer).toHaveBeenCalledWith('atlas-pois-layer')
    expect(map.addSource).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- tests/services/PoiManager.test.ts
```

- [ ] **Step 3: Create `src/services/PoiManager.ts`**

```ts
import type * as maplibregl from 'maplibre-gl'
import type { Poi } from '@types/poi'

const POIS_SOURCE_ID = 'atlas-pois-source'
const POIS_LAYER_ID = 'atlas-pois-layer'

export function addPois(
  map: maplibregl.Map,
  _mapId: string,
  pois: Poi[],
  onPoiClick: (poi: Poi) => void,
): void {
  removePois(map)

  const features: GeoJSON.Feature[] = pois.map((poi) => ({
    type: 'Feature',
    id: poi.id,
    properties: { id: poi.id, name: poi.name, numero: poi.numero, popupTitle: poi.popup.title },
    geometry: { type: 'Point', coordinates: poi.coords },
  }))

  map.addSource(POIS_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })

  map.addLayer({
    id: POIS_LAYER_ID,
    type: 'symbol',
    source: POIS_SOURCE_ID,
    layout: {
      'text-field': ['to-string', ['get', 'numero']],
      'text-size': 14,
      'text-font': ['Open Sans Bold'],
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#1a1a2e',
      'text-halo-width': 2,
    },
  })

  map.on('click', POIS_LAYER_ID, (e) => {
    const feature = e.features?.[0]
    if (feature) {
      const poiId = feature.properties?.id
      const poi = pois.find((p) => p.id === poiId)
      if (poi) onPoiClick(poi)
    }
  })

  map.on('mouseenter', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', POIS_LAYER_ID, () => {
    map.getCanvas().style.cursor = ''
  })
}

export function removePois(map: maplibregl.Map): void {
  try {
    if (map.getLayer(POIS_LAYER_ID)) map.removeLayer(POIS_LAYER_ID)
  } catch { /* noop */ }
  try {
    if (map.getSource(POIS_SOURCE_ID)) map.removeSource(POIS_SOURCE_ID)
  } catch { /* noop */ }
}
```

- [ ] **Step 4: Create `src/components/map/PoiModal.tsx`**

```tsx
import type { Poi } from '@types/poi'
import styles from './PoiModal.module.css'

interface Props {
  poi: Poi
  onClose: () => void
}

export function PoiModal({ poi, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2 className={styles.title}>{poi.popup.title}</h2>
        {poi.popup.body && <p className={styles.body}>{poi.popup.body}</p>}
        {poi.popup.image && (
          <img className={styles.image} src={poi.popup.image} alt={poi.popup.title} />
        )}
        {poi.popup.audio && (
          <audio className={styles.audio} controls src={poi.popup.audio} />
        )}
        {poi.capa && <span className={styles.capa}>{poi.capa}</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/map/PoiModal.module.css`**

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a2e;
  border: 1px solid #2a2a4e;
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.closeBtn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.title {
  margin: 0 0 12px;
  color: #e0e0ff;
  font-size: 18px;
}

.body {
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
}

.image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.audio {
  width: 100%;
  margin-top: 8px;
}

.capa {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 12px;
}
```

- [ ] **Step 6: Run PoiManager tests**

```bash
pnpm test -- tests/services/PoiManager.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add src/services/PoiManager.ts src/components/map/PoiModal.tsx src/components/map/PoiModal.module.css tests/services/PoiManager.test.ts
git commit -m "feat: add PoiManager service and PoiModal component"
```

---


