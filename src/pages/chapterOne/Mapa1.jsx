//Este sera el mapa 3
import { useEffect, useState } from "react";
import CheckboxList from "../../components/CheckboxList";
import "../../styles/Capitulo1.css";
import SidebarMain from "../../components/Sidebars/SidebarMain/SidebarMain";
import SidebarBottom from "../../components/Sidebars/SidebarBottom/SidebarBottom";

const Mapa1 = () => {
  const layers = [
    /* {
      name:"cuencaCauca",
      id: "capa-cuencaCauca",
      url: "http://localhost:4000/api/v1/location/cuencaCauca",
      color: "#ff0000",
      zIndex:15
    },*/
    {
      name: "rioMagdalena",
      id: "rioMagdalena",
      url: "http://localhost:4000/api/v1/location/Rio magdalena",
      color: "#ff0000",
      zIndex: 15,
    },
    {
      name: "Cuenca Alta del Cauca",
      id: "cuencaAltaRioCauca",
      url: "http://localhost:4000/api/v1/location/Cuenca Alta Del Cauca",
      color: "#4bcfff",
      zIndex: 2,
    },
    {
      name: "Sur Geográfico",
      id: "surGeografico",
      url: "http://localhost:4000/api/v1/location/Sur",
      color: "#ff0000",
    },
    {
      name: "Nodo Oriente Cali",
      id: "NodoOrienteCaliCapa",
      url: "http://localhost:4000/api/v1/location/nodoOrienteCali",
      color: "#81c640",
      zIndex: 3,
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
      color: "#ff0000",
    },
    {
      name: "Río Cesar",
      id: "rioCesar",
      url: "http://localhost:4000/api/v1/location/Rio cesar",
      color: "#ff0000",
    },
    {
      name: "Río Nechí",
      id: "rioNechi",
      url: "http://localhost:4000/api/v1/location/Rio Nechi",
      color: "#ff0000",
    },
    {
      name: "Río Anchicayá",
      id: "rioAnchicaya",
      url: "http://localhost:4000/api/v1/location/Rio Anchicaya",
      color: "#ff0000",
    },
    {
      name: "Río San Juan",
      id: "rioSanJuan",
      url: "http://localhost:4000/api/v1/location/Rio San juan",
      color: "#ff0000",
    },
    {
      name: "Río Atrato",
      id: "rioAtrato",
      url: "http://localhost:4000/api/v1/location/Rio atrato",
      color: "#ff0000",
    },
    {
      name: "Nevados",
      id: "nevados",
      url: "http://localhost:4000/api/v1/location/Nevados",
      color: "#ff0000",
    },
  ];

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map", // Div donde se cargará el mapa
      style: "https://demotiles.maplibre.org/style.json", // Mapa base estilo MapLibre
      center: [-75.5, 5.5], // Coordenadas iniciales
      zoom: 7, // Nivel de zoom inicial
      maxZoom: 7.5,
      minZoom: 7,
      bearing: -90, // Rotación inicial en grados
      dragRotate: false, // Desactiva rotación con el mouse
      touchZoomRotate: false, // Desactiva rotación con gestos táctiles
    });

    const  traerCapa= (url, nombre, idCapa, color, zIndex) => {
      fetch(url)
        .then((response) => response.json()) // Convertir la respuesta a JSON
        .then((data) => {
          const geoJsonLayer = data.geoCollection;

          // Agregar la capa al mapa
          map.addSource(nombre, {
            type: "geojson",
            data: geoJsonLayer,
          });
          
          // Determinar si la capa es un río (línea) o una zona geográfica (relleno)
          const isRiver = idCapa.startsWith("rio");

          map.addLayer({
            id: idCapa,
            type: isRiver ? "line" : "fill",
            source: nombre,
            paint: isRiver
              ? {
                  "line-color": color,
                  "line-width": 2,
                }
              : {
                  "fill-color": color,
                  "fill-opacity": 0.5,
                },
            layout: {
              visibility: "visible", // Mostrar todas las capas por defecto
            },
            zIndex: zIndex,
          });

          // Evento para mostrar tooltip con el nombre de la capa
          map.on("mousemove", idCapa, (e) => {
            if (e.features.length > 0) {
              const feature = e.features[0]; // Obtener la primera feature

              // Buscar el nombre de la capa en distintas propiedades posibles
              const nombreCapa =
                feature.properties?.name ||
                feature.properties?.nombre ||
                feature.properties?.["capaRio"] ||
                feature.properties?.["capa-rio"] ||
                nombre; // Si no hay nombre en el GeoJSON, usa el nombre asignado en el array

              if (nombreCapa) {
                tooltip.style.display = "block";
                tooltip.style.left = `${e.point.x + 10}px`;
                tooltip.style.top = `${e.point.y + 10}px`;
                tooltip.innerText = nombreCapa;
              } else {
                tooltip.style.display = "none"; // No mostrar tooltip si no hay nombre
              }
            }
          });

          // Evento para ocultar el tooltip cuando el mouse sale de la capa
          map.on("mouseleave", idCapa, () => {
            tooltip.style.display = "none";
          });

          console.log("Capa agregada exitosamente");
        }) // Guardar los datos en el estado
        .catch((error) => console.error("Error al obtener mensajes:", error));
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

    // Agregar las capas al mapa
    map.on("load", () => {
      // Agregar control de capas
      const layerControls = document.getElementById("layer-Control");
      layerControls.innerHTML = "";
      // Agregar la capa GeoJSON
      /*layers.forEach((layer) => {
        if(layer.name){
          traerCapa(layer.url, layer.name, layer.id, layer.color);

          const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = layer.id;
        checkbox.checked = true;
        checkbox.addEventListener("change", (e) => {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            e.target.checked ? "visible" : "none"
          );
        });

        const label = document.createElement("label");
        label.htmlFor = layer.id;
        label.appendChild(checkbox);
        label.append(` ${layer.name}`);

        layerControls.appendChild(label);
        layerControls.appendChild(document.createElement("br"));
        }
      });*/

      // Agregar la imagen georreferenciada
      const imageBounds = [
        [-79.438011528289, 1.633123501103],
        [
          -79.438011528289 + 0.00195748206 * 3507,
          1.633123501103 + 0.001957242876 * 4960,
        ],
      ];

      map.addSource("geoImage", {
        type: "image",
        url: "/assets/mapaBase.png",
        coordinates: [
          [imageBounds[0][0], imageBounds[1][1]], // Esquina superior izquierda
          [imageBounds[1][0], imageBounds[1][1]], // Esquina superior derecha
          [imageBounds[1][0], imageBounds[0][1]], // Esquina inferior derecha
          [imageBounds[0][0], imageBounds[0][1]], // Esquina inferior izquierda
        ],
      });

      map.addLayer({
        id: "geoImage-layer",
        type: "raster",
        source: "geoImage",
        paint: {
          "raster-opacity": 1,
        },
        gestureHandling: "none", // Deshabilita gestos táctiles
        tilt: 0, // Desactiva la inclinación (rotación en 3D)
      });

     
    });

    map.dragPan.disable(); // Desactiva arrastrar con el mouse
    map.scrollZoom.disable(); // Desactiva zoom con scroll del mouse
    map.touchZoomRotate.disable(); // Desactiva zoom y rotación con gestos táctiles
    map.doubleClickZoom.disable(); // Desactiva zoom con doble clic
  }, []);

  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.background = "rgba(0, 0, 0, 0.7)";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "14px";
  tooltip.style.display = "none"; // Ocultarlo inicialmente
  tooltip.style.zIndex = "10100"; // Ocultarlo inicialmente

  document.body.appendChild(tooltip);

  return (
    <div id="cap1">
      <SidebarMain />

      <SidebarBottom />
      <div id="map"></div>
      <div id="layer-Control"></div>
    </div>
  );
};

export default Mapa1;
