import pgwDataUnRioCauca from "../../data/Unriocaucaconfig/pgwDataUnRioCauca";
import capImages from "../../data/Unriocaucaconfig/capImages";

const agregarImagenCapas = (map) => {
  const imageUrls = [
    capImages.aguasSuperficiales.base,
    capImages.areasMetropolitanas.base,
    capImages.cuencaRioCauca.base,
    capImages.paramosNivalesVolcanes.base,
    capImages.parteaguasEstrellasFluviales.base,
  ];

  const pgwData = [
    pgwDataUnRioCauca.aguasSuperficiales,
    pgwDataUnRioCauca.areasMetropolitanas,
    pgwDataUnRioCauca.cuencaRioCauca,
    pgwDataUnRioCauca.paramosNivalesVolcanes,
    pgwDataUnRioCauca.parteaguasEstrellasFluviales,
  ];

  imageUrls.forEach((url, idx) => {
    const [a, b, c, d, e, f] = pgwData[idx];

    // Precargar la imagen para obtener sus dimensiones
    const img = new Image();

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Calcular las coordenadas del bounding box
      const topLeft = mercatorToLatLon(c, f);
      const topRight = mercatorToLatLon(c + width * a, f + width * b);
      const bottomRight = mercatorToLatLon(
        c + width * a + height * d,
        f + width * b + height * e
      );
      const bottomLeft = mercatorToLatLon(c + height * d, f + height * e);

      const sourceId = `Laimgen-source-${idx}`;
      const layerId = `Laimg-layer-${idx}`;

      // Verificar si la fuente ya existe
      if (!map.getSource(sourceId)) {
        console.log(`Agregando fuente: ${sourceId}`);
        map.addSource(sourceId, {
          type: "image",
          url: url,
          coordinates: [topLeft, topRight, bottomRight, bottomLeft],
        });

        // Verificar si la capa ya existe
        if (!map.getLayer(layerId)) {
          console.log(`Agregando capa: ${layerId}`);
          const validMinZoom = Math.max(0, -0.2); // Asegúrate de que 
          
          const beforeId = map.getLayer("map-base-layer") ? "map-base-layer" : undefined;

          // minzoom sea al menos 0
          map.addLayer(
            {
              id: layerId,
              type: "raster",
              source: sourceId,
              minzoom: validMinZoom, // Validar minzoom
              maxzoom: 15, // Asegúrate de que maxzoom sea válido
            },
            beforeId // Reemplaza con el ID de la capa base del mapa
          );
          map.moveLayer(layerId);
        }
      } else {
        console.warn(
          `⚠️ La fuente "${sourceId}" ya existe. No se agregó nuevamente.`
        );
      }

    };

    img.src = url;
  });
};

function mercatorToLatLon(x, y) {
  const lon = (x / 20037508.34) * 180;
  const lat = (y / 20037508.34) * 180;
  const rad = (Math.PI / 180) * lat;
  return [lon, (180 / Math.PI) * (2 * Math.atan(Math.exp(rad)) - Math.PI / 2)];
}

export default agregarImagenCapas;
