### Task 7: CalibrationPanel multi-capa — Extension + test

**Files:**
- Modify: `src/components/calibration/CalibrationPanel.tsx`
- Modify: `tests/components/CalibrationPanel.test.tsx` (extend)
- Modify: `src/services/SaveCalibration.ts`

**Interfaces:**
- Consumes: `useLayerStore` (Task 2), `getMapLayers` (Task 3), `LayerManager.updateLayerPGW` (Task 4), `CalibrationState` from MapCalibration
- Produces: Extended calibration panel with target selector (map vs layers)

- [ ] **Step 1: Extend `src/services/SaveCalibration.ts`**

Modify existing file:

```ts
export interface SaveCalibrationPayload {
  readonly mapId: string
  readonly target?: 'map' | 'layers'
  readonly layerIds?: readonly string[]
  readonly pgw?: readonly [number, number, number, number, number, number]
  readonly width?: number
  readonly height?: number
  readonly entries?: readonly { id: string; pgw: readonly [number, number, number, number, number, number]; width: number; height: number }[]
}

export async function saveCalibration(payload: SaveCalibrationPayload): Promise<void> {
  const res = await fetch('/__calibration/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, target: payload.target ?? 'map' }),
  })
  if (res.ok) return
  const data = await res.json().catch(() => ({} as Record<string, unknown>))
  throw new Error(String(data.error ?? `Error guardando calibración (${res.status})`))
}
```

- [ ] **Step 2: Write failing multi-layer CalibrationPanel test**

Append to `tests/components/CalibrationPanel.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CalibrationPanel } from '@components/calibration/CalibrationPanel'
import { useLayerStore } from '@stores/layerStore'
import type { MapController } from '@services/MapRenderer'

vi.mock('maplibre-gl', () => ({ default: {} }))

vi.mock('@data/maps', () => ({
  getMapEntry: vi.fn(() => ({
    geo: { pgw: [0, 0.001, 0.001, 0, -77, 2], width: 1000, height: 2000 },
    images: { placeholder: '', full: '' },
    config: { initialZoom: 5, initialBearing: -90, minZoom: 3, maxZoom: 8, dragPan: true, scrollZoom: true, useTransformConstrain: false },
  })),
}))

vi.mock('@data/layers', () => ({
  getMapLayers: vi.fn(() => [
    {
      id: 'layer-x',
      name: 'Layer X',
      type: 'raster-pgw',
      category: 'ecosystems',
      order: 1,
      pgw: [0, 0.001, 0.001, 0, -77, 2],
      width: 100,
      height: 200,
      image: '',
    },
  ]),
}))

describe('CalibrationPanel multi-layer', () => {
  beforeEach(() => {
    useLayerStore.getState().resetAll('test')
  })

  it('shows target selector with Mapa base selected by default', () => {
    const ctrl = { map: { getSource: vi.fn(), getLayer: vi.fn(), getStyle: vi.fn(() => ({ layers: [], sources: {} })), on: vi.fn(), off: vi.fn(), getCanvas: vi.fn(() => ({})), getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })), unproject: vi.fn(() => ({ lng: 0, lat: 0 })), dragPan: { disable: vi.fn(), enable: vi.fn() } }, updateBounds: vi.fn(() => ({ coordinates: [[-77,2],[-76,2],[-76,1],[-77,1]], bounds: [-77,1,-76,2], center: [-76.5,1.5], isValid: true })) }
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    expect(screen.getByText('🗺 Mapa base')).toBeDefined()
  })

  it('switches to layers mode when button clicked', () => {
    useLayerStore.getState().setCalibrationSelection(['layer-x'])
    const ctrl = { map: { getSource: vi.fn(), getLayer: vi.fn(), getStyle: vi.fn(() => ({ layers: [], sources: {} })), on: vi.fn(), off: vi.fn(), getCanvas: vi.fn(() => ({})), getContainer: vi.fn(() => ({ getBoundingClientRect: () => ({ left: 0, top: 0 }) })), unproject: vi.fn(() => ({ lng: 0, lat: 0 })), dragPan: { disable: vi.fn(), enable: vi.fn() } }, updateBounds: vi.fn(() => ({ coordinates: [[-77,2],[-76,2],[-76,1],[-77,1]], bounds: [-77,1,-76,2], center: [-76.5,1.5], isValid: true })) }
    render(<CalibrationPanel mapId="chapter1-ecosistemas" controllerRef={{ current: ctrl }} />)
    const layersBtn = screen.getByText(/📐 Capas/)
    fireEvent.click(layersBtn!)
    expect(useLayerStore.getState().selectedForCalibration.size).toBe(1)
  })
})
```

Note: this test extends the existing file. Read first, then append the new `describe` block.

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm test -- tests/components/CalibrationPanel.test.tsx
```

- [ ] **Step 4: Extend `CalibrationPanel.tsx`**

Above the existing `seedState` function, add imports and the target type:

Add to imports after existing imports:

```ts
import { useLayerStore } from '@stores/layerStore'
import { getMapLayers } from '@data/layers'
import { updateLayerPGW } from '@services/LayerManager'
import type { Layer } from '@types/layer'
```

Add type near the top:

```ts
type CalibrationTarget =
  | { kind: 'map' }
  | { kind: 'layers'; layerIds: string[] }

const LAYER_COLORS = ['#4fc3f7', '#f06292', '#aed581', '#ffd54f', '#ba68c8', '#90a4ae', '#ff8a65']
```

Inside the component, after `const [moveMode, setMoveMode] = useState(false)`:

```ts
const [target, setTarget] = useState<CalibrationTarget>({ kind: 'map' })
const [activeLayerIdx, setActiveLayerIdx] = useState(0)
const calibrationLayers = useLayerStore((s) => s.selectedForCalibration)
const layerStatesRef = useRef<Map<string, { current: CalibrationState; original: CalibrationState }>>(new Map())
```

Add target selector in the header, before the existing buttons:

```tsx
{ENABLE_DEV_TOOLS && getMapLayers(mapId) && (
  <div className={styles.overridesSection}>
    <button
      className={`${styles.headerBtn} ${target.kind === 'map' ? styles.targetActive : ''}`}
      onClick={() => {
        useLayerStore.getState().clearCalibrationSelection()
        setTarget({ kind: 'map' })
      }}
    >
      🗺 Mapa base
    </button>
    <button
      className={`${styles.headerBtn} ${target.kind === 'layers' ? styles.targetActive : ''}`}
      onClick={() => {
        const layerIds = [...calibrationLayers]
        if (layerIds.length === 0) return
        setTarget({ kind: 'layers', layerIds })
        initLayerStates(layerIds)
      }}
    >
      📐 Capas: {calibrationLayers.size || 0}
    </button>
  </div>
)}
```

Add helper function:

```ts
function initLayerStates(layerIds: string[]) {
  const allLayers = getMapLayers(mapId) ?? []
  const map = layerStatesRef.current
  map.clear()
  for (const id of layerIds) {
    const layer = allLayers.find((l) => l.id === id) as RasterPgwLayer | undefined
    if (layer) {
      const cs = pgwToState(layer.pgw, layer.width, layer.height)
      map.set(id, { current: cs, original: cs })
    }
  }
  setActiveLayerIdx(0)
  const first = map.get(layerIds[0])
  if (first) {
    setState(clampCalibration(first.current))
    originalRef.current = first.original
  }
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test -- tests/components/CalibrationPanel.test.tsx
```

Expected: existing tests + new multi-layer tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/calibration/CalibrationPanel.tsx src/services/SaveCalibration.ts tests/components/CalibrationPanel.test.tsx
git commit -m "feat: extend CalibrationPanel with multi-layer target selector"
```

---


