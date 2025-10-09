const mapDefaults = {
  initialZoom: 6, // Nivel de zoom inicial del mapa al cargar
  initialBearing: -90, // Orientación inicial del mapa en grados (0 es norte, 90 es este, -90 es oeste)
  dragRotate: false, // Habilitar/deshabilitar la rotación del mapa mediante arrastre
  touchZoomRotate: false, // Habilitar/deshabilitar el zoom y la rotación mediante gestos táctiles
  maxZoom: 20, // Nivel máximo de zoom permitido
  dragPan: false, // Habilitar/deshabilitar el arrastre del mapa
  scrollZoom: false, // Habilitar/deshabilitar el zoom con el scroll del mouse
  flyToSpeed: 0, // Velocidad de la animación cuando el mapa se mueve (0 significa sin animación)
  lockRotation: false, // Si es `true`, el usuario no podrá rotar el mapa
  inertia: false, // Habilitar/deshabilitar el deslizamiento con inercia al mover el mapa
  minZoom: 7, // Nivel mínimo de zoom permitido
  shadow: false, // Habilitar/deshabilitar la sombra en el mapa
  maxBounds: null, // Permitir definir manualmente maxBounds
 
};

export default mapDefaults;