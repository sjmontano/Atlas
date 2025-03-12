import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

const useMap = ({ imageBounds }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
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
      zoom: 6, // Zoom inicial
      bearing: -90,
      dragRotate: true, // Habilitar rotación con el mouse
      touchZoomRotate: true, // Habilitar zoom y rotación con gestos táctiles
    });

    newMap.on("load", () => {
      setMap(newMap);
      setMapLoaded(true);
      // Eliminar restricciones de los límites máximos del mapa
      // newMap.setMaxBounds(imageBounds); // Comentado para permitir desplazamiento sin restricciones
    });

    return () => {
      if (newMap) newMap.remove();
    };
  }, [imageBounds]);

  return { map, mapLoaded, mapContainerRef };
};

export default useMap;