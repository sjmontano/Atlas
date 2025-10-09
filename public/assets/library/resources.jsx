// src/utils/Resources.js
//import InfoIcon from "./public/assets/svg/todos/Hud/icons/icon-line-svg/map-info.svg";

// Iconos desde @svg (alias) - estos están probablemente en src/assets/svg/
import MapaCap1 from '@svg/sidebar-resources/silueta-mapa-cap-1.svg';
import MapaCap2 from '@svg/sidebar-resources/silueta-mapa-cap-2.svg';
import MapaCap3 from '@svg/sidebar-resources/silueta-mapa-cap-3.svg';
import MapaCap4 from '@svg/sidebar-resources/silueta-mapa-cap-4.svg';

//public/assets/svg/todos/Hud/icons/icon-line-svg/arrow-down.svg

// Iconos desde public/assets/svg/...
// Estos se acceden con rutas relativas a partir de `/` porque están en public
const basePath = '/assets/svg/todos/Hud/icons/icon-line-svg';

const iconMap = {
  arrowDown: `${basePath}/arrow-down.svg`,
  arrowUp: `${basePath}/arrow-up.svg`,
  back: `${basePath}/back.svg`,
  chapterInfo: `${basePath}/chapter-info.svg`,
  chapter1Map: `${basePath}/chapter1-map.svg`,
  chapter2Maps: `${basePath}/chapter2-maps.svg`,
  chapter3River: `${basePath}/chapter3-river.svg`,
  chapter4Cacao: `${basePath}/chapter4-cacao.svg`,
  close: `${basePath}/close.svg`,
  credits: `${basePath}/credits.svg`,
  download: `${basePath}/download.svg`,
  generalInfo: `${basePath}/general-info.svg`,
  hide: `${basePath}/hide.svg`,
  layers: `${basePath}/layers.svg`,
  levels: `${basePath}/levels.svg`,
  location: `${basePath}/location.svg`,
  mapGallery: `${basePath}/map-gallery.svg`,
  mapInfo: `${basePath}/map-info.svg`,
  metadata: `${basePath}/metadata.svg`,
  north: `${basePath}/north.svg`,
  play: `${basePath}/play.svg`,
  questionMark: `${basePath}/question-mark.svg`,
  romanI: `${basePath}/roman-i.svg`,
  romanII: `${basePath}/roman-ii.svg`,
  romanIII: `${basePath}/roman-iii.svg`,
  romanIV: `${basePath}/roman-iv.svg`,
  show: `${basePath}/show.svg`,
  technicalSheet: `${basePath}/technical-sheet.svg`,
};

// Exportar todos los recursos como un objeto único
const Resources = {
  // Iconos de mapa (desde alias)
  MapaCap1,
  MapaCap2,
  MapaCap3,
  MapaCap4,

  // Iconos dinámicos desde public/assets
  ...iconMap,
};

export default Resources;
