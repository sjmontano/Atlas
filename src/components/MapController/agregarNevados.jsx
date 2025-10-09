// Este será el mapa 3
import maplibregl from "maplibre-gl";
import { getMapTooltip } from "../../utils/mapTooltip";

const agregarNevados = (map, Nevados) => {
  const tooltip = getMapTooltip(); // Usar el tooltip unificado

  const markers = []; // Almacenar referencias de los marcadores

  const updateTooltipPosition = (coords, event) => {
    // Convertir coordenadas a posición en píxeles del mapa
    const pixel = map.project(coords);
    const canvas = map.getCanvas();
    const rect = canvas.getBoundingClientRect();
    
    // Calcular posición relativa al viewport
    tooltip.style.left = `${pixel.x + rect.left + 10}px`;
    tooltip.style.top = `${pixel.y + rect.top + 10}px`;
  };

  Nevados.forEach((nevado) => {
    const marker = new maplibregl.Marker({ color: "brown" })
      .setLngLat(nevado.coords)
      .addTo(map);

    const element = marker.getElement();
    element.style.cursor = "pointer";

    // Event handlers
    const handleMouseEnter = (e) => {
      tooltip.style.display = "block";
      tooltip.textContent = nevado.texto;
      updateTooltipPosition(nevado.coords, e);
    };

    const handleMouseMove = (e) => {
      updateTooltipPosition(nevado.coords, e);
    };

    const handleMouseLeave = () => {
      tooltip.style.display = "none";
    };

    // Agregar event listeners
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    // Actualizar posición durante el movimiento del mapa
    const moveHandler = () => {
      if (tooltip.style.display === "block") {
        updateTooltipPosition(nevado.coords);
      }
    };

    map.on("move", moveHandler);

    markers.push({
      marker,
      element,
      handlers: {
        mouseenter: handleMouseEnter,
        mousemove: handleMouseMove,
        mouseleave: handleMouseLeave,
        move: moveHandler
      }
    });
  });

  // Función de limpieza
  return () => {
    markers.forEach(({ marker, element, handlers }) => {
      marker.remove();
      element.removeEventListener("mouseenter", handlers.mouseenter);
      element.removeEventListener("mousemove", handlers.mousemove);
      element.removeEventListener("mouseleave", handlers.mouseleave);
      map.off("move", handlers.move);
    });
  };
};

export default agregarNevados;