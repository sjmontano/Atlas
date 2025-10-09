import { getChapterMaps } from "../../utils/geoUtils";


const agregarRasterTiles = async (map, rasterTiles) => {
  if (!map) return;

  
  


  const dataImg = await getChapterMaps(rasterTiles.map(({ name }) => ({ name })));

  rasterTiles.map(capa => {
    const capaData = dataImg.find(d => d.name === capa.name);
    if (!capaData?.imageBounds) return;

    const bounds = capaData.imageBounds;

    // Eliminar capa y fuente si existen

    console.log(capa)
    console.log(map)
    
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
      coordinates: [
        [bounds[0][0], bounds[1][1]],
        [bounds[1][0] , bounds[1][1]],
        [bounds[1][0], bounds[0][1]],
        [bounds[0][0], bounds[0][1]],
      ],
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
