const lugares = [
  {
    id: "nevadoHuila",
    title: "Volcán Nevado Wila\ndel Huila o yändi",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783246/geoImages/mzqg9y0oq4jurybekqwr.webp",
    texto: 
      "Soy un viejo canoso, el más alto de la Cordillera Central. Me alzo en el corazón del territorio del pueblo Nasa, que me llama la montaña anaranjada; la nieve y el hielo que coronan mis cumbres son para ellos sagradas. Los páramos y bosques altoandinos que me rodean capturan la humedad de las nubes y la lluvia, alimentando muchas quebradas y cauces de diferentes tamaños que corren al encuentro del Cauca y el gran Paez, al del Magdalena. De vez en cuando el fuego de mis entrañas se activa, brota un humo sulfuroso y se han producido deshielos que han alterado el caudal de muchos ríos cercanos. El pueblo Nasa en su enorme sabiduría ha comprendido cómo lidiar con mis subidas de temperatura.",
  },
  {
    id: "paramoDeMoras",
    title: "Páramo de Pisxnu - Moras",
    image:  "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783874/geoImages/hqy4xxgnyedrfpk7lj1b.webp",
    texto: "De mis suelos, mi vegetación y mi atmósfera brota mucha del agua que surca la cuenca alta del río Cauca ¡Soy territorio ancestral de los pueblos Misak, Nasa y Pijao! Entre frailejones, lagunas, turberas y pajonales y el bosque altoandino que me bordea habita el oso de anteojos y se conforma la red vigorosa de aguas que corren por los ríos Palo, Piendamó y Ovejas. Resguardo las cosmovisiones de los pobladores de la cuenca alta del Cauca que luchan por mi existencia amenazada por la deforestación y la expansión agrícola.",
  },
  {
    id: "paramoHermosas",
    title: "Páramo Las Hermosas",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783923/geoImages/an4uacoohc3ymgld3vub.webp",
    texto: "Me extiendo por la Cordillera Central entre Tuluá y Pradera. En mis valles y lagos glaciares entrelazados con los bosques andino y altoandino, se forma el sinfín de gotas que crean los ríos Bugalagrande, Tuluá, Amaime y Nima. Ellos, por los suelos que corren llevan agua al valle y garantizan que durante las épocas secas esta no falte.",
  },
  {
    id: "cerroMunchique",
    title: "Cerro Munchique-Tigres",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783211/geoImages/zlp4kwctihxihglfppuo.webp",
    texto: "Me alzo por el oriente de mi hermano, el cerro Catalina o Teta. En mis pliegues se crea una parte del tejido del agua que corre por el sur del valle alto del río Cauca. En este tejido surgen vitales las aguas del río Quilichao que cruzan su existencia con las comunidades locales y los bosques de la región.",
  },
  {
    id: "CerroTeta",
    title: "Cerro Catalina o Teta",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782397/geoImages/i0x7bmz0xzcddgc5s0a2.webp",
    texto: "El río Cauca me bordea apurado antes de salir al valle fértil y extenso. Despliego mis faldas como si estuviera solo en este territorio. Mi presencia está atada a la historia de los pueblos negros del norte del Cauca para los que soy un símbolo que une el agua con su cultura y sus tradiciones con la minería de oro.",
  },
  {
    id: "villarica",
    title: "Tejido Villa Rica",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784284/geoImages/bpdxtsmccgpmo7wknpzn.webp",
    texto: "Soy un territorio de resistencia del suroriente del valle alto del río Cauca. Mi historia transcurre entre haciendas esclavistas, como La Bolsa, pasa por el auge del cacao en la primera mitad del siglo XX, luego la extracción de arcillas para la fabricación de materiales de construcción y la implantación de la caña de azúcar como monocultivo. Recientemente me afirmo, desde las fincas tradicionales y los conocimientos tradicionales de las plantas, en la búsqueda de la soberanía alimentaria que esta tierra fértil puede garantizarnos.",
  },
  {
    id: "salvajina",
    title: "Represa La Salvajina",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784166/geoImages/xeg78osmzhq42p1q6rc6.webp",
    texto: "Me construyeron estratégicamente en el punto en el que empieza a formarse el valle del río Cauca en su cuenca alta. Mi enorme muro se alza frente al municipio de Suárez y desde ahí gobierno las aguas del Cauca y aprovechó su fuerza para producir energía. Dicen que afecté al río, que modifiqué su dinámica natural, que por mi causa se alteraron los modos de vida de las comunidades ribereñas y surgieron conflictos por el acceso al agua y la tierra, que facilité la destrucción de sus humedales y la intensificación del monocultivo de la caña de azúcar y la urbanización del valle… y si, es cierto, eso hago bajo el mandato del desarrollo.",
  },
  {
    id: "orienteDeCali",
    title: "Tejido Oriente de Cali",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783387/geoImages/g0cjz61lv6wtocbt9gwt.webp",
    texto: "En mis suelos sobreviven las lagunas El Pondaje y Charco Azul. También se reconocen las huellas de muchas ciénagas, zanjones y madreviejas que fue desecando el acelerado proceso de urbanización de Cali. Mis calles acogen la multiterritorialidad de miles de personas que desde el Pacífico y el sur occidente del país han llegado a esta ciudad. La vida en este territorio de hermosos atardeceres no transcurre fácil, está atravesada por la segregación y el racismo. Poco a poco nos vamos organizando para reconocer y exigir nuestros derechos e incidir en el futuro de Cali.",
  },
  {
    id: "pondaje",
    title: "El Pondaje y Charco Azul",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784064/geoImages/ukb6mn1lhmja1ztbmg8w.webp",
    texto: "Somos alargadas y permanecemos juntas, nuestro origen está en el río Cañaveralejo y la ciénaga de Aguablanca. Por siglos nuestras aguas y orillas han sido el hogar de aves que recorren Abya Yala, de mamíferos, peces e insectos cada vez más arrinconados. Entre el buchón de agua y el poblamiento de nuestros bordes permanecemos impasibles, pero estamos lastimadas. Una a una van apareciendo huertas a nuestro alrededor y la gente se pronuncia si llega un proyecto para ocupar nuestros suelos, sin embargo sentimos que Cali puede cuidarnos más.",
  },
  {
    id: "suarez",
    title: "Tejido Suárez",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784246/geoImages/ciifgnxts0jl4huqjhgs.webp",
    texto: "En un rincón del suroccidente transcurre mi historia desde hace siglos. Detrás mío está el gran muro de La Salvajina y al frente, mis montañas se van separando y, poco a poco, toma forma la extensa planicie del valle alto del Cauca. En estas tierras sabemos que el río es Madre y Padre por eso cuidamos y luchamos por ellos. Impedimos la desviación del río Ovejas y el uso de maquinaria amarilla para la minería en su cauce. Seguimos reclamando y construyendo justicia frente a los impactos que deja la construcción, operación y mantenimiento de la represa e hidroeléctrica La Salvajina.",
  },
  {
    id: "cordilleraOccidental",
    title: "Munchique - Cordillera Occidental",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783966/geoImages/sj3kor3rrqrkihwihfp6.webp",
    texto: "Soy un tapiz de bosques de niebla y refugio de biodiversidad y hago parte de la Cordillera Occidental. Junto a los hermanos del pueblo Nasa, muchos seres como el colibrí Calzoncitos de Munchique o el Zamarrito del Pinche encuentran en mis entrañas húmedas su único hábitat en este planeta. De mis flancos se apresuran ríos al litoral Pacífico y a los surcos de agua que nutren el río Cauca, un poco antes de salir al valle.",
  },
  {
    id: "rioCauca",
    title: "Rio Cauca",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784120/geoImages/rpjwd7hrvoqotuwcgagv.webp",
    texto: "Broto del Macizo Colombiano en el Páramo de Paletará, cerca de mis hermanos del pueblo Coconuco. A mi cauce llegan aguas de las cordilleras Central y Occidental y viajamos juntas hasta la Depresión Mompoxina. Atravieso bosques de la alta montaña, hasta que mi cauce vigoroso queda reducido al pasar por un enorme charco que llaman La Salvajina. Retomo mi camino al valle, por ahí paso lastimado, sin la fuerza suficiente para enredarme con las ciénagas, humedales y zanjones que han ido desapareciendo en nombre de un desarrollo desigual. El uso intenso de mis aguas para el consumo y la producción de energía, el crecimiento implacable de la agroindustrial de la caña de azúcar y la urbanización desbordada amenazan mi existencia ¡No soy un canal de aguas, soy un río, un ser vivo!",
  },
  {
    id: "lagunaSonso",
    title: "Laguna de Sonso",
    image:  "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782495/geoImages/kmka0qnxmodkyfflmzgs.webp",
    texto: "Soy una sobreviviente de los tantísimos humedales que desecaron en el valle alto del río Cauca. En mis aguas y alrededores la vida expresa su diversidad, sobre todo por la cantidad de aves que me habitan permanentemente o de paso. Con alegría y tristeza cuento que soy el hogar de una de las ultimas poblaciones de Buitres de ciénaga y de los casi extintos Patos Negros y Brasileños y las Zarcetas Coloradas. A pesar de estar saturada de buchón de agua cumplo mis labores: reservo agua para los días de sequía y hago un valioso aporte cuando de contener inundaciones se trata. Además, junto a muchos humedales a lo largo del continente contribuyo a la migración de miles de aves que recorren Abya Yala.",
  },
  {
    id: "losFarallones",
    title: "Los Farallones",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782610/geoImages/iil0mxcdrfozmq0cjq0d.webp",
    texto: "Somos altos y rocosos, nuestra presencia no pasa desapercibida en la cordillera Occidental. Nuestras formas milenarias y hábitats altoandinos, acogen al oso de anteojos y al águila crestada, solo por nombrar dos de tantos seres que resguardamos. También damos origen a más de 30 ríos que bajan a las selvas húmedas del Pacífico y al valle del alto Cauca. De estos, el Cali, Pance y Meléndez se diluyen en el río Cauca con aguas que nacen puras y cristalinas, son contaminadas por la minería y a su paso por Cali se tornan más turbias y escasas de vida.",
  },
  {
    id: "lagoCalima",
    title: "Embalse Calima",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782441/geoImages/fgehc6tfjksrx3sfjusl.webp",
    texto: "Me conocen como lago, pero soy un embalse creado hace más de 60 años sobre la cordillera Occidental para generar energía. Mi nombre guarda la memoria del río y de los pobladores nativos de estas tierras que hoy poco se recuerdan. Una de las dos vías que del valle alto del río va hasta Buenaventura pasa por mi lado y recrea la forma en la que los Calimas habitaron entre la Ciénaga del Sonso y la vertiente del Pacífico de la cordillera.  ",
  },
  {
    id: "buenaventura",
    title: "Buenaventura",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782257/geoImages/vz3v5pi79p4k70rs0xdn.webp",
    texto: "Antes que nada, soy una hermosa y profunda bahía del océano Pacífico, nutrida por aguas que nacen en los Farallones de Cali y bajan por los ríos Anchicayá, Dagua y Raposo. En mi interior, bordeado de manglares, está la isla de Cascajal y desde ella, hace siglos ya, me fueron enlazando con el valle alto del río Cauca. Muchas veces me reducen a ser solo puerto, zona franca, también me estigmatizan como zona de conflicto. Pero se olvida que desde Cascajal ha tenido génesis una ciudad, levantada por las comunidades del pueblo negro que llegaron a habitarme hace no pocos años. Para ellos reclamo un mejor vivir en comunión ancestral y tradicional con el océano y los ríos.",
  },
];

export default lugares;