// ─────────────────────────────────────────────────────────────────────────────
// CONFIGS — Configuración de cámara e interacción por mapa
// ─────────────────────────────────────────────────────────────────────────────
//
//   initialBearing: -90  → rota el viewport para alinear el PGW rotado.
//   useTransformConstrain → solo en mapas interactivos. En mapas bloqueados
//                           (vista fija) no hay nada que restringir, y el
//                           minZoom del constrain (dependiente del canvas)
//                           podría recortar la imagen.
// ─────────────────────────────────────────────────────────────────────────────

export const MAP_CONFIGS = {
  // ─── Mapas BLOQUEADOS (vista fija, sin pan ni zoom) ──────────────────────
  intro: {
    initialZoom: 6.39,
    minZoom: 6.39,
    maxZoom: 6.39,
    initialBearing: -90,
    useTransformConstrain: false,
    viewportMaxBounds: null,
    dragPan: false,
    scrollZoom: false,
  },

  'chapter1-encuadres': {
    initialZoom: 6.06,
    minZoom: 6.06,
    maxZoom: 6.06,
    initialBearing: -90,
    useTransformConstrain: false,
    viewportMaxBounds: null,
    dragPan: false,
    scrollZoom: false,
  },

  // ─── Mapas INTERACTIVOS (pan + zoom habilitados) ─────────────────────────
  'chapter1-ecosistemas': {
    initialZoom: 6.4,
    minZoom: 6.4,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },

  'chapter1-formas-paisaje': {
    initialZoom: 6,
    minZoom: 6,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },

  'chapter1-bredunco': {
    initialZoom: 6.4,
    minZoom: 6.4,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },

  'chapter1-mosaicos-del-agua': {
    initialZoom: 8.5,
    minZoom: 8.5,
    maxZoom: 9.5,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },

  'chapter1-un-rio-cauca': {
    initialZoom: 6.5,
    minZoom: 6.5,
    maxZoom: 10,
    initialBearing: -90,
    useTransformConstrain: true,
    viewportMaxBounds: null,
    dragPan: true,
    scrollZoom: true,
  },
}
