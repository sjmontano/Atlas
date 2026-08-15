import type { PoiTheme } from '../../types/theme'

export const POI_THEME: PoiTheme = {
  radius: 15,
  radiusLarge: 21,
  textSize: 14,
  textSizeLarge: 20,
  circleBg: '#03103a',
  iconBg: '#0081a9',
  pulse: { durationMs: 2200, maxScale: 1.9, opacity: 0.55 },
  gota: {
    url: '/assets/interface/icons/line/svg/location.svg',
    height: 21,
  },
  tooltipBg: '/assets/tooltip/fondo-tooltip.webp',
  minZoom: 6,
  maxZoom: 14,
  minScale: 0.8,
}
