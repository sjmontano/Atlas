// Geographic bounds are represented as [west, south, east, north].
//
// IMPORTANTE: En PGW, C/F representan el centro del pixel (0,0).
// Para obtener la esquina superior izquierda real se corrige medio pixel
// en ambos ejes: x0 = C - 0.5*A - 0.5*B, y0 = F - 0.5*D - 0.5*E.
// Luego las esquinas se derivan con la transformacion afin completa.

const getGeoCornersFromPGW = (pgwData, width, height) => {
  const [a, d, b, e, c, f] = pgwData;

  // Origen corregido: esquina superior izquierda real (no centro del pixel)
  const x0 = c - 0.5 * a - 0.5 * b;
  const y0 = f - 0.5 * d - 0.5 * e;

  // Esquinas en orden MapLibre [TL, TR, BR, BL]
  const topLeft     = [x0, y0];
  const topRight    = [x0 + a * width, y0 + d * width];
  const bottomRight = [x0 + a * width + b * height, y0 + d * width + e * height];
  const bottomLeft  = [x0 + b * height, y0 + e * height];

  return [topLeft, topRight, bottomRight, bottomLeft];
};

// Coordinates for maplibre image source in order [TL, TR, BR, BL].
export const calculateImageCoordinates = (pgwData, width, height) =>
  getGeoCornersFromPGW(pgwData, width, height);

export const calculateGeographicBounds = (pgwData, width, height) => {
  const geoCorners = getGeoCornersFromPGW(pgwData, width, height);

  const longitudes = geoCorners.map((corner) => corner[0]);
  const latitudes = geoCorners.map((corner) => corner[1]);

  return [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ];
};

export const calculateCenter = (bounds) => [
  bounds[0] + (bounds[2] - bounds[0]) / 2,
  bounds[1] + (bounds[3] - bounds[1]) / 2,
];

export const validateBounds = (bounds) =>
  Array.isArray(bounds) &&
  bounds.length === 4 &&
  bounds.every((value) => Number.isFinite(value));

export const processBounds = (pgwData, width, height) => {
  const imageCoordinates = calculateImageCoordinates(pgwData, width, height);
  const bounds = calculateGeographicBounds(pgwData, width, height);
  return {
    bounds,
    imageCoordinates,
    center: calculateCenter(bounds),
    isValid: validateBounds(bounds),
  };
};
