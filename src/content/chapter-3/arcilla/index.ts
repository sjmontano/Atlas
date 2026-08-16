import type { MapContent } from '../../../types/content'
import { LAYERS } from './layers'
import { GROUPS } from './groups'
import { LEGENDS } from './legends'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763846278/geoImages/zbtnuchm9uvshuqnaota.webp'

export default {
  mapId: 'chapter3-arcilla',
  geo: {
    pgw: [0, 0.000020719422, 0.000020719464, 0, -76.462515214762, 3.159866654268] as const,
    width: 1969,
    height: 3500,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763845021/geoImages/ps2z0y6in7o5bbvjedyz.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 9,
    minZoom: 9,
    maxZoom: 11,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  layers: LAYERS,
  groups: GROUPS,
  legends: LEGENDS,
} satisfies MapContent
