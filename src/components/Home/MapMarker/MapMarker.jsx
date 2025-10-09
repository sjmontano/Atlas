import PropTypes from "prop-types";
import "./MapMarker.css";
import fondoMarker from "../../../../public/assets/svg/sidebar-resources/fondoIcon1.svg";
import marker from "../../../../public/assets/svg/sidebar-resources/marker1.svg";

const MapMarker = () => {
  return (
    <div className="map-marker-wrapper">
      <img src={fondoMarker} className="map-marker fondo" alt="Fondo" />
      <img src={marker} className="map-marker icono" alt="Marker" />
    </div>
  );
};

MapMarker.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

export default MapMarker;
