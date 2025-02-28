import { useEffect, useRef, useState } from "react";
import CuencaCaucaBase from "../../../assets/maps/cuenca-cauca-base.webp";
import CuencaCaucaLow from "../../../assets/maps/cuenca-cauca-low.webp";
import CuencaCaucaMedium from "../../../assets/maps/cuenca-cauca-medium.webp";
import CuencaCaucaHigh from "../../../assets/maps/cuenca-cauca-high.webp";

const BaseMapImage = ({ map }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [layersAdded, setLayersAdded] = useState(false);
  const [useOfflineBase, setUseOfflineBase] = useState(false);

  const opacityRef = useRef({
    base: 0,
    low: 1,
    medium: 0,
    high: 0,
  });

  useEffect(() => {
    if (!map) return;

    console.log("🟢 BaseMapImage cargado. Iniciando precarga de imágenes...");

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          console.log(`✅ Imagen precargada: ${src}`);
          resolve(src);
        };
        img.onerror = (err) => {
          console.warn(`⚠️ Error al cargar imagen: ${src}`, err);
          reject(err);
        };
      });
    };

    const preloadAllImages = async () => {
      try {
        console.log("🔄 Precargando imágenes de mejor calidad...");
        await Promise.all([
          preloadImage(CuencaCaucaMedium),
          preloadImage(CuencaCaucaHigh),
        ]);
        setImagesLoaded(true);
        console.log("✅ Todas las imágenes fueron precargadas con éxito.");
      } catch (error) {
        console.warn("⚠️ Error en la precarga de imágenes.");
      }
    };

    const checkInternetConnection = async () => {
      try {
        console.log("🔍 Verificando conexión a Internet...");
        const response = await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        if (!response.ok) throw new Error("Sin conexión");
        setUseOfflineBase(false);
        console.log("✅ Conexión establecida. Usando mapas en línea.");
      } catch (error) {
        setUseOfflineBase(true);
        console.warn("⚠️ Sin conexión. Activando imagen base local.");
      }
    };

    const imageSources = [
      ...(useOfflineBase
        ? [{ id: "baseImage", url: CuencaCaucaBase, minzoom: 0, maxzoom: 22 }]
        : []),
      { id: "lowQualityImage", url: CuencaCaucaLow, minzoom: 0, maxzoom: 7.5 },
      { id: "mediumQualityImage", url: CuencaCaucaMedium, minzoom: 7.0, maxzoom: 8.5 },
      { id: "highQualityImage", url: CuencaCaucaHigh, minzoom: 8.5, maxzoom: 22 },
    ];

    const imageBounds = [
      [-79.438011528289, 1.633123501103],
      [-79.438011528289 + 0.00195748206 * 3507, 1.633123501103 + 0.001957242876 * 4960],
    ];

    const calculateOverlappingOpacity = (zoom) => {
      const transitionRange = 1.0;

      const smoothStep = (start, end, value) => {
        const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
        return Math.pow(x, 2) * (3 - 2 * x);
      };

      return {
        base: useOfflineBase ? 1 : 0,
        low: zoom <= 7.0 ? 1 : 1 - smoothStep(7.0, 7.5, zoom),
        medium: smoothStep(7.0, 7.5, zoom) * (zoom <= 8.5 ? 1 : 0),
        high: smoothStep(8.0, 8.5, zoom),
      };
    };

    const addLayers = async () => {
      if (!imagesLoaded) return;

      console.log("➕ Agregando capas al mapa...");

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
              "raster-opacity": opacityRef.current[id.replace("QualityImage", "").toLowerCase()] ?? 1,
              "raster-fade-duration": 1500,
            },
          });

          console.log(`✅ Capa agregada: ${id}`);
        }
      });

      setLayersAdded(true);
    };

    const updateOpacity = (zoom) => {
      if (!layersAdded) {
        console.warn("⚠️ No se pueden modificar opacidades porque las capas aún no han sido agregadas.");
        return;
      }

      const newOpacity = calculateOverlappingOpacity(zoom);
      opacityRef.current = newOpacity;

      ["baseImage-layer", "lowQualityImage-layer", "mediumQualityImage-layer", "highQualityImage-layer"]
        .forEach((layer) => {
          if (map.getLayer(layer)) {
            map.setPaintProperty(layer, "raster-opacity", newOpacity[layer.split("-")[0]]);
          }
        });

      console.log(
        `🔍 Zoom: ${zoom.toFixed(2)} | Opacidades: ` +
          `Base: ${newOpacity.base.toFixed(2)}, ` +
          `Low: ${newOpacity.low.toFixed(2)}, ` +
          `Medium: ${newOpacity.medium.toFixed(2)}, ` +
          `High: ${newOpacity.high.toFixed(2)}`
      );
    };

    let lastZoom = null;
    const onZoom = () => {
      const currentZoom = map.getZoom();
      if (lastZoom !== currentZoom) {
        requestAnimationFrame(() => updateOpacity(currentZoom));
        lastZoom = currentZoom;
      }
    };

    preloadAllImages().then(() => {
      checkInternetConnection().then(() => {
        addLayers().then(() => {
          map.on("zoom", onZoom);
          updateOpacity(map.getZoom());
        });
      });
    });

    return () => {
      map.off("zoom", onZoom);
      imageSources.forEach(({ id }) => {
        if (map.getLayer(`${id}-layer`)) {
          map.removeLayer(`${id}-layer`);
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      });
    };
  }, [map, useOfflineBase, imagesLoaded, layersAdded]);

  return null;
};

export default BaseMapImage;
