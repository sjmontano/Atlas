import { useEffect, useRef, useState } from "react";
import CuencaCaucaLow from "../../../assets/maps/cuenca-cauca-low.webp";
import CuencaCaucaMedium from "../../../assets/maps/cuenca-cauca-medium.webp";
import CuencaCaucaHigh from "../../../assets/maps/cuenca-cauca-high.webp";

const BaseMapImage = ({ map }) => {
  const opacityRef = useRef({
    low: 1,
    medium: 0,
    high: 0,
  });

  // Función de precarga de imágenes con manejo de errores
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = () => reject(new Error(`Error cargando: ${src}`));
    });

  const preloadImages = async () => {
    try {
      await Promise.all([
        loadImage(CuencaCaucaLow),
        loadImage(CuencaCaucaMedium),
        loadImage(CuencaCaucaHigh),
      ]);
      console.log("✅ Todas las imágenes precargadas");
    } catch (error) {
      console.error("⚠️ Error en precarga de imágenes:", error.message);
    }
  };

  useEffect(() => {
    if (!map) return;

    const imageSources = [
      { id: "lowQualityImage", url: CuencaCaucaLow, minzoom: 0, maxzoom: 7.01 },
      {
        id: "mediumQualityImage",
        url: CuencaCaucaMedium,
        minzoom: 7,
        maxzoom: 8.5,
      },
      { id: "highQualityImage", url: CuencaCaucaHigh, minzoom: 8.5, maxzoom: 22 },
    ];

    const imageBounds = [
      [-79.438011528289, 1.633123501103],
      [
        -79.438011528289 + 0.00195748206 * 3507,
        1.633123501103 + 0.001957242876 * 4960,
      ],
    ];

    // Función para calcular opacidades superpuestas de forma más fluida
    const calculateOverlappingOpacity = (zoom) => {
      const transitionRange = 0.5;
      return {
        low: Math.min(1, Math.max(0, (7.5 - zoom) / transitionRange)),
        medium: Math.min(
          1,
          Math.max(0, Math.min((zoom - 6.5) / transitionRange, (8.5 - zoom) / transitionRange))
        ),
        high: Math.min(1, Math.max(0, (zoom - 8.0) / transitionRange)),
      };
    };

    // Función para gestionar las capas con transiciones suaves
    const addLayers = async () => {
      await preloadImages();

      imageSources.forEach(({ id, url, minzoom, maxzoom }) => {
        if (!map.getSource(id)) {
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
              "raster-opacity": opacityRef.current[
                id.replace("QualityImage", "").toLowerCase()
              ],
              "raster-fade-duration": 1000, // Transición suave de opacidad
            },
          });
        }
      });
    };

    // Actualización de opacidades con superposición
    const updateOpacity = (zoom) => {
      const newOpacity = calculateOverlappingOpacity(zoom);

      opacityRef.current = newOpacity;

      map.setPaintProperty("lowQualityImage-layer", "raster-opacity", newOpacity.low);
      map.setPaintProperty("mediumQualityImage-layer", "raster-opacity", newOpacity.medium);
      map.setPaintProperty("highQualityImage-layer", "raster-opacity", newOpacity.high);

      console.log(`🔍 Zoom: ${zoom.toFixed(2)} | Opacidades: 
        Low: ${newOpacity.low.toFixed(2)}, 
        Medium: ${newOpacity.medium.toFixed(2)}, 
        High: ${newOpacity.high.toFixed(2)}`);
    };

    // Evento de zoom optimizado
    let lastZoom = null;
    const onZoom = () => {
      const currentZoom = map.getZoom();
      if (lastZoom !== currentZoom) {
        requestAnimationFrame(() => updateOpacity(currentZoom));
        lastZoom = currentZoom;
      }
    };

    addLayers().then(() => {
      map.on("zoom", onZoom);
      updateOpacity(map.getZoom());
    });

    return () => {
      map.off("zoom", onZoom);
      imageSources.forEach(({ id }) => {
        if (map.getSource(id)) {
          map.removeLayer(`${id}-layer`);
          map.removeSource(id);
        }
      });
    };
  }, [map]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        background: "rgba(0,0,0,0.7)",
        padding: "8px 12px",
        borderRadius: 4,
        color: "white",
        fontSize: 14,
      }}
    >
      🗺️ Calidad: {opacityRef.current.high > 0.5 ? "Alta" : opacityRef.current.medium > 0.5 ? "Media" : "Baja"}
    </div>
  );
};

export default BaseMapImage;
