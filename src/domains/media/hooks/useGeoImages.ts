/**
 * Hook para gestionar imágenes geográficas del Atlas
 * Integra con Cloudinary para optimización automática
 */

import { getOptimizedImageUrl } from "@lib/cloudinary/CloudinaryAdapter";
import { useMemo, useState } from "react";
import {
  GEO_IMAGES,
  IMAGE_MAP,
  IMAGE_SLUGS,
  getAllImages,
  getImageById,
  getImageBySlug,
  getOptimizedUrl,
} from "../data/geo-images";

export interface UseGeoImagesOptions {
  enableSearch?: boolean;
  defaultSize?: "thumbnail" | "small" | "medium" | "large" | "original";
}

export const useGeoImages = (options: UseGeoImagesOptions = {}) => {
  const { enableSearch = true, defaultSize = "medium" } = options;

  const loading = false;
  const [searchTerm, setSearchTerm] = useState("");

  // Imágenes filtradas por búsqueda
  const filteredImages = useMemo(() => {
    if (!searchTerm || !enableSearch) return GEO_IMAGES;

    const term = searchTerm.toLowerCase();
    return GEO_IMAGES.filter(
      (image) =>
        image.name.toLowerCase().includes(term) ||
        image.fileName.toLowerCase().includes(term) ||
        image.slug.toLowerCase().includes(term),
    );
  }, [searchTerm, enableSearch]);

  // Helper para convertir tamaños a opciones de Cloudinary
  const getSizeOptions = (size: string) => {
    const sizeMap: Record<string, { width: number; height: number }> = {
      thumbnail: { width: 150, height: 150 },
      small: { width: 400, height: 300 },
      medium: { width: 800, height: 600 },
      large: { width: 1200, height: 900 },
      original: { width: 1920, height: 1080 },
    };
    return sizeMap[size] || sizeMap.medium;
  };

  return {
    // Estado
    loading,
    searchTerm,
    setSearchTerm,

    // Datos
    images: filteredImages,

    // Getters
    getImageById,
    getImageBySlug,
    getAllImages,

    // URLs optimizadas
    getOptimizedUrl: (
      imageId: string,
      size:
        | "thumbnail"
        | "small"
        | "medium"
        | "large"
        | "original" = defaultSize,
    ) => getOptimizedUrl(imageId, getSizeOptions(size)),

    getCustomOptimizedUrl: (
      imageId: string,
      options: {
        width?: number;
        height?: number;
        quality?: "auto" | "low" | "medium" | "high" | number;
        format?: "auto" | "webp" | "jpg" | "png";
        crop?: "scale" | "fit" | "fill" | "crop" | "thumb";
      },
    ) => {
      const image = getImageById(imageId);
      return image
        ? getOptimizedImageUrl(image.cloudinary.secure_url, options)
        : "";
    },

    // Búsqueda
    searchImages: setSearchTerm,
    clearSearch: () => setSearchTerm(""),

    // Utilidades
    getTotalImageCount: () => GEO_IMAGES.length,
    hasImage: (id: string) => id in IMAGE_MAP,
    hasSlug: (slug: string) => slug in IMAGE_SLUGS,

    // Preloading (para optimización)
    preloadImage: (
      imageId: string,
      size: "thumbnail" | "small" | "medium" | "large" = "medium",
    ) => {
      const url = getOptimizedUrl(imageId, getSizeOptions(size));
      if (url) {
        const img = new Image();
        img.src = url;
      }
    },

    preloadImages: (
      imageIds: string[],
      size: "thumbnail" | "small" | "medium" | "large" = "medium",
    ) => {
      imageIds.forEach((id) => {
        const url = getOptimizedUrl(id, getSizeOptions(size));
        if (url) {
          const img = new Image();
          img.src = url;
        }
      });
    },
  };
};
