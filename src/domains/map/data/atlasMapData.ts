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

  // Capítulo 2 - Territorios específicos (por configurar)
  "chapter2-valle": {
    id: "chapter2-valle",
    name: "Valle del Cauca",
    description: "Mapa territorial del Valle del Cauca",
    imagePath: "/assets/interface/ui/mini-maps/valle.webp",
    pgwData: [0, 0, 0, 0, 0, 0] as [
      number,
      number,
      number,
      number,
      number,
      number,
    ], // Por configurar con datos reales
    // dimensions se cargan automáticamente de la imagen
    chapter: 2,
    territory: "valle",
  },

  "chapter2-suarez": {
    id: "chapter2-suarez",
    name: "Suárez",
    description: "Territorio de Suárez",
    imagePath: "/assets/interface/ui/mini-maps/suarez.webp",
    pgwData: [0, 0, 0, 0, 0, 0] as [
      number,
      number,
      number,
      number,
      number,
      number,
    ], // Por configurar con datos reales
    // dimensions se cargan automáticamente de la imagen
    chapter: 2,
    territory: "suarez",
  },

  "chapter2-cali": {
    id: "chapter2-cali",
    name: "Cali",
    description: "Territorio de Cali",
    imagePath: "/assets/interface/ui/mini-maps/cali.webp",
    pgwData: [0, 0, 0, 0, 0, 0] as [
      number,
      number,
      number,
      number,
      number,
      number,
    ], // Por configurar con datos reales
    // dimensions se cargan automáticamente de la imagen
    chapter: 2,
    territory: "cali",
  },

  "chapter2-villa-rica": {
    id: "chapter2-villa-rica",
    name: "Villa Rica",
    description: "Territorio de Villa Rica",
    imagePath: "/assets/interface/ui/mini-maps/villa-rica.webp",
    pgwData: [0, 0, 0, 0, 0, 0] as [
      number,
      number,
      number,
      number,
      number,
      number,
    ], // Por configurar con datos reales
    // dimensions se cargan automáticamente de la imagen
    chapter: 2,
    territory: "villa-rica",
  },
} as const;
