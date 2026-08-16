import type { MapContent } from '../types/content'
import { MAP_CALIBRATIONS } from './calibration/map'

const mapModules = import.meta.glob<{ default: MapContent }>('./*/*/index.ts', { eager: true })
const looseModules = import.meta.glob<{ default: MapContent }>('./*/index.ts', { eager: true })

const CONTENT = new Map<string, MapContent>()

for (const mod of [...Object.values(mapModules), ...Object.values(looseModules)]) {
  const content = mod.default
  if (!content || typeof content.mapId !== 'string') continue
  if (CONTENT.has(content.mapId)) {
    throw new Error(`mapId duplicado en content: ${content.mapId}`)
  }
  CONTENT.set(content.mapId, content)
}

export function getMapContent(mapId: string): MapContent | null {
  const content = CONTENT.get(mapId)
  if (!content) return null
  const calib = MAP_CALIBRATIONS[mapId]
  if (!calib) return content
  return {
    ...content,
    geo: { ...content.geo, pgw: calib.pgw, width: calib.width, height: calib.height },
    config:
      calib.viewportMargin !== undefined
        ? { ...content.config, viewportMargin: calib.viewportMargin }
        : content.config,
  }
}
