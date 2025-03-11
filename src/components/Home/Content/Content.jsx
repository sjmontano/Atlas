import { useModal } from "../../../context/ContextModal";
import Modal from "../Modal/Modal";
import LocationMarker from "../MapMarker/LocationMarker";
import ContentInfo from "./ContentInfo";
import img from "../../../../public/assets/img/background/home.webp";
import logo from "../../../../public/assets/img/logo/logo.png";
import lugares from "../../../data/lugares";

const Content = () => {
  const { modalData, openModal, closeModal } = useModal();

  return (
    <div className="content">     
      {lugares.map(({ id, title, image, texto }) => (
        <LocationMarker
          key={id}
          id={id}
          title={title}
          image={image}
          texto={texto}
          openModal={openModal}
        />
      ))}
      <Modal isOpen={modalData.isOpen} onClose={closeModal} {...modalData} />

      <ContentInfo
        title="Atlas"
        subtitle="Un rio Cauca, muchos mundos"
        description="¡Abrochen sus cinturones que vamos a transicionar!"
        image={img}
        logo={logo}
      />
    </div>
  );
};

export default Content;