import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

const useMap = ({ imageBounds, regionZoomLimits }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const calculateZoom = () => {
    const mapWidth = mapContainerRef.current.clientWidth;
    const mapHeight = mapContainerRef.current.clientHeight;
    const imageWidth = Math.abs(imageBounds[1][0] - imageBounds[0][0]);
    const imageHeight = Math.abs(imageBounds[1][1] - imageBounds[0][1]);
    const zoomX = Math.log2(mapWidth / imageWidth);
    const zoomY = Math.log2(mapHeight / imageHeight);
    return Math.min(zoomX, zoomY);
  };

  useEffect(() => {
    const initialZoom = regionZoomLimits.min; // Usar el valor proporcionado en regionZoomLimits.min
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          "simple-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: ''
          }
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "simple-tiles",
            minzoom: 0,
            maxzoom: 22,
          }
        ]
      },
      center: [
        imageBounds[0][0] + (imageBounds[1][0] - imageBounds[0][0]) / 2,
        imageBounds[0][1] + (imageBounds[1][1] - imageBounds[0][1]) / 2,
      ],
      zoom: initialZoom,
      maxZoom: regionZoomLimits.max,
      minZoom: regionZoomLimits.min,
      bearing: -90,
      dragRotate: false,
      touchZoomRotate: false,
    });

    newMap.on("load", () => {
      setMap(newMap);
      setMapLoaded(true);
      newMap.setMaxBounds(imageBounds); // Establecer los límites máximos del mapa a los límites de la imagen
    });

    const updateCursorAndBounds = () => {
      const currentZoom = newMap.getZoom();

      if (currentZoom <= regionZoomLimits.min) {
        newMap.dragPan.disable();
        newMap.getCanvas().style.cursor = "default"; // Flecha
      } else if (currentZoom > regionZoomLimits.min) {
        newMap.dragPan.enable();
        newMap.getCanvas().style.cursor = currentZoom >= regionZoomLimits.min ? "grab" : "default";
      }
    };

    const centerOnZoomOut = (currentZoom, interpolationSpeed = 0.4) => {
      const smoothStep = (start, end, value) => {
        const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
        return x * x * (3 - 2 * x); // Suavizado
      };

      if (currentZoom <= regionZoomLimits.min + 0.3) {
        const progress = smoothStep(regionZoomLimits.min, regionZoomLimits.min + 0.3, currentZoom);
        const center = [
          imageBounds[0][0] + (imageBounds[1][0] - imageBounds[0][0]) / 2,
          imageBounds[0][1] + (imageBounds[1][1] - imageBounds[0][1]) / 2,
        ];

        const currentCenter = newMap.getCenter();
        const interpolatedCenter = [
          currentCenter.lng + (center[0] - currentCenter.lng) * progress,
          currentCenter.lat + (center[1] - currentCenter.lat) * progress,
        ];

        newMap.flyTo({
          center: interpolatedCenter,
          zoom: currentZoom,
          essential: true,
          speed: interpolationSpeed,
        });
      }
    };

    newMap.on("zoomend", () => {
      updateCursorAndBounds();
      centerOnZoomOut(newMap.getZoom(), regionZoomLimits.interpolationSpeed);
    });

    newMap.on("mousemove", () => {
      updateCursorAndBounds();
    });

    return () => {
      if (newMap) newMap.remove();
    };
  }, [imageBounds, regionZoomLimits]);

  return { map, mapLoaded, mapContainerRef };
};

export default useMap; 