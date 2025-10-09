import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/Loading/LoadingScreen.jsx";
import  { useState } from "react";


const Home = lazy(() => import("./views/Home/Home.jsx"));
const Index = lazy(() => import("./views/index/Index.jsx"));
const CreditsApp = lazy(() => import("./views/Credits/CreditsApp.jsx"));
const EntramadosApp = lazy(() => import("./views/entramadosTerritoriales/entramadosApp.jsx"));
const Bienvenidos = lazy(() => import("./views/Bienvenidos/Bienvenidos.jsx"));
import Chapter1 from "./views/Chapters/Chapter1/Chapter1.jsx";
const Chapter2 = lazy(() => import("./views/Chapters/Chapter2/Chapter2.jsx"));

const App = () => {

  const [user, setUser] = useState({
    pass:"",
    acceso:true
  });
  
    const login = () => {
      if (user ) {
        if ( user.pass==="atlaspluriversal.*" && !user.pass.includes("&")) {
        setUser({...user,acceso:true})

        }
      }
    }

    const logout = () => {
      setUser({
        pass:"",
        acceso:false
      });
    }

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>


        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Home/" element={<Home acceso={user.acceso} />} />
          <Route path="/Credits/" element={<CreditsApp acceso={user.acceso}  />} />
          <Route path="/Entramados/" element={<EntramadosApp acceso={user.acceso}  />} />
          <Route path="/Bienvenidos/" element={<Bienvenidos acceso={user.acceso}  />} />
          <Route path="/chapter1/" element={<Chapter1 acceso={user.acceso}  />} />
          <Route path="/chapter2/" element={<Chapter2 acceso={user.acceso}  />} />
        </Routes>


          {/*
            user.acceso===false?
            (
              <>
              <input type="text" placeholder="Clave" onChange={(e)=>{setUser({pass:e.target.value , acceso:false})}}/>
              <button onClick={login}>Login</button>
              </>
            ):
            (
              <>
              </>
            )*/
          }
      </Suspense>
    </Router>
  );
};

export default App;
