export interface CalibrationEntryData {
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
  readonly viewportMargin?: number
}

export function rewriteCalibrationEntry(
  src: string,
  id: string,
  data: CalibrationEntryData,
): string {
  const valid = /^[A-Za-z0-9_-]+$/.test(id)
  if (!valid) throw new Error(`id inválido: "${id}"`)
  const [a, d, b, e, c, f] = data.pgw
  const block = [
    `  '${id}': {`,
    `    pgw: [${a}, ${d}, ${b}, ${e}, ${c}, ${f}],`,
    `    width: ${Math.round(data.width)},`,
    `    height: ${Math.round(data.height)},`,
    data.viewportMargin !== undefined
      ? `    viewportMargin: ${data.viewportMargin},`
      : null,
    `  },`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  const re = new RegExp(`^  '${escapeRegex(id)}': \\{[\\s\\S]*?\\r?\\n  \\},`, 'm')
  if (re.test(src)) {
    return src.replace(re, block)
  }

  const closingBraceIdx = src.lastIndexOf('}')
  if (closingBraceIdx === -1) throw new Error('Formato inválido: archivo de calibración')
  return src.slice(0, closingBraceIdx) + '\n' + block + '\n' + src.slice(closingBraceIdx)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
