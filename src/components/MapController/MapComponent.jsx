import React, { useEffect } from "react";
import BaseMapImage from "@components/MapController/BaseMapImage";
import useMap from "../../Hooks/useMap";
import agregarCapas from "./agregarCapas";
import mapLayers from "../../data/geojsonLayers/mapLayers";
import useMapProps from "../../Hooks/useMapProps";
import ToponimosLayer from "./agregarToponimos";
import LayerMenu from "./layerMenu";

const MapComponent = ({
  props,
  setIsChapterOpen,
  onMapChange,
  mapLayers = [],
  isEncuadresOpen,
  nevados = [],
  encuadres = [],
  toponimos = [],
  rasterTiles = [],
  selectedMap = 0,
  onMapReady, 
}) => {
  const { map, mapLoaded, mapContainerRef } = useMap(props);
  
  useEffect(() => {
    if (map) {
      const handleIdle = () => {
        console.log("🟢 MapLibre: Mapa completamente cargado (idle)");
        if (onMapReady) onMapReady();
      };

      map.on("idle", handleIdle);

      return () => {
        map.off("idle", handleIdle);
      };
    }
  }, [map, onMapReady]);

  return (
    <div>
      <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "100vh" }}>
        {mapLoaded ? (
          <BaseMapImage
            isEncuadresOpen={isEncuadresOpen}
            mapLayers={mapLayers}
            onMapChange={onMapChange}
            setIsChapterOpen={setIsChapterOpen}
            Nevados={nevados}
            Encuadres={encuadres}
            Toponimos={toponimos}
            RasterTiles={rasterTiles}
            map={map}
            imageUrls={props.imageUrls}
            imageBounds={props.imageBounds}
            selectedMap={selectedMap}
            onMapReady={() => setMapReady(true)}
          />
        ) : (
          <p>⏳ Cargando mapa...</p>
        )}
      </div>

      {map && rasterTiles.length !== 0 ? (
        <LayerMenu
          map={map}
          layers={rasterTiles.map((tile) => ({
            id: tile.id,
            name: tile.name || "Capa sin nombre",
            texto: tile.texto || "Capa sin descripción",
          }))}
          selectedMap={selectedMap}
        />
      ) : (
        <p>Cargando mapa...</p>
      )}

      {map && toponimos.length !== 0 ? (
        <ToponimosLayer
          mapName={props.name}
          onMapChange={onMapChange}
          map={map}
          toponimos={toponimos}
          selectedMap={selectedMap}
        />
      ) : (
        <p>Cargando mapa...</p>
      )}
    </div>
  );
};

export default MapComponent;
