import { createContext, useState, useContext } from "react";

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

  return (
    <ModalContext.Provider value={{ modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);