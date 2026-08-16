export interface SaveCalibrationPayload {
  readonly mapId: string
  readonly target?: 'map' | 'layers'
  readonly layerIds?: readonly string[]
  readonly pgw?: readonly [number, number, number, number, number, number]
  readonly width?: number
  readonly height?: number
  readonly viewportMargin?: number
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
