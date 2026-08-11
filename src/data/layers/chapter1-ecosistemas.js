const COMPOSITE_BASE = '/assets/maps/capas/ecosistemas'
const COMPOSITE_PGW = [0.000441457732, 0, 0, -0.000441431774, -77.623835249, 6.140675060]
const COMPOSITE_W = 1462
const COMPOSITE_H = 2599

const compositeLayer = (id, name, group, order, swatch) => ({
  id: `eco-composite-${id}`,
  name,
  category: 'ecosystems',
  type: 'raster-pgw',
  image: `${COMPOSITE_BASE}/${id}.webp`,
  pgw: COMPOSITE_PGW,
  width: COMPOSITE_W,
  height: COMPOSITE_H,
  opacity: 0.8,
  visibleByDefault: true,
  order,
  group,
  legend: { swatch, description: name },
})

export const CHAPTER1_ECOSYSTEMS_LAYERS = [
  compositeLayer('1.1_de_litoral_aguas', '1.1 Litoral y aguas', 'eco-1.1', 100, '#2b83ba'),
  compositeLayer('1.2_vegetacion_baja', '1.2 Vegetación baja', 'eco-1.2', 200, '#abdda4'),
  compositeLayer('1.3_bosques', '1.3 Bosques', 'eco-1.3', 300, '#1a9641'),
  compositeLayer('1.4_altas_cumbres', '1.4 Altas cumbres', 'eco-1.4', 400, '#d7191c'),
  compositeLayer('2.1_intervencion_moderada', '2.1 Intervención moderada', 'eco-2.1', 500, '#fdae61'),
  compositeLayer('2.3_intervencion_severa', '2.3 Intervención severa', 'eco-2.3', 600, '#a6cee3'),
  compositeLayer('3_sin_informacion', '3 Sin información', 'eco-3', 700, '#d9d9d9'),
]
