import { useEffect } from "react";
import { useShadow } from "../../context/ShadowContext";
import Content from "../../components/Home/Content/Content";
import { Navigate } from "react-router-dom";

const Home = ({acceso=false}) => {

  if(acceso==false){
    return <Navigate to="/"/>
  }

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
