import React,{ useState } from "react";
import FondoTooltip from "../../../public/assets/svg/sidebar-resources/FondoTooltip4.webp";
import InfoModal from "../Home/Modal/modalinfo";
import modalData from "../Home/Modal/modalsData";


const agregarCapas = (map, setIsChapterOpen, mapLayers , selectedMap,setIsModalOpen,handleCloseModal) => {

  var modalIndex=24;


  let isOpen=false;
  

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-marker"; // Asignar una clase para el estilo
  tooltip.style.position = "absolute";

  tooltip.style.alignContent = "center";
  tooltip.style.justifyContent = "center";

  tooltip.style.color = "white";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "14px";
  tooltip.style.display = "none"; // Ocultarlo inicialmente
  tooltip.style.zIndex = "10100";

  document.body.appendChild(tooltip);

  const traerCapa = (url, nombre, idCapa, color, zIndex) => {
    fetch(url)
      .then((response) => response.json()) // Convertir la respuesta a JSON
      .then((data) => {
        const geoJsonLayer = data.geoCollection;

        // Determinar si la capa es un río (línea) o una zona geográfica (relleno)
        const isRiver = idCapa.startsWith("rio");
        const isEncuadre = nombre.includes("Encuadre");

        map.addSource(nombre, {
          type: "geojson",
          data: geoJsonLayer,
        });

        // Configurar la capa como línea si es "Cuenca Cauca"
        const isCuencaCauca =
          idCapa === "rioCuencaCauca" || idCapa === "cuencaCauca";

        map.addLayer({
          id: idCapa,
          type: isRiver || isCuencaCauca ? "line" : "fill", // Configurar como línea o relleno
          source: nombre,
          paint:
             isRiver || isCuencaCauca
              ? {
                  "line-color": color,
                  "line-width": 15,
                  "line-opacity": 0, // Opacidad de la línea
                }
              : {
                  "fill-color": color,
                  "fill-opacity": 0,
                },
          layout: {
            visibility: "visible",
          },
          zIndex: zIndex,
        });

        if (isEncuadre) {
          map.on("click", idCapa, () => {
            console.log(idCapa);
            setIsChapterOpen(false);
          });
        }

        // Evento para mostrar tooltip con el nombre de la capa
        map.on("mousemove", idCapa, (e) => {
          if (e.features && e.features.length > 0) {
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
              tooltip.innerHTML = `
                                          <div className="tooltip-marker" style="
                                          
                              position: absolute;
                              top: 1.5vh;              /* justo arriba del botón */
                              left: 0;
                              transform: translateX(-50%);
                              margin-bottom: 4px;        /* pequeño espacio opcional */
                              display: block;

                              padding: 4px 8px;
                              font-size: 0.9rem;
                              color: white;
                              border-radius: 4px;
                              white-space: nowrap;
                              z-index: 5;

                              background: rgba(0, 0, 0, 0.75); /* fondo oscuro visible */
                              align-items: center;
                              justify-content: center;

                              /* Si quieres que el texto e imagen estén superpuestos */
                              position: absolute;
                                          ">
                          <span>
                              <React.Fragment>
                              ${nombreCapa}
                                <br />
                              </React.Fragment>
                          </span>
                          <img src=${FondoTooltip} alt=""  style="
                                                  
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                          z-index: -1;
                          top: 0;
                          left: 0;

                          border: 2px solid rgba(0, 110, 150, 1);         /* 🟢 AÑADIR BORDE AQUÍ */
                          border-radius: 6px;              /* Opcional: redondear las esquinas */
                                                  "/>
                                                </div>

              
                                    `;
            } else {
              tooltip.style.display = "none"; // No mostrar tooltip si no hay nombre
            }
          }
        });

        // Evento para ocultar el tooltip cuando el mouse sale de la capa
        map.on("mouseleave", idCapa, () => {
          tooltip.style.display = "none";
        });

        // Evento para ocultar el tooltip cuando el mouse sale de la capa
        map.on("click", idCapa, () => {
          setIsModalOpen(true);
          if(idCapa=="valleAltoDelRioCauca"){
          modalIndex==24;
          console.log(modalIndex);

          }
        });
        

      })
      .catch((error) => console.error("Error al obtener mensajes:", error));
  };

  // Agregar las capas al mapa
  mapLayers.forEach((mapLayer) => {
    if (mapLayer.name) {
      traerCapa(mapLayer.url, mapLayer.name, mapLayer.id, mapLayer.color);
    }
  });

  return(
    <div>
      
      {(selectedMap==1 )  && <InfoModal onClose={handleCloseModal}  datos={modalData[modalIndex]}/> }
    </div>
  );
};

export default agregarCapas;
