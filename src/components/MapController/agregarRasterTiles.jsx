import { getChapterMaps } from "../../utils/geoUtils";


const agregarRasterTiles = async (map, rasterTiles) => {
  if (!map) return;

  
  


  const dataImg = await getChapterMaps(rasterTiles.map(({ name }) => ({ name })));

  rasterTiles.map(capa => {
    const capaData = dataImg.find(d => d.name === capa.name);
    if (!capaData?.imageBounds) return;

    const bounds = capaData.imageBounds;

    // Usar imageCoordinates (esquinas reales transformadas) si están disponibles,
    // para respetar rotación del PGW. Fallback a bounds axis-aligned.

    const coordinates = Array.isArray(capaData.imageCoordinates) && capaData.imageCoordinates.length === 4
      ? capaData.imageCoordinates
      : [
          [bounds[0][0], bounds[1][1]],
          [bounds[1][0], bounds[1][1]],
          [bounds[1][0], bounds[0][1]],
          [bounds[0][0], bounds[0][1]],
        ];

    if (capa.id && map.getLayer(capa.id)) {
      map.removeLayer(capa.id);
    }

    if (capa.sourceId && map.getSource(capa.sourceId)) {
      map.removeSource(capa.sourceId);
    }

    // Agregar fuente
    map.addSource(capa.sourceId, {
      type: "image",
      url: capa.url,
      coordinates,
    });

    // Agregar capa raster
    map.addLayer({
      id: capa.id,
      type: "raster",
      source: capa.sourceId,
      paint: {
        "raster-opacity": capa.opacity,
      },
    });

    map.setLayoutProperty(
        capa.id,
        "visibility","none"
      );

  });

  
};

export default agregarRasterTiles;
