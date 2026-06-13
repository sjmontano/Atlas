import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 🗺️ MAPA CON GEORREFERENCIACIÓN MAPLIBRE GL
 * ==========================================
 */

// Datos de georreferenciación PGW para encuadres
const PGW_DATA = [
  0.0, // Scale X
  0.002291904891, // Rotation Y
  0.002292263474, // Rotation X
  -0.0, // Scale Y (negativo)
  -79.441458743296, // Origin X
  -1.354624163443, // Origin Y
];

// Dimensiones conocidas de la imagen (necesarias para cálculo de bounds)
const IMAGE_WIDTH = 3508;
const IMAGE_HEIGHT = 2476;

/**
 * Convierte datos PGW a bounds [west, south, east, north]
 */
function pgwToBounds(
  pgw: number[],
  width: number,
  height: number,
): [number, number, number, number] {
  const [a, d, b, e, c, f] = pgw;

  // Esquinas de la imagen en coordenadas de pixel
  const corners = [
    [0, 0], // Top-left
    [width, 0], // Top-right
    [width, height], // Bottom-right
    [0, height], // Bottom-left
  ];

  // Transformar cada esquina usando la matriz de transformación PGW
  const geoCorners = corners.map(([x, y]) => [
    a * x + b * y + c, // Longitud
    d * x + e * y + f, // Latitud
  ]);

  // Encontrar bounds
  const lngs = geoCorners.map((corner) => corner[0]);
  const lats = geoCorners.map((corner) => corner[1]);

  return [
    Math.min(...lngs), // west
    Math.min(...lats), // south
    Math.max(...lngs), // east
    Math.max(...lats), // north
  ];
}

const SimpleMapViewer = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scheduleError = useCallback((message: string) => {
    queueMicrotask(() => {
      setError(message);
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log("🎯 Inicializando mapa con georreferenciación...");

      // Calcular bounds de la imagen usando datos PGW
      const bounds = pgwToBounds(PGW_DATA, IMAGE_WIDTH, IMAGE_HEIGHT);
      console.log("📍 Bounds calculados:", bounds);

      // Inicializar mapa MapLibre
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {},
          layers: [],
        },
        bounds: bounds,
        fitBoundsOptions: { padding: 20 },
      });

      map.current.on("load", () => {
        console.log("✅ Mapa base cargado");

        if (!map.current) return;

        // Añadir imagen georreferenciada
        const imageUrl = "/assets/maps/base-images/chapter1/encuadres.webp";

        map.current.addSource("georeferenced-image", {
          type: "image",
          url: imageUrl,
          coordinates: [
            [bounds[0], bounds[3]], // Top-left [lng, lat]
            [bounds[2], bounds[3]], // Top-right [lng, lat]
            [bounds[2], bounds[1]], // Bottom-right [lng, lat]
            [bounds[0], bounds[1]], // Bottom-left [lng, lat]
          ],
        });

        map.current.addLayer({
          id: "georeferenced-layer",
          type: "raster",
          source: "georeferenced-image",
          paint: {
            "raster-opacity": 1,
          },
        });

        setMapLoaded(true);
        console.log("🗺️ Imagen georreferenciada añadida exitosamente");
      });

      map.current.on("error", (e) => {
        console.error("❌ Error en el mapa:", e);
        const detail = e.error?.message ?? "Error desconocido";
        scheduleError(`Error del mapa: ${detail}`);
      });
    } catch (err: unknown) {
      console.error("❌ Error inicializando mapa:", err);
      const detail = err instanceof Error ? err.message : String(err);
      scheduleError(`Error de inicialización: ${detail}`);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [scheduleError]);

  if (error) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fee",
          color: "#c33",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <div>
          <h3>❌ Error en el mapa</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {!mapLoaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.9)",
            padding: "1rem 2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>🗺️</div>
            <div>Cargando mapa georreferenciado...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMapViewer;
