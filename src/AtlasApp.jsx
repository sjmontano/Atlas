
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";  // Asegúrate de que la ruta sea correcta
import ChapterI from "./pages/ChapterI";

const App = () => {
  return (
    <Router>
      <div>
        {/* Agregar Links para la navegación */}
    

        {/* Definir las rutas */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/capitulo1" element={<ChapterI />} />
          {/* Otras rutas aquí */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
