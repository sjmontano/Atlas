const lugares = [
  {
    id: "nevadoHuila",
    title: "Nevado Huila",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741215982/assets/guqw2t3fpis7m8gdpely.webp",
    texto:
      "Abastece las dos cuencas mas importantes del país (Cuenca alta del \nRío Magdalena y Cuenca alta del Río Cauca) catalogándola como una \nestrella hídrica del macizo colombiano, que aporta bienes y servicios \nambientales representados en ecosistemas de Páramo, subparamo, \nbosque Andino y altoandino, favoreciendo asi la viabilidad de \nespecies de flora y fauna.",
  },
  {
    id: "paramoDeMoras",
    title: "Paramo De Moras",
    image:  "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216134/assets/mqjqukysja70qq8lssvu.webp",
    texto: "Es una de las principales fuentes de agua para los municipios de la \nregión. Su ecosistema, dominado por frailejones, musgos y pajonales,\nregula el ciclo hídrico y es el hogar de especies como el oso de\nanteojos. A pesar de su importancia, se enfrenta a la deforestación y \nla expansión agrícola, que ponen en riesgo su biodiversidad .",
  },
  {
    id: "paramoHermosas",
    title: "Paramo Las Hermosas",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216513/assets/bi3abdzgfk8oexoysgrz.webp",
    texto: "Abastece las dos cuencas mas importantes del país (Cuenca alta del \nRío Magdalena y Cuenca alta del Río Cauca) catalogándola como una \nestrella hídrica del macizo colombiano, que aporta bienes y servicios \nambientales representados en ecosistemas de Páramo, subparamo, \nbosque Andino y altoandino.",
  },
  {
    id: "cerroMunchique",
    title: "Cerro Munchique",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741197880/assets/g4wygsdzyhnogdlbijwt.webp",
    texto: "Es un refugio de biodiversidad con altos niveles de endemismo. Su \ndensa niebla y bosques nublados albergan especies como el colibrí \nestrella de pecho azul. Además de su riqueza natural, es vital para la\nregulación hídrica de la región.",
  },
  {
    id: "cerroTeta",
    title: "Cerro de la Teta",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216707/assets/dby7xk8xxof4vfplcv4t.webp",
    texto: "El Cerro La Teta, en Buenos Aires, Cauca, referente geográfico e \nhídrico que alimenta afluentes del río Cauca. Sus laderas han sido \ntestigo de procesos comunitarios y ambientales. A pesar de la minería \ny otros impactos, sigue siendo un símbolo de como territorio\nde resistencia.",
  },
  {
    id: "salvajina",
    title: "La Salvajina",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216860/assets/iz5o343gz0b6kifyo2pl.webp",
    texto: "La represa de La Salvajina regula el caudal del río Cauca, previniendo \ninundaciones y generando energía. Sin embargo, su impacto social\nha sido significativo, alterando los modos de vida de las comunidades\nribereñas y generando conflictos por el acceso al agua y la tierra.",
  },
  {
    id: "orienteDeCali",
    title: "Distrito Agua Blanca",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741217000/assets/hqlcizl7xtbyguthtnsq.webp",
    texto: "El Distrito de Aguablanca, en el oriente de Cali, es un epicentro de\nresistencia y expresión cultural, donde las raíces afrocolombianas se \nmanifiestan en la música, la danza y el arte urbano. Alberga espacios \nde creación, lucha y esperanza. A pesar de los desafíos sociales, la\ncomunidad ha tejido redes que fortalecen la identidad y pertenencia\nen el territorio.",
  },
  {
    id: "lagunaSonso",
    title: "Laguna del Sonso",
    image:  "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741217197/assets/bihtbyftxsuilhphzaq1.webp",
    texto: "El Distrito de Aguablanca, en el oriente de Cali, es un epicentro de\nresistencia y expresión cultural, donde las raíces afrocolombianas se \nmanifiestan en la música, la danza y el arte urbano. Alberga espacios \nde creación, lucha y esperanza. A pesar de los desafíos sociales, la\ncomunidad ha tejido redes que fortalecen la identidad y pertenencia\nen el territorio.",
  },
  {
    id: "losFarallones",
    title: "Los Farallones",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741200519/assets/eab8os0coxynpp75s450.webp",
    texto: "Reserva ecológica colombiana, protegiendo fuentes hídricas \nque abastecen a Cali y otras poblaciones del Valle del Cauca. Su \nbiodiversidad es hogar de especies emblemáticas como el oso de anteojos y el águila crestada. Además de su valor ambiental, y comunidades campesinas e indígenas",
  },
  {
    id: "lagoCalima",
    title: "Lago Calima",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741200047/assets/oao7cwva6mpkntekudyc.webp",
    texto: "El Lago Calima, ubicado en el departamento del Valle del Cauca, \nColombia, es un embalse artificial creado en la década de 1960 para \nla generación de energía hidroeléctrica. Conocido por sus fuertes \nvientos, es un destino popular para la práctica de deportes náuticos\ncomo el windsurf y el kitesurf. Rodeado de montañas y con un clima fresco, también es un lugar turístico ideal para el ecoturismo.",
  },
  {
    id: "buenaventura",
    title: "Buenaventura",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741199793/assets/wi2z0u3yjj9qmuvusflk.webp",
    texto: "Buenaventura es el puerto más importante de Colombia, siendo la \nprincipal puerta de entrada y salida del comercio marítimo del país. \nSin embargo, más allá de su función portuaria, la población se dedica \na diversas actividades como la pesca artesanal, el comercio informal y \nla gastronomía basada en los productos del Pacífico.",
  },
];

export default lugares;