import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./views/Pages/Home.jsx"));
const Index = lazy(() => import("./views/Pages/Index.jsx"));
const Chapter1 = lazy(() => import("./views/Chapters/Chapter1/Chapter1.jsx"));
const Chapter2 = lazy(() => import("./views/Chapters/Chapter2/Chapter2.jsx"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Home/" element={<Home />} />
          <Route path="/chapter1/" element={<Chapter1 />} />
          <Route path="/chapter2/" element={<Chapter2 />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
