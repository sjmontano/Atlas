import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MapSkeleton } from "./ui/components/map/MapSkeleton.tsx";

const Atlas = lazy(() => import("./ui/Atlas"));
const MapTestPage = lazy(() => import("./pages/MapTestPage/MapTestPage"));
const IntroPGWComparePage = lazy(() => import("./pages/MapTestPage/IntroPGWComparePage"));

// Página de inicio simple
const HomePage = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontSize: "1.5rem",
      fontFamily: "Arial, sans-serif",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <h1>🌍 Atlas 2.0 - Sistema de Desarrollo</h1>
    <div
      style={{
        fontSize: "1rem",
        opacity: 0.8,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <a
        href="/atlas"
        style={{
          color: "white",
          textDecoration: "underline",
          fontWeight: "bold",
        }}
      >
        🌍 Atlas Visor Completo (Fase 4)
      </a>
      <hr
        style={{
          borderColor: "rgba(255,255,255,0.3)",
          width: "100%",
          margin: "4px 0",
        }}
      />
      <a
        href="/test-maps/intro-pgw-compare"
        style={{
          color: "white",
          textDecoration: "underline",
          fontWeight: "bold",
          background: "rgba(255,255,255,0.15)",
          padding: "4px 10px",
          borderRadius: "6px",
        }}
      >
        🔬 Comparación PGW — Intro (setTransformConstrain test)
      </a>
      <a
        href="/test-maps/intro"
        style={{
          color: "white",
          textDecoration: "underline",
          fontWeight: "bold",
        }}
      >
        🌐 Introducción
      </a>
      <a
        href="/test-maps/chapter1-encuadres"
        style={{ color: "white", textDecoration: "underline" }}
      >
        🗺️ Encuadres Territoriales
      </a>
      <a
        href="/test-maps/chapter1-ecosistemas"
        style={{ color: "white", textDecoration: "underline" }}
      >
        🗺️ Ecosistemas
      </a>
      <a
        href="/test-maps/chapter1-formas-paisaje"
        style={{ color: "white", textDecoration: "underline" }}
      >
        🗺️ Formas del Paisaje
      </a>
      <a
        href="/test-maps/chapter1-bredunco"
        style={{ color: "white", textDecoration: "underline" }}
      >
        🗺️ Bredunco
      </a>
      <a
        href="/test-maps/chapter1-mosaicos-del-agua"
        style={{ color: "white", textDecoration: "underline" }}
      >
        🗺️ Mosaicos del Agua
      </a>
      <a
        href="/test-maps/chapter1-un-rio-cauca"
        style={{ color: "white", textDecoration: "underline" }}
      >
        🗺️ Un Río Cauca, Muchos Mundos
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<MapSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/test-maps" element={<MapTestPage />} />
          <Route path="/test-maps/intro-pgw-compare" element={<IntroPGWComparePage />} />
          <Route path="/test-maps/:mapId" element={<MapTestPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
