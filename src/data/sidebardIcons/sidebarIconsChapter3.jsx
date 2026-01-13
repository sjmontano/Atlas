
//Iconos del el sidebarLeft en los mapas
import levels from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/levels.webp";
import metadata from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/metadata.webp";
import download from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/download.webp";
import presentation from "../../../public/assets/interface/icons/line/svg/presentation.svg";
import info from "../../../public/assets/img/background/iconos/info.svg";
import datos from "../../../public/assets/img/background/iconos/datos.svg";
import { link } from "framer-motion/client";



const sidebarIconsChapter3 = [
    [
      //intro
      { id: 1, icon: presentation, title: "Presentación" },
      //{ id: 3, icon: info, title: "Ayuda" },
    ],
    [
      //monocultivo caña
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/10nefEH5pOSnpH6wdgBsTzLPUO924KQY-/view" },
      {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/1JFb4V6eD-kicm4_kjof2IMxpq6m6dsBR/view",
      },
      {
        id: 4,
        icon: datos,
        title:"Datos",
        link:"https://docs.google.com/spreadsheets/d/1TtjNpRPwglIfDh-EvJ6u3_XTIhzcpG-i/edit?usp=sharing&ouid=112200405745868632840&rtpof=true&sd=true",
      }
      
    ],
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/1Hj4e_Mlq5JzRbv_Ns38Wlo_IWLwsEEyX/view"},
      { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1serO1G5GM5kWplw8Ax4UhGOce0t6o-29/view"},
    ],
    [
      //cali deseca
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/10kcf3ObSpEdLuzZdFZiDh_yJIZlTKHEH/view?usp=sharing"},
      {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/1CGHbXCMCqEJIbxw7sNKpM88R9QBA8twX/view?usp=sharing",
      },
    ],
    [
      //Se encharca arriba se deseca abajo
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1swoN32n8SSE_ycZoh4XwbFJOFYAK2U5u/view?usp=sharing" },
      {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/1tqSNlYiyHNblPsxBe9Lq1GxH9RDX0jXR/view?usp=sharing",
      },
    ],
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1ocQi7dr8UDtar9dr666Fp4Gpwo5KYoxl/view" },
      { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1k6iPW9SNs2E_WaI_tCrGE1y6Edz9mYet/view"},
    ],
  ];
 export default sidebarIconsChapter3;