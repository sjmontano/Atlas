import PropTypes from "prop-types";
import MapMarker from "./MapMarker";
import "./MapMarker.css";

const LocationMarker = ({ id, title, image, texto, openModal }) => {


  const mouseEnter = ()=>{
      var tool = document.getElementById("tooltip-marker");
      tool.style.display = "block";
      
  }
  const mouseLeave = ()=>{
    var tool = document.getElementById("tooltip-marker");
    tool.style.display = "none";
    
}

  return (
    <div key={id} className="location-marker">
      <button
        id={id}
        className="location-marker-button"
        onClick={() => openModal(title, texto, image, id)}
        onMouseEnter={() =>mouseEnter
        }
        onMouseLeave={() =>mouseLeave
        }
      >
        <MapMarker size="15px" color="#167a4f" />
        <span className="tooltip-marker" >{title.replace(" ", "\n")}</span>
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