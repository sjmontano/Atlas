import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ICONS } from "@icons/icons.js";
import fondoLogo from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/icon-frame-1.webp";
import "./Header.css";

/**
 * Header: Encabezado del atlas. Muestra un botón de regreso y un título dinámico.
 *
 * Props:
 * - title: Texto que se mostrará como título del header.
 * - backLink: Ruta de regreso. Por defecto, "/".
 * - index: Índice del mapa actual. Si es distinto de 0, no navega, solo llama onMapChange.
 * - onMapChange: Función para cambiar de mapa sin navegación.
 */
const Header = ({ title, backLink = "/", index = 0, onMapChange }) => {
  const navigate = useNavigate();

  const handleBackClick = (e) => {
    if (index !== 0) {
      e.preventDefault();
      onMapChange(0);
    }
  };

  const resolvedBackLink =
    backLink !== "/chapter1" && backLink !== "/Bienvenidos" && backLink !== "/"
      ? backLink
      : index !== 0
      ? "/chapter1"
      : "/Bienvenidos";

  return (
    <header className="header">
      <div className="header-left-group">
        {resolvedBackLink && (
          <Link
            to={resolvedBackLink}
            onClick={handleBackClick}
            className="header-back"
            aria-label="Regresar"
          >

            {/*(backLink !== "/chapter1" && backLink !== "/Bienvenidos" && backLink !== "/")
            && (<img
              src={fondoLogo}
              alt="Regresar"
              className="back-icon-imgFondo"
              role="button"
            />)*/}
            
            <img
              src={ICONS.line.back.svg}
              alt="Regresar"
              className="back-icon-img"
              role="button"
            />
            
          </Link>
        )}

        {/* Solo se muestra el título definido por props| */}
        <div className="header-title">{title}</div>
      </div>
    </header>
  );
};

export default Header;
