// ─────────────────────────────────────────────────────────────────────────────
// IMAGES — URLs de imágenes de mapas
// ─────────────────────────────────────────────────────────────────────────────
//
// FUENTE: geoMapping.js de v17 (URLs Cloudinary reales, originales portrait).
//
//   base        → variante de referencia (no se usa en el render actual)
//   full        → ORIGINAL alta resolución SIN transformar. Debe coincidir con
//                 las dimensiones de geo.js (la afín exige el tamaño exacto).
//   placeholder → transform Cloudinary w_512,q_30 (~10 KB). Carga instantánea
//                 para la etapa 1 del sistema progresivo.
//
// NOTA: los assets locales de atlas_3.0 (public/assets/maps/base-images/) son
// versiones LANDSCAPE rotadas con GDAL. NO usarlas con este sistema (el PGW
// rotado espera el portrait original).
// ─────────────────────────────────────────────────────────────────────────────

/** Genera la URL placeholder (512px, baja calidad) desde una URL Cloudinary */
function ph(cloudinaryUrl) {
  return cloudinaryUrl.replace('/upload/', '/upload/w_512,q_30,f_webp/')
}

const introBase =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp'
const introHigh =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif'

export const MAP_IMAGES = {
  // intro y bredunco comparten la MISMA imagen (bitácora #27: 5649×11141)
  intro: {
    base: introBase,
    full: introHigh,
    placeholder: ph(introBase),
  },

  'chapter1-bredunco': {
    base: introBase,
    full: introHigh,
    placeholder: ph(introBase),
  },

  'chapter1-encuadres': {
    // TODO: asset original portrait no disponible en el workspace.
    // v17 usaba assets locales (public/assets/encuadres-*.webp) que no están
    // en el dist/. Los locales de 3.0 son landscape rotados (no compatibles).
    base: '',
    full: '',
    placeholder: '',
  },

  'chapter1-ecosistemas': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350945/geoImages/keozbw51ancathhw6cwk.webp',
    placeholder: ph(
      'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp',
    ),
  },

  'chapter1-formas-paisaje': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359002/geoImages/ki1nmtf1bry5hwfzpauv.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359777/geoImages/xyrkeumf4kv6eixtzuoz.webp',
    placeholder: ph(
      'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359002/geoImages/ki1nmtf1bry5hwfzpauv.webp',
    ),
  },

  'chapter1-mosaicos-del-agua': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360161/geoImages/fpno8nmueqi0duweghhf.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360193/geoImages/ycxghm0xralzkptnbqqj.webp',
    placeholder: ph(
      'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360161/geoImages/fpno8nmueqi0duweghhf.webp',
    ),
  },

  'chapter1-un-rio-cauca': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp',
    placeholder: ph(
      'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp',
    ),
  },
}
