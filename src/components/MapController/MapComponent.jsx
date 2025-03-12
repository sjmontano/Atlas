import React from "react";
import BaseMapImage from "@components/MapController/BaseMapImage";
import useMap from "@hooks/useMap";

const MapComponent = ({ imageBounds, regionZoomLimits, imageUrls }) => {
  const { map, mapLoaded, mapContainerRef } = useMap({ imageBounds, regionZoomLimits });

  return (
    <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "100vh" }}>
      {mapLoaded ? (
        <BaseMapImage
          map={map}
          imageUrls={imageUrls}
          imageBounds={imageBounds}
          minzoom={regionZoomLimits.min}
          maxzoom={regionZoomLimits.max}
        />
      ) : (
        <p>⏳ Cargando mapa...</p>
      )}
    </div>
  );
};

export default MapComponent;