/**
 * 📚 CHAPTER NAV
 * ==============
 * Navegación por capítulos y sus mapas.
 * Lee chaptersStore (capítulo activo) y mapStore (mapa activo).
 * Escribe en chaptersStore.goToChapter() y mapStore.setActiveMap().
 *
 * REGLA: No conoce MapConfig ni PGW — solo trabaja con IDs y títulos
 * obtenidos de chaptersData (narrativa pura).
 */

import { CHAPTERS_DATA } from "@chapters/data/chaptersData";
import { getMapLayerProfile } from "@layers/config/mapLayerProfiles";
import { getLayerDisplayMetadataById } from "@layers/data";
import { getEcosistemasLayerHierarchy } from "@layers/data/raster/ecosistemasRasterLayers";
import { pulseLayer } from "@layers/services/layerPulse";
import { useMapContext } from "@map/context/MapContext";
import { useLayersStore, useMapStore } from "@state";
import { useChaptersStore } from "@state/chaptersStore";
import React, { useState } from "react";

const ACCENT = "#3498db";
const ACTIVE_BG = "#ebf5fb";
const HOVER_BG = "rgba(52,73,94,0.06)";
const TEXT_PRIMARY = "#2c3e50";
const TEXT_SECONDARY = "#7f8c8d";
const BORDER = "rgba(52,73,94,0.12)";

export const ChapterNav: React.FC = () => {
  const { map } = useMapContext();
  const { activeChapter, goToChapter } = useChaptersStore();
  const { activeMapId, setActiveMap } = useMapStore();
  const {
    visibleLayers: visibleLayersSet,
    toggleLayer,
    setLayersVisibility,
  } = useLayersStore();

  // IDs de capítulos disponibles
  const chapterIds = Object.keys(CHAPTERS_DATA).map(Number);

  // Control de expansión local (independiente del store — es UI pura)
  const [expandedChapter, setExpandedChapter] = useState<number>(activeChapter);

  const handleChapterClick = (chapterId: number) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(0); // colapsar
    } else {
      setExpandedChapter(chapterId);
      goToChapter(chapterId); // activa el capítulo en el store (también setActiveMap)
    }
  };

  const handleMapClick = (mapId: string) => {
    setActiveMap(mapId);
  };

  const toggleAllMapLayers = (layerIds: string[], visible: boolean) => {
    setLayersVisibility(layerIds, visible);
  };

  const areAllLayersVisible = (layerIds: string[]): boolean =>
    layerIds.length > 0 && layerIds.every((id) => visibleLayersSet.has(id));

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "12px 8px",
      }}
    >
      <p
        style={{
          margin: "0 0 10px 6px",
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: TEXT_SECONDARY,
          fontWeight: 600,
        }}
      >
        Capítulos
      </p>

      {chapterIds.map((chId) => {
        const chapter = CHAPTERS_DATA[chId];
        const isActiveChapter = activeChapter === chId;
        const isExpanded = expandedChapter === chId;

        return (
          <div key={chId} style={{ display: "flex", flexDirection: "column" }}>
            {/* Cabecera del capítulo */}
            <button
              onClick={() => handleChapterClick(chId)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: isActiveChapter ? ACTIVE_BG : "transparent",
                border: `1px solid ${isActiveChapter ? ACCENT : "transparent"}`,
                borderRadius: "8px",
                padding: "8px 10px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActiveChapter)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    HOVER_BG;
              }}
              onMouseLeave={(e) => {
                if (!isActiveChapter)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
              }}
            >
              {/* Número */}
              <span
                style={{
                  minWidth: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: isActiveChapter ? ACCENT : "rgba(52,73,94,0.12)",
                  color: isActiveChapter ? "#fff" : TEXT_SECONDARY,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {chId}
              </span>

              {/* Título */}
              <span
                style={{
                  flex: 1,
                  fontSize: "0.82rem",
                  fontWeight: isActiveChapter ? 600 : 500,
                  color: isActiveChapter ? ACCENT : TEXT_PRIMARY,
                  lineHeight: 1.3,
                }}
              >
                {chapter.title}
              </span>

              {/* Flecha */}
              <span
                style={{
                  fontSize: "0.6rem",
                  color: TEXT_SECONDARY,
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                ▶
              </span>
            </button>

            {/* Lista de mapas del capítulo (colapsable) */}
            {isExpanded && (
              <div
                style={{
                  marginLeft: "18px",
                  marginTop: "2px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  borderLeft: `2px solid ${BORDER}`,
                  paddingLeft: "10px",
                }}
              >
                {chapter.maps.map((mapRef) => {
                  const isActiveMap = activeMapId === mapRef.mapId;
                  const mapProfile = getMapLayerProfile(mapRef.mapId);
                  const associatedLayerIds =
                    mapProfile?.associatedLayerIds ?? [];
                  const associatedLayers = associatedLayerIds
                    .map((id) => ({
                      id,
                      metadata: getLayerDisplayMetadataById(id),
                    }))
                    .filter((entry) => !!entry.metadata);
                  const ecosystemHierarchy =
                    mapRef.mapId === "chapter1-ecosistemas"
                      ? getEcosistemasLayerHierarchy(associatedLayerIds)
                      : [];
                  const visibleInMap = associatedLayerIds.filter((id) =>
                    visibleLayersSet.has(id),
                  ).length;

                  return (
                    <div
                      key={mapRef.mapId}
                      style={{
                        background: isActiveMap ? ACTIVE_BG : "transparent",
                        border: `1px solid ${isActiveMap ? ACCENT : "transparent"}`,
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => handleMapClick(mapRef.mapId)}
                        title={mapRef.description}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "6px 8px",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActiveMap)
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = HOVER_BG;
                        }}
                        onMouseLeave={(e) => {
                          if (!isActiveMap)
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.78rem",
                            color: isActiveMap ? ACCENT : TEXT_PRIMARY,
                            fontWeight: isActiveMap ? 600 : 400,
                            display: "block",
                          }}
                        >
                          {mapRef.title}
                        </span>
                        {mapRef.description && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              color: TEXT_SECONDARY,
                              display: "block",
                              marginTop: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {mapRef.description}
                          </span>
                        )}
                      </button>

                      {isActiveMap && (
                        <div
                          style={{
                            borderTop: `1px solid ${BORDER}`,
                            background: "#fff",
                            padding: "8px",
                            display: "grid",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: TEXT_PRIMARY,
                              }}
                            >
                              Capas de este mapa
                            </span>
                            <span
                              style={{
                                fontWeight: 500,
                                fontSize: "0.68rem",
                                color: TEXT_SECONDARY,
                              }}
                            >
                              {visibleInMap} de {associatedLayerIds.length}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() =>
                                toggleAllMapLayers(associatedLayerIds, true)
                              }
                              style={{
                                border: `1px solid ${ACCENT}`,
                                background: "#fff",
                                color: ACCENT,
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "0.72rem",
                                cursor: "pointer",
                              }}
                            >
                              Activar todo
                            </button>
                            <button
                              onClick={() =>
                                toggleAllMapLayers(associatedLayerIds, false)
                              }
                              style={{
                                border: `1px solid ${BORDER}`,
                                background: "#fff",
                                color: TEXT_SECONDARY,
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "0.72rem",
                                cursor: "pointer",
                              }}
                            >
                              Desactivar todo
                            </button>
                          </div>

                          {associatedLayers.length === 0 && (
                            <div
                              style={{
                                fontSize: "0.74rem",
                                color: TEXT_SECONDARY,
                              }}
                            >
                              Este mapa no tiene capas asociadas configuradas.
                            </div>
                          )}

                          {ecosystemHierarchy.length > 0
                            ? ecosystemHierarchy.map((categoryGroup) => {
                              const categoryLayerIds =
                                categoryGroup.subcategories.flatMap(
                                  (subcat) =>
                                    subcat.layers.map((layer) => layer.id),
                                );
                              const categoryChecked =
                                areAllLayersVisible(categoryLayerIds);

                              return (
                                <div
                                  key={categoryGroup.category}
                                  style={{
                                    display: "grid",
                                    gap: "8px",
                                    border: `1px solid ${BORDER}`,
                                    borderRadius: "6px",
                                    padding: "8px",
                                  }}
                                >
                                  <label
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      fontSize: "0.74rem",
                                      color: TEXT_PRIMARY,
                                      fontWeight: 700,
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={categoryChecked}
                                      onChange={() =>
                                        toggleAllMapLayers(
                                          categoryLayerIds,
                                          !categoryChecked,
                                        )
                                      }
                                    />
                                    <span>{categoryGroup.category}</span>
                                  </label>

                                  {categoryGroup.subcategories.map(
                                    (subcat) => {
                                      const subcatLayerIds =
                                        subcat.layers.map(
                                          (layer) => layer.id,
                                        );
                                      const subcatChecked =
                                        areAllLayersVisible(subcatLayerIds);

                                      return (
                                        <div
                                          key={subcat.subcategory}
                                          style={{
                                            display: "grid",
                                            gap: "6px",
                                            marginLeft: "14px",
                                          }}
                                        >
                                          <label
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "8px",
                                              fontSize: "0.72rem",
                                              color: TEXT_PRIMARY,
                                              fontWeight: 600,
                                            }}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={subcatChecked}
                                              onChange={() =>
                                                toggleAllMapLayers(
                                                  subcatLayerIds,
                                                  !subcatChecked,
                                                )
                                              }
                                            />
                                            <span>{subcat.subcategory}</span>
                                          </label>

                                          {subcat.layers.map((layer) => {
                                            const checked =
                                              visibleLayersSet.has(layer.id);
                                            return (
                                              <label
                                                key={layer.id}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "8px",
                                                  marginLeft: "14px",
                                                  fontSize: "0.72rem",
                                                  color: TEXT_SECONDARY,
                                                }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={checked}
                                                  onChange={() =>
                                                    toggleLayer(layer.id)
                                                  }
                                                />
                                                <span style={{ flex: 1 }}>
                                                  <span
                                                    onMouseEnter={() => {
                                                      if (checked) {
                                                        pulseLayer(
                                                          map,
                                                          layer.id,
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    {layer.menuLabel}
                                                  </span>
                                                </span>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              );
                            })
                            : associatedLayers.map(({ id, metadata }) => {
                              const checked = visibleLayersSet.has(id);
                              return (
                                <label
                                  key={id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "0.76rem",
                                    color: TEXT_PRIMARY,
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleLayer(id)}
                                  />
                                  <span style={{ flex: 1 }}>
                                    <span
                                      onMouseEnter={() => {
                                        if (checked) {
                                          pulseLayer(map, id);
                                        }
                                      }}
                                    >
                                      {metadata?.name ?? id}
                                    </span>
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.64rem",
                                      color: TEXT_SECONDARY,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {metadata?.category}
                                  </span>
                                </label>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default ChapterNav;
