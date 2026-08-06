# Glosario de Mapas — Atlas Pluriversal

> Índice de equivalencias entre los nombres que usa la comunidad, los nombres de archivo
> originales (PNG del GIS), el nombre canónico en `public/assets/maps/` y el ID interno
> del código (`src/data/maps/geo.js`). Sirve para no perderse cuando el mismo mapa se
> llama distinto en cada fuente, y como fuente de verdad para la futura generación de
> tiles (faceta 2).

## Convención de nombres canónicos

- Carpetas por capítulo: `intro/`, `cap1/`, `cap2/`, `cap3/`, `cap4/` dentro de `public/assets/maps/`.
- Archivo: kebab-case sin acentos, sin espacios (`modelo-territorial-suarez.png`).
- En `geo.js` el mapa se identifica como `chapterX-<slug>` (columna **ID interno**).

## Intro

| Nombre canónico | Comunidad (app) | Archivo original (enlace) | ID interno | Estado |
|---|---|---|---|---|
| `intro/cuenca-cauca.png` | Mapa intro | mapa en png georeferenciado Cuenca Cauca | `intro` | ✅ desde «cuenca cauca sin etiquetas.png» (10059×5649) |

## Capítulo 1

| Nombre canónico | Comunidad (app) | Archivo original (enlace) | ID interno | Estado |
|---|---|---|---|---|
| `cap1/encuadres.png` | Mapa de encuadres CAP 1 | mapa en png georeferenciado Cuenca Cauca | `chapter1-encuadres` | ⚠️ **sin PNG recibido** (ningún archivo coincide con sus dims 3389×6684; en `images.js` ya está vacío) |
| `cap1/bredunco.png` | Mapa Bredunco | Mapa Bredunco o Cuenca del río Cauca | `chapter1-bredunco` | ✅ desde «Mapa de la cuenca sin etquetas.png» (11141×5649) |
| `cap1/ecosistemas.png` | Mapa Ecosistemas | Mapa de fondo vista previa ecosistemas | `chapter1-ecosistemas` | ✅ desde «Copia de Mapa ecosistemas y regiones imagen.png» |
| `cap1/mosaicos-del-agua.png` | Mapa de Mosaico de aguas | Vista previa de mapa de mosaicos de agua | `chapter1-mosaicos-del-agua` | ✅ desde «Imagen 16_9 mosaicos sin etiquetas.png» (16:9) |
| `cap1/un-rio-cauca.png` | Un río Cauca muchos mundos | Mapa un río Cauca muchos mundos | `chapter1-un-rio-cauca` | ✅ |
| `cap1/formas-del-paisaje.png` | Mpa de Pliegues | Formas del paisaje | `chapter1-formas-paisaje` | ✅ |

## Capítulo 2

| Nombre canónico | Comunidad (app) | Archivo original (enlace) | ID interno | Estado |
|---|---|---|---|---|
| `cap2/intro-cap2.png` | Mapa intro cap 2 | (enlace de Drive) | `chapter2-valle` | ✅ desde «IntroCap2.png» |
| `cap2/alternativas-suarez.png` | Mapa alternativas de Suárez | Alternativas Suarez | `chapter2-suarez` | ✅ |
| `cap2/modelo-territorial-suarez.png` | Mapa modelo territorial de Suárez | Modelo territorial de Suárez | `chapter2-m-suarez` | ✅ antes `m-suarez.png` (ver nota 1) |
| `cap2/alternativas-cali.png` | Mapa Alternativas de Cali | Alternativas Cali - versión sin números | `chapter2-cali` | ✅ desde «Localizacionde alternativas de oriente de Cali.png» (v17 key `VDOrienteCali`) |
| `cap2/modelo-territorial-oriente-cali.png` | Mapa modelo territorial de Cali | Modelo territorial del Oriente de Cali | `chapter2-m-oriente-cali` | ✅ desde «MODELO PACIFICO FIN.png» |
| `cap2/alternativas-villa-rica.png` | Mapa Alternativas de Villa Rica | Alternativas villa rica | `chapter2-villa-rica` | ✅ |
| `cap2/modelo-territorial-villa-rica.png` | Mapa modelo territorial de Villa Rica | Modelo villa rica | `chapter2-m-villa-rica` | ✅ |

## Capítulo 3

| Nombre canónico | Comunidad (app) | Archivo original (enlace) | ID interno | Estado |
|---|---|---|---|---|
| `cap3/intro-tramos.png` | Mpa intro cap 3 (Tramos) | Mapa intro 3 capitulo | `chapter3-introduccion` | ✅ |
| `cap3/nos-encharcaron-el-rio.png` | Mpa Nos encharcaron el río | Mapa nos encharcaron el río | `chapter3-encharcaron` | ✅ (v17 key `nosEncharcaronElRio`) |
| `cap3/cali-deseca.png` | Mpa Cali deseca | Se deseca Cali | `chapter3-cali-deseca` | ✅ (v17 key `caliDeseca`) |
| `cap3/aguas-que-llegan.png` | Mpa Aguas que llegan | Aguas que llegan | `chapter3-arcilla` | ✅ (16:9; v17 key `arcilla` con comentario «Aguas que llegan») |
| `cap3/se-encharca-arriba-se-deseca-abajo.png` | Mapa Se encharca arriba se deseca abajo | Mapa se encharca arriba se deseca abajo | `chapter3-humedales` | ✅ (v17 key `humedalesCap3`) |
| `cap3/el-desierto-verde.png` | Mpa El desierto verde | Mapa de acaparamiento del monocultivo de caña de azúcar | `chapter3-monocultivo` | ✅ |

## Capítulo 4

| Nombre canónico | Comunidad (app) | Archivo original (enlace) | ID interno | Estado |
|---|---|---|---|---|
| `cap4/intro-localizacion-fincas.png` | Mapa intro cap 4 | Mapa de localización de fincas | `chapter4-introduccion` | ✅ (16:9) |
| `cap4/asoyoge.png` | Mapa Centro agropecuario ASOYOGE | Asoyoge | `chapter4-asoyoge` | ✅ (16:9) |
| `cap4/finca-el-paso.png` | Mpa Finca El Paso | Finca El Paso | `chapter4-el-paso` | ✅ (16:9) |
| `cap4/finca-el-buhido.png` | mpa Finca El Buhido | Finca el Buhido | `chapter4-el-buhido` | ✅ (19:9) |
| `cap4/finca-los-bajios.png` | Mpa Finca Los Bajios | Finca Los Bajios | `chapter4-los-bajios` | ✅ (16:9) |
| `cap4/finca-la-caicedo.png` | Mpa Finca La Caicedo | Finca La Caicedo | `chapter4-la-caicedo` | ✅ (16:9) |
| `cap4/centro-agropecuario.png` | Mpa Centro agropecuario | Centro agropecuario | `chapter4-centro-agropecuario` | ✅ (16:9) |
| `cap4/finca-la-virginia.png` | Mpa Finca La Virginia | Finca La Virginia | `chapter4-la-virginia` | ✅ (16:9) |
| `cap4/finca-las-mercedes.png` | Mpa Finca Las Mercedes | Finca Las Mercedes | `chapter4-las-mercedes` | ✅ (16:9) |
| `cap4/bosque-comestible.png` | Mpa Bosque comestible | Bosque comestible | `chapter4-bosque-comestible` | ✅ (16:9) |
| `cap4/pondaje-problematicas.png` | Mpa Humedales problemáticas | Pondaje problemáticas | `chapter4-problematicas` | ✅ |

## Pendientes / dudas

1. **`cap1/encuadres.png` sin archivo** — no hay PNG que coincida con `chapter1-encuadres` (dims 3389×6684); en `images.js` sus URLs están vacías (el mapa no se renderiza). Conseguir el original cuando se pueda.
2. **Orientación de los originales** — casi todos los PNG recibidos son **16:9 / 19:9 (apaisados)** o transposiciones de los dims de `geo.js`, mientras que los PGW y dimensiones de `geo.js` corresponden a imágenes **verticales (retrato)**. Los originales no calzan 1:1 con el PGW actual: para la faceta 2 (tiles) y/o para usar estos PNG como base, hay que **georreferenciar cada uno** (recalibrar) o decidir qué versión es la canónica. Esto también aplica a los marcados «vista previa».

## Notas

- **Nota 1**: `chapter2-m-suarez` usaba `public/assets/maps/m-suarez.png` (asset local, el Cloudinary venía mal rotado). Tras esta reorganización vive en `cap2/modelo-territorial-suarez.png` y `images.js` ya apunta a la nueva ruta.
- Los nombres «Enlaces» salen de la tabla de la comunidad (agosto 2026); algunas entradas comparten nombre («mapa en png georeferenciado Cuenca Cauca» para intro y encuadres) por eso la carpeta y el ID interno son la clave única.
- Fuente de los ID internos y nombres de v17: `atlas_front/atlas_frontend_v17/src/data/mapImages/pgwData.js`.
