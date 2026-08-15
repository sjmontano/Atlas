import type { MapContent } from '../../../types/content'

export default {
  mapId: 'chapter1-encuadres',
  geo: {
    pgw: [0, 0.002291904891, 0.002292263474, 0, -79.441458743296, -1.354624163443] as const,
    width: 3389,
    height: 6684,
  },
  images: { base: '', full: '', placeholder: '' },
  config: {
    initialZoom: 6.06,
    minZoom: 6.06,
    maxZoom: 6.06,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: false,
    scrollZoom: false,
  },
} satisfies MapContent
