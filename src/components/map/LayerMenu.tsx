import { useMemo, useState, useCallback } from 'react'
import { useLayerStore } from '@stores/layerStore'
import { getMapContent } from '@content'
import type { Layer, LegendItem } from '../../types/layer.ts'
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

function groupLegends(legends: LegendItem[]): Array<[string | null, LegendItem[]]> {
  const orderedGroups: string[] = []
  const byGroup = new Map<string, LegendItem[]>()
  const ungrouped: LegendItem[] = []

  for (const item of legends) {
    if (!item.group) {
      ungrouped.push(item)
      continue
    }
    if (!byGroup.has(item.group)) {
      byGroup.set(item.group, [])
      orderedGroups.push(item.group)
    }
    byGroup.get(item.group)!.push(item)
  }

  const result: Array<[string | null, LegendItem[]]> = []
  for (const group of orderedGroups) {
    result.push([group, byGroup.get(group)!])
  }
  if (ungrouped.length > 0) result.push([null, ungrouped])
  return result
}

export function LayerMenu({ mapId, onCalibrate }: Props) {
  const content = useMemo(() => getMapContent(mapId), [mapId])
  const layers = content?.layers ?? null
  const groups = content?.groups ?? null
  const legends = content?.legends ?? null
  const store = useLayerStore()
  const { visibleLayers, opacities, expandedGroups } = store
  const toggleLayer = store.toggleLayer
  const setLayerOpacity = store.setLayerOpacity
  const setLayerGroupVisible = store.setLayerGroupVisible
  const toggleGroupExpanded = store.toggleGroupExpanded

  const [collapsed, setCollapsed] = useState(true)

  const hasLayers = layers !== null && layers.length > 0
  const hasLegends = legends !== null && legends.length > 0

  const handleGroupToggle = useCallback(
    (groupId: string, groupLayers: Layer[]) => {
      const state = groupTriState(groupId, groupLayers, visibleLayers)
      setLayerGroupVisible(groupId, state !== true, groupLayers.map((l) => l.id))
    },
    [visibleLayers, setLayerGroupVisible],
  )

  if (!hasLayers && !hasLegends) return null

  const legendGroups = hasLegends ? groupLegends(legends!) : []

  const allVisible = hasLayers ? layers!.every((l) => visibleLayers.has(l.id)) : true
  const noneVisible = hasLayers ? layers!.every((l) => !visibleLayers.has(l.id)) : true
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
          {hasLayers && (
            <>
              <label className={styles.masterRow}>
                <input
                  type="checkbox"
                  checked={allVisible}
                  ref={(el) => {
                    if (el) el.indeterminate = masterTriState === 'indeterminate'
                  }}
                  onChange={() => {
                    setLayerGroupVisible('__all__', !allVisible, layers!.map((l) => l.id))
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
                const groupLayers = layers!.filter((l) => l.group === group.id)
                if (groupLayers.length === 0) return null
                const isExpanded = expandedGroups[group.id] !== false
                const tri = groupTriState(group.id, layers!, visibleLayers)

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

              {layers!
                .filter((l) => !l.group)
                .map((layer) => (
                  <LayerRow
                    key={layer.id}
                    layer={layer}
                    visible={visibleLayers.has(layer.id)}
                    opacity={opacities[layer.id] ?? layer.opacity ?? 1}
                    onToggle={() => toggleLayer(layer.id)}
                    onOpacityChange={(v) => setLayerOpacity(layer.id, v)}
                  />
                ))}
            </>
          )}

          {hasLegends && (
            <div className={styles.legendSection}>
              <div className={styles.legendSectionTitle}>Leyenda</div>
              {legendGroups.map(([groupName, items]) => (
                <div key={groupName ?? '__ungrouped__'} className={styles.legendGroup}>
                  {groupName && <div className={styles.legendGroupName}>{groupName}</div>}
                  {items.map((item) => (
                    <LegendRow key={item.id} item={item} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LegendRow({ item }: { item: LegendItem }) {
  return (
    <div className={styles.legendRow}>
      {item.icon ? (
        <span className={styles.legendIcon}>
          <img src={item.icon} alt="" className={styles.legendIconImg} />
        </span>
      ) : (
        <span className={styles.swatch} style={{ backgroundColor: item.swatch }} />
      )}
      <span className={styles.legendName} title={item.description}>
        {item.name}
      </span>
      {item.longText && (
        <span className={styles.infoIcon} tabIndex={0} aria-label={item.name}>
          ⓘ
          <span className={styles.tooltip}>{item.longText}</span>
        </span>
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
