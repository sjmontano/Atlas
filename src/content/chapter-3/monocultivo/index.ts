import type { MapContent } from '../../../types/content'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp'

export default {
  mapId: 'chapter3-monocultivo',
  geo: {
    pgw: [0, 0.000307843615, 0.0003078655575, 0, -76.939551386912, 2.497068728525] as const,
    width: 2806,
    height: 4989,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996331/geoImages/jje1a33z8enjmlrwfa4j.webp',
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
