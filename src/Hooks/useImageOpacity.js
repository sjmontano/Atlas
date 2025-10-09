import { useRef } from "react";
import { calculateOverlappingOpacity } from "@utils/mapUtils";

const useImageOpacity = (minzoom, maxzoom, availableLayers) => {
  const opacityRef = useRef({});

  return {
    opacityRef,
    calculateOverlappingOpacity: (zoom) =>
      calculateOverlappingOpacity(zoom, minzoom, maxzoom, availableLayers),
  };
};

export default useImageOpacity;
