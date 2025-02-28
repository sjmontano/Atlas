import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Importamos App.jsx

import "../src/assets/styles/Global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App /> {/* Ahora manejamos la navegación aquí */}
  </StrictMode>
);
