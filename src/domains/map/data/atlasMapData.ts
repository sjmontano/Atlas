/**
 * 📊 DATOS DE MAPAS GEORREFERENCIADOS - ATLAS
 * ==========================================
 *
 * NOTA: Las dimensiones (width/height) son OPCIONALES.
 * Si no se proporcionan, se cargarán automáticamente de la imagen.
 *
 * REGLA PGW PARA NUEVOS MAPAS:
 * ============================
 * El sistema requiere PGW estándar (sin skew):
 *   A ≠ 0  → lon por pixel horizontal (positivo, hacia el este)
 *   D = 0  → sin skew
 *   B = 0  → sin skew
 *   E < 0  → lat por pixel vertical (negativo, hacia el sur)
 *   C      → longitud del centro del píxel top-left (x=0, y=0)
 *   F      → latitud del centro del píxel top-left (x=0, y=0)
 *
 * Si el GeoTIFF viene con PGW rotado (A=0, E=0, B≠0, D≠0), convertir así:
 *   Imagen girada 90° HORARIO  (landscape desde portrait):
 *     A_new = B_old
 *     E_new = -D_old
 *     C_new = C_old
 *     F_new = F_old + D_old × W_portrait
 *
 *   Imagen girada 90° ANTIHORARIO (landscape desde portrait):
 *     A_new = -B_old
 *     E_new = D_old
 *     C_new = C_old + B_old × H_portrait
 *     F_new = F_old
 */

export const ATLAS_MAP_DATA = {
  // Mapa de introducción general del Atlas
  //
  // PGW ORIGINAL (rotado, A=0 E=0 B≠0 D≠0):
  //   A=0, D=0.001181998411, B=0.001182047579, E=0, C=-78.907953240108, F=-0.290036434033
  // La imagen source era portrait; intro.webp ya está girada 90° HORARIO (landscape 11141×5649).
  // Conversión 90° horario con W_portrait=5649:
  //   A_new = B_old = 0.001182047579
  //   E_new = -D_old = -0.001181998411
  //   F_new = F_old + D_old × 5649 = -0.290036434033 + 6.677109023739 = 6.387072589706
  intro: {
    id: "intro",
    name: "Introducción",
    description:
      "Mapa de introducción del Atlas — visión amplia de la cuenca del Río Cauca",
    imagePath: "/assets/maps/base-images/intro.webp",
    dimensions: { width: 11141, height: 5649 },
    pgwData: [
      0.001182047579,   // A = B_old: lon/col
      0.0,              // D: sin skew
      0.0,              // B: sin skew
      -0.001181998411,  // E = -D_old: lat/row (negativo = sur)
      -78.907953240108, // C: lon centro píxel top-left (x=0, y=0)
      12.878607862918,  // F: lat centro píxel top-left — anclado al norte del extent de tiles
      // (coincide con el PGW del generador de tiles; cubre lat ≈ [6.202, 12.879])
    ] as [number, number, number, number, number, number],
  },

  // ─── Variantes de intro para comparación PGW ────────────────────────────
  // Usadas en /test-maps/intro-pgw-compare para validar setTransformConstrain.
  // Misma imagen y tiles que intro; solo cambia F (latitud del píxel top-left).

  // Variante A: alias de intro con rasterOpacity=0 para comparación pura de tiles
  "intro-pgw-current": {
    id: "intro-pgw-current",
    name: "Intro — PGW Actual (solo tiles)",
    description: "Alias de intro con imagen invisible. PGW correcto F=12.878607862918.",
    imagePath: "/assets/maps/base-images/intro.webp",
    dimensions: { width: 11141, height: 5649 },
    pgwData: [
      0.001182047579,
      0.0,
      0.0,
      -0.001181998411,
      -78.907953240108,
      12.878607862918,
    ] as [number, number, number, number, number, number],
  },

  // Variante B: fórmula de conversión 90° horario con W_portrait=5649 (valor antiguo)
  //   F = F_old + D_old × W_portrait = -0.290036434033 + 6.677109023739 = 6.387072589706
  //   Resultado: imagen anclada ~6.39°N sur — cubre lat [-0.290, 6.387] → tiles aparecen desplazados
  "intro-pgw-transformed": {
    id: "intro-pgw-transformed",
    name: "Intro — PGW Transformado (fórmula antigua)",
    description: "Variante PGW con F calculado por fórmula 90° horario W_portrait=5649. Compara con intro actual.",
    imagePath: "/assets/maps/base-images/intro.webp",
    dimensions: { width: 11141, height: 5649 },
    pgwData: [
      0.001182047579,    // A: lon/col (igual)
      0.0,               // D: sin skew
      0.0,               // B: sin skew
      -0.001181998411,   // E: lat/row (igual)
      -78.907953240108,  // C: lon top-left (igual)
      6.387072589706,    // F: lat top-left — fórmula da 6.39°N (incorrecto)
    ] as [number, number, number, number, number, number],
  },

  // Variante C: PGW original de Atlas v17 tal como venía del GeoTIFF (A=E=0, rotado)
  //   No se puede usar directamente (A=0 E=0 → BoundsCalculator da span=0).
  //   Para visualizar, se usa la forma no-rotada con F original sin transformar.
  //   F = -0.290036434033 (lat tope ≈ -0.29°N → imagen centrada en sur de Colombia)
  "intro-pgw-v17": {
    id: "intro-pgw-v17",
    name: "Intro — PGW Original Atlas v17",
    description: "Variante PGW con F original del GeoTIFF v17 sin conversión. Representa el error base.",
    imagePath: "/assets/maps/base-images/intro.webp",
    dimensions: { width: 11141, height: 5649 },
    pgwData: [
      0.001182047579,    // A: lon/col (forzado no-cero para BoundsCalculator)
      0.0,               // D: sin skew
      0.0,               // B: sin skew
      -0.001181998411,   // E: lat/row (forzado no-cero)
      -78.907953240108,  // C: lon top-left (igual)
      -0.290036434033,   // F: lat top-left original v17 — ≈-0.29°N (muy al sur)
    ] as [number, number, number, number, number, number],
  },

  // Capítulo 1 - Encuadres generales
  "chapter1-encuadres": {
    id: "chapter1-encuadres",
    name: "Encuadres Territoriales",
    description: "Vista general de los encuadres territoriales del Atlas",
    imagePath: "/assets/maps/base-images/chapter1/encuadres.webp",
    dimensions: { width: 6497, height: 3651 },
    pgwData: [
      0.002291638125288596, // A: lon/col
      0.0, // D: sin skew
      0.0, // B: sin skew
      -0.002290735360175294, // E: lat/row (negativo = sur)
      -82.70296198093736, // C: lon centro píxel top-left (x=0, y=0)
      -4.618418667680087, // F: lat centro píxel top-left (x=0, y=0)
    ] as [number, number, number, number, number, number],
    chapter: 1,
  },

  // Capítulo 1 - Ecosistemas
  //
  // PGW ORIGINAL (rotado, A=0 E=0 B≠0 D≠0) con rango 2.03 aplicado:
  //   A=0, D=0.000231853160*2.03, B=0.000231866793*2.03, E=0,
  //   C=-77.717574036785, F=1.505615411172
  // La imagen final está en landscape (10396×5848).
  // Conversión 90° horario con W_portrait=5848:
  //   A_new = B_old = 0.00047068958979
  //   E_new = -D_old = -0.0004706619148
  //   F_new = F_old + D_old × 5848 = 4.258046288922
  "chapter1-ecosistemas": {
    id: "chapter1-ecosistemas",
    name: "Ecosistemas",
    description: "Ecosistemas de la cuenca del Río Cauca",
    imagePath: "/assets/maps/base-images/chapter1/ecosistemas.webp",
    lowResImagePath: "/assets/maps/base-images/chapter1/ecosistemas-preview.webp",
    dimensions: { width: 10396, height: 5848 },
    pgwData: [
      0.00047068958979, // A = B_old: lon/col
      0.0, // D: sin skew
      0.0, // B: sin skew
      -0.0004706619148, // E = -D_old: lat/row (negativo = sur)
      -77.717574036785, // C: lon centro píxel top-left (x=0, y=0)
      4.258046288922, // F = F_old + D_old×W_portrait: lat centro píxel top-left
    ] as [number, number, number, number, number, number],
    chapter: 1,
  },

  // Capítulo 1 - Formas del Paisaje
  //
  // PGW ORIGINAL (rotado, A=0 E=0 B≠0 D≠0):
  //   A=0, D=0.002101779729, B=0.002102102561, E=0, C=-79.131272642526, F=-0.005834616506
  // La imagen final está en landscape (6035×3389).
  // Conversión 90° horario con W_portrait=3389:
  //   A_new = B_old = 0.002102102561
  //   E_new = -D_old = -0.002101779729
  //   F_new = F_old + D_old × 3389 = -0.005834616506 + 7.122931501581 = 7.117096885075
  "chapter1-formas-paisaje": {
    id: "chapter1-formas-paisaje",
    name: "Formas del Paisaje",
    description: "Formas del paisaje de la cuenca del Río Cauca",
    imagePath: "/assets/maps/base-images/chapter1/formas-del-paisaje.webp",
    lowResImagePath:
      "/assets/maps/base-images/chapter1/formas-del-paisaje-preview.webp",
    dimensions: { width: 6035, height: 3389 },
    pgwData: [
      0.002102102561, // A = B_old: lon/col
      0.0, // D: sin skew
      0.0, // B: sin skew
      -0.002101779729, // E = -D_old: lat/row (negativo = sur)
      -79.131272642526, // C: lon centro píxel top-left (x=0, y=0)
      7.117096885075, // F = F_old + D_old×W_portrait: lat centro píxel top-left
    ] as [number, number, number, number, number, number],
    chapter: 1,
  },

  // Capítulo 1 - Bredunco
  //
  // PGW ORIGINAL (rotado, A=0 E=0 B≠0 D≠0):
  //   A=0, D=0.001181998411, B=0.001182047579, E=0, C=-78.907953240108, F=-0.290036434033
  // Conversión 90° horario con W_portrait=5649:
  //   A_new = B_old = 0.001182047579
  //   E_new = -D_old = -0.001181998411
  //   F_new = F_old + D_old × 5649 = 6.387072589706
  "chapter1-bredunco": {
    id: "chapter1-bredunco",
    name: "Bredunco",
    description: "Mapa Bredunco de la cuenca",
    imagePath: "/assets/maps/base-images/chapter1/bredunco.webp",
    lowResImagePath: "/assets/maps/base-images/chapter1/bredunco-preview.webp",
    dimensions: { width: 10059, height: 5649 },
    pgwData: [
      0.001182047579, 0.0, 0.0, -0.001181998411, -78.907953240108,
      6.387072589706,
    ] as [number, number, number, number, number, number],
    chapter: 1,
  },

  // Capítulo 1 - Mosaicos del Agua
  //
  // PGW ORIGINAL (tejidosDelAgua rotado, con rango=2 aplicado):
  //   A=0, D=0.000166382730, B=0.000166392514, E=0, C=-76.968456199726, F=2.161908918459
  // Conversión 90° horario con W_portrait=9214:
  //   A_new = B_old = 0.000166392514
  //   E_new = -D_old = -0.000166382730
  //   F_new = F_old + D_old × 9214 = 3.694959392679
  "chapter1-mosaicos-del-agua": {
    id: "chapter1-mosaicos-del-agua",
    name: "Mosaicos del Agua",
    description: "Mosaicos hídricos de la cuenca",
    imagePath: "/assets/maps/base-images/chapter1/mosaicos-del-agua.webp",
    lowResImagePath:
      "/assets/maps/base-images/chapter1/mosaicos-del-agua-preview.webp",
    dimensions: { width: 16382, height: 9214 },
    pgwData: [
      0.000166392514, 0.0, 0.0, -0.00016638273, -76.968456199726,
      3.694959392679,
    ] as [number, number, number, number, number, number],
    chapter: 1,
  },

  // Capítulo 1 - Un Río Cauca, Muchos Mundos
  //
  // PGW ORIGINAL (rotado):
  //   A=0, D=0.001232510189, B=0.001232559561, E=0, C=-79.451453386908, F=-0.584715652220
  // Conversión 90° horario con W_portrait=6082:
  //   A_new = B_old = 0.001232559561
  //   E_new = -D_old = -0.001232510189
  //   F_new = F_old + D_old × 6082 = 6.911411317278
  "chapter1-un-rio-cauca": {
    id: "chapter1-un-rio-cauca",
    name: "Un Río Cauca, Muchos Mundos",
    description: "Mapa Un Río Cauca, Muchos Mundos",
    imagePath: "/assets/maps/base-images/chapter1/un-rio-cauca.webp",
    lowResImagePath:
      "/assets/maps/base-images/chapter1/un-rio-cauca-preview.webp",
    dimensions: { width: 10826, height: 6082 },
    pgwData: [
      0.001232559561, 0.0, 0.0, -0.001232510189, -79.451453386908,
      6.911411317278,
    ] as [number, number, number, number, number, number],
    chapter: 1,
  },

  // ═══════════════════════════════════════════════════════
  // Capítulo 2 — PGW portado desde Atlas v17
  //   TNATransformadoras → valle
  //   ASuarez → suarez
  //   VDOrienteCali → cali
  //   AVillaRica → villa-rica
  //
  // Todas las imágenes se sirven desde Cloudinary (misma fuente que v17).
  // Pendiente: descargar copias locales.
  // ═══════════════════════════════════════════════════════

  "chapter2-valle": {
    id: "chapter2-valle",
    name: "Valle del Cauca (TNA Transformadoras)",
    description: "Entramados territoriales transformadores del Valle del Cauca",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285334/geoImages/kbg62bjm983wn9p6xexl.webp",
    dimensions: { width: 1754, height: 1972 },
    pgwData: [
      0.000328152382, 0.0, 0.0, -0.000328128994, -77.548017107743,
      5.965,
    ] as [number, number, number, number, number, number],
    chapter: 2,
    territory: "valle",
  },

  "chapter2-suarez": {
    id: "chapter2-suarez",
    name: "Suárez",
    description: "Territorio de Suárez — detalle de la cuenca del río Suárez",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061326/geoImages/mwz79qubfmr0x5zqtzto.webp",
    dimensions: { width: 6300, height: 4200 },
    pgwData: [
      0.000022038657, 0.0, 0.0, -0.000022037894, -76.771441329681,
      2.897276346134,
    ] as [number, number, number, number, number, number],
    chapter: 2,
    territory: "suarez",
  },

  "chapter2-cali": {
    id: "chapter2-cali",
    name: "Oriente de Cali",
    description: "Vista detalle del oriente de Cali y su entorno territorial",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512015/geoImages/roog2p6gjo3dnnqpcfel.webp",
    dimensions: { width: 4960, height: 3508 },
    pgwData: [
      0.000015918925, 0.0, 0.0, -0.000015918409, -76.533768208220,
      3.427136891448,
    ] as [number, number, number, number, number, number],
    chapter: 2,
    territory: "cali",
  },

  "chapter2-villa-rica": {
    id: "chapter2-villa-rica",
    name: "Villa Rica",
    description: "Territorio de Villa Rica y su cuenca hidrográfica",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512655/geoImages/pdxepthixmeebgei59yq.webp",
    dimensions: { width: 4960, height: 3508 },
    pgwData: [
      0.000055587544, 0.0, 0.0, -0.000055581180, -76.549878031544,
      3.250575696224,
    ] as [number, number, number, number, number, number],
    chapter: 2,
    territory: "villa-rica",
  },

  // ═══════════════════════════════════════════════════════
  // Capítulo 3: Caminos y conflictos del río Cauca (6 mapas)
  // Portado desde Atlas v17
  // ═══════════════════════════════════════════════════════

  "chapter3-introduccion": {
    id: "chapter3-introduccion",
    name: "Introducción Capítulo 3",
    description: "Visión general de los conflictos del río Cauca",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp",
    dimensions: { width: 1754, height: 1972 },
    pgwData: [
      0.000239528625, 0.0, 0.0, -0.000239511553, -77.387345555000,
      2.618703041739,
    ] as [number, number, number, number, number, number],
    chapter: 3,
  },

  "chapter3-monocultivo": {
    id: "chapter3-monocultivo",
    name: "Monocultivo de Caña",
    description: "Expansión del monocultivo de caña de azúcar en el valle",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp",
    dimensions: { width: 2806, height: 3157 },
    pgwData: [
      0.000307865558, 0.0, 0.0, -0.000307843615, -76.939551386912,
      3.360877912215,
    ] as [number, number, number, number, number, number],
    chapter: 3,
  },

  "chapter3-encharcaron": {
    id: "chapter3-encharcaron",
    name: "Nos Encharcaron el Río",
    description: "Transformaciones del cauce del río Cauca",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1762998575/geoImages/ladieazp24oyoyqszzlo.webp",
    dimensions: { width: 4960, height: 3508 },
    pgwData: [
      0.000035560332, 0.0, 0.0, -0.000035559180, -76.801058760121,
      2.920345962192,
    ] as [number, number, number, number, number, number],
    chapter: 3,
  },

  "chapter3-cali-deseca": {
    id: "chapter3-cali-deseca",
    name: "Cali se Deseca",
    description: "Pérdida de humedales en el área de Cali",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852352/geoImages/maiachqmczyrhmph1rql.webp",
    dimensions: { width: 4960, height: 3508 },
    pgwData: [
      0.000065249271, 0.0, 0.0, -0.000065247158, -76.744923302940,
      3.432208485111,
    ] as [number, number, number, number, number, number],
    chapter: 3,
  },

  "chapter3-humedales": {
    id: "chapter3-humedales",
    name: "Humedales del Cauca",
    description: "Ecosistemas de humedal en la cuenca del Cauca",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp",
    dimensions: { width: 2559, height: 2879 },
    pgwData: [
      0.000247614932, 0.0, 0.0, -0.000247615558, -77.374311108763,
      3.572715100344,
    ] as [number, number, number, number, number, number],
    chapter: 3,
  },

  "chapter3-arcilla": {
    id: "chapter3-arcilla",
    name: "Arcilla y Territorio",
    description: "Extracción de arcilla y transformación territorial",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1763846278/geoImages/zbtnuchm9uvshuqnaota.webp",
    dimensions: { width: 1969, height: 2215 },
    pgwData: [
      0.000020719464, 0.0, 0.0, -0.000020719422, -76.462515214762,
      3.200663196186,
    ] as [number, number, number, number, number, number],
    chapter: 3,
  },

  // ═══════════════════════════════════════════════════════
  // Capítulo 4: Actores, acciones, capacidades y poderes (11 mapas)
  // Portado desde Atlas v17
  // ═══════════════════════════════════════════════════════

  "chapter4-introduccion": {
    id: "chapter4-introduccion",
    name: "Introducción Capítulo 4",
    description: "Visión general de los actores y nodos del tejido territorial",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp",
    dimensions: { width: 2938, height: 3304 },
    pgwData: [
      0.000105661672, 0.0, 0.0, -0.000105655592, -76.847071012304,
      3.057504177905,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-asoyoge": {
    id: "chapter4-asoyoge",
    name: "Asoyoge",
    description: "Finca Asoyoge",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000506572, 0.0, 0.0, -0.000000506536, -76.684872187963,
      2.939376449243,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-el-buhido": {
    id: "chapter4-el-buhido",
    name: "El Buhído",
    description: "Finca El Buhído",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/l5qj5qxh5onul1b26e71.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000316628, 0.0, 0.0, -0.000000316606, -76.683480669945,
      2.943363652211,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-bosque-comestible": {
    id: "chapter4-bosque-comestible",
    name: "Bosque Comestible",
    description: "Bosque Comestible",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/yodemiucfhtp0iklk2fi.png",
    dimensions: { width: 1754, height: 2482 },
    pgwData: [
      0.000003502596, 0.0, 0.0, -0.000003502344, -76.493310517943,
      3.442352689114,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-los-bajios": {
    id: "chapter4-los-bajios",
    name: "Los Bajíos",
    description: "Finca Los Bajíos",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/xrssyymmhamqorcf5gb0.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000198462, 0.0, 0.0, -0.000000198448, -76.440746853991,
      3.193307587072,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-el-paso": {
    id: "chapter4-el-paso",
    name: "El Paso",
    description: "Finca El Paso",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/gqczkzh18jqhgatzwiht.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000490854, 0.0, 0.0, -0.000000490819, -76.672701593938,
      2.957800661072,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-las-mercedes": {
    id: "chapter4-las-mercedes",
    name: "Las Mercedes",
    description: "Finca Las Mercedes",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/uda3sxgw61nf5tt6mtfp.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000237440, 0.0, 0.0, -0.000000237423, -76.686255595443,
      2.931571470510,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-la-virginia": {
    id: "chapter4-la-virginia",
    name: "La Virginia",
    description: "Finca La Virginia",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/smdehdeaewwwasco6wt5.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000238244, 0.0, 0.0, -0.000000238227, -76.290182678552,
      3.225985855179,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-centro-agropecuario": {
    id: "chapter4-centro-agropecuario",
    name: "Centro Agropecuario",
    description: "Centro Agropecuario",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/drkxyppqvzpngqura5qg.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000515965, 0.0, 0.0, -0.000000515928, -76.431442736216,
      3.187538894219,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-la-caicedo": {
    id: "chapter4-la-caicedo",
    name: "La Caicedo",
    description: "Finca La Caicedo",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/fmyppc7aotckznz2zsah.png",
    dimensions: { width: 7015, height: 9929 },
    pgwData: [
      0.000000317511, 0.0, 0.0, -0.000000317488, -76.428345083992,
      3.185903118549,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },

  "chapter4-problematicas": {
    id: "chapter4-problematicas",
    name: "Problemáticas Ambientales",
    description: "Problemáticas ambientales del territorio",
    imagePath:
      "https://res.cloudinary.com/dvluvxfvn/image/upload/v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp",
    dimensions: { width: 4960, height: 7016 },
    pgwData: [
      0.000001194048, 0.0, 0.0, -0.000001194087, -76.502131435663,
      3.438239673010,
    ] as [number, number, number, number, number, number],
    chapter: 4,
  },
} as const;
