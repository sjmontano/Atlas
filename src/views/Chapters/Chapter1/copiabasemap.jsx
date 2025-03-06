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
    const initialZoom = calculateZoom();
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

    return () => {
      if (newMap) newMap.remove();
    };
  }, [imageBounds, regionZoomLimits]);

  return { map, mapLoaded, mapContainerRef };
};

export default useMap;