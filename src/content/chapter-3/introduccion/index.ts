import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp'

export default {
  mapId: 'chapter3-introduccion',
  geo: {
    pgw: [0, 0.000239511553, 0.000239528625, 0, -77.387345555000, 2.198599777777] as const,
    width: 1754,
    height: 3118,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910384/geoImages/fzz0wacqalycmhq0jehp.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 7.5,
    minZoom: 7.5,
    maxZoom: 10,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
} satisfies MapContent
