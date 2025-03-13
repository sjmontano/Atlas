import { useEffect, useState } from "react";
import CheckboxList from "../../components/CheckboxList";
import "../../styles/Capitulo1.css";
import SidebarMain from "../../components/Sidebars/SidebarMain/SidebarMain";
import SidebarBottom from "../../components/Sidebars/SidebarBottom/SidebarBottom";

const Mapa2 = () => {
  


  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.background = "rgba(0, 0, 0, 0.7)";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "14px";
  tooltip.style.display = "none"; // Ocultarlo inicialmente
  tooltip.style.zIndex = "10100"; // Ocultarlo inicialmente



  
  const traerCapa= ((map,url, nombre, idCapa, color)=>{
    fetch(url)
      .then((response) => response.json()) // Convertir la respuesta a JSON
      .then((data) => {
        const geoJsonLayer = data.geoCollection;

        // Agregar la capa al mapa
        map.addSource(nombre, {
          type: "geojson",
          data: geoJsonLayer,
        });

        map.addLayer({
          id: idCapa,
          type: "fill",
          source: nombre,
          paint: {
            "fill-color": color, // Color rojo para los polígonos
            "fill-opacity": 0.5, // Opacidad del 50%
          },
        });

        // Crear un elemento div para mostrar el texto

        // Evento para mover el tooltip cuando el mouse está sobre la capa
        map.on("mousemove", idCapa, (e) => {
          tooltip.style.display = "block";
          tooltip.style.left = `${e.point.x + 10}px`; // Ajustar posición X
          tooltip.style.top = `${e.point.y + 10}px`; // Ajustar posición Y
          tooltip.innerText = geoJsonLayer.name; // Texto que se mostrará
        });

        // Evento para ocultar el tooltip cuando el mouse salga de la capa
        map.on("mouseleave", idCapa, () => {
          tooltip.style.display = "none";
        });

        console.log("Capa agregada exitosamente");
      }) // Guardar los datos en el estado
      .catch((error) => console.error("Error al obtener mensajes:", error));
  });

  

  document.body.appendChild(tooltip);


  useEffect(() => {

    const map = new maplibregl.Map({
      container: "map", // Div donde se cargará el mapa
      style: "https://demotiles.maplibre.org/style.json", // Mapa base estilo MapLibre
      center: [-75.5, 6.7], // Coordenadas iniciales
      zoom: 6.7, // Nivel de zoom inicial
      maxZoom: 6.7,
      minZoom: 6.7,
      bearing: -90, // Rotación inicial en grados
      dragRotate: false, // Desactiva rotación con el mouse
      touchZoomRotate: false, // Desactiva rotación con gestos táctiles
    });


    //Traemos capas

    
    //Cuenca cauca
    traerCapa(map,"http://localhost:4000/api/v1/location/cuencaCauca","cuencaCauca","capa-cuencaCauca","#ff0000");
    
    //Nodo oriente de cali
    traerCapa(map,"http://localhost:4000/api/v1/location/nodoOrienteCali","NodoOrienteCaliCapa","capa-NodoOrienteCali","#ff0000");

    //Nodo villa rica
    traerCapa(map,"http://localhost:4000/api/v1/location/nodovilla","nodovilla","capa-nodovilla","#ff0000");

    //Nodo suarez
    traerCapa(map,"http://localhost:4000/api/v1/location/nodoSuarez","NodoSuarez","capa-NodoSuarez","#ff0000");

    //Nodo sur geografico
    traerCapa(map, "http://localhost:4000/api/v1/location/Sur","surGeografico","capa-surGeografico","#ff0000");


    //Cuenca Alta Rio Cauca
    traerCapa(map,"http://localhost:4000/api/v1/location/Cuenca Alta Del Cauca","cuencaAltaRioCauca","capa-cuencaAltaRioCauca","#ff0000");

    //Cuenca baja del rio cauca
    traerCapa(map,"http://localhost:4000/api/v1/location/bajo%20cauca","bajoCauca","capa-bajoCauca","#ff0000");
    
    
    //Rio magdalena
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio magdalena","rioMagdalena","capa-rioMagdalena","#ff0000");

    //rio san jorge
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio san Jorge","rioSanJorge","capa-rioSanJorge","#ff0000");

    //Rio cesar
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio cesar" ,"rioCesar","capa-rioCesar","#ff0000");

    //Rio Nechi
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio Nechi","rioNechi","capa-rioNechi","#ff0000");

    //Rio Anchicaya
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio Anchicaya","rioAnchicaya","capa-rioAnchicaya","#ff0000");

    //Rio San juan
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio San juan","rioSanJuan","capa-rioSanJuan","#ff0000");

    // Rio San Atrato
    //traerCapa(map,"http://localhost:4000/api/v1/location/Rio atrato","rioAtrato","capa-rioAtrato","#ff0000");
    
    //Nevados
    //traerCapa(map,"http://localhost:4000/api/v1/location/Nevados","nevados","capa-nevados","#ff0000");

  
    
   
    

    map.dragPan.disable(); // Desactiva arrastrar con el mouse
    map.scrollZoom.disable(); // Desactiva zoom con scroll del mouse
    map.touchZoomRotate.disable(); // Desactiva zoom y rotación con gestos táctiles
    map.doubleClickZoom.disable(); // Desactiva zoom con doble clic

    // Agregar las capas al mapa
    map.on("load", () => {
      // Agregar la capa GeoJSON

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
        url: "/assets/mapa2.jpeg",
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
          "raster-opacity": 0.8,
        },
        gestureHandling: "none", // Deshabilita gestos táctiles
        tilt: 0, // Desactiva la inclinación (rotación en 3D)
      });
    });
  }, []);
   

  return (
    <div id="cap1">
      <SidebarMain />
      
      <SidebarBottom />
      <div id="map"></div>
      <CheckboxList />
    </div>
  );
};


export default Mapa2;
