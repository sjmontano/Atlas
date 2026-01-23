
//Iconos del el sidebarLeft en los mapas
import levels from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/levels.webp";
import metadata from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/metadata.webp";
import download from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/download.webp";
import modelo from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/modelo.webp";
import presentation from "../../../public/assets/interface/icons/line/svg/presentation.svg";
import info from "../../../public/assets/img/background/iconos/info.svg";
import datos from "../../../public/assets/img/background/iconos/datos.svg";
import arbol from "../../../public/assets/img/background/iconos/arbol.svg";
import gallery from "../../../public/assets/img/background/iconos/presentationCap4.svg";

import { link } from "framer-motion/client";



const sidebarIconsChapter4 = [
    //Mapa introductorio
    [
      { id: 1, icon: presentation, title: "Presentación" },
      {
        id: 2,
        icon: datos,
        title:"Datos",
        link:"Datos",
      }
    ],
    //Centro agropecuario ASOYOGE
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/1zU1brROKItcLuutpzRhmLOoSCu_rPHL5/view?usp=sharing" },
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
        link:"Datos",
      },
      {
        id: 6,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/1x_8NCnjyVqVB1w0dvGSlGAhIWMOoajDc/view?usp=sharing",
      }
      
    ],
    //Finca El Paso
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/1lPJsUwLxV2TTlGwkf_F1nEPkroixZxh3/view"},
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1gIOicCrLnLeC3aoxVCsHSjPZdGmg4N6d/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "Datos",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/1OPmhg55NhJSx4uxt2V1CwtiRjo-Gwfy5/view?usp=sharing",
      }

    ],
    //Bosque comestible
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1WOTbHyYhsacU0OZOxny76qwoNNud02yH/view?usp=sharing"},
       /* {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "",
      },  */
      {
        id: 10,
        icon: modelo,
        title: "Síntesis",
        link: "10",
      },
    ],
    //Finca Los Bajios
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1lFIiuUV5eY1xvbxLIaS0Utn4xAnvUGBy/view?usp=sharing" },
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
        link: "Datos",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/16JvxIx1Knpi8sfwjaFg1h1EZjBogHY7g/view?usp=sharing",
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
        link: "Datos",
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
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1r8Rf_oQ28OAvHxR7AxKvoE6D1rT_vhJo/view?usp=sharing" },
       /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "Datos",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/16kTxtOhAS3UEj_yd03QkCbFi_zGO61Mf/view?usp=sharing",
      }
    ],
    //Finca La Virginia
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1MJJDDs-F_2J7zeGJ1nhWn4rCaErNXfew/view?usp=sharing" },
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "Datos",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/1YWcUXneLDUmt-W__G5wOlyfFfZQpRddJ/view?usp=sharing",
      }
    ],
    //Centro agropecuario villa rica
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1Kj6wFrSig47Sk_9WaD6hCek1k95cmohT/view?usp=sharing" },
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "Datos",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/1rMA6Z6tTE3aLwRKR2bxqUvmF7o4hH1VA/view?usp=sharing",
      }
    ],
    //Finca la caicedo
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/12KlWauZzbL7T44OGlV88imoofpFz3fP_/view?usp=sharing" },
      /* { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"}, */
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "Datos",
      },
      {
        id: 5,
        icon: arbol,
        title:"Mapa de árbol",
        link:"https://drive.google.com/file/d/1mC9qVkNbFV8tGbVTBTMzHajZz3mmoSgC/view?usp=sharing",
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
        link: "Datos",
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