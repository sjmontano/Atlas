// Este será el mapa 3

import maplibregl from "maplibre-gl";
import { useState } from "react";
import FondoTooltip3 from "../../../public/assets/svg/sidebar-resources/FondoTooltip3.webp";
import FondoTooltip4 from "../../../public/assets/svg/sidebar-resources/FondoTooltip4.webp";
import InfoModal from "../Home/Modal/modalinfo";
import modalData from "../Home/Modal/modalsData";
import ModalImagen from "../Home/Modal/ModalImagen";

const agregarEncuadres = ({map, setIsChapterOpen, onMapChange, Encuadres, names,mapName, selectedMap}) => {

  
 
  
    // Estado para controlar la apertura del modal de información
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para saber qué índice de modal mostrar
    const [modalIndex, setModalIndex] = useState(null);

     // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClick = (index) => {
    console.log(names[index].texto);
    const texto = names[index].texto;

    setIsChapterOpen(false); // Cierra el capítulo actual

    if (texto === "Un río Cauca, muchos mundos... <br>en transición") {
      onMapChange(5); // Cambia al mapa de "Tejidos del agua" (índice 4)
    } else if (texto === "Mosaico de <br>cuencas y aguas") {
      onMapChange(4); // Cambia al mapa de "Tejidos del agua" (índice 4)
    } else if (
      texto === "Existencias y transformaciones ecosistémicas"
    ) {
      onMapChange(3); // Cambia al mapa de "Ecosistemas" (índice 3)
    } else if (
      texto === "Pliegues, llanuras<br> y otras formas del paisajes"
    ) {
      onMapChange(2); // Cambia al mapa de "Ecosistemas" (índice 3)
    } else if (texto === "Bredunco, Caucayaco o <br>Cauca en la vertiente del Caribe") {
      onMapChange(1); // Cambia al mapa de "Ecosistemas" (índice 3)
    } else if (texto === "Se encharca arriba se deseca abajo") {
      onMapChange(4); // Cambia al mapa de "Tejidos del agua" (índice 4)
    } else if (texto === "Nos encharcaron el río") {
      onMapChange(2); // Cambia al mapa de "Tejidos del agua" (índice 4)
    } else if (
      texto === "Cali deseca"
    ) {
      onMapChange(3); // Cambia al mapa de "Ecosistemas" (índice 3)
    } else if (
      texto === "Monocultivo de caña de azúcar"
    ) {
      onMapChange(1); // Cambia al mapa de "Ecosistemas" (índice 3)
    } else if (
      texto === "Aguas que llegan"
    ) {
      onMapChange(5); // Cambia al mapa de "Ecosistemas" (índice 3)
    } else if (
      texto === "Tramo 1: Buenos Aíres - Yumbo"
    ) {
      setModalIndex(index + 59);
          setIsModalOpen(true);
    } else if (
      texto === "Tramo 2: Yumbo - San Pedro"
    ) {
      setModalIndex(index + 59);
          setIsModalOpen(true);
    } else if (
      texto === "Tramo 3. San Pedro - Zarzal"
    ) {
      setModalIndex(index + 59);
          setIsModalOpen(true);
    } else if (
      texto === "Tramo 4: Zarzal - La Victoria"
    ) {
      setModalIndex(index + 59);
          setIsModalOpen(true);
    } else if (
      texto === "Tramo 5"
    ) {
      setModalIndex(index + 58);
          setIsModalOpen(true);
    } else {
      onMapChange(index);
    }
  };
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.background = "rgba(0, 0, 0, 0.7)"; // Fondo negro semitransparente
  tooltip.style.color = "white"; // Texto blanco
  tooltip.style.padding = "5px 10px"; // Espaciado interno
  tooltip.style.borderRadius = "4px"; // Bordes redondeados
  tooltip.style.fontSize = "12px"; // Tamaño de fuente
  tooltip.style.display = "none"; // Ocultarlo inicialmente
  tooltip.style.zIndex = "10100"; // Asegurar que esté por encima de otros elementos
  tooltip.style.pointerEvents = "none"; // Evitar interferencias con el mouse

  document.body.appendChild(tooltip);

  const traerCapa = (
    url,
    nombre,
    idCapa,
    color,
    tooltipOffset = { x: 10, y: 10 },
    index
  ) => {
    fetch(url)
      .then((response) => response.json()) // Convertir la respuesta a JSON
      .then((data) => {
        const geoJsonLayer = data.geoCollection;

        // Determinar si la capa es un "Encuadre"
        const isEncuadre = nombre.includes("Encuadre");

        if (map.getLayer(idCapa)) {
          map.removeLayer(idCapa);
        }
        if (map.getSource(nombre)) {
          map.removeSource(nombre);
        }

        map.addSource(nombre, {
          type: "geojson",
          data: geoJsonLayer,
        });

        map.addLayer({
          id: idCapa,
          type: isEncuadre ? "line" : "fill",
          source: nombre,
          paint: isEncuadre
            ? {
                "line-color": color,
                "line-width": 3,
                "line-dasharray": [2, 1], // Línea punteada
              }
            : {
                "fill-color": color,
                "fill-opacity": 0.5,
              },
          layout: {
            visibility: "visible", // Mostrar todas las capas por defecto
          },
        });

        if (isEncuadre) {
          map.on("click", idCapa, () => {
            handleClick(index);
          });
        }

        const popup = new maplibregl.Popup({
          closeButton: false, // Desactiva el botón de cerrar en el popup
          closeOnClick: false, // No cerrar el popup al hacer clic en el mapa
          offset: [0, 0], // Aseguramos que el popup no se desplace con el zoom
        }).setHTML(`

          <div class="encuadresTooltip-marker" style="
              ${mapName=="introduccionCap3" ? "TRANSFORM: rotate(19deg);":""}
              position: absolute;
              left: 0;
              margin-bottom: 4px;        /* pequeño espacio opcional */
              display: block;
              padding: 8px 8px;
              font-size: 0.9rem;


              white-space: nowrap;
              z-index: 5;
              font-weight: 500;

              align-items: center;
              justify-content: center;

              /* Si quieres que el texto e imagen estén superpuestos */
              position: absolute;
              "
              onmouseenter="this.querySelector('img').src='${FondoTooltip3}'; 
                this.querySelector('h3').style.color='#193965';"
            onmouseleave="this.querySelector('img').src='${FondoTooltip4}'; this.querySelector('h3').style.color='white';
          
                 "
              >
              <h3 style='min-width:105px; text-align:center; font-size:1.8vh; line-height: 2vh; font-family: "Noto Sans", sans-serif; font-style: italic; font-weight: 500;'>
                  <React.Fragment>
                 ${names[index].texto}
              <br />
                  </React.Fragment>
              </h3>
              <img  class="encuadresTooltip-marker"  src=${FondoTooltip4} alt=""  style="
              
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
        top: 0;
        left: 0;
        border-radius: 6px;            /* Opcional: redondear las esquinas */
              "/>
            </div>
            `); // El texto del tooltip que será siempre visible

        // Posicionar el popup (tooltip) en las coordenadas especificadas
        popup.setLngLat(names[index].coords).addTo(map); // Coordenadas de Bogotá

        setTimeout(() => {
          const popupTexto = popup
            .getElement()
            .querySelector(".encuadresTooltip-marker");
          if (popupTexto) {
            popupTexto.addEventListener("click", () => {
              console.log("Tooltip clickeado con querySelector");
              handleClick(index);
            });
          }
        }, 0);

        console.log(`Capa "${idCapa}" agregada exitosamente.`);
      })
      .catch((error) => console.error("Error al obtener mensajes:", error));
  };

  // Agregar las capas al mapa
  Encuadres.forEach((encuadre, index) => {
    if (encuadre.name) {
      traerCapa(
        encuadre.url,
        encuadre.name,
        encuadre.id,
        "#193965",
        encuadre.tooltipOffset,
        index
      );
    }
  });

  if (Encuadres.length != 0) {
    const popupEncuadreFaltante = new maplibregl.Popup({
      closeButton: false, // Desactiva el botón de cerrar en el popup
      closeOnClick: false, // No cerrar el popup al hacer clic en el mapa
      offset: [-72.8, -500.75], // Aseguramos que el popup no se desplace con el zoom
    }).setHTML(
      `
          
          

          <div class="encuadresTooltip-marker" style="
              
  position: absolute;
  left: 0;
  margin-bottom: 4px;        /* pequeño espacio opcional */
  display: block;
  font-size:1.8vh;
  padding: 8px 8px;
  white-space: nowrap;
  z-index: 5;

  align-items: center;
  justify-content: center;

  /* Si quieres que el texto e imagen estén superpuestos */
  position: absolute;
              "
              onmouseenter="this.querySelector('img').src='${FondoTooltip3}'; 
                            this.querySelector('h3').style.color='#193965';"
            onmouseleave="this.querySelector('img').src='${FondoTooltip4}'; this.querySelector('h3').style.color='white';
                             "
              >
                          <h3 style='min-width:105px; text-align:center; font-size:1.8vh; line-height: 2vh; font-family: "Noto Sans", sans-serif; font-style: italic; font-weight: 500;'>
                              <React.Fragment>
                             ${names[4].texto}
                                <br />
                              </React.Fragment>
                          </h3>
                          <img  class="encuadresTooltip-marker"  src=${FondoTooltip4} alt=""  style="
                          
  position: absolute;
  width: 100%;

  height: 100%;
  object-fit: cover;
  z-index: -1;
  top: 0;
  left: 0;       /* 🟢 AÑADIR BORDE AQUÍ */
  border-radius: 6px;              /* Opcional: redondear las esquinas */
                          "/>
                        </div>
                        `
    ); // El texto del tooltip que será siempre visible

    // Posicionar el popup (tooltip) en las coordenadas especificadas
    popupEncuadreFaltante.setLngLat(names[4].coords).addTo(map); // Coordenadas de Bogotá

    setTimeout(() => {
      const popupTexto = popupEncuadreFaltante
        .getElement()
        .querySelector(".encuadresTooltip-marker");
      if (popupTexto) {
        popupTexto.addEventListener("click", () => {
          console.log("Tooltip clickeado con querySelector");
          handleClick(4);
        });
      }
    }, 0);
  } else {
    console.log("no");
  }

  


  return (
    <>
      {isModalOpen &&
        modalIndex !== null &&
        (selectedMap != 3 ||
          mapName == "arcilla" ||
          mapName == "caliDeseca") && (
          <ModalImagen onClose={handleCloseModal} datos={modalData[modalIndex]} />
        )}
    </>
  );
};

export default agregarEncuadres;
