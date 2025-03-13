import { useEffect } from "react";
import useImageOpacity from "@hooks/useImageOpacity";
import { calculateMapCenter } from "@utils/mapUtils";
import MapLayers from "./MapLayers";
import mapLayers from "../../data/mapLayers";

const BaseMapImage = ({ map, imageUrls, imageBounds, minzoom, maxzoom }) => {
  const { opacityRef, calculateOverlappingOpacity } = useImageOpacity(
    minzoom,
    maxzoom
  );

  useEffect(() => {
    if (!map) return;

    console.log("🟢 BaseMapImage cargado. Agregando capas de inmediato...");

    const imageSources = [
      { id: "baseImage", url: imageUrls.base, minzoom: 0, maxzoom: 22 },
      {
        id: "lowQualityImage",
        url: imageUrls.low,
        minzoom: 0,
        maxzoom: minzoom,
      },
      {
        id: "mediumQualityImage",
        url: imageUrls.medium,
        minzoom: minzoom - 0.2,
        maxzoom: minzoom + 1.5,
      },
      {
        id: "highQualityImage",
        url: imageUrls.high,
        minzoom: maxzoom - 2,
        maxzoom: 22,
      },
    ];

    const addLayers = async () => {
      console.log("➕ Agregando capas al mapa...");

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

            console.log(`✅ Capa agregada correctamente: ${id}`);
            addedLayers.push(`${id}-layer`);
          } catch (error) {
            console.error(`🚨 Error al agregar la capa ${id}:`, error);
          }
        } else {
          console.warn(`⚠️ La fuente ${id} ya existe en el mapa.`);
        }
      }

      console.log(
        `✅ Todas las capas agregadas correctamente: ${addedLayers.join(", ")}`
      );

      setTimeout(() => {
        updateOpacity(map.getZoom());
      }, 500);
    };

    const updateOpacity = (zoom) => {
      console.log("🔄 Intentando actualizar opacidades...");

      const newOpacity = calculateOverlappingOpacity(zoom);
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
          console.log(
            `🛠️ Opacidad actualizada en ${layer}: ${
              newOpacity[layer.split("-")[0]]
            }`
          );
        } else {
          console.warn(`⚠️ No se encontró la capa ${layer} en el mapa.`);
        }
      });

      console.log(`🔍 Zoom: ${zoom.toFixed(2)} | Opacidades: 
        Base: ${newOpacity.base.toFixed(2)}, 
        Low: ${newOpacity.low.toFixed(2)}, 
        Medium: ${newOpacity.medium.toFixed(2)}, 
        High: ${newOpacity.high.toFixed(2)}`);
    };

    const centerOnZoomOut = (currentZoom) => {
      if (currentZoom <= minzoom + 0.3) {
        map.flyTo({
          center: calculateMapCenter(imageBounds),
          zoom: currentZoom,
          essential: true,
          speed: 0.3, // Suavidad adicional
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
        console.log("📌 Verificando si las capas están disponibles...");
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

  return null;
};

export default BaseMapImage;
