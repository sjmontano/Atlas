export const CHAPTERS = [
  {
    id: 1,
    title: 'I. El valle alto del río Cauca, su cuenca y sus mundos',
    description: 'Cartografías de la Cuenca',
    maps: [
      { mapId: 'chapter1-encuadres', title: 'Encuadres Territoriales' },
      { mapId: 'chapter1-ecosistemas', title: 'Ecosistemas' },
      { mapId: 'chapter1-formas-paisaje', title: 'Formas del Paisaje' },
      { mapId: 'chapter1-bredunco', title: 'Bredunco' },
      { mapId: 'chapter1-mosaicos-del-agua', title: 'Mosaicos del Agua' },
      { mapId: 'chapter1-un-rio-cauca', title: 'Un Río Cauca, Muchos Mundos' },
    ],
  },
  {
    id: 2,
    title: 'II. Tejidos, entramados territoriales y alternativas transformadoras',
    description: 'Territorios Específicos',
    territories: ['valle', 'suarez', 'cali', 'villa-rica'],
    maps: [
      { mapId: 'chapter2-valle', title: 'Valle del Cauca' },
      { mapId: 'chapter2-suarez', title: 'Suárez' },
      { mapId: 'chapter2-cali', title: 'Oriente de Cali' },
      { mapId: 'chapter2-villa-rica', title: 'Villa Rica' },
    ],
  },
  {
    id: 3,
    title: 'III. Caminos y conflictos del río Cauca en el valle alto',
    description: 'Caminos y Conflictos del Río Cauca',
    maps: [
      { mapId: 'chapter3-introduccion', title: 'Introducción Capítulo 3' },
      { mapId: 'chapter3-monocultivo', title: 'Monocultivo de Caña' },
      { mapId: 'chapter3-encharcaron', title: 'Nos Encharcaron el Río' },
      { mapId: 'chapter3-cali-deseca', title: 'Cali se Deseca' },
      { mapId: 'chapter3-humedales', title: 'Humedales del Cauca' },
      { mapId: 'chapter3-arcilla', title: 'Arcilla y Territorio' },
    ],
  },
  {
    id: 4,
    title: 'IV. Actores, acciones, capacidades y poderes en los nodos del Tejido',
    description: 'Actores, Acciones, Capacidades y Poderes',
    maps: [
      { mapId: 'chapter4-introduccion', title: 'Introducción Capítulo 4' },
      { mapId: 'chapter4-asoyoge', title: 'Asoyoge' },
      { mapId: 'chapter4-el-buhido', title: 'El Buhído' },
      { mapId: 'chapter4-bosque-comestible', title: 'Bosque Comestible' },
      { mapId: 'chapter4-los-bajios', title: 'Los Bajíos' },
      { mapId: 'chapter4-el-paso', title: 'El Paso' },
      { mapId: 'chapter4-las-mercedes', title: 'Las Mercedes' },
      { mapId: 'chapter4-la-virginia', title: 'La Virginia' },
      { mapId: 'chapter4-centro-agropecuario', title: 'Centro Agropecuario' },
      { mapId: 'chapter4-la-caicedo', title: 'La Caicedo' },
      { mapId: 'chapter4-problematicas', title: 'Problemáticas Ambientales' },
    ],
  },
]

export function getChapter(id) {
  return CHAPTERS.find(c => c.id === id) ?? null
}

export function getChapterMapIds(chapterId) {
  const chapter = getChapter(chapterId)
  return chapter ? chapter.maps.map(m => m.mapId) : []
}

export function getAllMaps() {
  return CHAPTERS.flatMap(c => c.maps)
}
