export interface GeoEntryData {
  readonly pgw: readonly [number, number, number, number, number, number]
  readonly width: number
  readonly height: number
}

export function rewriteGeoEntry(src: string, mapId: string, data: GeoEntryData): string {
  const valid = /^[A-Za-z0-9_-]+$/.test(mapId)
  if (!valid) throw new Error(`mapId inválido: "${mapId}"`)
  const [a, d, b, e, c, f] = data.pgw
  const block = [
    `  '${mapId}': {`,
    `    pgw: [${a}, ${d}, ${b}, ${e}, ${c}, ${f}],`,
    `    width: ${Math.round(data.width)},`,
    `    height: ${Math.round(data.height)},`,
    `  },`,
  ].join('\n')
  const re = new RegExp(`^  '${mapId}': \\{[\\s\\S]*?\\r?\\n  \\},`, 'm')
  if (!re.test(src)) throw new Error(`Entrada no encontrada en geo.js: "${mapId}"`)
  return src.replace(re, block)
}
