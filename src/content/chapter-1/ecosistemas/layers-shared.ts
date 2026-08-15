import type { PGWData } from '@services/BoundsCalculator'
import type { Layer } from '../../../types/layer'

// Sub-capas individuales (data-ready, NO cableadas al registro por defecto).
// Port de v17 rasterTilesEcosistemas.js — se conservan como insumo.

const ECOSYSTEMS_PGW: PGWData = [0, 0.000441431774, 0.000441457732, 0, -77.621312825, 1.602929017]
const ECOSYSTEMS_DIMS: [number, number] = [1462, 2599]

const CDN = 'https://res.cloudinary.com/dvluvxfvn/image/upload'
const LOW = '/assets/img/Capas/ecosistemas/webp/low'

const layer = (id: string, name: string, url: string): Layer => ({
  id: `ecosistemas-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: url,
  pgw: ECOSYSTEMS_PGW,
  width: ECOSYSTEMS_DIMS[0],
  height: ECOSYSTEMS_DIMS[1],
  opacity: 0.8,
  order: 0,
  visibleByDefault: false,
})

export const ECOSYSTEMS_LAYERS: Layer[] = [
  layer('agriculturaMixta', 'Agricultura mixta', `${CDN}/v1752614823/geoImages/ehxtmyhan6sxciwzeqq8.webp`),
  layer('aguaSuperficial', 'Agua superficial', `${CDN}/v1752615018/geoImages/uw21wuzdbrqiefckuf4d.webp`),
  layer('altoAndinos', 'Alto andinos', `${CDN}/v1752615317/geoImages/nsxeretli1c7vs11x6kc.webp`),
  layer('arbustal', 'Arbustal', `${CDN}/v1752616024/geoImages/jmzub122jv4yei2hpchp.webp`),
  layer('areasInundacion', 'Áreas de inundación', `${CDN}/v1752616054/geoImages/g6pgktggt7ni6xiyhupw.webp`),
  layer('bosqueFragmentado', 'Bosque fragmentado', `${CDN}/v1752616546/geoImages/gsvasgqvuszn6hz18ap4.webp`),
  layer('bosqueNiebla', 'Bosque de niebla', `${CDN}/v1752616666/geoImages/ccrcbspmilcmwnttnijk.webp`),
  layer('ganaderia', 'Ganadería', `${CDN}/v1752620553/geoImages/gtwqfz5u1o3kmbtl33a4.webp`),
  layer('glaciaresNivales', 'Glaciares y nivales', `${CDN}/v1752620635/geoImages/fucpwcprskwntuimp3ln.webp`),
  layer('herbazalPastos', 'Herbazal y pastos', `${CDN}/v1752620752/geoImages/ab8fmppquopvzo4t9ime.webp`),
  layer('humedales', 'Humedales', `${CDN}/v1752620855/geoImages/zabqishlczt4jhzan583.webp`),
  layer('humedosTropicales', 'Húmedos tropicales', `${LOW}/humedos-tropicales-low.webp`),
  layer('inundables', 'Inundables', `${LOW}/inundables-low.webp`),
  layer('laguna', 'Laguna', `${LOW}/laguna-low.webp`),
  layer('llanuraMareal', 'Llanura mareal', `${LOW}/llanura-mareal-low.webp`),
  layer('manglar', 'Manglar', `${LOW}/manglar-low.webp`),
  layer('monocultivos', 'Monocultivos', `${LOW}/monocultivos-low.webp`),
  layer('pantanoParamo', 'Pantano de páramo', `${LOW}/pantano-paramo-low.webp`),
  layer('Paramo', 'Páramo', `${LOW}/paramo-low.webp`),
  layer('playas', 'Playas', `${LOW}/playas-low.webp`),
  layer('regeneracionVegetal', 'Vegetación en regeneración', `${LOW}/regeneracion-vegetal-low.webp`),
  layer('rocasExpuestas', 'Rocas expuestas', `${LOW}/rocas-expuestas-low.webp`),
  layer('secosTropicales', 'Secos tropicales', `${LOW}/secos-tropicales-low.webp`),
  layer('sedimentosSubmarinos', 'Sedimentos submarinos', `${LOW}/sedimentos-submarinos-low.webp`),
  layer('subandinos', 'Subandinos', `${LOW}/subandinos-low.webp`),
  layer('subxerofitico', 'Subxerofítico', `${LOW}/subxerofitico-low.webp`),
  layer('xerofitico', 'Xerofítico', `${LOW}/xerofitico-low.webp`),
  layer('zonaPantanosa', 'Zona pantanosa', `${LOW}/zona-pantanosa-low.webp`),
  layer('zonaUrbanaIndustrial', 'Zona urbana industrial', `${LOW}/zona-urbana-industrial-low.webp`),
  layer('sinInformacion', 'Sin información', `${LOW}/sin-informacion-low.webp`),
]
