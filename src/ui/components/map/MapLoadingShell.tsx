/**
 * 🐚 MAP LOADING SHELL
 * ====================
 *
 * Overlay semi-transparente que cubre el contenedor del mapa mientras
 * este se inicializa. Se desvanece con una transición CSS cuando
 * `visible` pasa a false, permitiendo que el mapa quede expuesto
 * gradualmente en lugar de aparecer de golpe.
 *
 * Ciclo de vida:
 *   mounted → visible=true (opaco)
 *   → mapBuilt=true → visible=false → transición opacity 0
 *   → onTransitionEnd → unmount
 */

import React from "react";
import "./MapLoadingShell.css";

interface MapLoadingShellProps {
  /** Nombre del mapa para el texto de estado */
  mapName?: string;
  /** La imagen base ya se descargó — activa el fondo semi-transparente */
  lowResReady?: boolean;
  /** Cuando false inicia la transición de desvanecimiento final */
  visible: boolean;
  /** Callback cuando la transición de salida termina */
  onFadeComplete?: () => void;
}

export const MapLoadingShell: React.FC<MapLoadingShellProps> = ({
  mapName,
  lowResReady = false,
  visible,
  onFadeComplete,
}) => {
  const opacity = visible ? 1 : 0;

  const handleTransitionEnd = () => {
    if (!visible) {
      onFadeComplete?.();
    }
  };

  return (
    <div
      className={`map-loading-shell${lowResReady ? " map-loading-shell--low-res-ready" : ""
        }`}
      style={{ opacity }}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={!visible}
    >
      <div className="map-loading-shell__center">
        <div className="map-loading-shell__spinner" aria-hidden="true" />
        <p className="map-loading-shell__text">
          {mapName ? `Construyendo ${mapName}` : "Ensamblando mapa…"}
        </p>
      </div>
    </div>
  );
};

export default MapLoadingShell;
