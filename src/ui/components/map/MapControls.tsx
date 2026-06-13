import maplibregl from "maplibre-gl";
import React, { useEffect, useState } from "react";
import { getMapTheme } from "../../themes/mapThemes";

/**
 * 🎮 MAP CONTROLS
 * ===============
 *
 * Controles personalizados para mapas del Atlas.
 * Usa sistema de temas compartido centralizado.
 */

export interface MapControlsProps {
  /** Instancia del mapa MapLibre */
  map: maplibregl.Map;
  /** Posición de los controles */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Mostrar control de zoom */
  showZoom?: boolean;
  /** Mostrar control de reset */
  showReset?: boolean;
  /** Mostrar control de rotación */
  showRotation?: boolean;
  /** Mostrar control de fullscreen */
  showFullscreen?: boolean;
  /** Configuración inicial para reset */
  initialView?: {
    center: [number, number];
    zoom: number;
    bearing: number;
  };
  /** Clases CSS adicionales */
  className?: string;
  /** Tema de colores */
  theme?: "light" | "dark" | "atlas";
}

const MapControls: React.FC<MapControlsProps> = ({
  map,
  position = "top-right",
  showZoom = true,
  showReset = true,
  showRotation = true,
  showFullscreen = false,
  initialView,
  className = "",
  theme = "atlas",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  // Listener para actualizar el zoom en tiempo real
  useEffect(() => {
    const updateZoom = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on("zoom", updateZoom);

    return () => {
      map.off("zoom", updateZoom);
    };
  }, [map]);

  // **HANDLERS DE CONTROLES**
  const handleZoomIn = () => {
    map.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    map.zoomOut({ duration: 300 });
  };

  const handleReset = () => {
    if (initialView) {
      map.flyTo({
        center: initialView.center,
        zoom: initialView.zoom,
        bearing: initialView.bearing,
        duration: 800,
      });
    } else {
      map.resetNorth({ duration: 300 });
    }
  };

  const handleRotateLeft = () => {
    const currentBearing = map.getBearing();
    map.easeTo({ bearing: currentBearing - 15, duration: 300 });
  };

  const handleRotateRight = () => {
    const currentBearing = map.getBearing();
    map.easeTo({ bearing: currentBearing + 15, duration: 300 });
  };

  const handleFullscreen = () => {
    const container = map.getContainer();
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // 🎨 Obtener tema centralizado
  const currentTheme = getMapTheme(theme);

  // **ESTILOS DE POSICIÓN**
  const positions = {
    "top-left": { top: "20px", left: "20px" },
    "top-right": { top: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "bottom-right": { bottom: "20px", right: "20px" },
  };

  const controlStyle: React.CSSProperties = {
    position: "absolute",
    ...positions[position],
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    zIndex: 1000,
  };

  const buttonGroupStyle: React.CSSProperties = {
    background: currentTheme.background,
    borderRadius: currentTheme.borderRadius || "8px",
    border: currentTheme.border,
    boxShadow: currentTheme.boxShadow,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  };

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: currentTheme.color,
    padding: "12px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    width: "40px",
    height: "40px",
    borderBottom: `1px solid ${currentTheme.border}`,
  };

  const lastButtonStyle = {
    ...buttonStyle,
    borderBottom: "none",
  };

  return (
    <div className={`atlas-map-controls ${className}`} style={controlStyle}>
      {/* ZOOM LEVEL DISPLAY */}
      <div
        style={{
          ...buttonGroupStyle,
          padding: "8px 12px",
          fontSize: "12px",
          fontWeight: "600",
          textAlign: "center",
          minWidth: "60px",
          userSelect: "none",
          color: "#000",
        }}
        title="Nivel de zoom actual"
      >
        🔍 {currentZoom.toFixed(1)}
      </div>

      {/* ZOOM CONTROLS */}
      {showZoom && (
        <div style={buttonGroupStyle}>
          <button
            onClick={handleZoomIn}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.hoverBackground || "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Acercar (Zoom +)"
            aria-label="Zoom in"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            style={lastButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.hoverBackground || "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Alejar (Zoom -)"
            aria-label="Zoom out"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M2 8h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ROTATION CONTROLS */}
      {showRotation && (
        <div style={buttonGroupStyle}>
          <button
            onClick={handleRotateLeft}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.hoverBackground || "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Rotar izquierda"
            aria-label="Rotate left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 2a6 6 0 1 0 5.292 3h-2.121A4 4 0 1 1 8 4V2z"
                fill="currentColor"
              />
              <path d="M8 0L5 3l3 3V0z" fill="currentColor" />
            </svg>
          </button>
          <button
            onClick={handleRotateRight}
            style={lastButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.hoverBackground || "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Rotar derecha"
            aria-label="Rotate right"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 2a6 6 0 1 1-5.292 3h2.121A4 4 0 1 0 8 4V2z"
                fill="currentColor"
              />
              <path d="M8 0l3 3-3 3V0z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}

      {/* RESET CONTROL */}
      {showReset && (
        <div style={buttonGroupStyle}>
          <button
            onClick={handleReset}
            style={lastButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.hoverBackground || "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title="Restaurar vista inicial"
            aria-label="Reset view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M8 2a6 6 0 0 0-6 6h2a4 4 0 1 1 1.172 2.828l1.414 1.414A6 6 0 1 0 8 2z"
                fill="currentColor"
              />
              <path d="M0 8l3-3v6L0 8z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}

      {/* FULLSCREEN CONTROL */}
      {showFullscreen && (
        <div style={buttonGroupStyle}>
          <button
            onClick={handleFullscreen}
            style={lastButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                currentTheme.hoverBackground || "rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title={
              isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
            }
            aria-label="Toggle fullscreen"
          >
            {!isFullscreen ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M1 1v5h2V3h3V1H1zm9 0v2h3v3h2V1h-5zM3 11H1v5h5v-2H3v-3zm11 0v3h-3v2h5v-5h-2z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M3 3v3H1v2h5V3H3zm8 0v5h5V6h-3V3h-2zM1 11v2h3v3h2v-5H1zm10 0v5h2v-3h3v-2h-5z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MapControls;
