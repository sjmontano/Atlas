import { createContext, useState, useContext } from "react";
import lugares from "../data/modalImages/lugares";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    text: "",
    texto: "",
    image: "",
    id: "",
  });

  const openModal = (text, texto, image, id) =>
    setModalData({ isOpen: true, text, texto, image, id });

  const closeModal = () =>
    setModalData((prevState) => ({ ...prevState, isOpen: false }));

  const navigateModal = (direction) => {
    const currentIndex = lugares.findIndex((lugar) => lugar.id === modalData.id);
    let newIndex = currentIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % lugares.length;
    } else if (direction === "prev") {
      newIndex = (currentIndex - 1 + lugares.length) % lugares.length;
    }

    const newModalData = lugares[newIndex];
    setModalData({
      isOpen: true,
      text: newModalData.title,
      texto: newModalData.texto,
      image: newModalData.image,
      id: newModalData.id,
    });
  };

  return (
    <ModalContext.Provider value={{ modalData, openModal, closeModal, navigateModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);