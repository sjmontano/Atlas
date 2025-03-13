import PropTypes from 'prop-types'; // Asegúrate de importar PropTypes
import { BsQuestionCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./ContentInfo.css";

const ContentInfo = ({ title, subtitle, description, image, logo }) => {
  return (
    <div
      className="content-info__container"
    >

      <img className='img-fondo' src={image} alt="" />
      <header className='header-home'>
        <a href="#">
          <img src={logo} className='header-home-logo' alt="Logo" />
        </a>
      </header>
      <div className="content-info__content">
      <div className="mapa-image-mini">
          <img src="./public/assets/img/background/mapitaColombia.png" alt="" />
      </div>
        <section className="content-titles">
          <h1 className="home-title">{title}</h1>
          <h3 className="home-subtitle">{subtitle}</h3>
        </section>
        <p className="home-description">{description}</p>
        
      </div>
    </div>
  );
};

ContentInfo.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
};

export default ContentInfo;