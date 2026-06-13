/**
 * 🚨 COMPONENTE DE ERROR DE MAPA
 * ================================
 *
 * Muestra errores de inicialización del mapa con accesibilidad correcta.
 */

import React from "react";

interface MapErrorProps {
  /** Mensaje de error */
  error: string;
  /** ID del mapa para diagnóstico */
  mapId: string;
  /** Callback para reintentar */
  onRetry?: () => void;
  /** Clases CSS adicionales */
  className?: string;
  /** Estilos inline */
  style?: React.CSSProperties;
}

/**
 * Componente de error accesible para mapas
 *
 * @example
 * ```tsx
 * {error && <MapError error={error} mapId={mapId} />}
 * ```
 */
export const MapError: React.FC<MapErrorProps> = ({
  error,
  mapId,
  onRetry,
  className,
  style,
}) => (
  <div
    role="alert"
    aria-live="assertive"
    className={className}
    style={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff5f5",
      color: "#c53030",
      padding: "2rem",
      borderRadius: "8px",
      border: "1px solid #fed7d7",
      ...style,
    }}
  >
    <div style={{ textAlign: "center", maxWidth: "500px" }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🗺️❌</div>
      <h3
        style={{
          margin: "0 0 0.75rem",
          fontSize: "1.1rem",
          fontWeight: 600,
        }}
      >
        Error construyendo mapa
      </h3>
      <p
        style={{
          margin: "0 0 1rem",
          fontSize: "0.9rem",
          opacity: 0.85,
          lineHeight: 1.5,
        }}
      >
        {error}
      </p>
      <small
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.75rem",
          opacity: 0.6,
          fontFamily: "monospace",
        }}
      >
        ID: {mapId}
      </small>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: "#c53030",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  </div>
);
