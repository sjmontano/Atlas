export const getImageSize = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      console.log(`🖼️ Cargada: ${imageUrl} | 📏 ${img.naturalWidth}x${img.naturalHeight}`);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = (error) => {
      console.error(`❌ Error al cargar: ${imageUrl}`, error);
      reject(error);
    };
  });
};
