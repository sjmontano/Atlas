import { useMemo, useState, useCallback } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapContent } from '@content'
import type { Layer } from '../../types/layer.ts'
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
  const layers = useMemo(() => getMapContent(mapId)?.layers ?? null, [mapId])
  const groups = useMemo(() => getMapContent(mapId)?.groups ?? null, [mapId])
  const store = useLayerStore()
  const { visibleLayers, opacities, expandedGroups } = store
  const toggleLayer = store.toggleLayer
  const setLayerOpacity = store.setLayerOpacity
  const setLayerGroupVisible = store.setLayerGroupVisible
  const toggleGroupExpanded = store.toggleGroupExpanded

  const [collapsed, setCollapsed] = useState(true)

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
            <button className={styles.calibrateBtn} onClick={onCalibrate}>
              🔧 Calibrar
            </button>
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
                      onToggle={() => toggleLayer(layer.id)}
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
  onToggle,
  onOpacityChange,
}: {
  layer: Layer
  visible: boolean
  opacity: number
  onToggle: () => void
  onOpacityChange: (v: number) => void
}) {
  return (
    <div className={styles.layerRow}>
      <input
        type="checkbox"
        checked={visible}
        onChange={onToggle}
        aria-label={layer.name}
      />
      {layer.legend?.swatch && (
        <span className={styles.swatch} style={{ backgroundColor: layer.legend.swatch }} />
      )}
      <span className={styles.layerName} title={layer.legend?.description}>
        {layer.name}
      </span>
      {visible && (
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
