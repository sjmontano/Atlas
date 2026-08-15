import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/xrssyymmhamqorcf5gb0.png'

export default {
  mapId: 'chapter4-los-bajios',
  geo: {
    pgw: [0, 1.98448e-7, 1.98462e-7, 0, -76.4406963166678, 3.191896067095853] as const,
    width: 7015,
    height: 12472,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991261/geoImages/o0jnbtkeiddi6ielq1ow.png',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 14,
    minZoom: 14,
    maxZoom: 18,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
} satisfies MapContent
