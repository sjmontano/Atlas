const lugares = [
  {
    id: "nevadoHuila",
    title: "Volcán Nevado Wila - del Huila o yändi",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741636504/assets/g3dyb4dgow8icxefjzol.webp",
    texto:
      "Soy un viejo canoso, el más alto de la Cordillera Central. Me alzo en el corazón del territorio del pueblo Nasa, que me llama la montaña anaranjada; la nieve y el hielo que coronan mis cumbres son para ellos sagradas. Los páramos y bosques altoandinos que me rodean capturan la humedad de las nubes y la lluvia, alimentando muchas quebradas y cauces de diferentes tamaños que corren al encuentro del Cauca y el gran Paez, al del Magdalena. De vez en cuando el fuego de mis entrañas se activa, brota un humo sulfuroso y se han producido deshielos que han alterado el caudal de muchos ríos cercanos. El pueblo Nasa en su enorme sabiduría ha comprendido cómo lidiar con mis subidas de temperatura.",
  },
  {
    id: "paramoDeMoras",
    title: "Páramo de Pisxnu - Moras",
    image:  "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741637428/assets/nxsrhlyrrjqobpmhvt6v.webp",
    texto: "De mis suelos, mi vegetación y mi atmósfera brota mucha del agua que surca la cuenca alta del río Cauca ¡Soy territorio ancestral de los pueblos Misak, Nasa y Pijao! Entre frailejones, lagunas, turberas y pajonales y el bosque altoandino que me bordea habita el oso de anteojos y se conforma la red vigorosa de aguas que corren por los ríos Palo, Piendamó y Ovejas. Resguardo las cosmovisiones de los pobladores de la cuenca alta del Cauca que luchan por mi existencia amenazada por la deforestación y la expansión agrícola.",
  },
  {
    id: "paramoHermosas",
    title: "Paramo Las Hermosas",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741638222/assets/wsodwsegszvymxhwqfrj.webp",
    texto: "Me extiendo por la Cordillera Central entre Tuluá y Pradera. En mis valles y lagos glaciares entrelazados con los bosques andino y altoandino se forma el sinfín de gotas que crean los ríos Bugalagrande, Tuluá, Amaime y Nima. Ellos, por los suelos que corren llevan agua al valle y garantizan que durante las épocas secas esta no falte",
  },
  {
    id: "cerroMunchique",
    title: "Cerro Munchique-Tigres",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741638672/assets/zxchlacs0jyj2gsjvkxo.webp",
    texto: "Me alzo por el oriente de mi hermano, el cerro Catalina o Teta. En mis pliegues se crea una parte del tejido del agua que corre por el sur del valle alto del río Cauca. En este tejido surgen vitales las aguas del río Quilichao que cruzan su existencia con las comunidades locales y los bosques de la región.",
  },
  {
    id: "cerroTeta",
    title: "Cerro de la Teta",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216707/assets/dby7xk8xxof4vfplcv4t.webp",
    texto: "El Cerro La Teta, en Buenos Aires, Cauca, referente geográfico e \nhídrico que alimenta afluentes del río Cauca. Sus laderas han sido \ntestigo de procesos comunitarios y ambientales. A pesar de la minería \ny otros impactos, sigue siendo un símbolo de como territorio\nde resistencia.",
  },
  {
    id: "villarica",
    title: "Villarica",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216707/assets/dby7xk8xxof4vfplcv4t.webp",
    texto: "villarica",
  },
  {
    id: "salvajina",
    title: "La Salvajina",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741216860/assets/iz5o343gz0b6kifyo2pl.webp",
    texto: "Me construyeron estratégicamente en el punto en el que empieza a formarse el valle del río Cauca en su cuenca alta. Mi enorme muro se alza frente al municipio de Suárez y desde ahí gobierno las aguas del Cauca y aprovechó su fuerza para producir energía. Dicen que afecté al río, que modifiqué su dinámica natural, que por mi causa se alteraron los modos de vida de las comunidades ribereñas y surgieron conflictos por el acceso al agua y la tierra, que facilité la destrucción de sus humedales y la intensificación del monocultivo de la caña de azúcar y la urbanización del valle… y si, es cierto, eso hago bajo el mandato del desarrollo.",
  },
  {
    id: "orienteDeCali",
    title: "Distrito Agua Blanca",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741641336/assets/h2c5xefrrm78uertxlfb.webp",
    texto: "Ubicado en el oriente de la ciudad de Cali, este tejido ha sido impactado por el acelerado proceso de urbanización y la segregación y discriminación racial. Se caracteriza por su cultura arraigada al Pacífico colombiano y por poseer las dos lagunas más grandes de Cali, relictos de la antigua ciénaga de Aguablanca, que están articuladas junto con las huertas urbanas de la ciudad como resistencia ante la fuerte urbanización.",
  },
  {
    id: "undefined1",
    title: "undefined1",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741641336/assets/h2c5xefrrm78uertxlfb.webp",
    texto: "undefined1",
  },
  {
    id: "undefined2",
    title: "undefined2",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741641336/assets/h2c5xefrrm78uertxlfb.webp",
    texto: "undefined2",
  },
  {
    id: "undefined3",
    title: "undefined3",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741641336/assets/h2c5xefrrm78uertxlfb.webp",
    texto: "undefined3",
  },
  {
    id: "undefined4",
    title: "undefined4",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741641336/assets/h2c5xefrrm78uertxlfb.webp",
    texto: "undefined4",
  },
  {
    id: "lagunaSonso",
    title: "Laguna de Sonso",
    image:  "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741217197/assets/bihtbyftxsuilhphzaq1.webp",
    texto: "Soy una sobreviviente de los tantísimos humedales que desecaron en el valle alto del río Cauca. En mis aguas y alrededores la vida expresa su diversidad, sobre todo por la cantidad de aves que me habitan permanentemente o de paso. Con alegría y tristeza cuento que soy el hogar de una de las ultimas poblaciones de Buitres de ciénaga y de los casi extintos Patos Negros y Brasileños y las Zarcetas Coloradas. A pesar de estar saturada de Buchón de Agua cumplo mis labores: reservo agua para los días de sequía y hago un valioso aporte cuando de contener inundaciones se trata. Además, junto a muchos humedales a lo largo del continente contribuyo a la migración de miles de aves que recorren Abya Yala.",
  },
  {
    id: "losFarallones",
    title: "Los Farallones",
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741639245/assets/iuymmhvvtmj9ukn0hg97.webp",
    texto: "Somos altos y rocosos, nuestra presencia no pasa desapercibida en la cordillera Occidental. Nuestras formas milenarias y hábitats altoandinos, acogen al oso de anteojos y al águila crestada, solo por nombrar dos de tantos seres que resguardamos. También damos origen a más de 30 ríos que bajan a las selvas húmedas del Pacífico y al valle del alto Cauca. De estos, el Cali, Pance y Meléndez se diluyen en el río Cauca con aguas que nacen puras y cristalinas, son contaminadas por la minería y a su paso por Cali se tornan más turbias y escasas de vida.",
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
    image: "http://res.cloudinary.com/dnf3vxalv/image/upload/v1741641075/assets/mhadsvydxlursgjm3n6i.webp",
    texto: "Antes que nada, soy una hermosa y profunda bahía del océano Pacífico, nutrida por aguas que nacen en los Farallones de Cali y bajan por los ríos Anchicayá, Dagua y Raposo. En mi interior, bordeado de manglares, está la isla de Cascajal y desde ella, hace siglos ya, me fueron enlazando con el valle alto del río Cauca. Muchas veces me reducen a ser solo puerto, zona franca, también me estigmatizan como zona de conflicto. Pero se olvida que desde Cascajal ha tenido génesis una ciudad, levantada por las comunidades del pueblo negro que llegaron a habitarme hace no pocos años. Para ellos reclamo un mejor vivir en comunión ancestral y tradicional con el océano y los ríos.",
  },
];

export default lugares;