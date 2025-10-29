// 🔒 Configuración manual de límites (maxBounds) para cada mapa
// Define las coordenadas exactas donde el usuario puede navegar
// Formato: [[oeste, sur], [este, norte]]

const mapBoundsConfig = {
  
  // 🗺️ tejidosDelAgua - Coordenadas de la imagen completa
  // Usar las coordenadas reales de la imagen calculadas desde pgwData
  // Punto inicial (esquina sup-izq): -76.968456, 2.161909
  // Los límites verticales ahora cubren toda la altura de la imagen


  // 📝 Cómo encontrar las coordenadas correctas:
  // 1. Abre el mapa en el navegador
  // 2. Abre la consola (F12)
  // 3. Navega hasta donde quieres que esté el límite
  // 4. Escribe: map.getCenter() para obtener las coordenadas
  // 5. Repite para cada esquina (izquierda, derecha, arriba, abajo)
  
  // 🎯 Tips para ajustar:
  // - Si se sale mucho por IZQUIERDA: aumenta el primer valor (más negativo)
  // - Si se sale mucho por DERECHA: reduce el tercer valor (menos negativo)
  // - Si se sale mucho por ABAJO: reduce el segundo valor
  // - Si se sale mucho por ARRIBA: aumenta el cuarto valor
  
  // Agrega más mapas aquí con el mismo formato:
  // nombreDelMapa: [[oeste, sur], [este, norte]],
};

export default mapBoundsConfig;
