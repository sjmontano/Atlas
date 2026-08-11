### Task 6: LayerMenu — Component + CSS + test

**Files:**
- Create: `src/components/map/LayerMenu.tsx` + `.module.css`
- Create: `tests/components/LayerMenu.test.tsx`

**Interfaces:**
- Consumes: `getMapLayers`, `getLayerGroups` (Task 3), `useLayerStore` (Task 2), `Layer`, `LayerGroup` types (Task 1)
- Produces: `<LayerMenu mapId={string} onCalibrate={() => void} />`

- [ ] **Step 1: Write the failing test**

Create `tests/components/LayerMenu.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LayerMenu } from '@components/map/LayerMenu'
import { useLayerStore } from '@stores/layerStore'

vi.mock('@data/layers', () => ({
  getMapLayers: vi.fn((mapId) => {
    if (mapId === 'test') {
      return [
        {
          id: 'layer-1',
          name: 'Layer One',
          type: 'raster-pgw',
          category: 'ecosystems',
          group: 'group-1',
          order: 1,
          opacity: 0.8,
          visibleByDefault: true,
          legend: { swatch: '#ff0000', description: 'Red layer' },
          image: '',
          pgw: [0, 1, 1, 0, 0, 0],
          width: 1,
          height: 1,
        },
        {
          id: 'layer-2',
          name: 'Layer Two',
          type: 'raster-pgw',
          category: 'ecosystems',
          group: 'group-1',
          order: 2,
          opacity: 0.5,
          legend: { swatch: '#00ff00' },
          image: '',
          pgw: [0, 1, 1, 0, 0, 0],
          width: 1,
          height: 1,
        },
      ]
    }
    return null
  }),
  getLayerGroups: vi.fn((mapId) => {
    if (mapId === 'test') {
      return [{ id: 'group-1', name: 'Group 1', order: 1 }]
    }
    return null
  }),
}))

describe('LayerMenu', () => {
  beforeEach(() => {
    useLayerStore.getState().resetAll('test')
  })

  it('renders group and layer names', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    expect(screen.getByText(/Capas/)).toBeDefined()
    expect(screen.getByText('Group 1')).toBeDefined()
    expect(screen.getByText('Layer One')).toBeDefined()
  })

  it('toggles layer visibility on checkbox click', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    const store = useLayerStore.getState()
    expect(store.visibleLayers.size).toBe(0)
    const checks = screen.getAllByRole('checkbox')
    const layerCheck = checks[checks.length - 1]
    fireEvent.click(layerCheck!)
    expect(useLayerStore.getState().visibleLayers.has('layer-1') || useLayerStore.getState().visibleLayers.has('layer-2')).toBe(true)
  })

  it('renders nothing when map has no layers', () => {
    const { container } = render(<LayerMenu mapId="empty" onCalibrate={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('toggles group expansion on click', () => {
    render(<LayerMenu mapId="test" onCalibrate={vi.fn()} />)
    const groupHeader = screen.getByText('Group 1')
    fireEvent.click(groupHeader!)
    expect(useLayerStore.getState().expandedGroups['group-1']).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- tests/components/LayerMenu.test.tsx
```

- [ ] **Step 3: Create `src/components/map/LayerMenu.tsx`**

```tsx
import { useMemo, useState, useCallback } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapLayers, getLayerGroups } from '@data/layers'
import type { Layer, LayerGroup } from '@types/layer'
import styles from './LayerMenu.module.css'

interface Props {
  mapId: string
  onCalibrate: () => void
}

function groupTriState(groupId: string, layers: Layer[], visibleLayers: Set<string>): boolean | 'indeterminate' {
  const groupLayers = layers.filter((l) => l.group === groupId)
  if (groupLayers.length === 0) return false
  const visibleCount = groupLayers.filter((l) => visibleLayers.has(l.id)).length
  if (visibleCount === 0) return false
  if (visibleCount === groupLayers.length) return true
  return 'indeterminate'
}

export function LayerMenu({ mapId, onCalibrate }: Props) {
  const layers = useMemo(() => getMapLayers(mapId), [mapId])
  const groups = useMemo(() => getLayerGroups(mapId), [mapId])
  const visibleLayers = useLayerStore((s) => s.visibleLayers)
  const opacities = useLayerStore((s) => s.opacities)
  const expandedGroups = useLayerStore((s) => s.expandedGroups)
  const selectedForCalibration = useLayerStore((s) => s.selectedForCalibration)
  const toggleLayer = useLayerStore((s) => s.toggleLayer)
  const setLayerOpacity = useLayerStore((s) => s.setLayerOpacity)
  const setLayerGroupVisible = useLayerStore((s) => s.setLayerGroupVisible)
  const toggleGroupExpanded = useLayerStore((s) => s.toggleGroupExpanded)
  const toggleCalibrationSelection = useLayerStore((s) => s.toggleCalibrationSelection)

  const [collapsed, setCollapsed] = useState(false)
  const [calibrateMode, setCalibrateMode] = useState(false)

  const handleGroupToggle = useCallback(
    (groupId: string, groupLayers: Layer[]) => {
      const state = groupTriState(groupId, groupLayers, visibleLayers)
      setLayerGroupVisible(groupId, state !== true, groupLayers.map((l) => l.id))
    },
    [visibleLayers, setLayerGroupVisible],
  )

  if (!layers || layers.length === 0) return null

  const allVisible = layers.every((l) => visibleLayers.has(l.id))
  const noneVisible = layers.every((l) => !visibleLayers.has(l.id))
  const masterTriState = allVisible ? true : noneVisible ? false : 'indeterminate'

  return (
    <div className={styles.panel} role="region" aria-label="Capas">
      <div className={styles.header}>
        <span className={styles.headerTitle}>🗂 Capas</span>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
        >
          {collapsed ? '▶' : '▼'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.body}>
          <label className={styles.masterRow}>
            <input
              type="checkbox"
              checked={allVisible}
              ref={(el) => {
                if (el) el.indeterminate = masterTriState === 'indeterminate'
              }}
              onChange={() => {
                setLayerGroupVisible('__all__', !allVisible, layers.map((l) => l.id))
              }}
            />
            <span>Todas</span>
          </label>

          <div className={styles.calibrateRow}>
            <button
              className={`${styles.calibrateBtn} ${calibrateMode ? styles.calibrateActive : ''}`}
              onClick={() => {
                setCalibrateMode((m) => !m)
                if (calibrateMode) {
                  useLayerStore.getState().clearCalibrationSelection()
                }
              }}
            >
              {calibrateMode ? 'Cancelar' : '🔧 Calibrar'}
            </button>
            {calibrateMode && selectedForCalibration.size > 0 && (
              <button className={styles.calibrateApplyBtn} onClick={onCalibrate}>
                ✨ Calibrar selección ({selectedForCalibration.size})
              </button>
            )}
          </div>

          {groups?.map((group) => {
            const groupLayers = layers.filter((l) => l.group === group.id)
            if (groupLayers.length === 0) return null
            const isExpanded = expandedGroups[group.id] !== false
            const tri = groupTriState(group.id, layers, visibleLayers)

            return (
              <div key={group.id} className={styles.group}>
                <div className={styles.groupHeader}>
                  <input
                    type="checkbox"
                    checked={tri === true}
                    ref={(el) => {
                      if (el) el.indeterminate = tri === 'indeterminate'
                    }}
                    onChange={() => handleGroupToggle(group.id, groupLayers)}
                  />
                  <span
                    className={styles.groupName}
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    {group.name} ({groupLayers.length})
                  </span>
                  <span
                    className={`${styles.groupArrow} ${isExpanded ? styles.expanded : ''}`}
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    ▶
                  </span>
                </div>

                {isExpanded &&
                  groupLayers.map((layer) => (
                    <LayerRow
                      key={layer.id}
                      layer={layer}
                      visible={visibleLayers.has(layer.id)}
                      opacity={opacities[layer.id] ?? layer.opacity ?? 1}
                      calibrateMode={calibrateMode}
                      selected={selectedForCalibration.has(layer.id)}
                      onToggle={() => {
                        if (calibrateMode) {
                          toggleCalibrationSelection(layer.id)
                        } else {
                          toggleLayer(layer.id)
                        }
                      }}
                      onOpacityChange={(v) => setLayerOpacity(layer.id, v)}
                    />
                  ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LayerRow({
  layer,
  visible,
  opacity,
  calibrateMode,
  selected,
  onToggle,
  onOpacityChange,
}: {
  layer: Layer
  visible: boolean
  opacity: number
  calibrateMode: boolean
  selected: boolean
  onToggle: () => void
  onOpacityChange: (v: number) => void
}) {
  return (
    <div className={`${styles.layerRow} ${calibrateMode && selected ? styles.layerSelected : ''}`}>
      <input
        type="checkbox"
        checked={calibrateMode ? selected : visible}
        onChange={onToggle}
        aria-label={layer.name}
      />
      {layer.legend?.swatch && (
        <span className={styles.swatch} style={{ backgroundColor: layer.legend.swatch }} />
      )}
      <span className={styles.layerName} title={layer.legend?.description}>
        {layer.name}
      </span>
      {visible && !calibrateMode && (
        <input
          type="range"
          className={styles.opacitySlider}
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/map/LayerMenu.module.css`**

```css
.panel {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 280px;
  max-height: calc(100vh - 140px);
  background: rgba(10, 10, 30, 0.92);
  border: 1px solid #2a2a4e;
  border-radius: 10px;
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #2a2a4e;
}

.headerTitle {
  color: #e0e0ff;
  font-size: 14px;
  font-weight: 600;
}

.collapseBtn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
}

.body {
  overflow-y: auto;
  padding: 8px 12px 12px;
}

.masterRow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 8px;
  color: #ccc;
  font-size: 13px;
  cursor: pointer;
}

.calibrateRow {
  display: flex;
  gap: 6px;
  padding: 0 0 8px;
}

.calibrateBtn {
  background: #2a2a4e;
  border: 1px solid #3a3a6e;
  color: #aaa;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.calibrateActive {
  background: #3a3a6e;
  color: #e0e0ff;
}

.calibrateApplyBtn {
  background: #2b5a3a;
  border: 1px solid #3a7a4e;
  color: #a0e0a0;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.group {
  margin-bottom: 4px;
}

.groupHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  cursor: pointer;
}

.groupName {
  color: #c0c0e0;
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}

.groupArrow {
  color: #888;
  font-size: 10px;
  transition: transform 0.2s;
}

.groupArrow.expanded {
  transform: rotate(90deg);
}

.layerRow {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0 3px 24px;
  font-size: 12px;
}

.layerRow:hover {
  background: rgba(255, 255, 255, 0.04);
}

.layerSelected {
  background: rgba(100, 140, 255, 0.15);
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.layerName {
  color: #bbb;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.opacitySlider {
  width: 60px;
  height: 4px;
  accent-color: #6688cc;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Run LayerMenu tests**

```bash
pnpm test -- tests/components/LayerMenu.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/components/map/LayerMenu.tsx src/components/map/LayerMenu.module.css tests/components/LayerMenu.test.tsx
git commit -m "feat: add LayerMenu component with tree, groups, calibration mode"
```

---


