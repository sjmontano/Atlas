export interface MapImageUrls {
  base: string
  full: string
  placeholder: string
}

function ph(url: string): string {
  return url.replace('/upload/', '/upload/w_512,q_25,f_webp/')
}

const introBase =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360535/geoImages/kv5mawmj8cefhcqho8np.webp'
const introHigh =
  'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360577/geoImages/zvluewqlzmf9hw9fua6x.avif'

export const MAP_IMAGES: Readonly<Record<string, MapImageUrls>> = {
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
    base: '',
    full: '',
    placeholder: '',
  },

  'chapter1-ecosistemas': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350945/geoImages/keozbw51ancathhw6cwk.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1752350981/geoImages/g9xrqxop5nmfciklng1b.webp'),
  },

  'chapter1-formas-paisaje': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359002/geoImages/ki1nmtf1bry5hwfzpauv.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359777/geoImages/xyrkeumf4kv6eixtzuoz.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1752359002/geoImages/ki1nmtf1bry5hwfzpauv.webp'),
  },

  'chapter1-mosaicos-del-agua': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360161/geoImages/fpno8nmueqi0duweghhf.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360193/geoImages/ycxghm0xralzkptnbqqj.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360161/geoImages/fpno8nmueqi0duweghhf.webp'),
  },

  'chapter1-un-rio-cauca': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1752360349/geoImages/icivkz04s6s4ka6onht8.webp'),
  },

  'chapter2-valle': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285334/geoImages/kbg62bjm983wn9p6xexl.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285229/geoImages/nhbnbpekarmsu7ernhcj.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1759285334/geoImages/kbg62bjm983wn9p6xexl.webp'),
  },

  'chapter2-suarez': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061326/geoImages/mwz79qubfmr0x5zqtzto.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061249/geoImages/nkxiwrxtbovp66gobcdq.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1761061326/geoImages/mwz79qubfmr0x5zqtzto.webp'),
  },

  'chapter2-cali': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512015/geoImages/roog2p6gjo3dnnqpcfel.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759511931/geoImages/ku7ikq6ottmty9pl91u0.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512015/geoImages/roog2p6gjo3dnnqpcfel.webp'),
  },

  'chapter2-villa-rica': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512655/geoImages/pdxepthixmeebgei59yq.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512616/geoImages/sj5c6kcyz8oilmta1ra8.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1759512655/geoImages/pdxepthixmeebgei59yq.webp'),
  },

  'chapter2-m-oriente-cali': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762486120/geoImages/jnqo25dhvenvrseezvlt.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762485986/geoImages/xa15iigitokhfyvek9s5.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1762486120/geoImages/jnqo25dhvenvrseezvlt.webp'),
  },

  'chapter2-m-villa-rica': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1759612261/geoImages/pabcndrbg0gjx29iuccg.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1767891949/geoImages/knk721fgkqtvdxnppxzr.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1759612261/geoImages/pabcndrbg0gjx29iuccg.webp'),
  },

  'chapter2-m-suarez': {
    base: '/assets/maps/cap2/modelo-territorial-suarez.png',
    full: '/assets/maps/cap2/modelo-territorial-suarez.png',
    placeholder: '/assets/maps/cap2/modelo-territorial-suarez.png',
  },

  'chapter3-introduccion': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910384/geoImages/fzz0wacqalycmhq0jehp.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1762910449/geoImages/lvjzutoybjbt9hek2nza.webp'),
  },

  'chapter3-monocultivo': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996331/geoImages/jje1a33z8enjmlrwfa4j.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1762996447/geoImages/rvdipsrqu6fbn4repgay.webp'),
  },

  'chapter3-encharcaron': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762998575/geoImages/ladieazp24oyoyqszzlo.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1762997781/geoImages/b8zivpviw5iz5yz6cgbz.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1762998575/geoImages/ladieazp24oyoyqszzlo.webp'),
  },

  'chapter3-cali-deseca': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852352/geoImages/maiachqmczyrhmph1rql.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852262/geoImages/llovghvucpft64ea6zad.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1763852352/geoImages/maiachqmczyrhmph1rql.webp'),
  },

  'chapter3-humedales': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1763847570/geoImages/n4gxlxxpeoqnfma5dylj.webp'),
  },

  'chapter3-arcilla': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763846278/geoImages/zbtnuchm9uvshuqnaota.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1763845021/geoImages/ps2z0y6in7o5bbvjedyz.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1763846278/geoImages/zbtnuchm9uvshuqnaota.webp'),
  },

  'chapter4-introduccion': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp',
    full: 'assets/img/maps/homeCap4-high.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765910985/geoImages/u7oiqxpnvoocf2mym8qw.webp'),
  },

  'chapter4-asoyoge': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986325/geoImages/u2dqe5dcdqzn1am0whlj.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/u2dqe5dcdqzn1am0whlj.png'),
  },

  'chapter4-el-buhido': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/l5qj5qxh5onul1b26e71.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765988704/geoImages/p9hryf14z42ilaw0iiez.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/l5qj5qxh5onul1b26e71.png'),
  },

  'chapter4-bosque-comestible': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/yodemiucfhtp0iklk2fi.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765989453/geoImages/p9npqvcz4r2f7zziqi6e.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765986412/geoImages/yodemiucfhtp0iklk2fi.png'),
  },

  'chapter4-los-bajios': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/xrssyymmhamqorcf5gb0.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991261/geoImages/o0jnbtkeiddi6ielq1ow.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/xrssyymmhamqorcf5gb0.png'),
  },

  'chapter4-el-paso': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/gqczkzh18jqhgatzwiht.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765992022/geoImages/tljpufqwb78r7nkqt27y.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/gqczkzh18jqhgatzwiht.png'),
  },

  'chapter4-las-mercedes': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/uda3sxgw61nf5tt6mtfp.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765992502/geoImages/xndkrm7tpgdbw881co0v.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/uda3sxgw61nf5tt6mtfp.png'),
  },

  'chapter4-la-virginia': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/smdehdeaewwwasco6wt5.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993236/geoImages/gikolsdb7i25mvhakxds.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/smdehdeaewwwasco6wt5.png'),
  },

  'chapter4-centro-agropecuario': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/drkxyppqvzpngqura5qg.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765993765/geoImages/gecszuuozkmhyng5w6y7.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/drkxyppqvzpngqura5qg.png'),
  },

  'chapter4-la-caicedo': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/fmyppc7aotckznz2zsah.png',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1765994205/geoImages/ssdze3oougoysjid5icz.png',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1765991292/geoImages/fmyppc7aotckznz2zsah.png'),
  },

  'chapter4-problematicas': {
    base: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp',
    full: 'https://res.cloudinary.com/dvluvxfvn/image/upload/v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp',
    placeholder: ph('https://res.cloudinary.com/dvluvxfvn/image/upload/v1768342194/geoImages/yqwuuru4zw9jvfoa4cpl.webp'),
  },
}
