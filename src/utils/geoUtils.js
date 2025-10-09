import pgwData from "../data/mapImages/pgwData";
import geoMapping from "../data/mapImages/geoMapping";
import { generateImageBounds } from "@utils/mapUtils";
import { getImageSize } from "@utils/imageUtils";
import mapConfig from "../data/mapImages/mapConfig"; // Importar configuraciones de mapas

let cachedMaps = {}; // Cache para evitar recálculos innecesarios

// 📌 Función para generar la configuración completa de un mapa
export const generateMapConfig = async ({ name, shadow = true, regionZoomLimits = { min: 6, max: 10, interpolationSpeed: 0.6 } , backLink="/"}) => {
  try {
    const pgwValues = pgwData[name];
    const geoValues = geoMapping[name];
    const config = mapConfig[name] || {}; // Obtener configuración específica del mapa

    if (!pgwValues) {
      console.warn(`⚠️ No existen datos de PGW para el mapa "${name}".`);
      return null;
    }
    
    if (!geoValues) {
      console.warn(`⚠️ No existen imágenes en geoMapping para el mapa "${name}".`);
      return null;
    }

    // Extraer valores del array de PGW
    const [a, scaleX, scaleY, d, lon, lat] = pgwValues;
    const images = { ...geoValues }; // Copia de imágenes

    // Obtener tamaño de imagen
    let width = 1, height = 1; // Valores por defecto
    try {
      const size = await getImageSize(images.high);
      if (size?.width > 0 && size?.height > 0) {
        width = size.width;
        height = size.height;
      } else {
        console.warn(`⚠️ Imagen "${name}" tiene dimensiones inválidas. Usando valores por defecto.`);
      }
    } catch (error) {
      console.error(`❌ Error al obtener tamaño de la imagen para "${name}":`, error);
    }

    // Cálculo automático de imageBounds con validación
    const imageBounds = generateImageBounds({
      initialCoordinates: [lon, lat],
      width,
      height,
      scaleX,
      scaleY,
    });

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
      backLink,
      ...config, // Agregar configuraciones específicas del mapa
    };
  } catch (error) {
    console.error(`❌ Error al generar la configuración del mapa "${name}":`, error);
    return null;
  }
};

// 📌 Función para obtener la configuración de los mapas de un capítulo
export const getChapterMaps = async (mapConfigs) => {
  try {
    const cacheKey = JSON.stringify(mapConfigs);
    
    if (cachedMaps[cacheKey]) {
      console.log("♻️ Usando mapas en caché...");
      return cachedMaps[cacheKey]; // Retorna mapas ya generados
    }

    console.log("🛠 Generando nuevos mapas...");
    const maps = await Promise.all(mapConfigs.map(generateMapConfig));
    const validMaps = maps.filter((map) => map !== null); // Filtrar mapas inválidos

    if (validMaps.length === 0) {
      console.warn("⚠️ No se generaron mapas válidos.");
    }

    cachedMaps[cacheKey] = validMaps; // Guardar en caché
    return validMaps;
  } catch (error) {
    console.error("❌ Error al obtener los mapas del capítulo:", error);
    return []; //  Retornar un array vacío en caso de error
  }
};