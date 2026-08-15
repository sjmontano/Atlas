import type { LayerCategory } from './layer'

export interface PoiTheme {
  radius: number
  radiusLarge: number
  textSize: number
  textSizeLarge: number
  circleBg: string
  iconBg: string
  pulse: { durationMs: number; maxScale: number; opacity: number }
  gota: { url: string; height: number }
  tooltipBg: string
  minZoom: number
  maxZoom: number
  minScale: number
}

export interface LayerStyle {
  defaultOpacity?: number
}

export type LayerStyleMap = Record<LayerCategory, LayerStyle>
