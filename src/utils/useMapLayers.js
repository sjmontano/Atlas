import { useEffect } from "react";

const useMapLayers = (map, imageSources, imageBounds) => {
  useEffect(() => {
    if (!map || !imageBounds || imageBounds.length !== 4) {
      console.warn("⚠️ useMapLayers: `imageBounds` no tiene el formato correcto.");
      return;
    }

    console.log("🟢 useMapLayers: Verificando capas...");

    const addOrUpdateLayers = () => {
      imageSources.forEach(({ id, url, minzoom, maxzoom }) => {
        if (!map.getSource(id)) {
          try {
            map.addSource(id, { 
              type: "image", 
              url, 
              coordinates: imageBounds 
            });

            map.on("sourcedata", (e) => {
              if (e.sourceId === id && map.getSource(id)) {
                map.addLayer({
                  id: `${id}-layer`,
                  type: "raster",
                  source: id,
                  minzoom,
                  maxzoom,
                  paint: { "raster-opacity": 0, "raster-fade-duration": 1500 },
                });
                console.log(`✅ Capa agregada: ${id}`);
              }
            });
          } catch (error) {
            console.error(`🚨 Error al agregar la capa ${id}:`, error);
          }
        } else {
          // Si la fuente ya existe, solo actualizamos coordenadas
          try {
            const source = map.getSource(id);
            if (source && source.setCoordinates) {
              source.setCoordinates(imageBounds);
              console.log(`🔄 Coordenadas actualizadas para: ${id}`);
            }
          } catch (error) {
            console.error(`🚨 Error actualizando coordenadas de ${id}:`, error);
          }
        }
      });
    };

    addOrUpdateLayers();
  }, [map, imageSources, imageBounds]); // Se ejecuta solo cuando `imageBounds` cambia
};

export default useMapLayers;
