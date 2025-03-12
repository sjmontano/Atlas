import pgwData from "../data/pgwData";
import geoMapping from "../data/geoMapping";
import calculateCoordinates from "./calculateCoordinates";

// Función para obtener el tamaño de una imagen
export const getImageSize = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      console.log(`🖼️ Imagen cargada: ${imageUrl} | 📏 Dimensiones: ${img.naturalWidth}x${img.naturalHeight}`);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = (error) => {
      console.error(`❌ Error al cargar la imagen: ${imageUrl}`, error);
      reject(error);
    };
  });
};

// Función para generar la configuración completa de un mapa
export const generateMapConfig = async ({ name, shadow = true, regionZoomLimits = { min: 6, max: 10, interpolationSpeed: 0.6 } }) => {
  const pgwValues = pgwData[name];
  const geoValues = geoMapping[name];

  if (!pgwValues || !geoValues) {
    console.error(`❌ Error: No existen datos de PGW o imágenes para "${name}"`);
    return null;
  }

  // Extraer valores del array de PGW
  const [a, scaleX, scaleY, d, lon, lat] = pgwValues;
  const images = { ...geoValues }; // Separar imágenes

  let width = 1, height = 1; // Valores por defecto
  try {
    const size = await getImageSize(images.high);
    if (size.width > 0 && size.height > 0) {
      width = size.width;
      height = size.height;
    } else {
      console.warn(`⚠️ Imagen "${name}" tiene dimensiones inválidas. Usando valores por defecto.`);
    }
  } catch (error) {
    console.error(`❌ Error al obtener tamaño de la imagen para "${name}":`, error);
  }

  const imageBounds = [
    [lon, lat],
    calculateCoordinates({ initialCoordinates: [lon, lat], width, height, scaleX, scaleY })
  ];

  console.log(`🌍 Mapa generado: ${name} | 🖼️ ${width}x${height} | 📍 imageBounds:`, imageBounds);

  return {
    name,
    initialCoordinates: [lon, lat],
    width,
    height,
    scaleX,
    scaleY,
    imageBounds,
    images,
    regionZoomLimits,
    shadow,
  };
};


export const getChapterMaps = async (mapConfigs) => {
  const maps = await Promise.all(mapConfigs.map(generateMapConfig)); // Esperar que se generen todos los mapas
  return maps.filter((map) => map !== null); // Filtrar mapas nulos
};
