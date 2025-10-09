import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import mapDefaults from "../data/mapImages/mapDefaults";

// 📐 Cálculo dinámico de minZoom basado en el tamaño geográfico de la imagen
const calculateDynamicMinZoom = (imageBounds) => {
  const viewportWidth = window.innerWidth;
  const tileSize = 512;
  const imageWidth = Math.abs(imageBounds[1][0] - imageBounds[0][0]);

  const minZoomFromImage = Math.log2((360 * viewportWidth) / (tileSize * imageWidth));
  return Math.max(minZoomFromImage, mapDefaults.minZoom); // protección
};

const useMap = ({
  imageBounds,
  initialZoom,
  initialBearing,
  maxBounds,
  dragRotate,
  touchZoomRotate,
  minZoom,
  maxZoom,
  dragPan,
  scrollZoom,
  flyToSpeed,
  lockRotation,
  inertia,
}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Valores personalizados o fallback
  const zoom = initialZoom ?? mapDefaults.initialZoom;
  const bearing = initialBearing ?? mapDefaults.initialBearing;
  const shouldApplyMaxBounds = maxBounds === 1;
  const minZoomValue = minZoom ?? calculateDynamicMinZoom(imageBounds);
  const maxZoomValue = maxZoom ?? mapDefaults.maxZoom;

  useEffect(() => {
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },

      dragRotate: dragRotate ?? mapDefaults.dragRotate,
      touchZoomRotate: touchZoomRotate ?? mapDefaults.touchZoomRotate,
      dragPan: dragPan ?? mapDefaults.dragPan,
      scrollZoom: scrollZoom ?? mapDefaults.scrollZoom,
      flyToSpeed: flyToSpeed ?? mapDefaults.flyToSpeed,
      pitchWithRotate: false,
      attributionControl: false,
      bearing,
      lockRotation: lockRotation ?? mapDefaults.lockRotation,
      inertia: inertia ?? mapDefaults.inertia,
      minZoom: minZoomValue,
      maxZoom: maxZoomValue,
    });

    newMap.on("load", () => {
      setMap(newMap);
      setMapLoaded(true);

      const bounds = [
        [imageBounds[0][0], imageBounds[0][1]],
        [imageBounds[1][0], imageBounds[1][1]],
      ];

      if (shouldApplyMaxBounds) {
        newMap.setMaxBounds(bounds); // 🧱 Límite duro
      }

      // Encuadre inicial con bearing y sin animación
      newMap.fitBounds(bounds, {
        padding: 0,
        duration: 0,
        maxZoom: zoom,
        bearing,
      });
    });

    return () => {
      newMap.remove();
    };
  }, [
    imageBounds,
    zoom,
    bearing,
    minZoomValue,
    maxZoomValue,
    dragRotate,
    touchZoomRotate,
    dragPan,
    scrollZoom,
    flyToSpeed,
    lockRotation,
    inertia,
    shouldApplyMaxBounds,
  ]);

  return { map, mapLoaded, mapContainerRef };
};

export default useMap;
