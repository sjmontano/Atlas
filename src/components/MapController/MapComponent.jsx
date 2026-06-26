import BaseMapImage from "@components/MapController/BaseMapImage";
import { useEffect } from "react";
import useMap from "../../Hooks/useMap";
import AgregarEncuadres from "./agregarEncueadres";
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
  names = [],
  toponimos = [],
  rasterTiles,
  selectedMap = 0,
  onMapReady,
  isfinca = false,
}) => {
  const { map, mapLoaded, mapContainerRef } = useMap(props);
  console.log(props);

  if (isfinca) {
    const existingDisplay = document.getElementById("coords-display");
    if (existingDisplay) {
      existingDisplay.remove();
    }
  }

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
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: "100%", height: "100vh" }}
      >
        {mapLoaded ? (
          <BaseMapImage
            mapName={props.name}
            isEncuadresOpen={isEncuadresOpen}
            mapLayers={mapLayers}
            onMapChange={onMapChange}
            setIsChapterOpen={setIsChapterOpen}
            Nevados={nevados}
            Encuadres={encuadres}
            names={names}
            Toponimos={toponimos}
            RasterTiles={rasterTiles}
            map={map}
            imageUrls={props.imageUrls}
            imageBounds={props.imageBounds}
            imageCoordinates={props.imageCoordinates}
            maxBounds={props.maxBounds}
            mirrorHorizontal={props.mirrorHorizontal}
            mirrorVertical={props.mirrorVertical}
            minzoom={props.minZoom ?? 0}
            maxzoom={props.maxZoom ?? 15}
            debugMapOpacity={props.debugMapOpacity}
            useTransformConstrain={props.useTransformConstrain}
            boundsPadding={props.boundsPadding}
            selectedMap={selectedMap}
            onMapReady={() => setMapReady(true)}
          />
        ) : (
          <p>⏳ Cargando mapa...</p>
        )}
      </div>

      {map && rasterTiles ? (
        <LayerMenu
          mapName={props.name}
          map={map}
          layers={rasterTiles.map((tile) => ({
            id: tile.id,
            name: tile.name || "Capa sin nombre",
            texto: tile.texto || "Capa sin descripción",
            icono: tile.icono || "",
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

      {map && encuadres.length !== 0 ? (
        <AgregarEncuadres
          map={map}
          setIsChapterOpen={setIsChapterOpen}
          onMapChange={onMapChange}
          Encuadres={encuadres}
          names={names}
          mapName={props.name}
          selectedMap={selectedMap}
        />
      ) : (
        <p>Cargando mapa...</p>
      )}
    </div>
  );
};

export default MapComponent;
