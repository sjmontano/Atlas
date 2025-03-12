import { useRef } from "react";

const useImageOpacity = (minzoom, maxzoom) => {
  const opacityRef = useRef({ base: 1, low: 1, medium: 0, high: 0 });

  const smoothStep = (start, end, value) => {
    const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return Math.pow(x, 2) * (3 - 2 * x);
  };

  const calculateOverlappingOpacity = (zoom) => ({
    base: 1,
    low: zoom <= minzoom ? 1 : 1 - smoothStep(minzoom, minzoom + 0.5, zoom),
    medium: smoothStep(minzoom, minzoom + 0.5, zoom) * (zoom <= maxzoom - 1.5 ? 1 : 0),
    high: smoothStep(maxzoom - 2, maxzoom - 1.5, zoom),
  });

  return { opacityRef, calculateOverlappingOpacity };
};

export default useImageOpacity;