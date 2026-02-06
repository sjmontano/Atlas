
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
        link: "Datos",
      },
      {
        id: 6,
        icon: arbol,
        title:"Mapa de árbol",
        link:"MapaArbol",
      }
      
    ],
    //Finca El buhido
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
        link:"MapaArbol",
      }

    ],
    //Bosque comestible
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1WOTbHyYhsacU0OZOxny76qwoNNud02yH/view?usp=sharing"},
      {
        id: 4,
        icon: levels,
        title: "Perfil",
        link: "Datos",
      },
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
        link:"MapaArbol",
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
        link:"MapaArbol",
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
        link:"MapaArbol",
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
        link:"MapaArbol",
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
        link:"MapaArbol",
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
        link:"MapaArbol",
      }
    ],
    //Humedales problemáticas
     [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1ZE41JqK6UrJR9-BfLDedgs7f_OQyLwFY/view" },
      { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/18PA-iS3TvXlhqT2el-9QsaWWeaVbk5gM/view"},
      
    ],
  ];
 export default sidebarIconsChapter4;