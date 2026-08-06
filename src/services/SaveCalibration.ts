export interface SaveCalibrationPayload {
  readonly mapId: string
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
}

export async function saveCalibration(payload: SaveCalibrationPayload): Promise<void> {
  const res = await fetch('/__calibration/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.ok) return
  const data = await res.json().catch(() => ({} as Record<string, unknown>))
  throw new Error(String(data.error ?? `Error guardando calibración (${res.status})`))
}
