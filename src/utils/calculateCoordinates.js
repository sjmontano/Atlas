const calculateCoordinates = ({ initialCoordinates, width, height, scaleX, scaleY }) => {
  if (!initialCoordinates || isNaN(scaleX) || isNaN(scaleY) || isNaN(width) || isNaN(height)) {
    console.warn(`⚠️ calculateCoordinates recibió valores inválidos:`, { initialCoordinates, width, height, scaleX, scaleY });
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
