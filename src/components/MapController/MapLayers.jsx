import { useEffect } from "react";
import PropTypes from "prop-types";

const MapLayers = ({ map, layers }) => {
  useEffect(() => {
    if (!map) return;

    console.log("🗺️ MapLayers cargado. Agregando capas...");
 
    const agregarCapa = (url, nombre, idCapa, color) => {
      if (map.getSource(idCapa)) {
        console.warn(`⚠️ La capa ${idCapa} ya existe en el mapa.`);
        return;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(`✅ Datos recibidos para ${idCapa}:`, data);

          if (!data.geoCollection) {
            console.error(`🚨 No se encontró geoCollection en la respuesta de ${idCapa}`);
            return;
          }

          map.addSource(idCapa, {
            type: "geojson",
            data: data.geoCollection,
          });

          const isRiver = idCapa.startsWith("rio");

          map.addLayer({
            id: idCapa,
            type: isRiver ? "line" : "fill",
            source: idCapa,
            paint: isRiver
              ? {
                  "line-color": color,
                  "line-width": 2,
                }
              : {
                  "fill-color": color,
                  "fill-opacity": 0.5,
                },
            layout: {
              visibility: "visible",
            },
          });

          console.log(`✅ Capa ${idCapa} agregada al mapa.`);
        })
        .catch((error) => console.error(`🚨 Error al cargar ${idCapa}:`, error));
    };

    // ✅ Esperar a que el mapa termine de cargar
    map.once("load", () => {
      layers.forEach((layer) => agregarCapa(layer.url, layer.name, layer.id, layer.color));
    });

    return () => {
      // ✅ Eliminar capas cuando el componente se desmonte
      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      });
      console.log("🗑️ Capas eliminadas.");
    };
  }, [map, layers]);

  return null;
};

MapLayers.propTypes = {
  map: PropTypes.object,
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MapLayers;
