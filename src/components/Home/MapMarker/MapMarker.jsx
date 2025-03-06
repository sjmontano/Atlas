import PropTypes from "prop-types";
import { FaCircleDot } from "react-icons/fa6";
import "./MapMarker.css";

const MapMarker = ({ color, size }) => {
  return (
    <div>
      <FaCircleDot color={color} size={size} className="map-marker" />
    </div>
  );
};

MapMarker.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

export default MapMarker;