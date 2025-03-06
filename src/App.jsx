import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./views/Pages/Home.jsx"; // Importar Home.jsx
import Index from "./views/Pages/Index.jsx"; // Importar Index.jsx
import Chapter1 from "./views/Chapters/Chapter1/Chapter1.jsx";
import Chapter2 from "./views/Chapters/Chapter2/Chapter2.jsx"; // Agrega más capítulos aquí

const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Index />} /> {/* Ruta principal */}
        <Route path="/Home/*" element={<Home />} />
        <Route path="/chapter1/*" element={<Chapter1 />} />
        <Route path="/chapter2/*" element={<Chapter2 />} />
        {/* Agregar más capítulos aquí */}
      </Routes>
    </Router>
  );
};

export default App;
