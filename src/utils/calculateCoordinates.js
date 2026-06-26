const calculateCoordinates = ({
  initialCoordinates,
  width,
  height,
  scaleX,
  scaleY,
  pgwData,
  x,
  y,
}) => {
  const pixelX = Number.isFinite(x) ? x : width;
  const pixelY = Number.isFinite(y) ? y : height;

  if (
    Array.isArray(pgwData) &&
    pgwData.length === 6 &&
    Number.isFinite(pixelX) &&
    Number.isFinite(pixelY)
  ) {
    const [a, d, b, e, c, f] = pgwData;
    return [a * pixelX + b * pixelY + c, d * pixelX + e * pixelY + f];
  }

  if (
    !initialCoordinates ||
    isNaN(scaleX) ||
    isNaN(scaleY) ||
    isNaN(width) ||
    isNaN(height)
  ) {
    console.warn(`⚠️ calculateCoordinates recibió valores inválidos:`, {
      initialCoordinates,
      width,
      height,
      scaleX,
      scaleY,
      pgwData,
      x,
      y,
    });
    return initialCoordinates; // Retornar coordenadas originales en caso de error
  }

  const result = [
    initialCoordinates[0] + scaleX * width,
    initialCoordinates[1] + scaleY * height,
  ];

  if (isNaN(result[0]) || isNaN(result[1])) {
    console.warn(`⚠️ Coordenadas calculadas inválidas:`, result);
    return initialCoordinates; // Fallback en caso de error
  }

  return result;
};

export default calculateCoordinates;
