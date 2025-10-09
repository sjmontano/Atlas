import { useEffect , useState} from "react";
import useImageOpacity from "../../Hooks/useImageOpacity";
import {
  calculateMapCenter,
  calculateOverlappingOpacity,
} from "@utils/mapUtils";
import agregarNevados from "./agregarNevados";
import agregarEncuadres from "./agregarEncueadres";
import agregarRasterTiles from "./agregarRasterTiles";
import agregarCapas from "./agregarCapas";
 

const BaseMapImage = ({

  Nevados,
  Encuadres,
  Toponimos,
  RasterTiles,
  map,
  imageUrls = [],
  imageBounds = [],
  minzoom = 0,
  maxzoom = 15,
  setIsChapterOpen,
  onMapChange,
  mapLayers,
  selectedMap
}) => {
  const availableLayers = [];
  const { opacityRef } = useImageOpacity(minzoom, maxzoom, availableLayers);

  const [Modal, setModal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vector, setVector] = useState([])
  const [datos, setDatos] = useState({})
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const agregarModalInfo = () => {
    setIsModalOpen(false);
  };

  // ⚡ 2. Agregar fuentes/layers con dataImage (cuando esté lista)
  useEffect(() => {


    if (!map ) return;
     


    

  }, [map]);

  // ⚡ 3. Cargar otras capas y lógica de opacidad
  useEffect(() => {
    if (!map) return;

    agregarEncuadres(map, setIsChapterOpen, onMapChange, Encuadres);
    agregarNevados(map, Nevados);
    setModal(agregarCapas(map, setIsChapterOpen, mapLayers,selectedMap,setIsModalOpen,handleCloseModal)); 
    agregarRasterTiles(map,RasterTiles );

    const imageSources = [];

    if (imageUrls.base) {
      imageSources.push({
        id: "baseImage",
        url: imageUrls.base,
        minzoom: 0,
        maxzoom: 22,
        opacity: 0,
      });
      availableLayers.push("base");
    }

    if (imageUrls.low) {
      imageSources.push({
        id: "lowQualityImage",
        url: imageUrls.low,
        minzoom: 1,
        maxzoom: minzoom,
        opacity: 0,
      });
      availableLayers.push("low");
    }

    if (imageUrls.medium) {
      imageSources.push({
        id: "mediumQualityImage",
        url: imageUrls.medium,
        minzoom: minzoom - 0.2,
        maxzoom: minzoom + 1.5,
        opacity: 0,
      });
      availableLayers.push("medium");
    }

    if (imageUrls.high) {
      imageSources.push({
        id: "highQualityImage",
        url: imageUrls.high,
        minzoom: maxzoom - 2.5,
        maxzoom: 22,
        opacity: 0,
      });
      availableLayers.push("high");
    }

    const addLayers = async () => {
      const addedLayers = [];

      for (const { id, url, minzoom, maxzoom } of imageSources) {
        if (!map.getSource(id)) {
          try {
            map.addSource(id, {
              type: "image",
              url,
              coordinates: [
                [imageBounds[0][0], imageBounds[1][1]],
                [imageBounds[1][0], imageBounds[1][1]],
                [imageBounds[1][0], imageBounds[0][1]],
                [imageBounds[0][0], imageBounds[0][1]],
              ],
            });

            map.addLayer({
              id: `${id}-layer`,
              type: "raster",
              source: id,
              minzoom,
              maxzoom,
              paint: {
                "raster-opacity": 0,
                "raster-fade-duration": 1500,
              },
            });

            addedLayers.push(`${id}-layer`);
          } catch (error) {
            console.error(`🚨 Error al agregar la capa ${id}:`, error);
          }
        }
      }

      setTimeout(() => {
        updateOpacity(map.getZoom());
      }, 500);
    };

    const updateOpacity = (zoom) => {
      const newOpacity = calculateOverlappingOpacity(
        zoom,
        minzoom,
        maxzoom,
        availableLayers
      );
      opacityRef.current = newOpacity;

      [
        "baseImage-layer",
        "lowQualityImage-layer",
        "mediumQualityImage-layer",
        "highQualityImage-layer",
      ].forEach((layer) => {
        if (map.getLayer(layer)) {
          map.setPaintProperty(
            layer,
            "raster-opacity",
            newOpacity[layer.split("-")[0]]
          );
        }
      });
    };

    const centerOnZoomOut = (currentZoom) => {
      if (currentZoom <= minzoom + 0.3) {
        map.flyTo({
          center: calculateMapCenter(imageBounds),
          zoom: currentZoom,
          essential: true,
          speed: 0.3,
        });
      }
    };

    let lastZoom = null;
    const onZoom = () => {
      const currentZoom = map.getZoom();
      if (lastZoom !== currentZoom) {
        requestAnimationFrame(() => updateOpacity(currentZoom));
        lastZoom = currentZoom;
      }
    };

    addLayers().then(() => {
      setTimeout(() => {
        updateOpacity(map.getZoom());
        map.on("zoom", onZoom);
        map.on("zoomend", () => {
          centerOnZoomOut(map.getZoom());
        });
      }, 1000);
    });

    return () => {
      map.off("zoom", onZoom);
    };
  }, [map, imageUrls, imageBounds, minzoom, maxzoom]);

  return isModalOpen? Modal: null;
};

export default BaseMapImage;
