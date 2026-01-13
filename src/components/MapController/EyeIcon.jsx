import PropTypes from "prop-types";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";

const EyeIcon = ({ isHidden, onClick }) => {
  const commonStyle = {
    marginTop: "-4px",
    marginRight: "8px", // Increased spacing from text
    cursor: "pointer",
    width: "3vh",
    height: "3vh",
    zIndex: "3",
    strokeWidth: "0.8", // Thicken lines
  };

  // If layer is hidden (isHidden=true):
  // We show RxEyeClosed with a pulse animation to make it visible.
  if (isHidden) {
    return <RxEyeClosed style={commonStyle} onClick={onClick} className="eye-icon-pulse" />;
  }

  // If layer is visible (isHidden=false):
  return <RxEyeOpen style={commonStyle} onClick={onClick} />;
};

EyeIcon.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EyeIcon;
