import type { PGWData } from '@services/BoundsCalculator'

export interface CalibrationEntry {
  pgw: PGWData
  width: number
  height: number
  viewportMargin?: number
}

export const LAYER_CALIBRATIONS: Record<string, CalibrationEntry> = {}
