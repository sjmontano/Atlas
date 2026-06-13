/**
 * 🗺️ MAP SELECTOR COMPONENT
 * ========================
 *
 * Componente para seleccionar y cargar diferentes mapas
 */

import { ATLAS_MAP_DATA } from "@map/data/atlasMapData";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./MapSelector.css";

export interface MapSelectorProps {
  /** Mapa actualmente seleccionado */
  selectedMapId: string;
  /** Callback cuando se selecciona un mapa */
  onMapSelect: (mapId: string) => void;
  /** Mapas disponibles para seleccionar (opcional, usa todos si no se especifica) */
  availableMaps?: string[];
  /** Si true, abre el mapa en fullscreen al hacer clic */
  openInFullscreen?: boolean;
}

/**
 * Componente selector de mapas
 */
export const MapSelector: React.FC<MapSelectorProps> = ({
  selectedMapId,
  onMapSelect,
  availableMaps,
}) => {
  // Obtener lista de mapas disponibles
  const mapIds = availableMaps || Object.keys(ATLAS_MAP_DATA);

  return (
    <div className="map-selector">
      <label htmlFor="map-select" className="map-selector__label">
        Seleccionar Mapa:
      </label>
      <select
        id="map-select"
        className="map-selector__select"
        value={selectedMapId}
        onChange={(e) => onMapSelect(e.target.value)}
      >
        {mapIds.map((mapId) => {
          const mapData = ATLAS_MAP_DATA[mapId as keyof typeof ATLAS_MAP_DATA];
          return (
            <option key={mapId} value={mapId}>
              {mapData.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

/**
 * Grid de tarjetas para seleccionar mapas visualmente
 */
export const MapSelectorGrid: React.FC<MapSelectorProps> = ({
  selectedMapId,
  onMapSelect,
  availableMaps,
  openInFullscreen = false,
}) => {
  const mapIds = availableMaps || Object.keys(ATLAS_MAP_DATA);
  const navigate = useNavigate();

  const handleMapClick = (mapId: string) => {
    if (openInFullscreen) {
      // Abrir en página completa
      navigate(`/map/${mapId}`);
    } else {
      // Seleccionar en la vista actual
      onMapSelect(mapId);
    }
  };

  return (
    <div className="map-selector-grid">
      {mapIds.map((mapId) => {
        const mapData = ATLAS_MAP_DATA[mapId as keyof typeof ATLAS_MAP_DATA];
        const isSelected = mapId === selectedMapId;

        return (
          <button
            key={mapId}
            className={`map-card ${isSelected ? "map-card--selected" : ""}`}
            onClick={() => handleMapClick(mapId)}
          >
            <div className="map-card__preview">
              <img
                src={mapData.imagePath}
                alt={mapData.name}
                className="map-card__image"
              />
              {openInFullscreen && (
                <div className="map-card__fullscreen-icon">🔍</div>
              )}
            </div>
            <div className="map-card__info">
              <h3 className="map-card__title">{mapData.name}</h3>
              <p className="map-card__description">{mapData.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
