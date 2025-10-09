import { createContext, useContext, useState } from "react";

//  Creación del contexto
const ShadowContext = createContext();

//  Proveedor del contexto
export const ShadowProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false); // Estado para controlar la sombra

  // Función para activar o desactivar la sombra
  const updateShadow = (state) => setIsActive(state);

  return (
    <ShadowContext.Provider value={{ updateShadow }}>
      {children}
      {isActive && (
        <div
          className="screen-shadow"
        ></div>
      )}
    </ShadowContext.Provider>
  );
};

// Hook para acceder al contexto
export const useShadow = () => useContext(ShadowContext);
