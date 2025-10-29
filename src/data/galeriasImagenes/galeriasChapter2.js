// Configuración de galerías de imágenes para Chapter 2
// Cada galería corresponde a un nodo específico

export const galeriasChapter2 = {
  suarez: {
    titulo: "Suárez",
    imagenes: [
      "/assets/img/imgcarruselcap2/imgSuarez/suarez1.webp",
      "/assets/img/imgcarruselcap2/imgSuarez/suarez2.webp",
      "/assets/img/imgcarruselcap2/imgSuarez/suarez3.webp",
      "/assets/img/imgcarruselcap2/imgSuarez/suarez4.webp",
      "/assets/img/imgcarruselcap2/imgSuarez/suarez6.webp",
      "/assets/img/imgcarruselcap2/imgSuarez/suarez7.webp",
    ],
    descripciones: [
      "Tejido de las Alternativas Transformadoras del nodo Suárez, Cauca. Encuentro en la Asociación Cultural Casa del Niño y de la Niña, Villa Rica, Cauca. Marzo de 2023.",
      "Visual del área urbana de Suárez y del río Cauca desde La Toma. Diciembre de 2024.",
      "Taller del Colaboratorio de Cartografias críticas y codiseño territorial. Mirador de La Toma. Suárez, Cauca. Diciembre de 2023.",
      "Taller del Colaboratorio de Narrativas para las Transiciones Mirador de La Toma. Suárez, Cauca. 2024.",
      "Visita a la represa Salvajina. Encuentro de Alternativas Transformadoras. Asnazú. Suárez, Cauca. Noviembre de 2023.",
      "Visita a la Asociación Agroindustrial de Productores Agropecuarios y Mineros Afrodescendientes de Yolombó y Gelima - Asoyogé. La Toma. Suárez, Cauca. Noviembre de 2023.",
    ]
  },
  villaRica: {
    titulo: "Villa Rica",
    imagenes: [
      "/assets/img/imgcarruselcap2/imgVillaRica/villaRica1.webp",
      "/assets/img/imgcarruselcap2/imgVillaRica/villaRica2.webp",
      "/assets/img/imgcarruselcap2/imgVillaRica/villaRica3.webp",
      "/assets/img/imgcarruselcap2/imgVillaRica/villaRica4.webp",
      "/assets/img/imgcarruselcap2/imgVillaRica/villaRica5.webp",
      "/assets/img/imgcarruselcap2/imgVillaRica/villaRica6.webp",
    ],
    descripciones: [
      "Finca tradicional Bajíos II. Vereda La Primavera. Villa Rica, Cauca.",
      "Línea de tiempo del territorio de las alternativas transformadoras de Villa Rica. Cali, junio 2023.",
      "Fruto del cacao en cultivos de Villa Rica, Cauca.",
      "Visita a la finca tradicional La Caicedo. Vereda La Caponera. Guachené, Cauca. Al fondo el mayor Robertino Caicedo. Noviembre de 2024.",
      "Primer encuentro de Alternativas Transformadoras del trayecto de diseño de transiciones ecosociales justas en sur del valle alto del río Cauca. Asociación Cultural Casa del Niño y de la Niña, Villa Rica, Cauca. 2023.",
      "Rincón de una finca tradicional en las visitas de caracterización. Guachené, Cauca. 2024.",
    ]
  },
  cali: {
    titulo: "Oriente de Cali",
    imagenes: [
      "/assets/img/imgcarruselcap2/imgCali/cali1.webp",
      "/assets/img/imgcarruselcap2/imgCali/cali2.webp",
      "/assets/img/imgcarruselcap2/imgCali/cali4.webp",
      "/assets/img/imgcarruselcap2/imgCali/cali5.webp",
      "/assets/img/imgcarruselcap2/imgCali/cali6.webp",
      "/assets/img/imgcarruselcap2/imgCali/cali7.webp",
    ],
    descripciones: [
      "Visita Huerta Madre La Laguna - Red Nativos. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.",
      "Taller Aguas que van, aguas que llegan. Colaboratorio de Cartografías críticas y Codiseño territorial. Asociación Cultural Casa El Chontaduro. Cali, Valle. Febrero, 2025.",
      "Mayora Elena Hinestroza. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.",
      "Taller de Lineas de tiempo. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.",
      "Mayora Edy Serrano. Encuentro de Alternativas Transformadoras en la Casa Cultural El Chontaduro. Cali, Valle. 2023.",
      "Taller del Colaboratorio de Narrativas para las Transiciones. Universidad del Valle. Cali, Valle. 2024.",
    ]
  }
};

// Mapeo de índices de mapa a galerías
export const mapaToGaleria = {
  1: "suarez",     // Mapa de Suárez
  2: "villaRica",  // Mapa de Villa Rica
  3: "cali",       // Mapa de Oriente de Cali
};
