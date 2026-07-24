const rangoEcosistemas = 2.03;
const rangoTejidosDelAgua = 2;

const pgwData = {
  intro: [
    // PGW estándar sin skew. Convertido 90° horario desde PGW rotado original:
    //   A_new=B_old, E_new=-D_old, F calibrado al tileset (cubre lat ≈ [6.202, 12.879])
    0.001182047579,
    0.000000000000,
    0.000000000000,
    -0.001181998411,
    -78.907953240108,
    12.878607862918,
  ],
  encuadres: [
    // PGW estándar. Convertido 90° horario. W_portrait=3651. Calibrado.
    0.002292263474,
    0.000000000000,
    0.000000000000,
    -0.002291904891,
    -79.441458743296,
    12.895714158593,
  ],

  bredunco: [
    // PGW estándar. Misma región que intro. Calibrado.
    0.001182047579,
    0.000000000000,
    0.000000000000,
    -0.001181998411,
    -78.907953240108,
    12.878607862918,
  ],
  fomasDelPaisaje: [
    // PGW estándar. Convertido 90° horario. F calibrado (desplazamiento sur).
    // W_portrait=3389, H_portrait=6035
    0.002102102561,
    0.000000000000,
    0.000000000000,
    -0.002101779729,
    -79.131272642526,
    12.647097,
  ],
  ecosistemas: [
    // PGW estándar. Convertido 90° horario. W_portrait=5848
    0.000231866793 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000231853160 * rangoEcosistemas),
    -77.717574036785,
    3.592615411172 + (0.000231853160 * rangoEcosistemas) * 5848,
  ],

  tejidosDelAgua: [
    // PGW estándar. Convertido 90° horario. W_portrait=9214
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    2.161908918459 + (0.000083191365 * rangoTejidosDelAgua) * 9214,
  ],
  unRioCaucaMuchosMundos: [
    // PGW calibrado manualmente
    0.001232559561,
    0.000000000000,
    0.000000000000,
    -0.001232510189,
    -79.457953240108,
    12.711411317278,
  ],


  TNATransformadoras: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=1754.
    0.000328152382,
    0.000000000000,
    0.000000000000,
    -0.000328128994,
    -77.548017107743,
    5.965,
  ],

  ASuarez: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=6300.
    0.000022038657,
    0.000000000000,
    0.000000000000,
    -0.000022037894,
    -76.771441329681,
    3.0055,
  ],

  VDOrienteCali: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960.
    0.000015918925,
    0.000000000000,
    0.000000000000,
    -0.000015918409,
    -76.536968208220,
    3.489136891448,
  ],
  AVillaRica: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960.
    0.000055587544,
    0.000000000000,
    0.000000000000,
    -0.000055581180,
    -76.549878031544,
    3.465575696224,
  ],

  MOrienteCali: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4921.
    0.000600804878,
    0.000000000000,
    0.000000000000,
    -0.000600802103,
    -79.061542883750,
    4.408839088289,
  ],

  MVillaRica: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=3508 (medium).
    0.000036520866,
    0.000000000000,
    0.000000000000,
    -0.000036518263,
    -76.537247333922,
    3.095670144628,
  ],

  MSuarez: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=1329.
    0.000079131596,
    0.000000000000,
    0.000000000000,
    -0.000079124151,
    -76.326626783196,
    2.803508781332,
  ],


  introduccionCap3: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=1754.
    0.000239528625,
    0.000000000000,
    0.000000000000,
    -0.000239511553,
    -77.387345555000,
    2.618703041739,
  ],

  monocultivo: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=2806.
    0.000307865558,
    0.000000000000,
    0.000000000000,
    -0.000307843615,
    -76.939551386912,
    3.360877912215,
  ],

  nosEncharcaronElRio: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960.
    0.000035560332,
    0.000000000000,
    0.000000000000,
    -0.000035559180,
    -76.801058760121,
    2.920345962192,
  ],

  arcilla: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=1969.
    0.000020719464,
    0.000000000000,
    0.000000000000,
    -0.000020719422,
    -76.462515214762,
    3.200663196186,
  ],

  humedalesCap3: [
    // PGW estándar. Mixed PGW convertido (A/E residual asimilado). W=2559.
    0.000247614932,
    0.000000000000,
    0.000000000000,
    -0.000247615558,
    -77.374311108763,
    3.572715100344,
  ],

  introduccionCap4: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=2938.
    0.000105661672,
    0.000000000000,
    0.000000000000,
    -0.000105655592,
    -76.847071012304,
    3.057504177905,
  ],


  asoyoge: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000506572,
    0.000000000000,
    0.000000000000,
    -0.000000506536,
    -76.684872187963,
    2.939376449243,
  ],

  elBuhido: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000316628,
    0.000000000000,
    0.000000000000,
    -0.000000316606,
    -76.683480669945,
    2.943363652211,
  ],

  bosqueComestible: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=1754.
    0.000003502596,
    0.000000000000,
    0.000000000000,
    -0.000003502344,
    -76.493310517943,
    3.442352689114,
  ],

  losBajios: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000198462,
    0.000000000000,
    0.000000000000,
    -0.000000198448,
    -76.440746853991,
    3.193307587072,
  ],

  elPaso: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000490854,
    0.000000000000,
    0.000000000000,
    -0.000000490819,
    -76.672701593938,
    2.957800661072,
  ],

  lasMercedes: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000237440,
    0.000000000000,
    0.000000000000,
    -0.000000237423,
    -76.686255595443,
    2.931571470510,
  ],

  laVirginia: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000238244,
    0.000000000000,
    0.000000000000,
    -0.000000238227,
    -76.290182678552,
    3.225985855179,
  ],

  centroAgropecuario: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000515965,
    0.000000000000,
    0.000000000000,
    -0.000000515928,
    -76.431442736216,
    3.187538894219,
  ],

  laCaicedo: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=7015.
    0.000000317511,
    0.000000000000,
    0.000000000000,
    -0.000000317488,
    -76.428345083992,
    3.185903118549,
  ],

  problematicas: [
    // PGW estándar. Mixed PGW convertido (A/E residual asimilado). W=4960.
    0.000001194048,
    0.000000000000,
    0.000000000000,
    -0.000001194087,
    -76.502131435663,
    3.438239673010,
  ],




  aguasSuperficiales: [
    // A/E reducidos 4%, C/F calibrados
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],

  areasMetropolitanas: [
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],
  cuencaRioCauca: [
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],
  paramosNivalesVolcanes: [
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],
  parteaguasEstrellasFluviales: [
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],
  planicies: [
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],
  vias: [
    0.001179559500,
    0.000000000000,
    0.000000000000,
    -0.001179512251,
    -79.287953240108,
    12.165411317278,
  ],

  // Tegidos del agua

  acuifero1: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  acuifero2: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],
  nubosidad: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],

  rioCali: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],
  rioDesbaratado: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],
  rioGuachal: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  rioOvejas: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],
  rioPalo: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],

  rioPiendamo: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  rioQuinayamo: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  rioSalado: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],
  rioTimba: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,
  ],
  riosClaroJamundi: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  rioAgrupados: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  zonaAcuifero: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  zonaDescarga: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],
  zonaEquilibrio: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],

  zonaRecarga: [
    0.000083196257 * rangoTejidosDelAgua,
    0.000000000000,
    0.000000000000,
    -(0.000083191365 * rangoTejidosDelAgua),
    -76.968456199726,
    3.451908918459 + (0.000083191365 * rangoTejidosDelAgua) * 1462,

  ],

  //Mapa Ecosistemas

  agriculturaMixta: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,
  ],
  aguaSuperficial: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,
  ],
  altoAndinos: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  arbustal: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  areasInundacion: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  bosqueFragmentado: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  bosqueNiebla: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  ganaderia: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  glaciaresNivales: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  herbazalPastos: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  humedales: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  humedosTropicales: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  inundables: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  laguna: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  llanuraMareal: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  manglar: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  monocultivos: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  pantanoParamo: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  Paramo: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  playas: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  regeneracionVegetal: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,
  ],
  rocasExpuestas: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,
  ],
  secosTropicales: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,
  ],
  sedimentosSubmarinos: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  sinInformacion: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  subandinos: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  subxerofitico: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  xerofitico: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  zonaPantanosa: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],
  zonaUrbanaIndustrial: [
    0.000217466863 * rangoEcosistemas,
    0.000000000000,
    0.000000000000,
    -(0.000217454076 * rangoEcosistemas),
    -77.623835248587,
    5.49530180558 + (0.000217454076 * rangoEcosistemas) * 1462,

  ],

  humedalesCapa1970: [
    // PGW estándar. Mixed PGW convertido. W=5118. Cross-chapter (Ch3+Ch4). Mismos valores que humedalesCap3 pero W distinto.
    0.000247614932,
    0.000000000000,
    0.000000000000,
    -0.000247615558,
    -77.374311108763,
    4.206363313266,
  ],

  caliDeseca: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960.
    0.000065249271,
    0.000000000000,
    0.000000000000,
    -0.000065247158,
    -76.744923302940,
    3.432208485111,
  ],

  suarez1970: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960. Cross-chapter (Ch3+Ch4).
    0.000035560332,
    0.000000000000,
    0.000000000000,
    -0.000035559180,
    -76.801058760121,
    2.920345962192,
  ],

  cali1937: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960. Cross-chapter (Ch3+Ch4).
    0.000065249271,
    0.000000000000,
    0.000000000000,
    -0.000065247158,
    -76.744923302940,
    3.432208485111,
  ],

  cali1937agua: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=4960. Cross-chapter (Ch3+Ch4).
    0.000065249271,
    0.000000000000,
    0.000000000000,
    -0.000065247158,
    -76.744923302940,
    3.432208485111,
  ],



  enExplotacion: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=3937. Ch3 sub-layer.
    0.000010359732,
    0.000000000000,
    0.000000000000,
    -0.000010359711,
    -76.462515214762,
    3.200652836475,
  ],


  enReanatualizacion: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=3937. Ch3 sub-layer.
    0.000010359732,
    0.000000000000,
    0.000000000000,
    -0.000010359711,
    -76.462515214762,
    3.200652836475,
  ],

  enRellenados: [
    // PGW estándar. Convertido 90° horario desde PGW rotado. W=3937. Ch3 sub-layer.
    0.000010359732,
    0.000000000000,
    0.000000000000,
    -0.000010359711,
    -76.462515214762,
    3.200652836475,
  ],

};

export default pgwData;
