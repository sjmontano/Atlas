/**
 * 💀 MAP SKELETON
 * ===============
 *
 * Pantalla de espera animada para el Suspense de carga inicial.
 * Reemplaza el texto "Cargando..." con una experiencia más pulida
 * que ya muestra el frame oscuro del mapa antes de que el bundle
 * JavaScript se haya evaluado.
 */

import React from "react";
import "./MapSkeleton.css";

export interface MapSkeletonProps {
  /** Texto descriptivo mostrado debajo del spinner */
  label?: string;
  /** Clases CSS adicionales */
  className?: string;
}

export const MapSkeleton: React.FC<MapSkeletonProps> = ({
  label = "Iniciando Atlas…",
  className,
}) => {
  return (
    <div className={`map-skeleton${className ? ` ${className}` : ""}`}>
      <div className="map-skeleton__shimmer" aria-hidden="true" />
      <div className="map-skeleton__content">
        <div className="map-skeleton__spinner" aria-hidden="true" />
        <span className="map-skeleton__label">{label}</span>
      </div>
    </div>
  );
};

export default MapSkeleton;
