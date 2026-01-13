
//Iconos del el sidebarLeft en los mapas
import levels from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/levels.webp";
import metadata from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/metadata.webp";
import download from "../../../public/assets/svg/todos/Hud/icons/icon-line-webp/download.webp";
import presentation from "../../../public/assets/interface/icons/line/svg/presentation.svg";
import info from "../../../public/assets/img/background/iconos/info.svg";
import { link } from "framer-motion/client";


const sidebarIconsChapter1 = [
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: levels, title: "Perfil cuenca" },
      //{ id: 3, icon: info, title: "Ayuda" },
    ],
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/1A7Jw4LORNUxoopVOMvVyahswDT4-VxS1/view?usp=sharing" },
      {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/19t24x_n0A_Fe_tgzWX57uP6azJc-PHyo/view?usp=drivesdk",
      },
    ],
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link: "https://drive.google.com/file/d/1lPJsUwLxV2TTlGwkf_F1nEPkroixZxh3/view"},
      { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1gIOicCrLnLeC3aoxVCsHSjPZdGmg4N6d/view?usp=drivesdk"},
    ],
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/13Fd5C8St_BArPKEgTQC8ZefT0gI_LXpE/view"},
      {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/13mmmAcE0odjgSLI2-u00DtReF13ZFy5p/view?usp=drivesdk",
      },
    ],
    [
      { id: 1, icon: presentation, title: "Presentación" },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/1nvHvHBqucWGGzJEXpALQnVO-qmIRNCLO/view" },
      {
        id: 3,
        icon: download,
        title: "Descargar",
        link: "https://drive.google.com/file/d/1FV4jcrdxeRRdOmRuYUlaozv0t4Vq1Ocd/view",
      },
    ],
    [
      {
        id: 1,
        icon: presentation,
        title: "Presentación",
      },
      { id: 2, icon: metadata, title: "Ficha técnica", link:"https://drive.google.com/file/d/17adqPeKCjtrKwjv0pHMZVat6UgEUnogH/view" },
      { id: 3, icon: download, title: "Descargar" , link:"https://drive.google.com/file/d/1FeTqSUT-m1D69gdRod8zZuEm6LKIgI3h/view?usp=drivesdk"},
    ],
  ];
 export default sidebarIconsChapter1;