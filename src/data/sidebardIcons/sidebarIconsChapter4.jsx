
//Iconos del el sidebarLeft en los mapas
import levels from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/levels.webp";
import metadata from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/metadata.webp";
import download from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/download.webp";
import modelo from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/modelo.webp";
import presentation from "../../../public/assets/interface/icons/line/svg/presentation.svg";
import info from "../../../public/assets/img/background/iconos/info.svg";
import datos from "../../../public/assets/img/background/iconos/datos.svg";
import arbol from "../../../public/assets/img/background/iconos/arbol.svg";

import { link } from "framer-motion/client";



const sidebarIconsChapter4 = [
    //Mapa introductorio
    [
      { id: 1, icon: presentation, title: "Presentación" },
      {
        id: 2,
        icon: datos,
        title:"Datos",
        link:"https://docs.google.com/spreadsheets/d/1TtjNpRPwglIfDh-EvJ6u3_XTIhzcpG-i/edit?usp=sharing&ouid=112200405745868632840&rtpof=true&sd=true",
      }
    ],
    //Centro agropecuario ASOYOGE
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación mapa1",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "" },
      /* {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "",
      }, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: datos,
        title:"Datos",
        link:"",
      },
      {
        id: 6,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
      
    ],
    //Finca El Paso
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación mapa2",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/1lPJsUwLxV2TTlGwkf_F1nEPkroixZxh3/view"},
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1gIOicCrLnLeC3aoxVCsHSjPZdGmg4N6d/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }

    ],
    //Bosque comestible
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:""},
       /* {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "",
      },  */
      {
        id: 4,
        icon: modelo,
        title: "Síntesis",
        link: "6",
      },
    ],
    //Finca Los Bajios
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1nvHvHBqucWGGzJEXpALQnVO-qmIRNCLO/view" },
      /* {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/1FV4jcrdxeRRdOmRuYUlaozv0t4Vq1Ocd/view",
      }, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
    //Finca el paso
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
       /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
    //finca las mercedes
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
       /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
    //Finca La Virginia
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
    //Centro agropecuario villa rica
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
    //Finca la caicedo
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
    //Humedales problemáticas
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación mapa10",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
      { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"},
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"",
      }
    ],
  ];
 export default sidebarIconsChapter4;