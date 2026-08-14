const CLOUD = 'https://res.cloudinary.com/dvluvxfvn/image/upload'

const arrow = (id, numero, name, coords, icon, angle) => ({
  id,
  numero,
  name,
  coords,
  capa: 'Nodo Oriente de Cali',
  variant: 'arrow',
  icon,
  angle,
  popup: { title: name, image: icon },
})

export const CAP2_CALI_POIS = [
  arrow('poi-cap2-cali-chontaduro', 1, 'Casa del Chontaduro', [-76.486678, 3.432277], `${CLOUD}/v1761794279/geoImages/gqy5xtw09p0qfta46jr6.webp`, 270),
  arrow('poi-cap2-cali-huerta', 2, 'Huerta Madre La Laguna', [-76.486929, 3.433365], `${CLOUD}/v1761792935/geoImages/lnyyorgnj7zmdzzi93p1.webp`, 90),
  arrow('poi-cap2-cali-chicas', 3, 'Chicas Comunicativas', [-76.495738, 3.413591], '/assets/img/entramados/chicasComunicativas.webp', 140),
  arrow('poi-cap2-cali-afroyoga-1', 4, 'Afroyoga', [-76.506431, 3.390553], `${CLOUD}/v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp`, 140),
  arrow('poi-cap2-cali-afroyoga-2', 4, 'Afroyoga', [-76.516033, 3.443108], `${CLOUD}/v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp`, 140),
  arrow('poi-cap2-cali-afroyoga-3', 4, 'Afroyoga', [-76.489738, 3.45103], `${CLOUD}/v1761791824/geoImages/gk60hbzfh98apd8uuekk.webp`, 140),
  arrow('poi-cap2-cali-matamba', 5, 'Revista Afro Juvenil Matamba', [-76.486678, 3.432277], `${CLOUD}/v1761794790/geoImages/mecisufjjucxdzzalslg.webp`, 270),
  arrow('poi-cap2-cali-red-mujeres-1', 6, 'Red de mujeres y organizaciones del Oriente', [-76.480056, 3.447839], '/assets/img/entramados/mujeresDelOriente.webp', 280),
  arrow('poi-cap2-cali-red-mujeres-2', 6, 'Red de mujeres y organizaciones del Oriente', [-76.521509, 3.435984], '/assets/img/entramados/mujeresDelOriente.webp', 270),
]
