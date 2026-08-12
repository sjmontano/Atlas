const URIO_CAUCA_BASE = '/assets/maps/capas/un-rio-cauca'
const URIO_CAUCA_PGW = [0, 0.001232510189, 0.0012309569997728162, 0, -79.27447278696201, -0.6228009147673822]
const URIO_CAUCA_W = 5836
const URIO_CAUCA_H = 10388

const urioLayer = (id, name, group, order, opacity = 0.8) => ({
  id: `urc-${id}`,
  name,
  category: 'rivers',
  type: 'raster-pgw',
  image: `${URIO_CAUCA_BASE}/${id}.webp`,
  pgw: URIO_CAUCA_PGW,
  width: URIO_CAUCA_W,
  height: URIO_CAUCA_H,
  opacity,
  visibleByDefault: true,
  order,
  group,
  legend: { description: name },
})

export const CHAPTER1_URIOCAUCA_LAYERS = [
  urioLayer('parteaguas-estrellas-fluviales', 'Parteaguas y estrellas fluviales', 'urc-1', 100, 0.8),
  urioLayer('planicies', 'Planicies', 'urc-2', 200, 0.8),
  urioLayer('aguas-superficiales', 'Aguas superficiales', 'urc-3', 300, 1),
  urioLayer('paramos-nivales-volcanes', 'Páramos, nivales y volcanes', 'urc-4', 400, 0.8),
  urioLayer('cuenca-rio-cauca', 'Cuenca del río Cauca', 'urc-5', 500, 1),
  urioLayer('vias', 'Vías', 'urc-6', 600, 0.8),
  urioLayer('areas-metropolitanas', 'Áreas metropolitanas', 'urc-7', 700, 1),
]
