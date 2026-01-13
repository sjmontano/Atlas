import { ICONS } from "@icons/icons.js";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

// Importamos las imágenes de fondo para los diferentes tamaños
import bgShort from "../../../public/assets/img/background/tituloPequeñoMapas.webp";
import bgMedium from "../../../public/assets/img/background/aguas3.webp";
import bgLong from "../../../public/assets/img/background/tituloMapa2.webp";

/**
 * Header: Encabezado del atlas. Muestra un botón de regreso y un título dinámico.
 *
 * Props:
 * - title: Texto que se mostrará como título del header.
 * - backLink: Ruta de regreso. Por defecto, "/".
 * - index: Índice del mapa actual. Si es distinto de 0, no navega, solo llama onMapChange.
 * - onMapChange: Función para cambiar de mapa sin navegación.
 * - bgImage: (Opcional) Imagen de fondo específica. Si no se pasa, se calcula automáticamente.
 */
const Header = ({ title="", backLink = "/", index = 0, onMapChange, bgImage, props=null}) => {
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

  // Lógica para determinar la imagen de fondo según la longitud del título
  let backgroundToUse = bgImage;

  if (!backgroundToUse && title) {
    // Convertimos el título a string por si acaso es un objeto o componente
    const titleText = typeof title === 'string' ? title : String(title);
    const length = titleText.length;

    if (length < 20) {
      backgroundToUse = bgShort; // Imagen para textos cortos
    } else if (length < 40) {
      backgroundToUse = bgMedium; // Imagen para textos medianos
    } else {
      backgroundToUse = bgLong; // Imagen para textos largos
    }
  }


  return (
    <header className="header">
      <div className={`header-left-group ${backgroundToUse ? "has-bg" : ""}`} style= { props && index==0?{height:"14vh"}:{}}>
        {backgroundToUse && <img src={backgroundToUse}  style={props && index==0?{height:"14vh"}:{}} className="header-bg-image" alt="" />}
        {resolvedBackLink && (
          <Link
            to={resolvedBackLink}
            onClick={handleBackClick}
            className="header-back"
            aria-label="Regresar"
          >
            <img
              src={ICONS.line.back.svg}
              alt="Regresar"
              className="back-icon-img"
              role="button"
            />
          </Link>
        )}

        {/* Solo se muestra el título definido por props| */}
        <div className="header-title-wrapper">
          <div className="header-title" style= { props && index==0  ?{marginTop:"1.5vw"}:{}} >{title}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
