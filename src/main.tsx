import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Precarga los chunks de ruta en cuanto el navegador queda libre,
// sin bloquear el primer render. Esto elimina el retraso de red
// al navegar por primera vez a /atlas o /map-test.
const preloadRoutes = () => {
  void import("./ui/Atlas");
  void import("./pages/MapTestPage/MapTestPage");
};

if (document.readyState === "complete") {
  preloadRoutes();
} else {
  window.addEventListener("load", preloadRoutes, { once: true });
}

// NOTA: StrictMode removido temporalmente para evitar doble renderizado
// en mapas que cargan recursos pesados (imágenes georreferenciadas)
createRoot(document.getElementById("root")!).render(<App />);
