import type { MapContent } from '../../../types/content'
import { LAYERS } from './layers'

export default {
  mapId: 'chapter2-m-suarez',
  geo: {
    pgw: [0, -0.000079124151, -0.000079131596, 0, -76.32673887696231, 3.119152348416211] as const,
    width: 9448,
    height: 5314,
  },
  images: {
    base: '/assets/maps/cap2/modelo-territorial-suarez.png',
    full: '/assets/maps/cap2/modelo-territorial-suarez.png',
    placeholder: '/assets/maps/cap2/modelo-territorial-suarez.png',
  },
  config: {
    initialZoom: 9,
    minZoom: 9,
    maxZoom: 16,
    initialBearing: 180,
    useTransformConstrain: false,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  layers: LAYERS,
} satisfies MapContent
