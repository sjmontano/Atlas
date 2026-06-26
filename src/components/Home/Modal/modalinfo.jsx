import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import nextIcon from "../../../../public/assets/img/background/iconos/next.svg";
import linea from "../../../../public/assets/svg/inicio/linea.svg";
import salir from "../../../../public/assets/svg/inicio/salir.svg";
import "./modalInfo.css"; // Asegúrate de tener los estilos necesarios
import "./modalSizes.css"; // Importar sistema de tamaños

// Importaciones de imágenes del taller para el carrusel
import taller1 from "../../../../public/assets/img/talleres/taller-1.webp";
import taller2 from "../../../../public/assets/img/talleres/taller-2.webp";
import taller3 from "../../../../public/assets/img/talleres/taller-3.webp";

// Componente de carrusel para el InfoModal
const CarruselTaller = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Array con imágenes y sus descripciones
  const tallerData = [
    {
      image: taller1,
      description: "Foto 1: Taller La intuición espacial y las construcciones geográficas ¿Por qué los mapas importan? Octubre 7 de 2023. Casa Cultural del Niño y de la Niña. Villa Rica, Cauca. Diana Bernal."
    },
    {
      image: taller2,
      description: "Foto 2: Taller Cuando el cuerpo habla: descubriendo relatos territoriales. Enero 17 de 2024. Casa Cultural del Niño y de la Niña. Villa Rica, Cauca. Olga Eusse."
    },
    {
      image: taller3,
      description: "Foto 3: Taller Mundos relacionales y codiseño territorial. Agosto 24 de 2024. Casa Cultural del Niño y de la Niña. Villa Rica. Ana María Rendón."
    }
  ];

  // Efecto para el cambio automático de imágenes
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        nextImage();
      }, 6000); // Tiempo aumentado a 6 segundos
    }
    return () => clearInterval(interval);
  }, [isPaused, currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % tallerData.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + tallerData.length) % tallerData.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="carrusel-taller-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Botón anterior fuera de la imagen */}
      <button
        className="carousel-btn carousel-btn-prev"
        onClick={prevImage}
        aria-label="Imagen anterior"
      >
        <img src={nextIcon} alt="Anterior" style={{ transform: 'rotate(-180deg)' }} />
      </button>

      {/* Contenido central */}
      <div className="carrusel-taller-content">
        <div className="carrusel-taller-image-container">
          <div
            className="carrusel-track"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {tallerData.map((item, index) => (
              <img
                key={index}
                src={item.image}
                alt={`Taller ${index + 1}`}
                className="carrusel-taller-image"
              />
            ))}
          </div>

          {/* Indicadores de puntos */}
          <div className="carousel-indicators">
            {tallerData.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => goToImage(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Descripción de la imagen actual */}
        <div className="carrusel-taller-description">
          <p>{tallerData[currentImageIndex].description}</p>
        </div>
      </div>

      {/* Botón siguiente fuera de la imagen */}
      <button
        className="carousel-btn carousel-btn-next"
        onClick={nextImage}
        aria-label="Siguiente imagen"
      >
        <img src={nextIcon} alt="Siguiente" />
      </button>
    </div>
  );
};

// Componente para el botón de cierre del modal
const CloseButton = ({ onClose, right="0vw", top="30%"}) => (
  <img
    src={salir}
    className="close-btn-modal-info"
    style={{right:right, top:top}}
    id="closeModal-info"
    onClick={onClose}
    alt="Cerrar modal"
  />
);

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
};

// Componente para la cabecera del modal
const Header = ({ icon }) => (
  <div className="icon-info-modal-container">
    {icon}
  </div>
);

Header.propTypes = {
  icon: PropTypes.node.isRequired,
};

// Componente para el contenedor del título
const TitleContainer = ({ maintitle, highLight, titleRef }) => (
  <div className="title-container-modal-info" ref={titleRef}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h3>{maintitle}</h3>
      <span className="highlight-modal-info" style={{whiteSpace:"pre-line"}}>{highLight}</span>
    </div>
    <img src={linea} className="" alt="Línea decorativa" />
  </div>
);

TitleContainer.propTypes = {
  maintitle: PropTypes.string,
  highLight: PropTypes.string,
  titleRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};

// Componente para el botón de texto completo
const TextCompleteButton = ({ link }) => (
  <a
    href={link}
    className="btn-download-modal-info"
    target="_blank"
    rel="noopener noreferrer"
  >
    Texto completo
  </a>
);

TextCompleteButton.propTypes = {
  link: PropTypes.string.isRequired,
};

// Componente para imagen y descripción
const ImageDescription = ({
  image,
  image2,
  image3,
  description,
  description2,
  description3,
}) => {
  return (
    <div className="image-description-modal-info-group">
      {image && (
        <div id="image-description-modal-info-1">
          <img src={image} alt="Descripción 1" />
          <p>{description}</p>
        </div>
      )}
      {image2 && (
        <div id="image-description-modal-info-2">
          <img src={image2} alt="Descripción 2" />
          <p>{description2}</p>
        </div>
      )}
      {image3 && (
        <div id="image-description-modal-info-3">
          <img src={image3} alt="Descripción 3" />
          <p>{description3}</p>
        </div>
      )}
    </div>
  );
};

ImageDescription.propTypes = {
  image: PropTypes.string,
  image2: PropTypes.string,
  image3: PropTypes.string,
  description: PropTypes.string,
  description2: PropTypes.string,
  description3: PropTypes.string,
};

// Componente para el cuerpo del modal
const Body = ({ texto , margin="0 calc(14vw) 0 0"}) => <div className="body-modal-info" style={{margin}} >{texto}</div>;

Body.propTypes = {
  texto: PropTypes.node.isRequired,
};

// Componente para el botón de compartir en redes sociales

// Componente principal del modal
const InfoModal = ({ onClose, datos }) => {
  const titleRef = useRef(null);
  const scrollContentRef = useRef(null);
  const [arrowOpacity, setArrowOpacity] = useState(1);
  const [showBottomFade, setShowBottomFade] = useState(true);

  useEffect(() => {
    console.log(datos)
    if (datos.layaut === "Luyaut2" && titleRef.current) {
      titleRef.current.style.flexDirection = "column";
      titleRef.current.style.alignItems = "start";
    }
  }, [datos.layaut]); // Se ejecuta cuando `datos.layaut` cambia

  useEffect(() => {
    if (datos.id === 1) {
      setArrowOpacity(1);
      // Verificar si hay scroll inicialmente
      if (scrollContentRef.current) {
        const { scrollHeight, clientHeight } = scrollContentRef.current;
        setShowBottomFade(scrollHeight > clientHeight);
      }
    } else {
      setArrowOpacity(0);
      setShowBottomFade(false);
    }
  }, [datos.id, datos]);

  const handleScroll = () => {
    if (scrollContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContentRef.current;

      // La opacidad de la flecha disminuye a medida que se hace scroll (hasta 200px)
      const newOpacity = Math.max(0, 1 - scrollTop / 200);
      setArrowOpacity(newOpacity);

      // El fade desaparece si llegamos al final del scroll
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5;
      setShowBottomFade(!isBottom);
    }
  };

  // Determinar clase de tamaño basada en datos.size
  const getSizeClass = () => {
    if (!datos.size) return 'modal-size-medium'; // Valor por defecto
    return `modal-size-${datos.size}`;
  };

  return (
    <div  className={`modal-info ${getSizeClass()}`} id="modal-info">
      {(datos.id!=55 ) && (

      <div className="modal-content-info">
        {/* Header fijo con icono, título y botón de cierre */}

        <div className="modal-fixed-header">
          <Header icon={datos.icono} />
          <CloseButton onClose={onClose} />


            <TitleContainer
            maintitle={datos.title}
            highLight={datos.highLight}
            titleRef={titleRef}
          />

        </div>

        {/* Contenedor interno con padding y scroll */}
        <div className="modal-inner-content" style={{ position: 'relative', height: '100%' }}>
          <div
            className="modal-scrollable-content"
            ref={scrollContentRef}
            onScroll={handleScroll}
          >
            {/* Carrusel específico para el modal con id: 1 */}
            {datos.id === 1 && <CarruselTaller />}

            {datos.image && datos.id !== 1 && (
              <ImageDescription
                image={datos.image}
                description={datos.description}
              />
            )}
            <Body texto={datos.texto} />
            {/*datos.boton == "" && <TextCompleteButton link={datos.link} />*/}
            <br />
          </div>

          {/* Fade inferior para indicar más contenido */}
          {datos.id === 1 && showBottomFade && (
            <div className="content-fade-bottom"></div>
          )}

          {datos.id === 1 && arrowOpacity > 0 && (
            <div className="scroll-indicator-arrow" style={{ opacity: arrowOpacity }}>
              <img
                src={nextIcon}
                alt="Deslizar hacia abajo"
                style={{ transform: 'rotate(90deg)', width: '30px', height: '30px' }}
              />
            </div>
          )}
        </div>
      </div>
      )
      ||(
        <>
          <CloseButton onClose={onClose} right={"1vw"} top={"3vw"} />
          <Body texto={datos.texto} margin="-4vh 4vh 4vw -1vw"  />
          </>
      )}

    </div>
  );
};

InfoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  datos: PropTypes.shape({
    id: PropTypes.number, // Agregar validación para id
    layaut: PropTypes.string,
    size: PropTypes.string, // Agregar validación para size
    icono: PropTypes.node,
    title: PropTypes.string,
    highLight: PropTypes.string,
    texto: PropTypes.node,
    image: PropTypes.string,
    description: PropTypes.string,
    boton: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    link: PropTypes.string,
  }).isRequired,
};

export default InfoModal;
