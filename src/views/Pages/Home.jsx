import { useEffect } from "react";
import { useShadow } from "../../context/ShadowContext";
import SidebarMain from "../../components/Sidebars/SidebarMain/SidebarMain";
import Content from "../../components/Home/Content/Content";

const Home = () => {
  const { updateShadow } = useShadow(); // Accedemos a la función de la sombra

  useEffect(() => {
    updateShadow(false); // Asegurar que la sombra está desactivada en Home
  }, []);

  return (
    <div className="home">
      <Content />
    </div>
  );
};

export default Home;
