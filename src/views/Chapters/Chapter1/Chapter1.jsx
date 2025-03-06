import React, { useState } from "react";
import SidebarMain from "../../../components/Sidebars/SidebarMain/SidebarMain";
import SidebarLeft from "../../../components/Sidebars/SidebarLeft/SidebarLeft";
import SidebarBottom from "../../../components/Sidebars/SidebarBottom/SidebarBottom";
import Header from "../../../components/Header/Header";
import MapComponent from "../../../components/MapController/MapComponent";
import "./Chapter1.css";
import { BiBorderRadius } from "react-icons/bi";

const Chapter1 = () => {
  const [selectedMap, setSelectedMap] = useState(0);

  const maps = [
    {
      imageBounds: [
        [-79.438011528289, 1.633123501103],
        [-79.438011528289 + 0.00195748206 * 3507, 1.633123501103 + 0.001957242876 * 4960],
      ],
      regionZoomLimits: { min: 6, max: 10, interpolationSpeed: 0.6 },
      shadowConfig: {
        active: true, // Habilitar o deshabilitar sombra para este mapa
        color: "rgba(0, 0, 0, 0.9)",
        intensity: 200, // Nivel de desenfoque
        spread: 100, // Tamaño del borde
      },
      imageUrls: {
        base: "/assets/img/maps/atlasverde.jpg",
        low: "/assets/img/maps/atlasverde.jpg",
        medium: "/assets/img/maps/atlasverde.jpg",
        high: "/assets/img/maps/atlasverde.jpg",
      },
    },

    {
      imageBounds: [
        [-79.438011528289, 1.633123501103],
        [-79.438011528289 + 0.00195748206 * 3507, 1.633123501103 + 0.001957242876 * 4960],
      ],
      regionZoomLimits: { min: 6, max: 10, interpolationSpeed: 0.6 },
      shadowConfig: {
        active: true, // Habilitar o deshabilitar sombra para este mapa
        color: "rgba(0, 0, 0, 0.9)",
        intensity: 200, // Nivel de desenfoque
        spread: 100, // Tamaño del borde
      },
      imageUrls: {
        base: "/assets/img/maps/cuenca-cauca-base.webp",
        low: "/assets/img/maps/cuenca-cauca-low.webp",
        medium: "/assets/img/maps/cuenca-cauca-medium.webp",
        high: "/assets/img/maps/cuenca-cauca-high.webp",
      },
    },
  ];

  const handleMapChange = (index) => {
    setSelectedMap(index);
  };

  return (
    <div id="cap1">
      <Header />
      <SidebarLeft />
      <SidebarMain />
      <SidebarBottom onMapChange={handleMapChange} />

      <MapComponent
        imageBounds={maps[selectedMap].imageBounds}
        regionZoomLimits={maps[selectedMap].regionZoomLimits}
        imageUrls={maps[selectedMap].imageUrls}
      />

      {maps[selectedMap].shadowConfig.active && (
        <div
          className="screen-shadow"
          style={{
            boxShadow: `inset 0 0 ${maps[selectedMap].shadowConfig.intensity}px ${maps[selectedMap].shadowConfig.spread}px ${maps[selectedMap].shadowConfig.color}`,
          }}
        ></div>
      )}
    </div>
  );
};

export default Chapter1;
 