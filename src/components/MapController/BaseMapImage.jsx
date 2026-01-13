import {
  calculateMapCenter,
  calculateOverlappingOpacity,
} from "@utils/mapUtils";
import { useEffect, useState } from "react";
import useImageOpacity from "../../Hooks/useImageOpacity";
import agregarCapas from "./agregarCapas";
import agregarNevados from "./agregarNevados";
import agregarRasterTiles from "./agregarRasterTiles";
 

const BaseMapImage = ({

  Nevados,
  Encuadres,
  names,
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
  selectedMap,
  mapName=""
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

  // ⚡ NUEVO EFECTO: Ajustar minZoom dinámicamente basado en imageBounds para evitar conflictos
  useEffect(() => {
    if (!map || !imageBounds || imageBounds.length !== 2) return;

    const updateMinZoom = () => {
      try {
        const bounds = [
          [imageBounds[0][0], imageBounds[0][1]],
          [imageBounds[1][0], imageBounds[1][1]]
        ];

        // 1. Zoom Contain (Base)
        const camera = map.cameraForBounds(bounds, { padding: 0 });
        if (!camera || typeof camera.zoom !== 'number') return;

        const containZoom = camera.zoom;

        // 2. Calcular Zoom Cover (Llenar pantalla)
        // Comparamos las proporciones de la imagen vs la pantalla
        const mapCanvas = map.getCanvas();
        const screenRatio = mapCanvas.width / mapCanvas.height;

        // Proyectamos las esquinas para obtener dimensiones en pixeles (en el zoom actual)
        const p1 = map.project(bounds[0]);
        const p2 = map.project(bounds[1]);
        const imageWidth = Math.abs(p2.x - p1.x);
        const imageHeight = Math.abs(p2.y - p1.y);
        const imageRatio = imageWidth / imageHeight;

        // Calculamos cuánto zoom extra necesitamos para cubrir el eje que sobra
        let zoomDiff = 0;
        if (imageRatio > screenRatio) {
          // Imagen más ancha que pantalla (apaisada vs cuadrada/vertical)
          // Contain ajusta el ancho, dejando bandas arriba/abajo.
          // Para Cover, necesitamos ampliar hasta que el alto coincida.
          zoomDiff = Math.log2(imageRatio / screenRatio);
        } else {
          // Imagen más alta que pantalla (vertical vs apaisada)
          // Contain ajusta el alto, dejando bandas a los lados.
          // Para Cover, necesitamos ampliar hasta que el ancho coincida.
          zoomDiff = Math.log2(screenRatio / imageRatio);
        }

        // El zoom "Cover" exacto
        const coverZoom = containZoom + Math.max(0, zoomDiff);

        // 3. Configurar MinZoom
        // Usamos Cover para garantizar "que no se vean partes sin mapa"
        // Agregamos un margen mínimo (0.01) para evitar errores de redondeo
        const finalMinZoom = coverZoom;
        const userMinZoom = minzoom || 0;
        const realMinZoom = Math.max(userMinZoom, finalMinZoom);

        map.setMinZoom(realMinZoom);

        // 4. Configurar MaxBounds (con holgura)
        // Damos espacio extra (50%) para que el mapa no se sienta rígido en los bordes
        const lngSpan = Math.abs(imageBounds[1][0] - imageBounds[0][0]);
        const latSpan = Math.abs(imageBounds[1][1] - imageBounds[0][1]);
        const pad = 0.5;

        map.setMaxBounds([
            [imageBounds[0][0] - lngSpan * pad, imageBounds[0][1] - latSpan * pad],
            [imageBounds[1][0] + lngSpan * pad, imageBounds[1][1] + latSpan * pad]
        ]);

        // 5. Ajuste Inicial
        // Si el mapa está más lejos que el límite, lo acercamos y centramos.
        // Esto asegura que la primera vista sea el encuadre perfecto (Cover).
        if (map.getZoom() < realMinZoom - 0.1) {
            map.jumpTo({
              center: camera.center,
              zoom: realMinZoom
            });
        }
      } catch (error) {
        console.warn("Error ajustando bounds/zoom:", error);
      }
    };

    // Ejecutar al montar y cuando cambien las props relevantes
    updateMinZoom();

    // Recalcular si cambia el tamaño de la ventana (responsive)
    map.on('resize', updateMinZoom);

    return () => {
      map.off('resize', updateMinZoom);
    };
  }, [map, imageBounds, minzoom]);

  // ⚡ 2. Agregar fuentes/layers con dataImage (cuando esté lista)
  useEffect(() => {


    if (!map ) return;





  }, [map]);

  // ⚡ 3. Cargar otras capas y lógica de opacidad
  useEffect(() => {
    if (!map) return;

    agregarNevados(map, Nevados, mapName);
    agregarCapas(map, setIsChapterOpen, mapLayers,selectedMap,setIsModalOpen,handleCloseModal);
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
