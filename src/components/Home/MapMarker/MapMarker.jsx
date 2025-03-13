import PropTypes from "prop-types";
import { TiLocation   } from "react-icons/ti";
import "./MapMarker.css";

const MapMarker = ({ color, size }) => {
  return (
    <div>
      <TiLocation   color="#7B3327" size="32px" className="map-marker" />
    </div>
  );
};

MapMarker.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

export default MapMarker;