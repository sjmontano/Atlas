export const calculateMapCenter = (imageBounds) => [
    imageBounds[0][0] + (imageBounds[1][0] - imageBounds[0][0]) / 2,
    imageBounds[0][1] + (imageBounds[1][1] - imageBounds[0][1]) / 2,
  ];