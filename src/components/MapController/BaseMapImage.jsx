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
  imageCoordinates = [],
  maxBounds = 0,
  mirrorHorizontal = false,
  mirrorVertical = false,
  minzoom = 0,
  maxzoom = 15,
  setIsChapterOpen,
  onMapChange,
  mapLayers,
  selectedMap,
  mapName = "",
  debugMapOpacity = 0, // 🧪 0 = desactivado, 0.5 = semitransparente para verificacion visual
  useTransformConstrain = false, // 🔒 Si true, NO aplicar setMaxBounds (el constrain lo reemplaza)
  boundsPadding = null, // { top, bottom, left, right } — expansión por lado (0=solo imagen, >0=más espacio)
}) => {
  const availableLayers = [];
  const { opacityRef } = useImageOpacity(minzoom, maxzoom, availableLayers);

  const [Modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vector, setVector] = useState([]);
  const [datos, setDatos] = useState({});

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const agregarModalInfo = () => {
    setIsModalOpen(false);
  };

  // ⚡ EFECTO SIMPLE: solo aplicar setMaxBounds. El zoom lo controla mapConfig.js
  useEffect(() => {
    if (!map || !imageBounds || imageBounds.length !== 2) return;

    // Aplicar MaxBounds si estan activos. setTransformConstrain (si disponible)
    // refina el comportamiento bearing-aware; setMaxBounds queda como red de seguridad.
    if (maxBounds === 1) {
      const lngSpan = Math.abs(imageBounds[1][0] - imageBounds[0][0]);
      const latSpan = Math.abs(imageBounds[1][1] - imageBounds[0][1]);

      const pad = boundsPadding || {};
      const expandWest  = pad.left   ?? 0.0;
      const expandEast  = pad.right  ?? 0.0;
      const expandSouth = pad.bottom ?? 0.0;
      const expandNorth = pad.top    ?? 0.0;

      const west  = imageBounds[0][0] - lngSpan * expandWest;
      const east  = imageBounds[1][0] + lngSpan * expandEast;
      const south = imageBounds[0][1] - latSpan * expandSouth;
      const north = imageBounds[1][1] + latSpan * expandNorth;

      map.setMaxBounds([[west, south], [east, north]]);
    }
  }, [map, imageBounds, maxBounds, useTransformConstrain, boundsPadding]);

  // ⚡ 2. Agregar fuentes/layers con dataImage (cuando esté lista)
  useEffect(() => {
    if (!map) return;
  }, [map]);

  // ⚡ 3. Cargar otras capas y lógica de opacidad
  useEffect(() => {
    if (!map) return;

    agregarNevados(map, Nevados, mapName);
    agregarCapas(
      map,
      setIsChapterOpen,
      mapLayers,
      selectedMap,
      setIsModalOpen,
      handleCloseModal,
    );
    agregarRasterTiles(map, RasterTiles);

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

      const sourceCoordinatesBase =
        Array.isArray(imageCoordinates) && imageCoordinates.length === 4
          ? imageCoordinates
          : [
              [imageBounds[0][0], imageBounds[1][1]],
              [imageBounds[1][0], imageBounds[1][1]],
              [imageBounds[1][0], imageBounds[0][1]],
              [imageBounds[0][0], imageBounds[0][1]],
            ];

      let sourceCoordinates = sourceCoordinatesBase;

      if (mirrorHorizontal) {
        sourceCoordinates = [
          sourceCoordinates[1],
          sourceCoordinates[0],
          sourceCoordinates[3],
          sourceCoordinates[2],
        ];
      }

      if (mirrorVertical) {
        sourceCoordinates = [
          sourceCoordinates[3],
          sourceCoordinates[2],
          sourceCoordinates[1],
          sourceCoordinates[0],
        ];
      }

      for (const { id, url, minzoom, maxzoom } of imageSources) {
        if (!map.getSource(id)) {
          try {
            map.addSource(id, {
              type: "image",
              url,
              coordinates: sourceCoordinates,
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
      // 🧪 Modo debug: opacidad fija para verificacion visual de alineacion
      if (debugMapOpacity > 0) {
        const layers = [
          "baseImage-layer",
          "lowQualityImage-layer",
          "mediumQualityImage-layer",
          "highQualityImage-layer",
        ];
        // Aplica tambien a capas de tiles si existen
        const tileLayerIds = [];
        if (map.getStyle()) {
          const styleLayers = map.getStyle().layers || [];
          tileLayerIds.push(
            ...styleLayers
              .filter((l) => l.id && l.id.endsWith("-tiles-layer"))
              .map((l) => l.id),
          );
        }
        [...layers, ...tileLayerIds].forEach((layer) => {
          if (map.getLayer(layer)) {
            map.setPaintProperty(layer, "raster-opacity", debugMapOpacity);
          }
        });
        return;
      }

      const newOpacity = calculateOverlappingOpacity(
        zoom,
        minzoom,
        maxzoom,
        availableLayers,
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
            newOpacity[layer.split("-")[0]],
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
      }, 1000);
    });

    return () => {
      map.off("zoom", onZoom);
    };
  }, [
    map,
    imageUrls,
    imageBounds,
    imageCoordinates,
    minzoom,
    maxzoom,
    mirrorHorizontal,
    mirrorVertical,
    debugMapOpacity,
  ]);

  return isModalOpen ? Modal : null;
};

export default BaseMapImage;
