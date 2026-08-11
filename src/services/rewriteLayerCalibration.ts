export interface LayerCalibrationEntry {
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
}

export function rewriteLayerCalibration(
  src: string,
  layerId: string,
  data: LayerCalibrationEntry,
): string {
  const valid = /^[A-Za-z0-9_-]+$/.test(layerId)
  if (!valid) throw new Error(`layerId inválido: "${layerId}"`)
  const [a, d, b, e, c, f] = data.pgw
  const block = [
    `  '${layerId}': {`,
    `    pgw: [${a}, ${d}, ${b}, ${e}, ${c}, ${f}],`,
    `    width: ${Math.round(data.width)},`,
    `    height: ${Math.round(data.height)},`,
    `  },`,
  ].join('\n')

  const re = new RegExp(`^  '${escapeRegex(layerId)}': \\{[\\s\\S]*?\\r?\\n  \\},`, 'm')
  if (re.test(src)) {
    return src.replace(re, block)
  }

  const closingBraceIdx = src.lastIndexOf('}')
  if (closingBraceIdx === -1) throw new Error('Formato inválido: calibration.js')
  return src.slice(0, closingBraceIdx) + '\n' + block + '\n' + src.slice(closingBraceIdx)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
