import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import mapDefaults from "../data/mapImages/mapDefaults";

/**
 * 🗺️ HOOK useMap - Sistema de mapas con límites automáticos
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 📌 CONFIGURAR LÍMITES RÍGIDOS:
 * ────────────────────────────────────────────────────────────────
 * Para activar los límites automáticos en un mapa:
 *
 * 1. Ve a: src/data/mapImages/mapConfig.js
 * 2. Añade la propiedad: maxBounds: 1
 *
 * Ejemplo:
 * ```javascript
 * tejidosDelAgua: {
 *   initialZoom: 9.17,
 *   dragPan: true,
 *   scrollZoom: true,
 *   maxBounds: 1,  // ← Activa límites automáticos
 * }
 * ```
 *
 * 🎯 AJUSTAR LÍMITES MANUALMENTE:
 * ────────────────────────────────────────────────────────────────
 * Busca en este archivo las líneas 210-220 (aprox):
 *
 * ```javascript
 * // 🔧 FACTORES DE EXPANSIÓN (ajusta estos valores):
 * const expandWest = 1.0;   // Oeste (izquierda) - MÁS = más espacio
 * const expandEast = 1.0;   // Este (derecha) - MÁS = más espacio
 * const expandSouth = 0.5;  // Sur (abajo) - MÁS = más espacio
 * const expandNorth = 0.5;  // Norte (arriba) - MÁS = más espacio
 * ```
 *
 * CÓMO USAR:
 * - Valor 1.0 = sin expansión (límite exacto de la imagen)
 * - Valor 0.5 = reduce el límite a la mitad (MÁS restrictivo)
 * - Valor 1.5 = expande 50% más allá de la imagen (MÁS permisivo)
 *
 * EJEMPLOS:
 * - Se recorta ARRIBA → Aumenta expandNorth (ej: 0.7, 0.8, 1.0)
 * - Se recorta ABAJO → Aumenta expandSouth (ej: 0.7, 0.8, 1.0)
 * - Se recorta IZQUIERDA → Aumenta expandWest (ej: 1.2, 1.5)
 * - Se recorta DERECHA → Aumenta expandEast (ej: 1.2, 1.5)
 *
 * 🛠️ DEBUG:
 * ────────────────────────────────────────────────────────────────
 * En la consola del navegador (F12) verás los límites aplicados
 */

// 📐 Cálculo dinámico de minZoom basado en el tamaño geográfico de la imagen
const calculateDynamicMinZoom = (imageBounds) => {
  const viewportWidth = window.innerWidth;
  const tileSize = 512;
  const imageWidth = Math.abs(imageBounds[1][0] - imageBounds[0][0]);

  const minZoomFromImage = Math.log2((360 * viewportWidth) / (tileSize * imageWidth));
  return Math.max(minZoomFromImage, mapDefaults.minZoom);
};

const useMap = ({
  imageBounds,
  initialZoom,
  initialBearing,
  maxBounds,
  dragRotate,
  touchZoomRotate,
  minZoom,
  maxZoom,
  dragPan,
  scrollZoom,
  flyToSpeed,
  lockRotation,
  inertia,
  mapName, // 🆕 Nombre del mapa para buscar configuración personalizada
  showCoordinates = true, // 🆕 Flag para mostrar/ocultar coordenadas
}) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Valores personalizados o fallback
  const zoom = initialZoom ?? mapDefaults.initialZoom;
  const bearing = initialBearing ?? mapDefaults.initialBearing;
  const shouldApplyMaxBounds = maxBounds === 1;
  const minZoomValue = minZoom ?? calculateDynamicMinZoom(imageBounds);
  const maxZoomValue = maxZoom ?? mapDefaults.maxZoom;

  useEffect(() => {
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },

      dragRotate: dragRotate ?? mapDefaults.dragRotate,
      touchZoomRotate: touchZoomRotate ?? mapDefaults.touchZoomRotate,
      dragPan: dragPan ?? mapDefaults.dragPan,
      scrollZoom: scrollZoom ?? mapDefaults.scrollZoom,
      flyToSpeed: flyToSpeed ?? mapDefaults.flyToSpeed,
      pitchWithRotate: false,
      attributionControl: false,
      bearing,
      lockRotation: lockRotation ?? mapDefaults.lockRotation,
      inertia: inertia ?? mapDefaults.inertia,
      minZoom: minZoomValue,
      maxZoom: maxZoomValue,
    });

    newMap.on("load", () => {
      setMap(newMap);
      setMapLoaded(true);

      // 🛠️ Exponer el mapa globalmente en desarrollo para debugging
      if (typeof window !== 'undefined') {
        window.map = newMap;
        console.log('🗺️ Mapa disponible en consola. Usa: window.map o simplemente map');
        console.log('📍 Comandos útiles:');
        console.log('  - map.getCenter() → Obtener centro actual');
        console.log('  - map.getBounds() → Obtener límites visibles');
        console.log('  - map.getZoom() → Obtener nivel de zoom');
        console.log('🖱️ Haz CLICK en el mapa para ver las coordenadas en ese punto');
      }

      // 🖱️ Mostrar coordenadas al hacer click en el mapa
      newMap.on('click', (e) => {
        const coords = e.lngLat;
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🖱️ COORDENADAS EN EL PUNTO CLICKEADO:');
        console.log(`📍 Longitud: ${coords.lng.toFixed(6)}`);
        console.log(`📍 Latitud: ${coords.lat.toFixed(6)}`);
        console.log(`📋 Formato array: [${coords.lng.toFixed(6)}, ${coords.lat.toFixed(6)}]`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      });

      // 🎯 Crear overlay visual para mostrar coordenadas del mouse en tiempo real
      // Eliminar cualquier instancia previa para evitar superposición
      const existingDisplay = document.getElementById('coords-display');
      if (existingDisplay) {
        existingDisplay.remove();
      }

      if (showCoordinates) {
        const coordsDisplay = document.createElement('div');
        coordsDisplay.id = 'coords-display';
        coordsDisplay.style.cssText = `
          position: fixed;
          top: 20%;
          left: 1%;
           background-color: rgba(0, 132, 168, 0.7);
          color: #F2EEE7;
          padding: 12px 18px;
          border-radius: 6px;
          font-family: 'Noto Sans', sans-serif;
          font-weight: bold;
          font-size: 14px;
          line-height: 1.8;
          z-index: 0;
          pointer-events: none;
          display: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        `;
        document.body.appendChild(coordsDisplay);

        // Mostrar coordenadas al mover el mouse
        newMap.on('mousemove', (e) => {
          const coords = e.lngLat;
          const zoom = newMap.getZoom();
          coordsDisplay.style.display = 'block';
          coordsDisplay.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 6px; color: #EFE3D6; font-size: 12px;"> Coordenadas</div>
            <div style="font-size: 11px; color: #e7e8f2ff;"> Lng: <span style="font-weight: 500;">${coords.lng.toFixed(6)}</span></div>
            <div style="font-size: 11px; color: #F2EEE7;"> Lat: <span style="font-weight: 500;">${coords.lat.toFixed(6)}</span></div>
            <div style="font-size: 11px; color: #F2EEE7;"> Zoom: <span style="font-weight: 500;">${zoom.toFixed(2)}</span></div>

          `;
        });

        // Ocultar cuando el mouse sale del mapa
        newMap.on('mouseleave', () => {
          coordsDisplay.style.display = 'none';
        });
      }

      const bounds = [
        [imageBounds[0][0], imageBounds[0][1]],
        [imageBounds[1][0], imageBounds[1][1]],
      ];

      // Encuadre inicial con bearing y sin animación
      newMap.fitBounds(bounds, {
        padding: 0,
        duration: 0,
        maxZoom: zoom,
        bearing,
      });

      // 🔒 SISTEMA DE LÍMITES AUTOMÁTICOS (si maxBounds === 1)
      if (shouldApplyMaxBounds) {
        setTimeout(() => {
          // 🔧 FACTORES DE EXPANSIÓN - AJUSTA ESTOS VALORES:
          // ═════════════════════════════════════════════════════════════
          // Valores: 0 = límite exacto | Números positivos = MÁS espacio
          const expandWest = 0.48;   // 🔹 Oeste (izquierda) - Ej: 0.1 = 10% más espacio
          const expandEast = 0.48;   // 🔹 Este (derecha) - Ej: 0.2 = 20% más espacio
          const expandSouth = 0.0;  // 🔹 Sur (abajo) - Ej: 0.3 = 30% más espacio
          const expandNorth = 0.0;  // 🔹 Norte (arriba) - Ej: 0.5 = 50% más espacio
          // ═════════════════════════════════════════════════════════════

          // Obtener dimensiones del contenedor (viewport)
          const container = mapContainerRef.current;
          const viewportWidth = container.offsetWidth;
          const viewportHeight = container.offsetHeight;
          const viewportAspectRatio = viewportWidth / viewportHeight;

          // Calcular dimensiones de la imagen en grados
          const imageWidth = bounds[1][0] - bounds[0][0];  // este - oeste
          const imageHeight = bounds[1][1] - bounds[0][1]; // norte - sur
          const imageAspectRatio = imageWidth / imageHeight;

          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📐 CÁLCULO DE LÍMITES AUTOMÁTICOS:');
          console.log(`  🖥️  Viewport: ${viewportWidth}×${viewportHeight} (ratio: ${viewportAspectRatio.toFixed(3)})`);
          console.log(`  🗺️  Imagen ratio: ${imageAspectRatio.toFixed(3)}`);
          console.log(`  � Límites originales de la imagen:`);
          console.log(`     Oeste: ${bounds[0][0].toFixed(6)}, Este: ${bounds[1][0].toFixed(6)}`);
          console.log(`     Sur: ${bounds[0][1].toFixed(6)}, Norte: ${bounds[1][1].toFixed(6)}`);

          // Calcular límites expandidos (oeste/este son negativos, más negativo = más al oeste)
          const west = bounds[0][0] - (imageWidth * expandWest);   // Restar hace más negativo (hacia izquierda)
          const east = bounds[1][0] + (imageWidth * expandEast);   // Sumar hace menos negativo (hacia derecha)
          const south = bounds[0][1] - (imageHeight * expandSouth); // Restar baja latitud (hacia abajo)
          const north = bounds[1][1] + (imageHeight * expandNorth); // Sumar sube latitud (hacia arriba)

          const finalBounds = [
            [west, south],   // (oeste, sur)
            [east, north]    // (este, norte)
          ];

          console.log(`  🔧 Factores de expansión aplicados:`);
          console.log(`     Oeste: +${(expandWest*100).toFixed(0)}%, Este: +${(expandEast*100).toFixed(0)}%, Sur: +${(expandSouth*100).toFixed(0)}%, Norte: +${(expandNorth*100).toFixed(0)}%`);
          console.log('  🔒 Límites finales aplicados:');
          console.log(`     Oeste (izq): ${west.toFixed(6)}`);
          console.log(`     Este (der):  ${east.toFixed(6)}`);
          console.log(`     Sur (abajo): ${south.toFixed(6)}`);
          console.log(`     Norte (arriba): ${north.toFixed(6)}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

          // Aplicar maxBounds calculados
          // newMap.setMaxBounds(finalBounds);

          // 🛡️ RESTRICCIÓN DE MOVIMIENTO - DESACTIVADA
          // La lógica de límites ahora se maneja de forma centralizada y dinámica en BaseMapImage.jsx
          // usando map.cameraForBounds y map.setMaxBounds con padding inteligente.
          // Esto evita conflictos entre listeners manuales y el motor de física de MapLibre.

          /*
          const enforceStrictBounds = () => {
            // ... lógica anterior eliminada para evitar bloqueos de zoom ...
          };
          newMap.on('move', enforceStrictBounds);
          newMap.on('zoom', enforceStrictBounds);
          */

        }, 100);
      }
    });

    return () => {
      // Limpiar el overlay de coordenadas al desmontar el mapa
      const coordsDisplay = document.getElementById('coords-display');
      if (coordsDisplay) {
        coordsDisplay.remove();
      }
      newMap.remove();
    };
  }, [
    imageBounds,
    zoom,
    bearing,
    minZoomValue,
    maxZoomValue,
    dragRotate,
    touchZoomRotate,
    dragPan,
    scrollZoom,
    flyToSpeed,
    lockRotation,
    inertia,
    shouldApplyMaxBounds,
    showCoordinates,
  ]);

  return { map, mapLoaded, mapContainerRef };
};

export default useMap;
