import type { MapContent } from '../../../types/content'
import { POIS } from './pois'

const ph = (url: string): string => url.replace('/upload/', '/upload/w_512,q_25,f_webp/')

const base =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061326/geoImages/mwz79qubfmr0x5zqtzto.webp'

export default {
  mapId: 'chapter2-suarez',
  geo: {
    pgw: [0, 0.0000220378935, 0.000022038657, 0, -76.771441329681, 2.758437617084] as const,
    width: 6300,
    height: 11200,
  },
  images: {
    base,
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061249/geoImages/nkxiwrxtbovp66gobcdq.webp',
    placeholder: ph(base),
  },
  config: {
    initialZoom: 7,
    minZoom: 7,
    maxZoom: 11,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
  pois: POIS,
} satisfies MapContent
