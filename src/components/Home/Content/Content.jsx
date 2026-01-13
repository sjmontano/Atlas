import { useMemo } from "react";
import { useModal } from "../../../context/ContextModal";
import Modal from "../Modal/Modal";
import LocationMarker from "../MapMarker/LocationMarker";
import ContentInfo from "./ContentInfo";
import logo from "../../../../public/assets/img/logo/logo.webp";
import placesWithMarkers from "../../../data/modalImages/placesWithMarkers"; // <- IMPORTANTE
import img from "../../../../public/assets/img/background/home.webp";

const Content = () => {
  const { modalData, openModal, closeModal } = useModal();

  return (
    <div className="content">
      {placesWithMarkers.map(({ id, title, image, texto, top, left, delay }) => (
        <LocationMarker
          key={id}
          id={id}
          title={title}
          image={image}
          texto={texto}
          top={top}
          left={left}
          delay={delay}
          openModal={openModal}
        />
      ))}

      <Modal isOpen={modalData.isOpen} onClose={closeModal} {...modalData} />

      <ContentInfo
        title="Atlas"
        subtitle="Sur del valle alto del río Cauca"
        description="Geopoéticas para las transiciones"
        image={img}
        logo={logo}
        logoLink="https://www.unriocauca.com/" 
      />
    </div>
  );
};

export default Content;
