import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/fmyppc7aotckznz2zsah.png'

export default {
  mapId: 'chapter4-la-caicedo',
  geo: {
    pgw: [0, 3.17488e-7, 3.17511e-7, 0, -76.42831830916282, 3.1837989140567857] as const,
    width: 6945,
    height: 12347,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765994205/geoImages/ssdze3oougoysjid5icz.png',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 11,
    minZoom: 11,
    maxZoom: 14,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
} satisfies MapContent
