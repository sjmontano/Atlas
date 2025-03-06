import PropTypes from "prop-types";
import MapMarker from "./MapMarker";
import "./MapMarker.css";

const LocationMarker = ({ id, title, image, texto, openModal }) => {
  return (
    <div key={id} className="location-marker">
      <h4 id={`${id}Title`} className="location-title">{title.replace(" ", "\n")}</h4>
      <button
        id={id}
        className="location-marker-button"
        onClick={() => openModal(title, texto, image, id)}
        onMouseEnter={() =>
          (document.getElementById(`${id}Title`).style.display = "block")
        }
        onMouseLeave={() =>
          (document.getElementById(`${id}Title`).style.display = "none")
        }
      >
        <MapMarker size="15px" color="#167a4f" />
      </button>
    </div>
  );
};

LocationMarker.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  texto: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default LocationMarker;