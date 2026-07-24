// ─────────────────────────────────────────────────────────────────────────────
// GEO — Datos geográficos de mapas (PGW + dimensiones)
// ─────────────────────────────────────────────────────────────────────────────
//
// FUENTE DE VERDAD para georreferenciación.
//
// PGW en formato ROTADO original de v17:
//   [A, D, B, E, C, F] donde A=0, E=0, D≠0, B≠0
//
//   Con PGW rotado:
//     lng = B·row + C   (la longitud depende de la FILA del píxel)
//     lat = D·col + F   (la latitud depende de la COLUMNA del píxel)
//
//   La imagen tiene el norte geográfico "a la derecha".
//   MapLibre la alinea con bearing: -90 (rotación del viewport, no de datos).
//
// DIMENSIONES: portrait ORIGINALES (width < height), medidas vía Cloudinary
// fl_getinfo (bitácora Interacción 27). NO usar las landscape rotadas de
// atlasMapData.ts de 3.0 — esas corresponden a imágenes rotadas con GDAL.
//
// C/F son el CENTRO del píxel (0,0), no la esquina. BoundsCalculator aplica
// la corrección half-pixel automáticamente.
// ─────────────────────────────────────────────────────────────────────────────

export const MAP_GEO = {
  // ─── Intro ─────────────────────────────────────────────────────────────
  intro: {
    pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033],
    width: 5649,
    height: 11141,
  },

  // ─── Capítulo 1 ────────────────────────────────────────────────────────
  'chapter1-encuadres': {
    pgw: [0, 0.002291904891, 0.002292263474, 0, -79.441458743296, -1.354624163443],
    width: 3389,
    height: 6684,
  },

  'chapter1-ecosistemas': {
    // v17: D/B base × rangoEcosistemas (2.03) — valores ya multiplicados
    pgw: [0, 0.0004706619148, 0.0004706895898, 0, -77.717574036785, 1.505615411172],
    width: 5846,
    height: 10394,
  },

  'chapter1-formas-paisaje': {
    pgw: [0, 0.002101779729, 0.002102102561, 0, -79.131272642526, -0.005834616506],
    width: 3389,
    height: 6035,
  },

  'chapter1-bredunco': {
    pgw: [0, 0.001181998411, 0.001182047579, 0, -78.907953240108, -0.290036434033],
    width: 5649,
    height: 11141,
  },

  'chapter1-mosaicos-del-agua': {
    pgw: [0, 0.000166382730, 0.000166392514, 0, -76.968456199726, 2.161908918459],
    width: 5845,
    height: 10393,
  },

  'chapter1-un-rio-cauca': {
    pgw: [0, 0.001232510189, 0.001232559561, 0, -79.451453386908, -0.584715652220],
    width: 6082,
    height: 10826,
  },
}
