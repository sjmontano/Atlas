/**
 * Configuración de Cloudinary para Atlas
 * URLs optimizadas y transformaciones de imágenes
 */

export const CLOUDINARY_CONFIG = {
  cloud_name: "dvluvxfvn",
  api_key: "628137656897332",
  // No incluimos el API secret en el frontend por seguridad
  base_url: "https://res.cloudinary.com/dvluvxfvn/image/upload/",
} as const;

/**
 * Genera URL optimizada de Cloudinary con transformaciones
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "medium" | "high" | number;
    format?: "auto" | "webp" | "jpg" | "png";
    crop?: "scale" | "fit" | "fill" | "crop" | "thumb";
  } = {},
): string => {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "scale",
  } = options;

  // Extraer la parte después de /upload/
  const uploadIndex = imageUrl.indexOf("/upload/");
  if (uploadIndex === -1) return imageUrl;

  const baseUrl = imageUrl.substring(0, uploadIndex + 8);
  const imagePath = imageUrl.substring(uploadIndex + 8);

  // Construir transformaciones
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (crop && (width || height)) transformations.push(`c_${crop}`);

  const transformString =
    transformations.length > 0 ? transformations.join(",") + "/" : "";

  return `${baseUrl}${transformString}${imagePath}`;
};

/**
 * Presets comunes de transformación
 */
export const IMAGE_PRESETS = {
  thumbnail: {
    width: 150,
    height: 150,
    crop: "thumb" as const,
    quality: "auto" as const,
  },
  small: { width: 300, quality: "auto" as const },
  medium: { width: 600, quality: "auto" as const },
  large: { width: 1200, quality: "auto" as const },
  hero: {
    width: 1920,
    height: 1080,
    crop: "fill" as const,
    quality: "auto" as const,
  },
} as const;

/**
 * Genera múltiples URLs optimizadas para diferentes tamaños
 */
export const generateResponsiveUrls = (imageUrl: string) => ({
  thumbnail: getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.thumbnail),
  small: getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.small),
  medium: getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.medium),
  large: getOptimizedImageUrl(imageUrl, IMAGE_PRESETS.large),
  original: imageUrl,
});
