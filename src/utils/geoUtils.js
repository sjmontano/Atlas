import { getImageSize } from "@utils/imageUtils";
import { generateImageBounds, generateImageCoordinates } from "@utils/mapUtils";
import geoMapping from "../data/mapImages/geoMapping";
import mapConfig from "../data/mapImages/mapConfig"; // Importar configuraciones de mapas
import pgwData from "../data/mapImages/pgwData";

let cachedMaps = {}; // Cache para evitar recálculos innecesarios

// 📌 Función para generar la configuración completa de un mapa
export const generateMapConfig = async ({
  name,
  shadow = true,
  regionZoomLimits = { min: 6, max: 10, interpolationSpeed: 0.6 },
  backLink = "/",
}) => {
  try {
    const pgwValues = pgwData[name];
    const geoValues = geoMapping[name];
    const config = mapConfig[name] || {}; // Obtener configuración específica del mapa

    if (!pgwValues) {
      console.warn(`⚠️ No existen datos de PGW para el mapa "${name}".`);
      return null;
    }

    if (!geoValues) {
      console.warn(
        `⚠️ No existen imágenes en geoMapping para el mapa "${name}".`,
      );
      return null;
    }

    // Orden PGW esperado: [a, d, b, e, c, f]
    const [a, d, b, e, lon, lat] = pgwValues;
    // Campos legacy conservados para evitar romper consumidores actuales.
    const scaleX = b;
    const scaleY = d;
    const images = { ...geoValues }; // Copia de imágenes

    // Obtener tamaño de imagen
    let width = 1,
      height = 1; // Valores por defecto
    try {
      const size = await getImageSize(images.high);
      if (size?.width > 0 && size?.height > 0) {
        width = size.width;
        height = size.height;
      } else {
        console.warn(
          `⚠️ Imagen "${name}" tiene dimensiones inválidas. Usando valores por defecto.`,
        );
      }
    } catch (error) {
      console.error(
        `❌ Error al obtener tamaño de la imagen para "${name}":`,
        error,
      );
    }

    // Cálculo automático de imageBounds con validación
    const imageBounds = generateImageBounds({
      pgwData: pgwValues,
      initialCoordinates: [lon, lat],
      width,
      height,
      scaleX,
      scaleY,
    });

    const imageCoordinates = generateImageCoordinates({
      pgwData: pgwValues,
      width,
      height,
    });

    // El PGW puede codificar rotacion (A≈0, E≈0, B≠0, D≠0) para mapas
    // cuyo GeoTIFF original estaba en portrait. La transformacion afin de
    // boundsCalculator.js posiciona correctamente las esquinas geograficas
    // sin importar que parametros llevan la escala. El bearing se controla
    // desde mapConfig.js — NO se sobreescribe aqui.
    const normalizedConfig = { ...config };

    // Global interaction policy: pan + zoom for all maps.
    // maxBounds: respeta el valor de mapConfig.js si esta definido; default 1.
    // mirrorHorizontal/Vertical: false por defecto. Configurar en mapConfig.js si se necesita.
    const interactionOverrides = {
      dragPan: true,
      scrollZoom: true,
    };

    // Some legacy maps were locked with minZoom === maxZoom.
    // Keep existing limits when valid, otherwise open a minimum zoom window.
    const resolvedMinZoom = Number.isFinite(normalizedConfig.minZoom)
      ? normalizedConfig.minZoom
      : undefined;
    const resolvedMaxZoom = Number.isFinite(normalizedConfig.maxZoom)
      ? normalizedConfig.maxZoom
      : undefined;

    const zoomOverrides =
      Number.isFinite(resolvedMinZoom) && Number.isFinite(resolvedMaxZoom)
        ? resolvedMaxZoom <= resolvedMinZoom
          ? { maxZoom: resolvedMinZoom + 2 }
          : {}
        : {};

    //console.log(`🌍 Mapa generado: ${name} | 🖼️ ${width}x${height} | 📍 imageBounds:`, imageBounds);

    return {
      name,
      initialCoordinates: [lon, lat],
      width,
      height,
      pgwData: pgwValues,
      scaleX,
      scaleY,
      imageBounds,
      imageCoordinates,
      images,
      regionZoomLimits,
      shadow,
      backLink,
      ...normalizedConfig, // Agregar configuraciones específicas del mapa
      ...interactionOverrides,
      ...zoomOverrides,
      // maxBounds: respeta el valor de mapConfig (0=desactivado); si no existe, default 1
      maxBounds: normalizedConfig.maxBounds ?? 1,
    };
  } catch (error) {
    console.error(
      `❌ Error al generar la configuración del mapa "${name}":`,
      error,
    );
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
