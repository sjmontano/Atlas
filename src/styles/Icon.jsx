import React from "react";
import { ICONS } from "@icons/icons";

// ⚠️ IMPORTA explícitamente los SVG que quieras usar dinámicamente
// Solo los que necesites con color dinámico
import { ReactComponent as ArrowdownIcon } from "@icons/line/svg/arrow-down.svg";
import { ReactComponent as ArrowupIcon } from "@icons/line/svg/arrow-up.svg";
import { ReactComponent as BackIcon } from "@icons/line/svg/back.svg";
import { ReactComponent as ChapterinfoIcon } from "@icons/line/svg/chapter-info.svg";
import { ReactComponent as Chapter1MapIcon } from "@icons/line/svg/chapter1-map.svg";
import { ReactComponent as Chapter2MapsIcon } from "@icons/line/svg/chapter2-maps.svg";
import { ReactComponent as Chapter3RiverIcon } from "@icons/line/svg/chapter3-river.svg";
import { ReactComponent as Chapter4CacaoIcon } from "@icons/line/svg/chapter4-cacao.svg";
import { ReactComponent as CloseIcon } from "@icons/line/svg/close.svg";
import { ReactComponent as CreditsIcon } from "@icons/line/svg/credits.svg";
import { ReactComponent as DownloadIcon } from "@icons/line/svg/download.svg";
import { ReactComponent as GeneralinfoIcon } from "@icons/line/svg/general-info.svg";
import { ReactComponent as HideIcon } from "@icons/line/svg/hide.svg";
import { ReactComponent as LayersIcon } from "@icons/line/svg/layers.svg";
import { ReactComponent as LevelsIcon } from "@icons/line/svg/levels.svg";
import { ReactComponent as LocationIcon } from "@icons/line/svg/location.svg";
import { ReactComponent as MapgalleryIcon } from "@icons/line/svg/map-gallery.svg";
import { ReactComponent as MapinfoIcon } from "@icons/line/svg/map-info.svg";
import { ReactComponent as MetadataIcon } from "@icons/line/svg/metadata.svg";
import { ReactComponent as NorthIcon } from "@icons/line/svg/north.svg";
import { ReactComponent as PlayIcon } from "@icons/line/svg/play.svg";
import { ReactComponent as QuestionmarkIcon } from "@icons/line/svg/question-mark.svg";
import { ReactComponent as RomaniIcon } from "@icons/line/svg/roman-i.svg";
import { ReactComponent as RomaniiIcon } from "@icons/line/svg/roman-ii.svg";
import { ReactComponent as RomaniiiIcon } from "@icons/line/svg/roman-iii.svg";
import { ReactComponent as RomanivIcon } from "@icons/line/svg/roman-iv.svg";
import { ReactComponent as ShowIcon } from "@icons/line/svg/show.svg";
import { ReactComponent as TechnicalsheetIcon } from "@icons/line/svg/technical-sheet.svg";
// Agrega más aquí si los necesitas como SVG React

// Mapeo de íconos dinámicos
const dynamicIconComponents = {
  layers: LayersIcon,
  metadata: MetadataIcon,
  download: DownloadIcon,
  "general-info": GeneralInfoIcon,
  // Agrega más aquí
};

const Icon = ({
  name,
  type = "svg", // svg | webp
  dynamic = false,
  className = "",
  alt = name,
  ...props
}) => {
  // Si es dinámico y existe como componente importado
  if (dynamic && dynamicIconComponents[name]) {
    const DynamicIcon = dynamicIconComponents[name];
    return <DynamicIcon className={className} {...props} />;
  }

  // Ruta estática según tipo
  const src = ICONS.line?.[name]?.[type] || ICONS.frame?.[name]?.[type];

  if (!src) {
    console.warn(`❌ Icon "${name}" not found in ICONS.`);
    return null;
  }

  return <img src={src} alt={alt} className={className} {...props} />;
};

export default Icon;
