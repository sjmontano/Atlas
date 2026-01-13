import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModalProvider } from "./context/ContextModal";
import { ShadowProvider } from "./context/ShadowContext"; 
import "../public/assets/styles/base.css";
import Resources from '../public/assets/library/resources';

import { UI } from "@ui/uiElements";
import { ICONS } from '@icons/icons';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <ShadowProvider> 
        <App />
      </ShadowProvider>
    </ModalProvider>
  </React.StrictMode>
);
