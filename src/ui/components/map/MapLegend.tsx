import { LayerManager } from "@layers/services/LayerManager";
import React, { useEffect, useState } from "react";
import { getMapTheme } from "../../themes/mapThemes";

/**
 * 🗺️ MAP LEGEND
 * =============
 *
 * Leyenda de capas del mapa con controles de visibilidad y opacidad.
 * Usa sistema de temas compartido centralizado.
 */

export interface MapLegendProps {
  /** Instancia del LayerManager */
  layerManager: LayerManager;
  /** Posición de la leyenda */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Título de la leyenda */
  title?: string;
  /** Leyenda colapsable */
  collapsible?: boolean;
  /** Colapsada por defecto */
  defaultCollapsed?: boolean;
  /** Mostrar control de opacidad */
  showOpacityControl?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Tema de colores */
  theme?: "light" | "dark" | "atlas";
}

const MapLegend: React.FC<MapLegendProps> = ({
  layerManager,
  position = "bottom-left",
  title = "Capas del mapa",
  collapsible = true,
  defaultCollapsed = false,
  showOpacityControl = true,
  className = "",
  theme = "atlas",
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [summary, setSummary] = useState(layerManager.getLayersSummary());
  const [layerOpacities, setLayerOpacities] = useState<Map<string, number>>(
    new Map(),
  );

  // Actualizar resumen cada segundo o cuando cambie algo
  useEffect(() => {
    const updateSummary = () => {
      const newSummary = layerManager.getLayersSummary();
      setSummary(newSummary);

      // Actualizar opacidades locales
      const newOpacities = new Map<string, number>();
      newSummary.layers.forEach((layer) => {
        newOpacities.set(layer.id, layer.opacity);
      });
      setLayerOpacities(newOpacities);
    };

    updateSummary();
    const interval = setInterval(updateSummary, 1000);

    return () => clearInterval(interval);
  }, [layerManager]);

  // **HANDLERS**
  const handleToggleLayer = (layerId: string, currentVisible: boolean) => {
    layerManager.setLayerVisibility(layerId, !currentVisible);
    setSummary(layerManager.getLayersSummary());
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    layerManager.setLayerOpacity(layerId, opacity);
    setLayerOpacities((prev) => new Map(prev).set(layerId, opacity));
  };

  const getLayerOpacity = (layerId: string, fallback: number): number =>
    layerOpacities.get(layerId) ?? fallback;

  // 🎨 Obtener tema centralizado
  const currentTheme = getMapTheme(theme);

  // **ESTILOS DE POSICIÓN**
  const positions = {
    "top-left": { top: "20px", left: "20px" },
    "top-right": { top: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "bottom-right": { bottom: "20px", right: "20px" },
  };

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    ...positions[position],
    minWidth: "250px",
    maxWidth: "350px",
    maxHeight: "80vh",
    overflowY: "auto",
    background: currentTheme.background,
    borderRadius: "8px",
    border: `1px solid ${currentTheme.border}`,
    boxShadow: currentTheme.boxShadow,
    backdropFilter: "blur(10px)",
    zIndex: 999,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const headerStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: collapsed ? "none" : `1px solid ${currentTheme.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: collapsible ? "pointer" : "default",
    color: currentTheme.color,
  };

  const layerItemStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderBottom: `1px solid ${currentTheme.border}`,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const layerHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const checkboxStyle: React.CSSProperties = {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: currentTheme.activeBackground,
  };

  const sliderStyle: React.CSSProperties = {
    width: "100%",
    cursor: "pointer",
    accentColor: currentTheme.activeBackground,
  };

  // Agrupar por categoría
  const layersByCategory = summary.layers.reduce(
    (acc, layer) => {
      const category = layer.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(layer);
      return acc;
    },
    {} as Record<string, typeof summary.layers>,
  );

  return (
    <div className={`atlas-map-legend ${className}`} style={containerStyle}>
      {/* HEADER */}
      <div
        style={headerStyle}
        onClick={collapsible ? () => setCollapsed(!collapsed) : undefined}
      >
        <div>
          <strong style={{ fontSize: "14px" }}>{title}</strong>
        </div>
        {collapsible && (
          <span style={{ fontSize: "12px" }}>{collapsed ? "▼" : "▲"}</span>
        )}
      </div>

      {/* CONTENT */}
      {!collapsed && (
        <div>
          {Object.entries(layersByCategory).map(([category, layers]) => (
            <div key={category}>
              {/* Categoría header */}
              {summary.categories > 0 && (
                <div
                  style={{
                    padding: "8px 16px",
                    background:
                      currentTheme.hoverBackground || "rgba(0,0,0,0.05)",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: currentTheme.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {category}
                </div>
              )}

              {/* Capas de la categoría */}
              {layers.map((layer) => {
                const currentOpacity = getLayerOpacity(layer.id, layer.opacity);

                return (
                  <div key={layer.id} style={layerItemStyle}>
                    {/* Nombre y checkbox */}
                    <div style={layerHeaderStyle}>
                      <input
                        type="checkbox"
                        checked={layer.visible}
                        onChange={() =>
                          handleToggleLayer(layer.id, layer.visible)
                        }
                        style={checkboxStyle}
                        aria-label={`Toggle ${layer.name}`}
                      />
                      <label
                        style={{
                          flex: 1,
                          fontSize: "13px",
                          color: currentTheme.color,
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        onClick={() => handleToggleLayer(layer.id, layer.visible)}
                      >
                        {layer.name}
                      </label>
                    </div>

                    {/* Control de opacidad */}
                    {showOpacityControl && layer.visible && (
                      <div style={{ paddingLeft: "28px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            color: "#888",
                            marginBottom: "4px",
                          }}
                        >
                          <span>Opacidad</span>
                          <span>{Math.round(currentOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentOpacity * 100}
                          onChange={(e) =>
                            handleOpacityChange(
                              layer.id,
                              parseInt(e.target.value, 10) / 100,
                            )
                          }
                          style={sliderStyle}
                          aria-label={`Opacity for ${layer.name}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Sin capas */}
          {summary.total === 0 && (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#888",
                fontSize: "12px",
              }}
            >
              No hay capas registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapLegend;
