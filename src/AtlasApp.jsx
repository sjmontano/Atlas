
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";  // Asegúrate de que la ruta sea correcta

import Mapa1 from "../src/pages/chapterOne/Mapa1";
import Mapa2 from "../src/pages/chapterOne/Mapa2"
import Mapa3 from "../src/pages/chapterOne/Mapa3";

const App = () => {
  return (
    <Router>
      <div>
        {/* Agregar Links para la navegación */}
    

        {/* Definir las rutas */}
        <Routes >
          <Route path="/home" element={<Home />} />
  
            <Route path="/mapa1" element={<Mapa1 />} />
            <Route path="/mapa2" element={<Mapa2 />} />
            <Route path="/mapa3" element={<Mapa3 />} />
          
          
          {/* Otras rutas aquí */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
