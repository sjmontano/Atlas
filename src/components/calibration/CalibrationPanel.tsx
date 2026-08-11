import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { RefObject } from 'react'
import type { MapController } from '@services/MapRenderer'
import { getMapEntry } from '@data/maps'
import {
  pgwToState,
  stateToPGW,
  shiftOrigin,
  scaleParam,
  clampCalibration,
  type CalibrationState,
} from '@services/MapCalibration'
import { saveCalibration } from '@services/SaveCalibration'
import { updateLayerPGW } from '@services/LayerManager'
import { processBounds } from '@services/BoundsCalculator'
import { useLayerStore } from '@stores/layerStore'
import { getMapLayers } from '@data/layers'
import type { RasterPgwLayer } from '../../types/layer.ts'
import type { BoundsResult } from '@services/BoundsCalculator'
import styles from './CalibrationPanel.module.css'

const ENABLE_DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

interface Props {
  mapId: string
  controllerRef: RefObject<MapController | null>
  onRebuild?: () => void
  onClose?: () => void
}

type FieldKey = 'd' | 'b' | 'c' | 'f' | 'width' | 'height'

type CalibrationTarget =
  | { kind: 'map' }
  | { kind: 'layers'; layerIds: string[] }

const PCT_STEPS = [0.0001, 0.001, 0.01, 0.1]
const DEG_STEP_DEFAULT = 0.0005
const PX_STEP = 1
const PX_STEP_QUICK = 10

function computeReadout(pgw: readonly [number, number, number, number, number, number], width: number, height: number) {
  const { coordinates, bounds } = processBounds(pgw, width, height)
  return { coordinates, bounds }
}

function seedState(mapId: string, state?: CalibrationState): CalibrationState {
  if (state) return clampCalibration(state)
  const entry = getMapEntry(mapId)
  if (!entry) throw new Error(`Mapa no encontrado: ${mapId}`)
  return pgwToState(entry.geo.pgw, entry.geo.width, entry.geo.height)
}

function fmtNum(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '—'
  return value.toFixed(decimals)
}

function fmtExp(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return value.toExponential(6)
}

export function CalibrationPanel({ mapId, controllerRef, onRebuild, onClose }: Props) {
  const originalRef = useRef<CalibrationState | null>(null)
  const [state, setState] = useState<CalibrationState | null>(null)
  const [readout, setReadout] = useState<Pick<BoundsResult, 'coordinates' | 'bounds'> | null>(null)
  const [dirty, setDirty] = useState<Record<FieldKey, boolean>>({ d: false, b: false, c: false, f: false, width: false, height: false })
  const [collapsed, setCollapsed] = useState(true)
  const [moveMode, setMoveMode] = useState(false)
  const [target, setTarget] = useState<CalibrationTarget>({ kind: 'map' })
  const [activeLayerIdx, setActiveLayerIdx] = useState(0)
  const { visibleLayers } = useLayerStore()
  const layerStatesRef = useRef<Map<string, { current: CalibrationState; original: CalibrationState }>>(new Map())
  const [saveError, setSaveError] = useState<string | null>(null)

  const stepPctRef = useRef(PCT_STEPS[1])
  const [stepPctIdx, setStepPctIdx] = useState(1)

  const onLayerIds = useMemo(
    () => (getMapLayers(mapId) ?? []).filter((l) => visibleLayers.has(l.id)).map((l) => l.id),
    [mapId, visibleLayers],
  )

  useEffect(() => {
    if (onLayerIds.length > 0 && target.kind !== 'layers') {
      const layerIds = [...onLayerIds]
      setTarget({ kind: 'layers', layerIds })
      initLayerStates(layerIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyAndUpdate = useCallback((newState: CalibrationState) => {
    setState(newState)
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      const map = controllerRef.current?.map
      if (map) {
          const activeId = target.layerIds[activeLayerIdx]
        if (activeId) {
          const entry = layerStatesRef.current.get(activeId)
          if (entry) entry.current = newState
        }
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          updateLayerPGW(map, layerId, stateToPGW(entry.current), entry.current.width, entry.current.height)
        }
      }
      const activeId2 = target.layerIds[activeLayerIdx]
      if (activeId2) {
        const activeEntry = layerStatesRef.current.get(activeId2)
        if (activeEntry) {
          const r = computeReadout(stateToPGW(activeEntry.current), activeEntry.current.width, activeEntry.current.height)
          setReadout(r)
        }
        const orig = layerStatesRef.current.get(activeId2)
        setDirty({
          d: orig ? orig.original.d !== newState.d : false,
          b: orig ? orig.original.b !== newState.b : false,
          c: orig ? orig.original.c !== newState.c : false,
          f: orig ? orig.original.f !== newState.f : false,
          width: orig ? orig.original.width !== newState.width : false,
          height: orig ? orig.original.height !== newState.height : false,
        })
      }
      return
    }
    const controller = controllerRef.current
    if (!controller) return
    const pgw = stateToPGW(newState)
    try {
      const result = controller.updateBounds(pgw, newState.width, newState.height)
      setReadout({ coordinates: result.coordinates, bounds: result.bounds })
    } catch {
      // bounds inválidos durante calibración — no hacer nada
    }
    const orig = originalRef.current
    setDirty({
      d: orig ? orig.d !== newState.d : false,
      b: orig ? orig.b !== newState.b : false,
      c: orig ? orig.c !== newState.c : false,
      f: orig ? orig.f !== newState.f : false,
      width: orig ? orig.width !== newState.width : false,
      height: orig ? orig.height !== newState.height : false,
    })
  }, [controllerRef, target, activeLayerIdx])

  useEffect(() => {
    const s = seedState(mapId)
    originalRef.current = s
    setState(s)
    setDirty({ d: false, b: false, c: false, f: false, width: false, height: false })
    setMoveMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId])

  useEffect(() => {
    if (!state || target.kind === 'layers') return
    try {
      const pgw = stateToPGW(state)
      const result = controllerRef.current?.updateBounds(pgw, state.width, state.height)
      if (result) {
        setReadout({ coordinates: result.coordinates, bounds: result.bounds })
      }
    } catch {
      // ignore
    }
  }, [state, controllerRef, target.kind])

  // --- drag handlers ---
  const dragRef = useRef<{
    pointerId: number
    startGeo: { lng: number; lat: number }
  } | null>(null)

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller || !moveMode) return

    const map = controller.map
    const canvas = map.getCanvas()
    const container = map.getContainer()

    function getCanvasOffset(e: PointerEvent): { x: number; y: number } {
      const rect = container.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onPointerDown(e: PointerEvent) {
      if (dragRef.current) return
      const { x, y } = getCanvasOffset(e)
      const geo = map.unproject([x, y])
      dragRef.current = { pointerId: e.pointerId, startGeo: { lng: geo.lng, lat: geo.lat } }
      canvas.setPointerCapture(e.pointerId)
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return
      const { x, y } = getCanvasOffset(e)
      const geo = map.unproject([x, y])
      const dLng = geo.lng - dragRef.current.startGeo.lng
      const dLat = geo.lat - dragRef.current.startGeo.lat

      setState((prev) => {
        if (!prev) return prev
        const pgw = stateToPGW(prev)
        const shifted = shiftOrigin(pgw, -dLng, -dLat)
        const next = clampCalibration(pgwToState(shifted, prev.width, prev.height))
        const controllerNow = controllerRef.current
        if (controllerNow) {
          const result = controllerNow.updateBounds(stateToPGW(next), next.width, next.height)
          setReadout({ coordinates: result.coordinates, bounds: result.bounds })
        }
        const orig = originalRef.current
        setDirty({
          d: orig ? orig.d !== next.d : false,
          b: orig ? orig.b !== next.b : false,
          c: orig ? orig.c !== next.c : false,
          f: orig ? orig.f !== next.f : false,
          width: orig ? orig.width !== next.width : false,
          height: orig ? orig.height !== next.height : false,
        })
        return next
      })

      dragRef.current.startGeo = { lng: geo.lng, lat: geo.lat }
    }

    function onPointerUp(e: PointerEvent) {
      if (!dragRef.current || e.pointerId !== dragRef.current.pointerId) return
      dragRef.current = null
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.style.cursor = 'move'
    map.dragPan.disable()

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.style.cursor = ''
      try { map.dragPan.enable() } catch { /* noop */ }
      dragRef.current = null
    }
  }, [moveMode, controllerRef])

  const nudge = useCallback((key: FieldKey, sign: 1 | -1, fine: boolean) => {
    setState((prev) => {
      if (!prev) return prev
      let next: CalibrationState
      if (key === 'd' || key === 'b') {
        const pgw = stateToPGW(prev)
        const pct = stepPctRef.current!
        const factor = fine ? (1 + sign * pct * 0.1) : (1 + sign * pct)
        const scaled = (key === 'd')
          ? scaleParam(pgw, 'd', factor)
          : scaleParam(pgw, 'b', factor)
        next = clampCalibration(pgwToState(scaled, prev.width, prev.height))
      } else if (key === 'c' || key === 'f') {
        const step = fine ? DEG_STEP_DEFAULT * 0.2 : DEG_STEP_DEFAULT
        next = clampCalibration({ ...prev, [key]: prev[key] + sign * step })
      } else {
        const step = fine ? PX_STEP : PX_STEP_QUICK
        next = clampCalibration({ ...prev, [key]: Math.round(prev[key] + sign * step) })
      }

      if (target.kind === 'layers' && target.layerIds.length > 0) {
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          let entryNext: CalibrationState
          if (key === 'd' || key === 'b') {
            const ePgw = stateToPGW(entry.current)
            const pct = stepPctRef.current!
            const factor = fine ? (1 + sign * pct * 0.1) : (1 + sign * pct)
            const scaled = (key === 'd')
              ? scaleParam(ePgw, 'd', factor)
              : scaleParam(ePgw, 'b', factor)
            entryNext = clampCalibration(pgwToState(scaled, entry.current.width, entry.current.height))
          } else if (key === 'c' || key === 'f') {
            const step = fine ? DEG_STEP_DEFAULT * 0.2 : DEG_STEP_DEFAULT
            entryNext = clampCalibration({ ...entry.current, [key]: entry.current[key] + sign * step })
          } else {
            const step = fine ? PX_STEP : PX_STEP_QUICK
            entryNext = clampCalibration({ ...entry.current, [key]: Math.round(entry.current[key] + sign * step) })
          }
          entry.current = entryNext
        }
        applyAndUpdate(next)
        return next
      }

      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate, target])

  const setFieldExact = useCallback((key: FieldKey, value: number) => {
    setState((prev) => {
      if (!prev) return prev
      const next = clampCalibration({ ...prev, [key]: value })
      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate])

  const onSizeScale = useCallback((pct: number) => {
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      setState((prev) => {
        if (!prev) return prev
        for (const layerId of target.layerIds) {
          const entry = layerStatesRef.current.get(layerId)
          if (!entry) continue
          const orig = entry.original
          entry.current = clampCalibration({
            ...entry.current,
            width: Math.round(orig.width * (pct / 100)),
            height: Math.round(orig.height * (pct / 100)),
          })
        }
        const activeId = target.layerIds[activeLayerIdx]
        if (!activeId) return prev
        const activeEntry = layerStatesRef.current.get(activeId)
        if (!activeEntry) return prev
        applyAndUpdate(activeEntry.current)
        return activeEntry.current
      })
      return
    }
    const orig = originalRef.current
    if (!orig) return
    setState((prev) => {
      if (!prev) return prev
      const next = clampCalibration({
        ...prev,
        width: Math.round(orig.width * (pct / 100)),
        height: Math.round(orig.height * (pct / 100)),
      })
      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate, target, activeLayerIdx])

  const reset = useCallback(() => {
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      for (const layerId of target.layerIds) {
        const entry = layerStatesRef.current.get(layerId)
        if (entry) {
          entry.current = clampCalibration(entry.original)
        }
      }
      const activeId = target.layerIds[activeLayerIdx]
      if (!activeId) return
      const activeEntry = layerStatesRef.current.get(activeId)
      if (activeEntry) {
        setState(clampCalibration(activeEntry.original))
        originalRef.current = activeEntry.original
        const map = controllerRef.current?.map
        if (map) {
          for (const layerId of target.layerIds) {
            const e = layerStatesRef.current.get(layerId)
            if (e) updateLayerPGW(map, layerId, stateToPGW(e.current), e.current.width, e.current.height)
          }
        }
      }
      return
    }
    const orig = originalRef.current
    if (orig) {
      setState(clampCalibration(orig))
    }
  }, [target, activeLayerIdx, controllerRef])

  const copyPGW = useCallback(() => {
    if (!state) return
    const hasChange = dirty.c || dirty.f || dirty.d || dirty.b || dirty.width || dirty.height
    const suffix = hasChange
      ? '  // ← calibrado'
      : ''
    const snippet = `pgw: [${state.a}, ${state.d}, ${state.b}, ${state.e}, ${state.c}, ${state.f}],${suffix}\nwidth: ${state.width},\nheight: ${state.height},`
    navigator.clipboard.writeText(snippet).catch(() => { /* noop */ })
  }, [state, dirty])

  const apply = useCallback(async () => {
    if (!state) return
    setSaveError(null)
    try {
      if (target.kind === 'layers' && target.layerIds.length > 0) {
        const entries = target.layerIds
          .map((id) => {
            const entry = layerStatesRef.current.get(id)
            if (!entry) return null
            return { id, pgw: stateToPGW(entry.current), width: entry.current.width, height: entry.current.height }
          })
          .filter((e): e is NonNullable<typeof e> => e !== null)
        await saveCalibration({ mapId, target: 'layers', layerIds: target.layerIds, entries })
        for (const [, entry] of layerStatesRef.current) {
          entry.original = entry.current
        }
      } else {
        await saveCalibration({
          mapId,
          pgw: stateToPGW(state),
          width: state.width,
          height: state.height,
        })
        originalRef.current = state
      }
      setDirty({ d: false, b: false, c: false, f: false, width: false, height: false })
      onRebuild?.()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    }
  }, [state, mapId, onRebuild, target])

  function selectLayer(idx: number) {
    if (target.kind !== 'layers' || target.layerIds.length === 0) return
    const newIdx = idx < 0 ? target.layerIds.length - 1 : idx >= target.layerIds.length ? 0 : idx
    setActiveLayerIdx(newIdx)
    const activeId = target.layerIds[newIdx]
    if (!activeId) return
    const entry = layerStatesRef.current.get(activeId)
    if (entry) {
      setState(clampCalibration(entry.current))
      originalRef.current = entry.original
      const r = computeReadout(stateToPGW(entry.current), entry.current.width, entry.current.height)
      setReadout(r)
    }
  }

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
    const firstId = layerIds[0]
    if (firstId) {
      const first = map.get(firstId)
      if (first) {
        setState(clampCalibration(first.current))
        originalRef.current = first.original
        const r = computeReadout(stateToPGW(first.current), first.current.width, first.current.height)
        setReadout(r)
      }
    }
  }

  const convertF = state ? state.f + state.b * state.height : 0
  const sizePct = (() => {
    if (target.kind === 'layers' && target.layerIds.length > 0) {
      const activeId = target.layerIds[activeLayerIdx]
      if (!activeId) return 100
      const entry = layerStatesRef.current.get(activeId)
      if (!entry || entry.original.width <= 0) return 100
      return Math.round((entry.current.width / entry.original.width) * 100)
    }
    const orig = originalRef.current
    if (!state || !orig || orig.width <= 0) return 100
    return Math.round((state.width / orig.width) * 100)
  })()
  const activeLayerName = target.kind === 'layers' && target.layerIds.length > 0
    ? getMapLayers(mapId)?.find((l) => l.id === (target.layerIds[activeLayerIdx] ?? ''))?.name ?? target.layerIds[activeLayerIdx] ?? ''
    : null

  if (!state) return null

  return (
    <div className={styles.panel} role="region" aria-label="Calibración PGW">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Calibración</span>
        {ENABLE_DEV_TOOLS && getMapLayers(mapId) && (
          <div className={styles.overridesSection}>
            <button
              className={`${styles.headerBtn} ${target.kind === 'map' ? styles.targetActive : ''}`}
              onClick={() => {
                setTarget({ kind: 'map' })
                const s = seedState(mapId)
                originalRef.current = s
                setState(s)
                const pgw = stateToPGW(s)
                const result = controllerRef.current?.updateBounds(pgw, s.width, s.height)
                if (result) setReadout({ coordinates: result.coordinates, bounds: result.bounds })
              }}
            >
              🗺 Mapa base
            </button>
            <button
              className={`${styles.headerBtn} ${target.kind === 'layers' ? styles.targetActive : ''}`}
              onClick={() => {
                const layerIds = [...onLayerIds]
                if (layerIds.length === 0) return
                setTarget({ kind: 'layers', layerIds })
                initLayerStates(layerIds)
              }}
            >
              📐 Capas: {onLayerIds.length}
            </button>
          </div>
        )}
        {target.kind === 'layers' && target.layerIds.length > 0 && (
          <div className={styles.overridesSection}>
            <button className={styles.headerBtn} onClick={() => selectLayer(activeLayerIdx - 1)} title="Capa anterior">◀</button>
            <span className={styles.layerNavLabel}>
              {activeLayerIdx + 1}/{target.layerIds.length} {activeLayerName}
            </span>
            <button className={styles.headerBtn} onClick={() => selectLayer(activeLayerIdx + 1)} title="Capa siguiente">▶</button>
          </div>
        )}
        <div className={styles.headerActions}>
          <button
            className={styles.headerBtn}
            onClick={() => setMoveMode((m) => !m)}
            title={moveMode ? 'Soltar modo mover' : 'Modo mover: arrastrar imagen'}
          >
            {moveMode ? '✦ Soltar' : '↕ Mover'}
          </button>
          <button
            className={styles.headerBtn}
            title="Reset a valores originales de geo.js"
            onClick={reset}
          >
            ↺ Reset
          </button>
          <button
            className={styles.headerBtn}
            title="Guardar valores en geo.js y reconstruir mapa"
            onClick={apply}
          >
            ⟳ Aplicar
          </button>
          <button
            className={styles.headerBtn}
            title="Copiar a portapapeles (formato geo.js)"
            onClick={copyPGW}
          >
            📋 Copiar
          </button>
          {onClose && (
            <button
              className={styles.collapseBtn}
              title="Cerrar panel de calibración"
              onClick={onClose}
            >
              ✕
            </button>
          )}
          <button
            className={styles.collapseBtn}
            title={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '▶' : '▼'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className={styles.body}>
          {saveError && (
            <div className={styles.error}>{saveError}</div>
          )}
          <div className={styles.paramRow}>
            <label className={styles.paramLabel}>step %</label>
            <select
              className={styles.stepSelect}
              value={stepPctIdx}
              onChange={(e) => {
                const idx = Number(e.target.value)
                setStepPctIdx(idx)
                stepPctRef.current = PCT_STEPS[idx]
              }}
            >
              {PCT_STEPS.map((s, i) => (
                <option key={i} value={i}>{(s * 100).toFixed(2)}%</option>
              ))}
            </select>
          </div>

          {([
            ['D (scale lat)', 'd', state.d, dirty.d, false] as const,
            ['B (scale lon)', 'b', state.b, dirty.b, false] as const,
          ]).map(([label, key, value, isDirty]) => (
            <StepperRow
              key={key}
              label={label}
              value={value}
              dirty={isDirty}
              isScale
              display={typeof value === 'number' ? fmtExp(value) : String(value)}
              onNudge={(s, fine) => nudge(key, s, fine)}
              onExact={(v) => setFieldExact(key, v)}
            />
          ))}

          {([
            ['C (lng)', 'c', state.c, dirty.c, true],
            ['F (lat)', 'f', state.f, dirty.f, true],
          ] as const).map(([label, key, value, isDirty]) => (
            <StepperRow
              key={key}
              label={label}
              value={value}
              dirty={isDirty}
              display={fmtNum(value, 8)}
              onNudge={(s, fine) => nudge(key, s, fine)}
              onExact={(v) => setFieldExact(key, v)}
            />
          ))}

          <div className={styles.separator} />

          {([
            ['width', 'width', state.width, dirty.width],
            ['height', 'height', state.height, dirty.height],
          ] as const).map(([label, key, value, isDirty]) => (
            <StepperRow
              key={key}
              label={label}
              value={value}
              dirty={isDirty}
              display={String(value)}
              onNudge={(s, fine) => nudge(key, s, fine)}
              onExact={(v) => setFieldExact(key, v)}
            />
          ))}

          <div className={styles.paramRow}>
            <label className={styles.paramLabel}>Tamaño %</label>
            <input
              className={styles.sizeSlider}
              type="range"
              min={5}
              max={500}
              step={1}
              value={sizePct}
              onChange={(e) => onSizeScale(Number(e.target.value))}
              title="Escalar width y height en porcentaje"
            />
            <span className={styles.displayValue}>{sizePct}%</span>
          </div>

          <div className={styles.separator} />

          <div className={styles.readout}>
            <div className={styles.readoutTitle}>Valores convertidos (vivo)</div>
            <div className={styles.readoutRow}>
              <span>F_std (F+B·H):</span>
              <span>{fmtNum(convertF, 8)}</span>
            </div>
            {readout && (
              <>
                <div className={styles.readoutRow}>
                  <span>NW:</span>
                  <span>
                    [{fmtNum(readout.coordinates[0][0], 6)}, {fmtNum(readout.coordinates[0][1], 6)}]
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>SE:</span>
                  <span>
                    [{fmtNum(readout.coordinates[2][0], 6)}, {fmtNum(readout.coordinates[2][1], 6)}]
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Span lon:</span>
                  <span>
                    {fmtNum(readout.bounds[2] - readout.bounds[0], 6)}°
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Span lat:</span>
                  <span>
                    {fmtNum(readout.bounds[3] - readout.bounds[1], 6)}°
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>Aspect geo:</span>
                  <span>
                    {readout.bounds[2] - readout.bounds[0] > 0
                      ? fmtNum((readout.bounds[3] - readout.bounds[1]) / (readout.bounds[2] - readout.bounds[0]), 4)
                      : '—'}
                  </span>
                </div>
                <div className={styles.readoutRow}>
                  <span>px/° (lon, lat):</span>
                  <span>
                    {readout.bounds[2] - readout.bounds[0] > 0
                      ? `${fmtNum(state.width / (readout.bounds[2] - readout.bounds[0]), 1)}, ${fmtNum(state.height / (readout.bounds[3] - readout.bounds[1]), 1)}`
                      : '—'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// -- internal sub-component --
function StepperRow({
  label,
  value,
  dirty,
  display,
  isScale,
  onNudge,
  onExact,
}: {
  label: string
  value: number
  dirty: boolean
  display: string
  isScale?: boolean
  onNudge: (sign: 1 | -1, fine: boolean) => void
  onExact: (value: number) => void
}) {
  return (
    <div className={`${styles.paramRow} ${dirty ? styles.dirty : ''}`}>
      <label className={styles.paramLabel}>{label}</label>
      <div className={styles.stepper}>
        <button className={styles.stepBtn} onClick={() => onNudge(-1, true)} title={`-${isScale ? '0.001%' : 'fino'}`}>
          −−
        </button>
        <button className={styles.stepBtn} onClick={() => onNudge(-1, false)} title={`− ${isScale ? '%' : 'paso'}`}>
          −
        </button>
        <input
          className={styles.valueInput}
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (Number.isFinite(v)) onExact(v)
          }}
          step={isScale ? 'any' : 'any'}
        />
        <button className={styles.stepBtn} onClick={() => onNudge(1, false)} title={`+ ${isScale ? '%' : 'paso'}`}>
          +
        </button>
        <button className={styles.stepBtn} onClick={() => onNudge(1, true)} title={`+${isScale ? '0.001%' : 'fino'}`}>
          ++
        </button>
      </div>
      <span className={styles.displayValue}>{display}</span>
    </div>
  )
}
