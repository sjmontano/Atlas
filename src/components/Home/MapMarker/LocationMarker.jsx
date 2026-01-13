import PropTypes from "prop-types";
import MapMarker from "./MapMarker";
import React from "react";
import "./MapMarker.css";
import img from "../../../../public/assets/svg/sidebar-resources/FondoTooltip4.webp";

const LocationMarker = ({ id, title, image, texto, openModal, top, left, delay }) => {
  return (
    <div className="location-marker" style={{ top, left, position: "absolute" }}>
      <button
        className="location-marker-button"
        style={{ animationDelay: delay }}
        onClick={() => openModal(title, texto, image, id)}
      >
        <MapMarker />
          <div className="homeTooltip-marker">
            <span>
              {title.split("\n").map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </span>
            <img src={img} alt="" />
          </div>
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
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  delay: PropTypes.string.isRequired,
};

export default LocationMarker;
