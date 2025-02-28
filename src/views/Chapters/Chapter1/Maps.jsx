import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import BaseMapImage from "./BaseMapImage";

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-75.5, 5.5], // 🔹 No cambiamos la posición del mapa
      zoom: 7,
      maxZoom: 10,
      minZoom: 7, // 🔹 Se mantiene alineado con BaseMapImage.jsx
      bearing: -90,
      dragRotate: false,
      touchZoomRotate: false,
    });

    newMap.on("load", () => {
      setMap(newMap);
      setMapLoaded(true);
    });

    return () => newMap.remove();
  }, []);

  return (
    <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "100vh" }}>
      {mapLoaded && <BaseMapImage map={map} />} {/* ✅ Se renderiza solo cuando el mapa está listo */}
    </div>
  );
};

export default Map;
