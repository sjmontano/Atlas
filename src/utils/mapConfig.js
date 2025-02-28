const mapConfig = {
    container: "map", // ID del div donde se cargará el mapa
    style: "https://demotiles.maplibre.org/style.json", // Estilo base del mapa
    center: [-75.5, 5.5], // Coordenadas iniciales
    zoom: 7, // Nivel de zoom inicial
    maxZoom: 7.5,
    minZoom: 7,
    bearing: -90, // Rotación inicial en grados
    dragRotate: false, // Desactiva rotación con el mouse
    touchZoomRotate: false, // Desactiva rotación con gestos táctiles
  };
  
  export default mapConfig;
  