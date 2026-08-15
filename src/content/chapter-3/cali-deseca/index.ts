import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852352/geoImages/maiachqmczyrhmph1rql.webp'

export default {
  mapId: 'chapter3-cali-deseca',
  geo: {
    pgw: [0, 0.000065247158, 0.000065249271, 0, -76.744923302940, 3.108582581431] as const,
    width: 4960,
    height: 8822,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852262/geoImages/llovghvucpft64ea6zad.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 7,
    minZoom: 7,
    maxZoom: 10,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
} satisfies MapContent
