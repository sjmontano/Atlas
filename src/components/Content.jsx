import PropTypes from "prop-types";
import { BsQuestionCircleFill } from "react-icons/bs";
import driver from "../utils/driver";
import MapMarker from "./MapMarker";
import { useState } from "react";
import location from "../data/data";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import img from "../../assets/fondoHome.png"

const Content = ({ toggleSidebar }) => {
  const [purace, rioCauca, hermosas, OceanoPacifico] = location;

  // Estados para manejar visibilidad del modal y datos dinámicos

  const buttonIds = [
    "nevadoHuila", "paramoDeMoras", "paramoHermosas", "cerroMunchique", "cerroTeta", "villarica", 
    "salvajina", "suarez", "distritoAguablanca", "lagunaSonso", "rioCauca", "naturalMunchique", 
    "losFarallones", "lagoCalima", "buenaventura"
  ];


  const handleHelpButton = () => {
    toggleSidebar(); // Llamar para alternar el estado del Sidebar
    driver.drive();
  };


  const [modalData, setModalData] = useState({ isOpen: false, text: "", image: "",id:""});

  const openModal = (text, image,id) => {
    setModalData({ isOpen: true, text, image, id});
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  const derecha = () => {

    buttonIds.forEach(id=>{

      if(modalData.id==buttonIds[14]){
        const boton = document.getElementById(buttonIds[0]);
        if (boton) {
          boton.click();
        }
        return;
      }

      if ( id==modalData.id){

        const boton = document.getElementById(buttonIds[ buttonIds.indexOf(id)+1]);
        if (boton) {
          boton.click();
        }
      }
      
    });
  };

  const izquierda = () => {
    
    buttonIds.forEach(id=>{

      if(modalData.id==buttonIds[0]){
        const boton = document.getElementById(buttonIds[14]);
        if (boton) {
          boton.click();
        }
        return;
      }

      if ( id==modalData.id){

        const boton = document.getElementById(buttonIds[ buttonIds.indexOf(id)-1]);
        if (boton) {
          boton.click();
        }
      }
      
    });
  };



  const mostrarTitulo=(id)=>{
    var titulo = document.getElementById(id);
    titulo.setAttribute("style","display:block;");
  }
  
  const ocultarTitulo=(id)=>{
    var titulo = document.getElementById(id);
    titulo.setAttribute("style","display:none;");
  }
  


  return (
    <div className="content">


     <img src={img} alt="" />

      {/* Botones con información específica */}

      <h4 id="nevadoHuilaTitulo">Nevado <br />del Huila</h4>
      <button
        id="nevadoHuila"
        className="marker-button"
        onClick={() => openModal("Lago Calima","/assets/lagoCalima.png",buttonIds[0])
        }
        onMouseEnter={()=>mostrarTitulo("nevadoHuilaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("nevadoHuilaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="paramoDeMorasTitulo">Paramo <br /> de Moras</h4>
      <button
        id="paramoDeMoras"
        className="marker-button"
        onClick={() => openModal("Lago Calima","/assets/lagoCalima.png",buttonIds[1])}
        onMouseEnter={()=>mostrarTitulo("paramoDeMorasTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("paramoDeMorasTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="paramoHermosasTitulo">Paramo de<br />las Hermosas</h4>
      <button
        id="paramoHermosas"
        className="marker-button"
        onClick={() => openModal("Los Farallones","/assets/losFrallones.png",buttonIds[2])}
        onMouseEnter={()=>mostrarTitulo("paramoHermosasTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("paramoHermosasTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="cerroMunchiqueTitulo">Cerro<br />Muchique <br />Tigres</h4>
      <button
        id="cerroMunchique"
        className="marker-button"
        onClick={() => openModal("Los Farallones","/assets/losFrallones.png",buttonIds[3])}
        onMouseEnter={()=>mostrarTitulo("cerroMunchiqueTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("cerroMunchiqueTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="cerroTetaTitulo">Cerro<br />La Teta</h4>
      <button
        id="cerroTeta"
        className="marker-button"
        onClick={() => openModal("Oriente de Cali","/assets/orienteCali.png",buttonIds[4])}
        onMouseEnter={()=>mostrarTitulo("cerroTetaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("cerroTetaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="villaricaTitulo">Villarica</h4>
      <button
        id="villarica"
        className="marker-button"
        onClick={() => openModal("Laguna de Sonso","/assets/lagunaSonso.png",buttonIds[5])}
        onMouseEnter={()=>mostrarTitulo("villaricaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("villaricaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="salvajinaTitulo">La Salvajina</h4>
      <button
        id="salvajina"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[6])}
        onMouseEnter={()=>mostrarTitulo("salvajinaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("salvajinaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="suarezTitulo">Suarez</h4>
      <button
        id="suarez"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[7])}
        onMouseEnter={()=>mostrarTitulo("suarezTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("suarezTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="distritoAguablancaTitulo">Distrito Aguablanca <br /> •Oriente de Cali</h4>
      <button
        id="distritoAguablanca"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[8])}
        onMouseEnter={()=>mostrarTitulo("distritoAguablancaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("distritoAguablancaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="lagunaSonsoTitulo">Laguna de Sonso</h4>
      <button
        id="lagunaSonso"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[9])}
        onMouseEnter={()=>mostrarTitulo("lagunaSonsoTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("lagunaSonsoTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="rioCaucaTitulo">Rio Cauca</h4>
      <button
        id="rioCauca"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[10])}
        onMouseEnter={()=>mostrarTitulo("rioCaucaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("rioCaucaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="naturalMunchiqueTitulo">Parque Nacional <br /> Natural Munchique</h4>
      <button
        id="naturalMunchique"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[11])}
        onMouseEnter={()=>mostrarTitulo("naturalMunchiqueTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("naturalMunchiqueTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="losFarallonesTitulo">Los Farallones</h4>
      <button
        id="losFarallones"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[12])}
        onMouseEnter={()=>mostrarTitulo("losFarallonesTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("losFarallonesTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="lagoCalimaTitulo">Lago Calima</h4>
      <button
        id="lagoCalima"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[13])}
        onMouseEnter={()=>mostrarTitulo("lagoCalimaTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("lagoCalimaTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>

      <h4 id="buenaventuraTitulo">Buenaventura</h4>
      <button
        id="buenaventura"
        className="marker-button"
        onClick={() => openModal("Nevado del Huila","/assets/nevadoHuila.png",buttonIds[14])}
        onMouseEnter={()=>mostrarTitulo("buenaventuraTitulo")
        }
        onMouseLeave={()=>ocultarTitulo("buenaventuraTitulo")}
        
      >
        <MapMarker size="15px" color="blue" />
      </button>


      <Modal isOpen={modalData.isOpen} onClose={closeModal} text={modalData.text} image={modalData.image} derecha={derecha} izquierda={izquierda} />
    

      <div className="content-info">
        <section className="content-titles">
          <h1 className="titulo">Atlas</h1>
          <h3>Un rio Cauca, muchos mundos</h3>
        </section>
        <p>Abrochen sus cinturones <br />que vamos a transicionar</p>

        <section className="content-buttons">
         
          <Link to='/capitulo1' className="link">
            <button id="atlas-button-explorar" className="atlas-button-explorar">Explorar</button>
          </Link>

          <BsQuestionCircleFill className="btnInfoTutorial" color="#5cad9a" size="50px" onClick={handleHelpButton} />
        </section>
      </div>
    </div>
  );
};

Content.propTypes = {
  toggleSidebar: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default Content;
