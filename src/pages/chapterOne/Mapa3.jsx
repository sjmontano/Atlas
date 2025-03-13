//Este sera el mapa 1.

import { useEffect, useState } from "react";
import CheckboxList from "../../components/CheckboxList";
import "../../styles/Capitulo1.css";
import SidebarMain from "../../components/Sidebars/SidebarMain/SidebarMain";
import SidebarBottom from "../../components/Sidebars/SidebarBottom/SidebarBottom";

const Mapa3 = () => {
  const layers = [
    {
      name: "Río Magdalena",
      id: "rioMagdalena",
      url: "http://localhost:4000/api/v1/location/Rio magdalena",
      color: "#ff0000",
      zIndex: 15,
    },
    /*{
      name: "Cuenca Alta del Cauca",
      id: "cuencaAltaRioCauca",
      url: "http://localhost:4000/api/v1/location/Cuenca Alta Del Cauca",
      color: "#4bcfff",
      zIndex: 1,
    },*/
    {
      name: "Sur Geográfico",
      id: "surGeografico",
      url: "http://localhost:4000/api/v1/location/Sur",
      color: "#ff0000",
      zIndex: 2,
    },
    {
      name: "Nodo Oriente Cali",
      id: "NodoOrienteCaliCapa",
      url: "http://localhost:4000/api/v1/location/nodoOrienteCali",
      color: "#81c640",
      zIndex: 5,
    },
    {
      name: "Nodo Villa Rica",
      id: "nodovilla",
      url: "http://localhost:4000/api/v1/location/nodovilla",
      color: "#ffea2b",
      zIndex: 3,
    },
    {
      name: "Nodo Suárez",
      id: "NodoSuarez",
      url: "http://localhost:4000/api/v1/location/nodoSuarez",
      color: "#ffaf25",
      zIndex: 1104,
    },
    {
      name: "Bajo Cauca",
      id: "bajoCauca",
      url: "http://localhost:4000/api/v1/location/bajo%20cauca",
      color: "#ffff03",
      zIndex: 1105,
    },
    {
      name: "Río San Jorge",
      id: "rioSanJorge",
      url: "http://localhost:4000/api/v1/location/Rio san Jorge",
      color: "#0000ff",
      zIndex: 4,
    },
    {
      name: "Río Cesar",
      id: "rioCesar",
      url: "http://localhost:4000/api/v1/location/Rio cesar",
      color: "#0000ff",
      zIndex: 4,
    },
    {
      name: "Río Nechí",
      id: "rioNechi",
      url: "http://localhost:4000/api/v1/location/Rio Nechi",
      color: "#0000ff",
      zIndex: 4,
    },
    {
      name: "Río Anchicayá",
      id: "rioAnchicaya",
      url: "http://localhost:4000/api/v1/location/Rio Anchicaya",
      color: "#0000ff",
      zIndex: 4,
    },
    {
      name: "Río San Juan",
      id: "rioSanJuan",
      url: "http://localhost:4000/api/v1/location/Rio San juan",
      color: "#0000ff",
      zIndex: 4,
    },
    {
      name: "Río Atrato",
      id: "rioAtrato",
      url: "http://localhost:4000/api/v1/location/Rio atrato",
      color: "#0000ff",
      zIndex: 4,
    },
    {
      name: "Nevados",
      id: "nevados",
      url: "http://localhost:4000/api/v1/location/Nevados",
      color: "#ff0000",
      zIndex: 6,
    },
  ];

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: "https://demotiles.maplibre.org/style.json",
      center: [-75.5, 5.5],
      zoom: 7,
      maxZoom: 7.5,
      minZoom: 7,
      bearing: -90,
      dragRotate: false,
      touchZoomRotate: false,
    });

    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0, 0, 0, 0.7)";
    tooltip.style.color = "white";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "14px";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "10100";
    document.body.appendChild(tooltip);

    const traerCapa = (url, nombre, idCapa, color, zIndex) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const geoJsonLayer = data.geoCollection;
          map.addSource(nombre, { type: "geojson", data: geoJsonLayer });

          const isRiver = idCapa.startsWith("rio");

          map.addLayer({
            id: idCapa,
            type: isRiver ? "line" : "fill",
            source: nombre,
            paint: isRiver
              ? { "line-color": color, "line-width": 2 }
              : { "fill-color": color, "fill-opacity": 0.5 },
            layout: { visibility: "visible" },
            zIndex: zIndex,
          });

          // Tooltip para capas
          map.on("mousemove", idCapa, (e) => {
            if (e.features.length > 0) {
              const feature = e.features[0];
              const nombreCapa = feature.properties?.name || nombre;

              tooltip.style.display = "block";
              tooltip.style.left = `${e.point.x + 10}px`;
              tooltip.style.top = `${e.point.y + 10}px`;
              tooltip.innerText = nombreCapa;
            }
          });

          map.on("mouseleave", idCapa, () => {
            tooltip.style.display = "none";
          });

          console.log(`Capa ${nombre} agregada`);
        })
        .catch((error) => console.error(`Error al cargar ${nombre}:`, error));
    };
    // Definir los puntos con coordenadas y contenido del popup
    const Nevados = [
      {
        coords: [-76.38206609134501, 2.293281219620491],
        texto: "Puracé",
      },
      {
        coords: [-76.029260864817857, 2.920775754535208],
        texto: "Nevado del huila",
      },
      {
        coords: [-75.322183446164701, 4.888710105413276],
        texto: "Nevado del Ruíz",
      },
      {
        coords: [-75.330985239757894, 4.658396506391393],
        texto: "Nevado del Tolima",
      },
      {
        coords: [-75.392597794910245, 4.715608164747147],
        texto: "Nevado de Santa Isabe",
      },
      {
        coords: [-73.666468273578474, 10.826497861087862],
        texto: "Sierra Nevada de Santa Marta",
      },
    ]; // Recorrer el vector y agregar marcadores y popups
    
    Nevados.forEach((nevado) => {
      const marker = new maplibregl.Marker({ color: "blue" }) // Marcador azul
        .setLngLat(nevado.coords)
        .addTo(map);
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat(nevado.coords)
        .setHTML(nevado.texto); // Mostrar popup en hover
      //
      marker.getElement().addEventListener("mouseenter", () => {
        popup.addTo(map);
      }); // Ocultar popup al salir el mouse
      marker.getElement().addEventListener("mouseleave", () => {
        popup.remove();
      });
    });

    layers.forEach((layer) =>
      traerCapa(layer.url, layer.name, layer.id, layer.color, layer.zIndex)
    );

    map.dragPan.disable();
    map.scrollZoom.disable();
    map.touchZoomRotate.disable();
    map.doubleClickZoom.disable();

    return () => {
      document.body.removeChild(tooltip);
    };
  }, []);

  return (
    <div id="cap1">
      <SidebarMain />
      <SidebarBottom />
      <div id="map"></div>
      <div id="layer-Control"></div>
    </div>
  );
};

export default Mapa3;
