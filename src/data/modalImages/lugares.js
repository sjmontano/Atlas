const lugares = [
  {
    id: "nevadoHuila",
    title: "Volcán Nevado Wila\ndel Huila o yändi",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783246/geoImages/mzqg9y0oq4jurybekqwr.webp",
    texto: 
      "Soy un viejo canoso, el más alto de la cordillera Central. Me alzo en el corazón del territorio del pueblo Nasa. Ellos me llaman “la montaña anaranjada”. La nieve y el hielo que coronan mis cumbres son sagrados para este territorio. Los páramos y bosques altoandinos que me rodean capturan la humedad de las nubes y la lluvia, alimentando así a muchas quebradas y cauces de diferentes tamaños que corren al encuentro del Cauca y el gran Páez, y al del Magdalena. De vez en cuando el fuego de mis entrañas se activa, brota un humo sulfuroso y se han producido deshielos que han alterado el caudal de muchos ríos cercanos. El pueblo Nasa, en su enorme sabiduría, ha comprendido cómo lidiar con mis subidas de temperatura.",
  },
  {
    id: "paramoDeMoras",
    title: "Páramo de Pisxnu - Moras",
    image:  "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783874/geoImages/hqy4xxgnyedrfpk7lj1b.webp",
    texto: "¡Soy territorio ancestral de los pueblos Misak, Nasa y Pijao! De mis suelos, mi vegetación y mi atmósfera brota gran parte del agua que surca la cuenca alta del río Cauca. Entre frailejones, lagunas, turberas, pajonales y el bosque altoandino que me bordean habita el oso de anteojos y se conforma la red vigorosa de aguas que corre por los ríos Palo, Piendamó y Ovejas. Soy resguardo de las cosmovisiones de los pobladores de la cuenca alta del Cauca que luchan por mi existencia amenazada por la deforestación y la expansión agrícola.",
  },
  {
    id: "paramoHermosas",
    title: "Páramo Las Hermosas",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783923/geoImages/an4uacoohc3ymgld3vub.webp",
    texto: "Me extiendo por la cordillera Central entre Tuluá y Pradera, en mis valles y lagos glaciares, entrelazados con los bosques andino y altoandino, se forma el sinfín de gotas que crean los ríos Bugalagrande, Tuluá, Amaime y Nima. Ellos, a través de los suelos que recorren, llevan al valle el agua y garantizan que durante las épocas secas nunca falte.",
  },
  {
    id: "cerroMunchique",
    title: "Cerro Munchique-Tigres",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783211/geoImages/zlp4kwctihxihglfppuo.webp",
    texto: "Soy un tapiz de bosques de niebla y refugio de biodiversidad y hago parte de la cordillera Occidental. Muchos seres como el colibrí calzoncitos de Munchique o el zamarrito del Pinche encuentran en mis entrañas húmedas su único hábitat en este planeta. De mis flancos se apresuran ríos al litoral Pacífico y a los surcos de agua que nutren el río Cauca, un poco antes de salir al valle.",
  },
  {
    id: "CerroTeta",
    title: "Cerro Catalina o Teta",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782397/geoImages/i0x7bmz0xzcddgc5s0a2.webp",
    texto: "Mi presencia está atada a la historia de los pueblos negros del norte del Cauca, y para ellos, soy un símbolo que junta el agua con su cultura y con sus tradiciones relacionadas con la minería de oro. El río Cauca me bordea apurado antes de salir al valle fértil y extenso. Despliego mis faldas como si estuviera solo en este territorio.",
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
    texto: "Mi enorme muro se alza frente al municipio de Suárez y desde ahí gobierno las aguas del río Cauca y aprovecho su fuerza para producir energía. Me construyeron estratégicamente en el punto en el que empieza a formarse el valle del río Cauca en su cuenca alta. Dicen que afecté al río, que modifiqué su dinámica natural, que por mi causa se alteraron los modos de vida de las comunidades ribereñas y surgieron conflictos por el acceso al agua y la tierra, que facilité la destrucción de sus humedales y la intensificación del monocultivo de la caña de azúcar y la urbanización del valle… Y sí, es cierto, eso hago bajo el mandato del modelo de desarrollo extractivista.",
  },
  {
    id: "orienteDeCali",
    title: "Tejido Oriente de Cali",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754783387/geoImages/g0cjz61lv6wtocbt9gwt.webp",
    texto: "Mis calles acogen la multiterritorialidad de miles de personas que desde el Pacífico y el norte del Cauca han llegado a esta ciudad. En mis suelos sobreviven las madreviejas El Pondaje y Charco Azul y aún se reconocen las huellas de muchas ciénagas, zanjones y madreviejas que, debido al proceso de urbanización de Cali fueron desecadas. La vida en este territorio de hermosos atardeceres no transcurre fácil, está atravesada por la segregación y el racismo estructural; ante esto nos hemos organizado en diferentes expresiones comunitarias para transformar imaginarios excluyentes y  exigir nuestros derechos.",
  },
  {
    id: "pondaje",
    title: "El Pondaje y Charco Azul",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784064/geoImages/ukb6mn1lhmja1ztbmg8w.webp",
    texto: "Nuestro origen está en el río Cañaveralejo y la ciénaga de Aguablanca, somos alargadas y permanecemos juntas; durante siglos nuestras aguas y orillas han sido el hogar de aves que recorren Abya Yala, de mamíferos, de peces e insectos cada vez más arrinconados. Entre el buchón de agua y el poblamiento de nuestros bordes permanecemos impasibles, pero estamos lastimadas y aunque, una a una van apareciendo huertas a nuestro alrededor y la gente se pronuncia si llega un proyecto para ocupar nuestros suelos, sentimos que Cali puede cuidarnos más.",
  },
  {
    id: "suarez",
    title: "Tejido Suárez",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754784246/geoImages/ciifgnxts0jl4huqjhgs.webp",
    texto: "Mi historia desde hace siglos transcurre en un rincón del suroccidente, donde mis montañas se van separando y, poco a poco, toma forma la extensa planicie del valle alto del Cauca. Como en estas tierras sabemos que los ríos son Madre y Padre, los cuidamos y luchamos por ellos. En el 2001 impedimos la desviación del río Ovejas y en el 2014 el uso de maquinaria amarilla para la minería en su cauce. ¡Seguimos reclamando y construyendo justicia frente a los impactos que deja la construcción, operación y mantenimiento de la represa e hidroeléctrica la salvajada!",
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
    texto: "Broto del Macizo Colombiano en el Páramo de Sotará, cerca de mis hermanos del pueblo Coconuco. A mi cauce, llegan aguas de las cordilleras Central y Occidental y viajamos juntas hasta la Mojana en la Depresión Mompoxina; atravieso bosques de la alta montaña hasta que mi cauce vigoroso queda reducido al pasar por un enorme charco que llaman La Salvajina; retomo mi camino al valle y por allí paso ya lastimado, sin la fuerza suficiente para enredarme con las ciénagas, los humedales y los zanjones que han ido desapareciendo en nombre de un desarrollo desigual. El uso intenso de mis aguas para el consumo y la producción de energía, el crecimiento implacable de la agroindustrial de la caña de azúcar y la urbanización desbordada amenazan mi existencia ¡No soy un canal de aguas, soy un río, un ser vivo!",
  },
  {
    id: "lagunaSonso",
    title: "Laguna de Sonso",
    image:  "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782495/geoImages/kmka0qnxmodkyfflmzgs.webp",
    texto: "Soy una sobreviviente de los tantísimos humedales que desecaron en el valle alto del río Cauca. En mis aguas y mis alrededores, la vida expresa su diversidad, por la cantidad de aves que me habitan permanentemente o de paso. Con alegría y tristeza cuento que soy el hogar de una de las últimas poblaciones de buitres de ciénaga y de los casi extintos patos negros y brasileños y las zarcetas coloradas. A pesar de estar saturada de buchón de agua, cumplo con mis labores: reservo agua para los días de sequía y hago un valioso aporte cuando de contener inundaciones se trata. Además, junto a muchos humedales a lo largo del continente, contribuyo a la migración de miles de aves que recorren Abya Yala.",
  },
  {
    id: "losFarallones",
    title: "Los Farallones",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782610/geoImages/iil0mxcdrfozmq0cjq0d.webp",
    texto: "Somos altos, rocoso y nuestra presencia no pasa desapercibida en la cordillera Occidental. Nuestras formas milenarias y hábitats altoandinos acogen al oso de anteojos y al águila crestada, solo por nombrar dos de tantos seres que resguardamos. Así mismo, damos origen a más de 30 ríos que bajan a las selvas húmedas del Pacífico y al valle del alto Cauca, entre estos, los ríos Cali, Pance y Meléndez que se diluyen en el río Cauca con aguas que nacen puras y cristalinas, pero que, a causa de la minería y de su paso por la ciudad de Cali, se contaminan y se tornan más turbias y escasas de vida.",
  },
  {
    id: "lagoCalima",
    title: "Embalse Calima",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782441/geoImages/fgehc6tfjksrx3sfjusl.webp",
    texto: "Me conocen como lago, pero soy un embalse construido sobre la cordillera Occidental entre 1954 y 1966 para generar energía. Mi nombre guarda la memoria del río y de los pobladores nativos que hoy poco se recuerdan. Una de las dos vías que, del valle alto del río va hasta Buenaventura, pasa por mi lado recrea la forma en la que los Calimas habitaron entre la ciénaga de Sonso y la vertiente del Pacífico de la cordillera.",
  },
  {
    id: "buenaventura",
    title: "Buenaventura",
    image: "http://res.cloudinary.com/dvluvxfvn/image/upload/v1754782257/geoImages/vz3v5pi79p4k70rs0xdn.webp",
    texto: "Soy una hermosa y profunda bahía del océano Pacífico, nutrida por aguas que nacen en los Farallones de Cali y bajan por los ríos Anchicayá, Yurumanguí, Cajambre, Naya, Mayorquín, Dagua y Raposo. En mi interior, bordeado de manglares, está la isla de Cascajal y desde allí, hace siglos ya, me fueron enlazando con el valle alto del río Cauca. Muchas veces me reducen a ser solo puerto, zona franca; también me estigmatizan como zona de conflicto, pero se olvidan que, desde Cascajal ha tenido génesis una ciudad levantada por las comunidades del pueblo negro que llegaron a habitarme hace no pocos años. Para ellos reclamo un mejor vivir en comunión ancestral y tradicional con el océano y los ríos.",
  },
];

export default lugares;