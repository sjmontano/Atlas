import calculateCoordinates from "./calculateCoordinates";

// 📌 Genera los límites de la imagen basados en la georreferenciación
export const generateImageBounds = ({ initialCoordinates, width, height, scaleX, scaleY }) => {
  if (!initialCoordinates || isNaN(scaleX) || isNaN(scaleY) || isNaN(width) || isNaN(height)) {
    console.warn("⚠️ Datos inválidos en `generateImageBounds`:", { initialCoordinates, width, height, scaleX, scaleY });
    return null;
  }

  const bounds = [
    initialCoordinates,
    calculateCoordinates({ initialCoordinates, width, height, scaleX, scaleY }),
  ];

  //console.log("📍 `generateImageBounds` calculado:", bounds);
  return bounds;
};

// 📌 Calcula el centro del mapa
export const calculateMapCenter = (imageBounds) => {
  if (!imageBounds || !Array.isArray(imageBounds) || imageBounds.length !== 2) {
    console.warn("⚠️ `calculateMapCenter` recibió `imageBounds` inválido:", imageBounds);
    return [0, 0];
  }

  return [
    (imageBounds[0][0] + imageBounds[1][0]) / 2, // 📌 Centro de longitud
    (imageBounds[0][1] + imageBounds[1][1]) / 2, // 📌 Centro de latitud
  ];
};

// 📌 Calcula la opacidad de las imágenes según el zoom
export const calculateOverlappingOpacity = (zoom, minzoom, maxzoom, availableLayers = []) => {
  if (!Array.isArray(availableLayers) || availableLayers.length === 0) {
    console.warn("⚠️ No se pasaron capas disponibles. Se usará solo `base` por defecto.");
    return { base: 1, low: 0, medium: 0, high: 0 };
  }

  const smoothStep = (start, end, value) => {
    const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return x * x * (3 - 2 * x);
  };

  const opacity = { base: 0, low: 0, medium: 0, high: 0 };
  let lastVisibleLayer = availableLayers[availableLayers.length - 1];

  if (availableLayers.includes("low")) {
    opacity.low = zoom <= minzoom ? 1 : 1 - smoothStep(minzoom, minzoom + 1, zoom);
    lastVisibleLayer = "low";
  }

  if (availableLayers.includes("medium")) {
    opacity.medium = smoothStep(minzoom, minzoom + 1, zoom);
    if (zoom > minzoom + 1) {
      opacity.medium = 1 - smoothStep(minzoom + 1, maxzoom - 2, zoom);
    }
    lastVisibleLayer = "medium";
  }

  if (availableLayers.includes("high")) {
    opacity.high = smoothStep(maxzoom - 2, maxzoom, zoom);
    lastVisibleLayer = "high";
  }

  if (availableLayers.includes("base")) {
    opacity.base = 1;
    lastVisibleLayer = "base";
  }

  if (Object.values(opacity).every((val) => val === 0)) {
    opacity[lastVisibleLayer] = 1;
  }

  return opacity;
};
