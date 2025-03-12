import proj4 from "proj4";
import imageSize from "image-size";
import pgwData from "@data/pgwData";

// 🔥 Configuración de proyecciones
const utm18n = "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs";
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

// 📌 Función para convertir UTM a Lat/Lon
export const convertToLatLon = ([, , , , e, f]) => proj4(utm18n, wgs84, [e, f]);

// 📌 Función para obtener el tamaño de la imagen "high" en el navegador
const getImageSize = (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath;
      
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = (err) => reject(`⚠️ Error cargando imagen: ${imagePath} → ${err}`);
    });
  };
  
  export default getImageSize;

// 📌 Función para generar la configuración de un mapa
export const generateMapConfig = (name, pgwKey, images) => {
  const pgwValues = pgwData[pgwKey];
  const [a, scaleX, scaleY, d, e, f] = pgwValues;

  // 📌 Si las coordenadas están en UTM, las convertimos
  const initialCoordinates = pgwKey === "atlasVerde" ? [e, f] : convertToLatLon(pgwValues);
  
  // 📌 Obtener tamaño de la imagen automáticamente
  const { width, height } = getImageSize(images.high);

  return {
    name,
    initialCoordinates,
    width,
    height,
    scaleX: scaleX,
    scaleY: scaleY,
    images,
  };
};
