import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp'

export default {
  mapId: 'chapter4-introduccion',
  geo: {
    pgw: [0, 0.000105655592, 0.000105661672, 0, -76.847071012304, 2.747088048609] as const,
    width: 5876,
    height: 10446,
  },
  images: {
    base,
    full: 'assets/img/maps/homeCap4-high.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 8,
    minZoom: 8,
    maxZoom: 11,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
} satisfies MapContent
