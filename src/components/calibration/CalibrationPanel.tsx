import { useState, useCallback, useEffect, useRef } from 'react'
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
import type { BoundsResult } from '@services/BoundsCalculator'
import styles from './CalibrationPanel.module.css'

interface Props {
  mapId: string
  controllerRef: RefObject<MapController | null>
  onRebuild?: () => void
}

type FieldKey = 'd' | 'b' | 'c' | 'f' | 'width' | 'height'

const PCT_STEPS = [0.0001, 0.001, 0.01, 0.1]
const DEG_STEP_DEFAULT = 0.0005
const PX_STEP = 1
const PX_STEP_QUICK = 10

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

export function CalibrationPanel({ mapId, controllerRef, onRebuild }: Props) {
  const originalRef = useRef<CalibrationState | null>(null)
  const [state, setState] = useState<CalibrationState | null>(null)
  const [readout, setReadout] = useState<Pick<BoundsResult, 'coordinates' | 'bounds'> | null>(null)
  const [dirty, setDirty] = useState<Record<FieldKey, boolean>>({ d: false, b: false, c: false, f: false, width: false, height: false })
  const [collapsed, setCollapsed] = useState(false)
  const [moveMode, setMoveMode] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const stepPctRef = useRef(PCT_STEPS[1])
  const [stepPctIdx, setStepPctIdx] = useState(1)

  const applyAndUpdate = useCallback((newState: CalibrationState) => {
    setState(newState)
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
  }, [controllerRef])

  useEffect(() => {
    const s = seedState(mapId)
    originalRef.current = s
    setState(s)
    setDirty({ d: false, b: false, c: false, f: false, width: false, height: false })
    setMoveMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId])

  useEffect(() => {
    if (!state) return
    try {
      const pgw = stateToPGW(state)
      const result = controllerRef.current?.updateBounds(pgw, state.width, state.height)
      if (result) {
        setReadout({ coordinates: result.coordinates, bounds: result.bounds })
      }
    } catch {
      // ignore
    }
  }, [state, controllerRef])

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
      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate])

  const setFieldExact = useCallback((key: FieldKey, value: number) => {
    setState((prev) => {
      if (!prev) return prev
      const next = clampCalibration({ ...prev, [key]: value })
      applyAndUpdate(next)
      return next
    })
  }, [applyAndUpdate])

  const onSizeScale = useCallback((pct: number) => {
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
  }, [applyAndUpdate])

  const reset = useCallback(() => {
    const orig = originalRef.current
    if (orig) {
      setState(clampCalibration(orig))
    }
  }, [])

  const copyPGW = useCallback(() => {
    if (!state) return
    const hasChange = dirty.c || dirty.f || dirty.d || dirty.b || dirty.width || dirty.height
    const suffix = hasChange
      ? '  // ← calibrado'
      : ''
    const snippet = `pgw: [0, ${state.d}, ${state.b}, 0, ${state.c}, ${state.f}],${suffix}\nwidth: ${state.width},\nheight: ${state.height},`
    navigator.clipboard.writeText(snippet).catch(() => { /* noop */ })
  }, [state, dirty])

  const apply = useCallback(async () => {
    if (!state) return
    setSaveError(null)
    try {
      await saveCalibration({
        mapId,
        pgw: stateToPGW(state),
        width: state.width,
        height: state.height,
      })
      originalRef.current = state
      setDirty({ d: false, b: false, c: false, f: false, width: false, height: false })
      onRebuild?.()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    }
  }, [state, mapId, onRebuild])

  const convertF = state ? state.f + state.b * state.height : 0
  const sizePct = (() => {
    const orig = originalRef.current
    if (!state || !orig || orig.width <= 0) return 100
    return Math.round((state.width / orig.width) * 100)
  })()

  if (!state) return null

  return (
    <div className={styles.panel} role="region" aria-label="Calibración PGW">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Calibración</span>
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
