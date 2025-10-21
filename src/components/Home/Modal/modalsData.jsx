import iconInfo from "../../../../public/assets/interface/icons/line/svg/iconInfo.svg";
import iconPresentation from "../../../../public/assets/interface/icons/line/svg/iconPresentation.svg";
import fichaTecnica from "../../../../public/assets/interface/icons/line/svg/fichatecnica.svg";
const modalsData = [
  {
    id: 0,
    layaut: "Luyaut1",
    size: "large", // Tamaño large para modal inicial
    title: "",
    highLight: "Confines del sur del valle alto caucano",
    icono: (
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 40 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M31.4232 19.2424C32.0381 19.7215 32.7393 20.0679 33.4854 20.2611C34.0293 20.4307 34.5977 20.4996 35.1646 20.4648C36.2263 20.3987 37.2481 20.0207 38.1105 19.3748C38.6819 18.9335 39.1486 18.3628 39.4753 17.7061C39.8021 17.0495 39.9801 16.3241 39.9959 15.5854C40.026 14.7571 39.8906 13.9314 39.5982 13.16C39.3058 12.3887 38.8629 11.6884 38.2971 11.1032C37.6311 10.4658 36.8238 10.0087 35.9468 9.77241C35.0698 9.53608 34.1502 9.52781 33.2694 9.74833C32.7572 9.87272 32.2646 10.0716 31.8062 10.3392C31.4331 10.0743 31.001 9.79926 30.4805 9.45291C29.4593 8.75002 28.3104 7.93508 27.2989 7.35443C27.5003 6.4736 27.5003 5.55614 27.2989 4.67531C27.0629 3.61906 26.5575 2.64802 25.8358 1.86375C25.4722 1.41635 25.0371 1.03729 24.5494 0.743206C23.6238 0.200103 22.5669 -0.0545556 21.5053 0.00975669C20.795 0.0625573 20.1056 0.282669 19.4897 0.653358C18.8737 1.02405 18.3473 1.53555 17.9505 2.14898C17.4918 2.82657 17.1753 3.59645 17.0214 4.40888C16.8675 5.22131 16.8796 6.0582 17.0569 6.86547C17.2893 7.78003 17.7365 8.62062 18.3585 9.31212C18.9806 10.0036 19.758 10.5245 20.6215 10.8281L20.9554 10.93C20.8881 12.2884 20.9144 13.6501 21.0339 15.0047C21.0339 15.4326 21.0929 15.8095 21.1125 16.166C20.6044 16.2705 20.1077 16.4275 19.6297 16.6346C19.132 16.8556 18.6608 17.1359 18.2255 17.4699C17.3298 16.3602 16.3654 15.3121 15.3385 14.3324C14.7007 13.6574 14.0287 13.0181 13.3254 12.4173C13.4132 12.1372 13.4628 11.8457 13.4727 11.5514C13.4988 10.986 13.409 10.4212 13.2093 9.89445C13.0096 9.36767 12.7044 8.89081 12.314 8.49535C11.8564 8.05016 11.298 7.73183 10.6904 7.56981C10.0828 7.40778 9.44562 7.40728 8.83779 7.56836C8.20688 7.71654 7.62639 8.03909 7.15787 8.5018C6.68936 8.96451 6.3503 9.55013 6.17663 10.1965C5.97476 10.8595 5.97476 11.5709 6.17663 12.2339C6.38377 12.8162 6.72018 13.3396 7.15861 13.7619C7.24267 13.8388 7.33121 13.9103 7.42374 13.9758C6.90102 14.9575 6.45128 15.9792 6.07843 17.0319C5.9115 17.4801 5.77402 17.8468 5.65618 18.183C5.18285 18.1632 4.70937 18.2181 4.25196 18.346C3.40278 18.5599 2.61715 18.9866 1.96395 19.5888C1.17908 20.3207 0.60185 21.2612 0.294593 22.3086C0.102063 22.8643 0.00243285 23.45 0 24.0404C0.00519722 25.1423 0.304285 26.2212 0.864139 27.1576C1.25065 27.7784 1.766 28.3018 2.37253 28.6896C2.97906 29.0773 3.66144 29.3196 4.36979 29.3987C5.17214 29.4949 5.98505 29.414 6.75511 29.1612C7.52517 28.9084 8.23494 28.4894 8.83779 27.9318C9.56066 27.2343 10.0753 26.3363 10.3206 25.3443H11.8721C12.9915 25.3443 14.219 25.3443 15.2501 25.2526C15.4035 26.0716 15.668 26.8638 16.0357 27.6058C16.5558 28.71 17.3444 29.6544 18.3237 30.346C19.1044 30.8612 19.9598 31.243 20.8572 31.4768C20.7162 32.6626 20.6637 33.858 20.7001 35.0523C20.7001 35.5515 20.7001 35.9691 20.7001 36.346C19.8693 36.5702 19.1019 36.9962 18.4612 37.5888C17.7602 38.2496 17.2502 39.0996 16.9882 40.0438C16.7172 41.0049 16.7378 42.0291 17.0471 42.9776C17.3314 43.8336 17.8057 44.6083 18.4317 45.2391C19.1774 45.9978 20.1071 46.5329 21.1223 46.7875C21.6662 46.9571 22.2346 47.026 22.8015 46.9912C23.8645 46.9314 24.8878 46.5527 25.7474 45.9013C26.3206 45.461 26.7892 44.8907 27.1177 44.234C27.4461 43.5773 27.6257 42.8514 27.6426 42.1118C27.6718 41.2843 27.5351 40.4595 27.2409 39.6897C26.9468 38.9199 26.5018 38.2218 25.934 37.6398C25.3389 37.0632 24.6229 36.6378 23.8424 36.397V35.0116C23.8424 33.891 23.8424 32.6788 23.8424 31.6397C24.7957 31.4893 25.7104 31.1429 26.533 30.6211C27.467 31.7769 28.4954 32.8471 29.6066 33.8197C30.2154 34.38 30.6868 34.8384 31.0992 35.1746C30.91 35.8423 30.9271 36.5548 31.1483 37.2119C31.3513 37.7963 31.6883 38.3207 32.1303 38.7399C32.5793 39.1915 33.1292 39.5206 33.7309 39.6975C34.1652 39.8733 34.6301 39.9531 35.0958 39.9318C35.8039 39.8833 36.4845 39.6292 37.0598 39.1983C37.444 38.8811 37.7546 38.4784 37.9688 38.02C38.1829 37.5616 38.2951 37.0592 38.2971 36.5498C38.3189 35.9849 38.2271 35.4214 38.0276 34.8953C37.8281 34.3692 37.5253 33.8919 37.1383 33.4937C36.6842 33.0672 36.1357 32.7632 35.5414 32.6086C34.9472 32.4541 34.3253 32.4537 33.7309 32.6075C33.5192 32.6603 33.3122 32.7319 33.1122 32.8214C32.7391 32.4343 32.2579 31.9963 31.6589 31.4462C30.6278 30.4886 29.5182 29.4088 28.5461 28.6041L28.6541 28.4513C28.9314 27.989 29.1524 27.4929 29.312 26.9742C29.6265 26.0452 29.7795 25.0656 29.7637 24.0811C29.7786 22.9837 29.5642 21.896 29.1352 20.8927L29.5673 20.5871C30.2056 20.1287 30.9028 19.6906 31.4232 19.2424ZM35.2137 35.5413C35.4219 35.7772 35.5345 36.0873 35.5279 36.4072C35.5289 36.4928 35.5129 36.5777 35.4808 36.6566C35.4487 36.7355 35.4012 36.8066 35.3413 36.8656C35.1644 37.0013 34.9592 37.092 34.7423 37.1304C34.6542 37.1398 34.5653 37.1398 34.4772 37.1304C34.2526 37.0496 34.0504 36.9133 33.888 36.7331C33.7719 36.5974 33.6849 36.4377 33.6327 36.2645C33.5985 36.1483 33.5985 36.0242 33.6327 35.908C33.6978 35.7571 33.8002 35.6267 33.9295 35.5301C34.0589 35.4335 34.2105 35.3741 34.3692 35.3579C34.5222 35.3172 34.6825 35.3154 34.8363 35.3526C34.9902 35.3899 35.1331 35.4651 35.253 35.5718L35.2137 35.5413ZM34.0058 12.9266C34.3789 12.8284 34.7693 12.8253 35.1438 12.9176C35.5183 13.0098 35.8657 13.1947 36.1564 13.4563C36.4048 13.7271 36.5981 14.0471 36.7247 14.3972C36.8512 14.7472 36.9084 15.1202 36.8929 15.4937C36.8912 15.7334 36.8404 15.9699 36.7439 16.1877C36.6474 16.4055 36.5074 16.5995 36.3331 16.7568C35.9384 17.0601 35.4751 17.253 34.9878 17.3171C34.7827 17.345 34.5751 17.3484 34.3692 17.3273C33.8639 17.1698 33.407 16.8784 33.0435 16.4818C32.7723 16.1935 32.5675 15.8452 32.4445 15.4631C32.3367 15.1328 32.3367 14.7748 32.4445 14.4444C32.5523 14.0751 32.7562 13.7438 33.0337 13.4869C33.3098 13.222 33.6432 13.0299 34.0058 12.9266ZM29.6655 12.7534C29.5578 12.9981 29.466 13.2499 29.3906 13.5073C29.1227 14.4693 29.1467 15.4936 29.4593 16.4411C29.4593 16.5531 29.5379 16.6448 29.5771 16.7568C28.9815 17.082 28.4045 17.4426 27.8489 17.8366L27.5248 18.0506C27.1661 17.7022 26.7856 17.379 26.3857 17.0828C25.7763 16.6943 25.1143 16.4024 24.4218 16.2169H24.245C24.245 15.7993 24.1861 15.3409 24.1566 14.801C24.0682 13.5378 24.0093 12.1524 23.8718 10.9809C24.5628 10.7838 25.2054 10.4365 25.7572 9.96225C26.7276 10.7907 27.7513 11.5497 28.821 12.2339L29.6655 12.7534ZM20.1109 6.12183C20.0411 5.76285 20.0416 5.39296 20.1125 5.0342C20.1833 4.67544 20.3231 4.33513 20.5233 4.03354C20.6517 3.81936 20.8254 3.63832 21.0313 3.50418C21.2371 3.37004 21.4698 3.28631 21.7115 3.25934C22.2014 3.23364 22.6899 3.33151 23.1354 3.54457C23.3264 3.6347 23.5047 3.7512 23.6656 3.89092C24.0155 4.30055 24.2529 4.80012 24.353 5.33745C24.4367 5.73686 24.4367 6.15027 24.353 6.54968C24.2652 6.8875 24.0802 7.18953 23.8227 7.41555C23.5441 7.66396 23.2039 7.8263 22.8408 7.88415C22.4246 7.96441 21.995 7.91843 21.6035 7.75172C21.2479 7.62226 20.9272 7.40695 20.6677 7.12355C20.4081 6.84016 20.2173 6.49681 20.1109 6.12183ZM8.83779 10.9504C8.88662 10.7971 8.97443 10.6604 9.09196 10.5546C9.20949 10.4488 9.35238 10.3779 9.50553 10.3493C9.66067 10.3038 9.82424 10.2985 9.9818 10.334C10.1394 10.3696 10.2861 10.4448 10.4089 10.5531C10.6178 10.7927 10.7303 11.1062 10.7232 11.4291C10.7232 11.7042 10.6348 11.8061 10.5366 11.8876C10.3574 12.0191 10.1532 12.1094 9.9376 12.1524C9.84946 12.1618 9.76061 12.1618 9.67247 12.1524C9.44788 12.0716 9.24565 11.9352 9.08328 11.7551C8.97307 11.6245 8.88956 11.472 8.83779 11.3069C8.79807 11.1916 8.79807 11.0656 8.83779 10.9504ZM6.7069 25.5277C6.43883 25.7666 6.12586 25.9452 5.78779 26.0522C5.44973 26.1592 5.09394 26.1921 4.74295 26.1491C4.49544 26.1313 4.25493 26.0562 4.03911 25.9292C3.82329 25.8023 3.63764 25.6268 3.49584 25.4156C3.23321 24.9747 3.07505 24.4755 3.03431 23.9589C3.00866 23.7356 3.00866 23.5099 3.03431 23.2866C3.21678 22.7724 3.52466 22.3161 3.92791 21.9623C4.23569 21.6884 4.60301 21.4961 4.99826 21.402C5.32543 21.3178 5.67014 21.3464 5.98024 21.4835C6.33886 21.6399 6.65224 21.8901 6.88976 22.2097C7.12729 22.5293 7.28082 22.9074 7.33536 23.3069C7.40958 23.7023 7.39124 24.1103 7.28188 24.4967C7.17252 24.8832 6.97533 25.2367 6.7069 25.5277ZM11.7837 22.054H10.2813C9.96587 21.0066 9.36988 20.0739 8.56283 19.3647C8.70031 19.0285 8.83779 18.6516 9.00472 18.2034C9.41715 17.1032 9.91796 15.9012 10.2027 14.8927C10.5384 14.8651 10.8689 14.7897 11.1847 14.6685C11.7826 15.3873 12.4221 16.0677 13.0996 16.7059C14.0815 17.7246 15.201 18.8553 16.1732 19.7619C15.9294 20.1712 15.7255 20.6046 15.5643 21.0557C15.4163 21.4374 15.3045 21.8331 15.2305 22.2373C14.0874 22.0894 12.9354 22.0281 11.7837 22.054ZM23.862 43.2629C23.4859 43.5511 23.0477 43.7399 22.5855 43.813C22.3767 43.8382 22.1658 43.8382 21.957 43.813C21.4498 43.6642 20.9892 43.3796 20.6215 42.9878C20.3533 42.6989 20.1518 42.3506 20.0323 41.9692C19.9294 41.638 19.9294 41.2816 20.0323 40.9505C20.1399 40.5786 20.3478 40.2464 20.6313 39.9929C21.0722 39.6026 21.6327 39.3882 22.2123 39.3882C22.7919 39.3882 23.3525 39.6026 23.7933 39.9929C24.0456 40.2609 24.2414 40.5805 24.3682 40.9312C24.495 41.282 24.55 41.6563 24.5298 42.0303C24.5171 42.2728 24.4524 42.5094 24.3402 42.7227C24.2281 42.9359 24.0714 43.1205 23.8817 43.2629H23.862ZM21.9963 27.9114C21.3711 27.7895 20.7743 27.5439 20.2385 27.1881C19.7791 26.8524 19.4106 26.3999 19.1682 25.874C18.8857 25.2954 18.7124 24.6661 18.6576 24.02C18.5939 23.4238 18.6784 22.8206 18.903 22.2679C19.083 21.7608 19.3615 21.2974 19.7213 20.9066C20.0811 20.5158 20.5145 20.206 20.9947 19.9962C21.8068 19.6379 22.7075 19.5559 23.5674 19.7619C23.91 19.8448 24.2403 19.975 24.5494 20.149C24.7949 20.3732 25.0993 20.4954 25.2663 20.7704C25.3645 20.8825 25.4725 20.9844 25.5707 21.0862L25.7867 21.4733L26.0027 21.8299L26.1402 22.2271C26.1893 22.3392 26.2384 22.4513 26.2777 22.5633C26.3721 23.0285 26.4051 23.5049 26.3759 23.9793C26.3512 24.5761 26.2318 25.1647 26.0224 25.7212C25.8525 26.2346 25.5583 26.6941 25.1681 27.0557C24.7443 27.4451 24.2382 27.7255 23.6905 27.8742C23.1429 28.0228 22.5692 28.0356 22.0159 27.9114H21.9963Z"
          fill="#0599B7"
        />
      </svg>
    ),
    texto:
      "Esta mapa se conforma de dos elementos: una imagen 3D construida a partir del Modelo de Elevación Nacional de Colombia adquirido por el IGAC y procesada en un modelo 3D en el sotware Qgis. Posteriormente fue redibujado con texturas y colores que contrastan los relieves y el agua de esta zona de la geografía de Colombia. El segundo elemento, son las ilustraciones y los textos de 15 lugares, que en las alturas de las cordilleras y la planicie, constituyen el territorio del sur del valle alto del río Cauca. Este fue un proceso creativo realizado con base en el conocimiento geográifco comunitario, institucional y académico de esta parte de la cuenca del río Cauca.",
    boton: false,
    image: "",
    description: "",
  },

  {
    id: 1,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para modal de bienvenida
    highLight: "El río pensado y sentido desde la cartografía y el dibujo",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),
    texto: (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1em",
          margin: "1em 0",
        }}
      >
        <div
          style={{
            flex: 6, // Ajusta el valor para hacerlo más grande que el segundo div
            fontSize: "0.8em",
            color: "#444",
            fontFamily: "inherit",
            textAlign: "start",
            minWidth: "410px",
          }}
        >
          Este atlas surge de dos procesos solidarios desarrollados por el
          Tejido de transicionantes del valle alto del río Cauca entre el 2023 y
          2024. El primero es la creación de tres entramados territoriales a
          partir de un diagnóstico de Paz territorial pluriversal realizado
          entre las personas que hemos consolidado en juntanzas de muchos tipos,
          alternativas transformadoras (ATs) en los municipios de Suárez y Villa
          Rica, en el norte de Cauca y en el oriente de Cali, en el Valle del
          Cauca. Las ATs, como mingas de pensamiento y acción, dan cuenta del
          potencial que tenemos como habitantes de esta cuenca, de este río
          Cauca, para invocar y convocar alrededor de nuestras capacidades y
          saberes y producir posibilidades emergentes, valientes y contundentes
          para hacerle frente a los conflictos territoriales creados por el
          modelo de desarrollo extractivista. El segundo es una juntanza
          formativa y creativa que tomó la forma de Colaboratorio de
          cartografías críticas y codiseño territorial donde nos propusimos
          poner en juego la intuición espacial, el vínculo afectivo y el
          conocimiento geográfico académico y cotidiano con las representaciones
          sensibles y técnicas del territorio. Las representaciones gráficas de
          los lugares de la vida toda en el sur del valle alto del río Cauca nos
          está permitiendo, a través de dibujos, esquemas, mapas y textos
          construir herramientas para reconocer, interpretar, analizar y disoñar
          las transiciones eco sociales justas de los territorios de los que
          hacemos parte. <br /> <br />
          La organización de este atlas consta de cuatro partes que abordan
          aspectos bioculturales relevantes del sur del valle alto del río
          Cauca. La primera parte está centrada en el tema de la gran cuenca del
          río, sus partes, formas de paisajes, relaciones ecosistémicas y el
          mosaico de cuencas pequeñas y tejidos del agua que conforman nuestro
          territorio. En la segunda parte nos ubicamos en los entramados
          territoriales, portadores de saberes y capacidades que se tejen en
          Suárez, entre los territorios de varios de los consejos de comunidades
          negras, con Villa Rica y cuatro municipios cercanos; Puerto Tejada,
          Miranda, Guachené y Padilla; y el Oriente de Cali, donde nos enfocamos
          en una zona urbana. En la tercera parte, hacemos énfasis en las formas
          en las que el río Cauca se manifiesta en el valle alto de su cuenca,
          el flujo y dinámica de lo acuático y los cambios en el tiempo causados
          por las intervenciones del modelo de desarrollo extractivista que nos
          tiene, desde hace generaciones, enfrentando conflictos y violencias de
          diversa índole. Finalmente, presentamos casos concretos que conjugan
          acciones, capacidades y saberes para hacer frente a los conflictos
          territoriales que ponen en riesgo la soberanía alimentaria, el cuidado
          del agua y el buen vivir o el vivir sabroso y que dan pautas para
          desencadenar procesos de pensamiento, imaginación y acción que hagan
          posibles la transformación productiva, la restauración ecológica y
          ontológica de los ecosistemas y la reparación de las desigualdades e
          injusticias históricas en el sur del valle alto del río Cauca.
        </div>
        <div
          style={{
            borderRadius: "8px",
            fontSize: "0.75em",
            color: "#444",
            fontFamily: "inherit",
            textAlign: "start",
            width: "260px",
            minWidth: "220px",
            maxWidth: "320px",
            boxSizing: "border-box",
            lineHeight: "1.4",
          }}
        >
          <sup>1</sup> Alternativas transformadoras son aquellas formas
          organizativas que procuran romper con los sistemas dominantes para
          transitar por otros caminos, hacia formas radicales y directas de
          democracia política y económica para la vida digna, contribuyendo a
          construir otros mundos y territorios posibles para el buen vivir y el
          vivir sabroso.
          <br />
          <span style={{ fontStyle: "italic", fontSize: "0.95em" }}>
            (Diagnóstico de Paz Territorial Pluriversal, 2024: 6)
          </span>
        </div>
      </div>
    ),
    boton: false,
    link: "https://docs.google.com/document/d/1b8t-bCbnQOOCKgBMKEWtUB0e9oru086TC7NiXr875RE/edit?usp=sharing",
    image: "../../../../public/assets/img/background/tejidos.png",
    description:
      "Taller La intuición espacial y las construcciones geográficas ¿Por qué los mapas importan? Octubre 7 de 2023. Casa Cultural del Niño y de la Niña. Villa",
    image2: "/assets/img/background/taller1.webp",
    description2:
      "Taller La intuición espacial y las construcciones geográficas ¿Por qué los mapas importan? Octubre 7 de 2023. Casa Cultural del Niño y de la Niña. Villa Rica.",
  },

  {
    id: 2,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "El valle alto del río Cauca, su cuenca y sus mundos",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "El valle alto del río Cauca en el suroccidente colombiano es una planicie fértil de 300.000 hectáreas y está bordeada por las cordilleras Central y Occidental, presenta rastros de poblamiento desde hace más de 9000 años y su paisaje actual es tiene menos de un siglo de conformado. Allí predomina un extenso sistema agroindustrial creado a partir del monocultivo de la caña de azúcar, acompañado por una red urbana a ambos lados del río que conserva algo del rastro del poblamiento de las diferentes culturas nativas de Abya Yala y del que se consolidó con la irrupción colonizadora ibérica. En esta red sobresale Cali, una de las ciudades más antiguas del sur occidente colombiano y, actualmente, la más poblada y extensa de este valle. Desde esta ciudad se irradia un intenso proyecto metropolitanizante que agudiza las desigualdades históricas de la región y se articulan varias de las dinámicas que están creando graves desequilibrios ecoterritoriales. \n\nAl valle alto del Cauca, antes de la construcción de varios jarillones en el curso del río (1958 - 1972) y del represamiento de sus aguas con La Salvajina (1985) justo antes de conformarse la planicie, llegaba apresurado el río Cauca desde el Macizo Colombiano. Sobre esta planicie, la más extensa del río en su cuenca alta, el Cauca regaba sus aguas nutriendo con vigor los suelos fertilizados por la actividad volcánica regional hace miles de años e incrementaba la vida en cientos de cuerpos acuáticos como ciénagas, madreviejas, zanjones, caños, humedales, charcos y lagunas. Poco a poco, el diseño del territorio concebido desde la perspectiva de la producción de alto rendimiento económico, ha transformado el panorama de esta planicie y se han creado unas condiciones de riesgo para muchos seres que la habitan y para los distintos ciclos y tejidos de la vida. \n\nLos mapas de este capítulo, toman el hilo de los saberes y las poéticas de las comunidades pobladoras del río y los articulan con el conocimiento geográfico para reconocer el territorio que habitamos y para presentarlo en la cartografía con unas particularidades. Una de ellas es la rotación de la composición convencional de la cartografía que dispone todo lo que está al norte, en la parte superior del mapa. En lugar de esto, preferimos que fuera la costa y el océano Pacífico, al occidente, lo que aparece arriba. De esta forma, su presencia imponente cobra relevancia y es un llamado al vínculo estrecho que tiene el sur del valle con este litoral. Con el cambio de orientación, se facilita la lectura del mapa de izquierda a derecha, hecho que refuerza el sentido sur a norte, que es el que lleva el curso del río Cauca desde su nacimiento en el páramo de Paletará, en el Macizo Colombiano, hasta su disolución en La Mojana. \n\nSe construyeron cinco mapas para este capítulo e iniciamos con los dos primeros, reconociendo la cuenca del río Cauca en toda su extensión y como parte de un sistema más amplio: la vertiente del Caribe, también como tributario, no del río Magdalena, sino de La Mojana. El río Cauca, antes que desembocar en el Magdalena, como tradicionalmente se ha dicho, llega a ser partícipe del impresionante conjunto de aguas pulsantes de la Depresión Momposina. Hecha esta provocación al relato geográfico hegemónico, presentamos los múltiples paisajes de la cuenca y su contexto y una reflexión cartográfica sobre las transformaciones ecosistémicas en el sur del valle alto del río Cauca y en la parte de la región Pacífica que le corresponde al otro lado de la cordillera Occidental. Finalizamos con un mapa del mosaico de las aguas en el sur del valle alto. Este se compone de las aguas presentes, desde las atmosféricas hasta la subterráneas, y de las 11 cuencas que nutren al río Cauca en esta parte de su recorrido.",
    boton: true,
    link: "https://docs.google.com/document/d/1uDWBiK19UN8G_1yVICTFgG-4jnbrp1vv/edit?pli=1#heading=h.y1bwv3ismpus",
    image: "",
    description: "",
  },

  {
    id: 3,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Bredunco, Caucayaco o Cauca en la vertiente del Caribe",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),
    texto:
      "En el flujo de las aguas que surcan a Colombia, dos ríos que nacen en el macizo colombiano recorren los Andes, separados en tres cordilleras, hasta llegar a La Mojana. Uno de ellos, el Magdalena, ponderado como el río más importante de Colombia, se dirige apresurado al nororiente, entre las cordilleras Central y Oriental. El otro, el Cauca, discurre hacia el occidente, tallando valles y cañones entre las cordilleras Central y Occidental. Es conocido en tiempos milenarios por pueblos ancestrales como el Bredunco aquí, como Caucayaco allá; ha determinado las formas de vida en las altas montañas y en el extenso valle de su cuenca alta, en la estrechez de su cuenca media y en la plana inmensidad del Caribe, su cuenca baja se va diluyendo en las aguas de la Depresión Mompoxina con los ríos San Jorge, Magdalena y César. \n\nEl río Bredunco, o Cauca, recorre aproximadamente 1350 kilómetros, desde su nacimiento cerca de la laguna del Buey hasta su desembocadura en La Mojana; bañan de vitalidad, abundancia y fertilidad los asentamientos a lo largo de sus riberas; irriga con sus aguas los departamentos de Cauca, Valle, Risaralda, Caldas, Antioquia, Sucre y Bolívar y concentra más del 20% de la población del país a lo largo de sus orillas. Este río imponente se ha consolidado, junto con el Magdalena y otros tantos, como vertebrador de la nación colombiana. Ambos son hilos vitales que articulan las relaciones económicas, sociales, culturales y en los que sobreviven las cosmovisiones de pobladores de memoria ancestral. \n\nA pesar de la abundancia que brinda el río Cauca a las poblaciones asentadas en su cuenca, su vitalidad se ha visto diezmada por las concepciones que reducen al agua a un simple recurso, y que no la reconocen como lo que realmente es: un tejido de vida, un ser vivo que da vida. La relación establecida entre este ser y las comunidades es una clara muestra de ello. Para muchas personas, el río es visto como una banda transportadora de desechos; y aunque se abastecen de sus aguas, paradójicamente, le vierten contaminantes provenientes de los grandes centros urbanos como: desechos tóxicos de industrias extractivistas, del cemento, de plantas de asfalto, de la minería de oro y químicos agrícolas de la industria azucarera en el Valle del Cauca. Estos múltiples contaminantes han hecho que el Cauca sea uno de los ríos más contaminados de Colombia. Como si esto no fuera suficiente, su flujo vital es contenido por la construcción de represas como La Salvajina en Cauca (o Salvajada, para las comunidades de Suárez), e Hidroituango, en Antioquia. Las represas han llevado a la desaparición de decenas de especies del río y con ellas, a los ecosistemas presentes en él. \n\nEn el contexto de la crisis climática se nos convoca a pensar, no solo en la reparación de la deuda histórica y la restauración de los ecosistemas que ha destruido el desarrollo a lo largo de este ser vivo, sino también a cambiar nuestra relación con el río a partir del sentir, pensar y disoñar transiciones eco sociales justas, conectándonos con el mundo de manera más respetuosa y reconociendo la profunda y radical relacionalidad que tenemos con todo lo que nos rodea.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },

  {
    id: 4,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Pliegues, llanuras y otras formas del paisaje",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),
    texto:
      "Este mapa tiene como objetivo representar las formas del paisaje presentes en las regiones naturales que conforman la cuenca del río Cauca: Andina y Caribe y la del Pacífico que, como hemos mencionado antes, tiene un fuerte vínculo cultural y de poblamiento, sobre todo por procesos de migradestierro con el valle alto del río. Las regiones naturales se establecen por sus paisajes, climas y geologías particulares que, en conjunto, definen características ecológicas y geográficas únicas. \n\nEn el caso específico de los tres entramados territoriales que conforman el Tejido de transicionantes  del valle alto del río Cauca destacamos los dos paisajes asociados al sur del valle alto: el Altiplano de Popayán (Ver mapa forma del paisaje N° 11) y el Valle geográfico del Cauca (Ver mapa forma del paisaje N° 8). El primer paisaje se caracteriza por su clima templado, consecuencia de su altitud media (1730 m s. n m). Su topografía está marcada por pequeños accidentes orográficos, como colinas suaves y mesetas, que van disminuyendo gradualmente en magnitud hasta fusionarse con el valle alto del río Cauca, específicamente en las inmediaciones de los municipios de Suárez, Buenos Aires y Santander de Quilichao. En contraste, el Valle alto del río Cauca presenta un perfil muy diferente. Su clima es cálido, con variaciones entre húmedo y seco, según las zonas, está influenciado por su baja altitud (1000 a 900 m s.n. m.) y su posición entre las cordilleras Central y Occidental. La característica geomorfológica más notable de esta región es su terreno predominantemente plano, resultado de milenios de deposición de material volcánico y sedimentos de los afluentes del río Cauca. \n\nEs importante señalar que este mapa de formas del paisaje se articula estrechamente con el mapa de existencias y transformaciones ecosistémicas, el cual muestra la biodiversidad que caracteriza estos paisajes. Esta correspondencia entre regiones naturales, formas del paisaje y ecosistemas no es casual debido a que es el resultado de una larga historia evolutiva y geológica, donde las condiciones geográficas han accionado como filtros, moldeando la vida para adaptarse a cada contexto específico.",
    boton: true,
    link: "https://docs.google.com/document/d/1b8t-bCbnQOOCKgBMKEWtUB0e9oru086TC7NiXr875RE/edit?usp=sharing",
    image: "",
    description: "",
  },
  {
    id: 5,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Existencias y transformaciones ecosistémicas",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),
    texto:
      "Este mapa está compuesto por las 11 cuencas principales que nutren al río Cauca en el sur del valle alto. En el contexto de las cuencas se revelan las formas y espacios en los que se encuentra el agua, desde la atmosférica hasta la subterránea y la relación de cada cuenca con los ecosistemas de nevados, páramos y bosques Alto andino, de Niebla y Sub andino que los nutren; además de los cursos superficiales, el mapa también visibiliza los acuíferos presentes en la zona. Estos reservorios subterráneos, a menudo ignorados en la cartografía tradicional, son en realidad grandes depósitos de agua que juegan un papel crucial en el equilibrio hídrico del territorio, actuando como reservas estratégicas y reguladores naturales del ciclo del agua que suplen de este líquido vital a gran parte de las comunidades del norte del Cauca. \n\nLa elaboración de este mapa trasciende la mera representación geográfica, se realizó con el propósito de retratar el agua como un cuerpo vivo, dinámico y complejo. En esta visión, el conjunto de nubosidad, cada río y cada quebrada, los humedales visibles y los tres acuíferos destacados no son simplemente recursos, sino entidades con sus propias dinámicas, historias y roles ecológicos y culturales.",
    boton: true,
    link: "https://docs.google.com/document/d/1uDWBiK19UN8G_1yVICTFgG-4jnbrp1vv/edit?pli=1#heading=h.y1bwv3ismpus",
    image: "",
    description: "",
  },
  {
    id: 6,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Mosaico de  cuencas y aguas",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),
    texto:
      "Este mapa está compuesto por las 11 cuencas principales que nutren al río Cauca en el sur del valle alto. En el contexto de las cuencas se revelan las formas y espacios en los que se encuentra el agua, desde la atmosférica hasta la subterránea y la relación de cada cuenca con los ecosistemas de nevados, páramos y bosques Alto andino, de Niebla y Sub andino que los nutren;  además de los cursos superficiales, el mapa también visibiliza los acuíferos presentes en la zona. Estos reservorios subterráneos, a menudo ignorados en la cartografía tradicional, son en realidad grandes depósitos de agua que juegan un papel crucial en el equilibrio hídrico del territorio, actuando como reservas estratégicas y reguladores naturales del ciclo del agua que suplen de este líquido vital a gran parte de las comunidades del norte del Cauca. \n\nLa elaboración de este mapa trasciende la mera representación geográfica, se realizó con el propósito de retratar el agua como un cuerpo vivo, dinámico y complejo. En esta visión, el conjunto de nubosidad, cada río y cada quebrada, los humedales visibles y los tres acuíferos destacados no son simplemente recursos, sino entidades con sus propias dinámicas, historias y roles ecológicos y culturales.",
    boton: true,
    link: "https://docs.google.com/document/d/1uDWBiK19UN8G_1yVICTFgG-4jnbrp1vv/edit?pli=1#heading=h.y1bwv3ismpus",
    image: "",
    description: "",
  },
  {
    id: 7,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Un Río Cauca muchos mundos en transición",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={iconPresentation}
          alt="icono Presentation"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),
    texto:
      "Este mapa presenta una síntesis de las estructuras geográficas que componen el entorno de la cuenca del río Cauca, desde su afloramiento, gota a gota cerca a la laguna del Buey en el páramo de Paletará, Macizo Colombiano hasta su desembocadura en el Brazo de Loba en La Mojana, Depresión Mompoxina. Las estructuras convocadas a narrar el río Cauca comprende los paisajes altos de las dos cordilleras, Central y Occidental, entre las que se crea la cuenca interandina del río Cauca. A lo largo de los parteaguas de esta sucesión de gigantes montañosos localizamos los nevados, volcanes y páramos a partir de los cuales se conforman las estrellas fluviales de las que brotan los ríos de varias cuencas prominentes del país: una amazónica: la del Caquetá, una pacífica: la del Patía, dos caribeñas: las del San Jorge y Sinú y dos andinas, las del Magdalena y Cauca.\n\nComo nuestro interés está centrado en el río Cauca, a través de este mapa destacamos los tres tramos de su cuenca; sus principales afluentes: Ovejas, Palo, Risaralda y Nechí; las planicies que llaman las aguas del río a la lentitud en varios puntos de su cuenca; los caminos y carreteras generatrices del sistema vial y las áreas metropolitanas. Llamamos la atención sobre dos asuntos insinuados en las aguas superficiales que aparecen en este mapa: el primero está relacionado con los cuerpos de agua libre asociados a las zonas planas del valle alto y la depresión Momposina, estas toman las múltiples formas de los humedales, cada vez más escasos. En contraste, las aguas superficiales confinadas y represadas en zonas montañosas dan cuenta de varias de las violencias que ha sufrido el río y que son en parte causa de la agonía de los cuerpos de agua libre de las planicies.",
    boton: true,
    link: "https://docs.google.com/document/d/1uDWBiK19UN8G_1yVICTFgG-4jnbrp1vv/edit?pli=1#heading=h.y1bwv3ismpus",
    image: "",
    description: "",
  },

  //----------------------------------------------------------------------------------------------------------------------
  //Modales para el mapa de Tejidos del agua
  {
    id: 8,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para encuadres
    highLight: "Rio Piendamó",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Desde las montañas del Cauca, donde la niebla cubre la cordillera Central con su velo, despierto y comienza mi andar. Recorro, junto a otros, una cuenca de 597 km², llevando vida a comunidades indígenas del pueblo Nasa Yuwe, Misak, Pijao. En la parte alta de mi cuenca las comunidades indígenas de los resguardos de Jebala, Ambalo, Kizgo y Wuambia, protegen su gran territorio ancestral, habitando los páramos desde donde emana mi hilo de vida, allí, hacen “siembras de agua” con plantas “PI”, revelando el poder restaurador de la naturaleza. Los campesinos confían en mí para su sustento. Desde Silvia y Piendamó hasta Morales me desplazo como una fuente de historias. En la parte baja las comunidades del resguardo indigena de Wuambia, La Bonanza, Misak Piscitau, Raices de Oriente, Musse Ukwe, y los consejos comunitarios de las comunidades negras de Aganche, La Fortaleza y de Mindala toman de mí la fuerza y la vitalidad que traigo de las tierras altas.En mi viaje, no todo es calma, mi capacidad para almacenar y rezumar mi hilo de vida durante todo el año es limitada. Las actividades humanas consumen la mayoría de mi agua disponible por lo que me encuentro en estado crítico, mi caudal está diezmado. Mi fluir se reduce aún más porque no utilizan mi flujo eficientemente. Soy una cuenca en agonía y altamente vulnerable, si no me cuidan el agua va a escasear ¡No quiero volverme un recuerdo! ",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 9,
    title: "Río Salado ",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "y otros que vamos al Cauca.",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Nazco permanentemente en las entrañas de la Cordillera Occidental, donde los vientos fríos acarician las cimas y los bosques de niebla alimentan mis venas con el agua que retienen de los susurros del viento. Desde allí, desciendo, alimentando los suelos del municipio de Suarez. Mi cauce recoge las aguas de una cuenca que se extienden por 1.262 km². Baño los resguardos indígenas Nasa de Chimborazo, Cerro Tijeras y Agua Negra y varios consejos comunitarios del pueblo negro colombiano. El IDEAM, dice que soy el río principal de esta subcuenca, pero quisiera recordar que desde las cumbres húmedas de las que vengo, también desciende estrepitoso mi hermano el río Inguito.  Mi capacidad para mantener mi flujo estable durante todo el año es reducida, en los años en que las nubes me nutren vigorosamente, mi caudal permite que las comunidades usen mis aguas con una tranquilidad, que a veces se acerca al desperdicio. Sin embargo, en años secos mis corrientes merman, me vuelvo vulnerable y muchos seres empiezan a lamentar la escasez de agua. Mis venas han sido marcadas por la intervención humana, la más reciente es el monocultivo de coníferas y coca que acaparan los brotes de mis aguas. Otra que altera la pureza de mis aguas son las malas prácticas de la minería que utilizan el mercurio y el cianuro para extraer el oro de mis entrañas. Podría seguir contando mis males, pero prefiero contarles que las comunidades ancestrales me cuidan en medio de muchos riesgos para evitar la contaminación y asegurar mi fluir puro y continuo.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 10,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "Río Ovejas",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Desde la Cordillera Central, donde los yarumos aún susurran canciones de antaño, mis arterias descienden con fuerza por una cuenca de 922 km² y en la mitad de este recorrido me encuentro con un amigo torrentoso, el río Mondomó. Mis aguas riegan a su paso zonas de los municipios de Piendamó, Caldono, Buenos Aires, Suárez y otras poblaciones del Cauca. Soy el tejido vital que garantiza el buen vivir de los pueblos Nasa, Kizgo y Misak. En la parte alta se encuentran los grandes resguardos de Pueblo Nuevo Cereal, Cerro Tijeras, La Maria, Tumburao, La Laguna Siberia, Quichaya y en la parte baja resguardos más pequeños como Nuevo Horizonte, Raíces de Oriente, San Antonio, La Concepción, Las Delicias y los consejos de comunidades negras de La Toma y Cuenca Río Ovejas en Suárez. Soy un tejido acuático de contrastes: mi caudal se mantiene moderado, pero las huellas humanas son cada vez más visibles. La actividad minera, la agricultura intensiva y los vertimientos han comenzado a enrarecer mis aguas. Me deterioro poco a poco, y aunque aún sostengo la vida a mi alrededor, temo por mi futuro​. He perdido la capacidad para guardar en mis entrañas las aguas bondadosas que caen del cielo, la vegetación y bosques que conservan la humedad fueron talados por el avance de la frontera agrícola. A pesar de que la población que en mi habita no extrae de mi mucha agua para su consumo, desperdician el fluido que les otorgo. No consideran que soy altamente vulnerable, si no me usan de forma sostenible mi caudal estrepitoso algún día será solo un rastro en las rocas. Mis aguas están contaminadas por pesticidas, vertimientos de minería y residuos domésticos. Por mis venas discurre la vida que nutre todo a su paso, pero a mi arrojan venenos que traen muerte ¡Así no se puede gente!",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 11,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "Río Timba",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Desde la Cordillera Central, donde los yarumos aún susurran canciones de antaño, mis arterias descienden con fuerza por una cuenca de 922 km² y en la mitad de este recorrido me encuentro con un amigo torrentoso, el río Mondomó. Mis aguas riegan a su paso zonas de los municipios de Piendamó, Caldono, Buenos Aires, Suárez y otras poblaciones del Cauca. Soy el tejido vital que garantiza el buen vivir de los pueblos Nasa, Kizgo y Misak. En la parte alta se encuentran los grandes resguardos de Pueblo Nuevo Cereal, Cerro Tijeras, La Maria, Tumburao, La Laguna Siberia, Quichaya y en la parte baja resguardos más pequeños como Nuevo Horizonte, Raíces de Oriente, San Antonio, La Concepción, Las Delicias y los consejos de comunidades negras de La Toma y Cuenca Río Ovejas en Suárez.  Soy un tejido acuático de contrastes: mi caudal se mantiene moderado, pero las huellas humanas son cada vez más visibles. La actividad minera, la agricultura intensiva y los vertimientos han comenzado a enrarecer mis aguas. Me deterioro poco a poco, y aunque aún sostengo la vida a mi alrededor, temo por mi futuro​. He perdido la capacidad para guardar en mis entrañas las aguas bondadosas que caen del cielo, la vegetación y bosques que conservan la humedad fueron talados por el avance de la frontera agrícola. A pesar de que la población que en mi habita no extrae de mi mucha agua para su consumo, desperdician el fluido que les otorgo. No consideran que soy altamente vulnerable, si no me usan de forma sostenible mi caudal estrepitoso algún día será solo un rastro en las rocas. Mis aguas están contaminadas por pesticidas, vertimientos de minería y residuos domésticos. Por mis venas discurre la vida que nutre todo a su paso, pero a mi arrojan venenos que traen muerte ¡Así no se puede gente!",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 12,
    title: "Río Quinamayó",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "Y otros directos al río Cauca",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Bajo desde la Cordillera Occidental, donde los musgos del bosque alto andino y bosque de niebla filtran la lluvia y me dan la primera vida. La cuenca que surco tiene 484 km² y los drenajes que he moldeado por milenios me llevan al río Cauca. A mi paso surto de agua a comunidades del pueblo negro del consejo comunitario La Alsacia y de los resguardos Nasa de Pueblo Nuevo Cereal y Cerro Tijeras, así como las campesinas que habitan en mis riberas. Aunque conservo la fuerza para retener y entregar mi agua en flujos constantes, la deforestación amenaza esta capacidad porque acaba con la vegetación que me apoya en este proceso. No me habitan muchos humanos, por lo que mi líquido vital no es tan consumido, pero como les pasa a otros de mis hermanos, si se desperdicia y se maltrata con muchos vertimientos de residuos no tratados. Aun con estas dificultades, soy una de las pocas cuencas vigorosas en esta región, por lo que mi susceptibilidad a enfrentar una escasez de agua es baja y aun baja pura al encuentro con el Cauca.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 13,
    title: "Río Claro y Jamundí ",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Desciendo desde el relieve quebrado entre las cordilleras Occidental y Central, donde las montañas atrapan la lluvia y conspiran mi nacimiento. Mi cuenca tiene 816 km², que abrazan los territorios de Santander de Quilichao, Caloto y Villa Rica. A lo largo de mi trayecto, acompaño comunidades del pueblo negro, indígenas y campesinas que han tejido sus vidas a mi alrededor, confiando su vida y la permanencia de su cultura a mis aguas. En la parte alta donde la cuenca es un laberinto de agua, moran comunidades de los resguardos Naya, Kiwe Tekh Ksxaw, Huellas, La Concepción, Toez, Canoas, Guadualito y Las Delicias del pueblo Nasa. En mi parte baja, donde mis aguas pacientemente surcan un valle fértil animo el habitar de comunidades del pueblo negro de los consejos comunitarios de Quebrada Quitacalzón, Afropavas, Cuenca del río Cauca y Microcuenca Teta Mazamorrero, La Quebrada, Aires de Garrapatero, Santafro, Afrocolombia Río Palo Quintero y Afro Lomitas Sur. La tierra que riego ya no es la misma, mis aguas fueron ultrajadas, mis cauces antes llenos de vida, fueron despojados de su riqueza buscando la falsa fortuna extrayendo oro. En el valle talaron mi bosque seco tropical y crearon un desierto verde de caña. Ahora cuando el tiempo es seco mi caudal se vuelve frágil y en lluvias me desbordo sin control.  En tiempo de sequía consumen de mí mucha agua, como si fuese infinita, no saben que les puedo faltar. En Villa Rica, mis aguas subterráneas recargan el río Cauca; de ellas también se benefician los pobladores a través de aljibes. Cuando mi tejido se funde con el Cauca en la planicie, más que agua, soy veneno. Mis aguas están totalmente contaminadas, residuos agrícolas, industriales y domésticos se mezclan en mi corriente. Si continúan arrojando a mi todo su veneno, pronto mis corrientes perderán el vigor con el que he sostenido la vida.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 14,
    title: "Río Palo",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Mi historia comienza en la Cordillera Occidental, donde los bosques húmedos nos impulsan a la vida y se forman nuestros cauces. El del Jamundí corre con aguas color esmeralda. Descendemos con energía, atravesando 615 km² de tierras fértiles, llevando agua a los municipios de Jamundí y Cali. Durante siglos, he sido el pulso de estas tierras, acompañando la existencia de comunidades afrodescendientes, indígenas y campesinas y honrándolos con la riqueza del monte. Soy cuna y territorio ancestral de comunidades negras que en las riberas de nuestros afluentes encontraron su protección y sustento. En mi habitan los consejos comunitarios de San Isidro, El Paso de la Bolsa, Quinamayo, Comunidad Negra de la Vereda El Guabal, Robles, Alteron y Bocas del Palo. Mis montañas son lugar del resguardo Nasa La Cristalina (Kwes Kiwe Nasa).Mi esencia se debilita, la deforestación en mis nacientes ha reducido mi capacidad para almacenar el agua de la lluvia, los bosques prístinos que alimentaban mis cauces gota a gota, han desaparecido por la tala indiscriminada. Las actividades humanas consumen una alta cantidad de mi vida, padecemos la expansión urbana, muchos seres habitan nuestra cuenca pero pocos nos cuidan. Sobre mis humedales, zanjones y madreviejas aparecen sin control las estructuras del desarrollo; cortan nuestro fluir, lo desecan, lo erradican y así acaban con seres centenarios que nos han habitado. Nuestras aguas tienen memoria y vuelven a crecer sobre lo que se destruye como flujos pulsantes. Soy muy vulnerable, en el mañana, cuando las nubes no bañen mi cuerpo hueco, padeceran la escasez de mis aguas quienes me habitan. A lo largo de mi curso, me encuentro con residuos urbanos y vertimientos agrícolas e industriales que ensombrecen mi transparencia. Aún sostengo la vida en mis riberas. Clamo por cuidado, por respeto, por una oportunidad de seguir siendo el río que nutre esta tierra.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 15,
    title: "Ríos",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "Lili, Meléndez y Cañaveralejo",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Nazco en la Cordillera Central, donde los frailejones y musgos abrazan el agua de la neblina y la entregan a mis venas. Desciendo con ímpetu, extendiéndome por 1.638 km², serpenteando entre montañas y valles que guardan la memoria de pueblos indígenas y comunidades afrodescendientes. Mis aguas riegan los territorios de Guachené, Corinto, Miranda, Puerto Tejada, Toribío y Padilla, hogar del pueblo nasa y las comunidades negras quienes han resistido siglos de ataques sin dejar de cuidarme. Soy hogar de los resguardos de La Cilia, Corinto, Jambaló y  territorio de los consejos comunitarios de  Brisas Del Río Palo, Severo Mulato, Zanjón De Potoco, La Tupia y Riveras del río Palo.Mi capacidad para sostenerme es poca, durante los años de lluvias generosas, mi caudal fluye con fuerza, pero en tiempos secos, siento el peso del agotamiento, casi toda mi agua es consumida y sufro una sequía que parece llevarme a la agonía, las comunidades lo saben y por eso me usan con cautela. El mañana es desalentador para mi, soy muy vulnerable, en el futuro pueden desaparecer los tejidos que derramo sobre estas tierras. Mi cuenca es fuerte, sus aguas y el tiempo me han tallado ancho y profundo, pero el ser humano ha dejado cicatrices químicas en mi lecho. Mis aguas se deterioran cada día por su alteración, ahora soy veneno, estoy muy contaminado. Aunque aún fluyo con vigor, temo por mi futuro. La minería, la agricultura intensiva, los residuos urbanos y sobre todo los industriales de las zonas francas que han puesto sobre mis riberas, amenazan con quebrar mi espíritu​.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 16,
    title: "Río Desbaratado",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Nazcemos en la Cordillera Occidental, en los bosques de niebla que se visten del color del oro en el alba y donde el sol pinta iridiscente el cielo en el ocaso. Desde las cumbres de Cali, mis aguas se deslizan entre raíces y piedras, formando los hilos de vida que llevan mis nombres, Lili, Melendez y Cañaveralejo. Mis cauces, que se extienden por 241 km², han sido testigos del crecimiento de la ciudad, acompañando su historia y saciando la sed de sus habitantes. En mis montañas ondulantes he prestado vida a las comunidades del resguardo indigena Kofan y en mis planicies, en las riberas de mis cauces y en mis humedales pulsantes, nutro la tierra de los consejos comunitarios de Las Dos Aguas De Cascajal, Palenque El Hormiguero, Raíces Del Cauca y La Playa Renaciente. Nosotros, quienes antes drenabamos libremente entre el suelo y la naturaleza ahora hemos sido aprisionados en concreto.  A mi, el Cañaveralejo me ha secado las lágrimas, mis lamentos no fluyen a la tierra, mis aguas, antes conectadas con los humedales de Charco Azul y el Pondaje, fueron reencauzadas. Las personas no saben que soy río, ya no río. Nosotros, tres ríos con nombre propio, contenidos en nuestro andar, ahora llevamos el nombre de Canal CVC Sur.Mi esencia se ha transformado, la urbanización desmedida ha invadido mis riberas, desplazando los bosques que una vez protegieron mi pureza. Mis cauces se secan en verano y las poblaciones alrededor han drenado mis aguas dejando las rocas de mis venas al descubierto, estamos en un estado crítico, ni la lluvia es suficiente para calmar la sed que tenemos. El agua que toman de nosotros no retorna, ni la nube trae de vuelta lo que perdimos. Nos sentimos tan vulnerables, al borde de la muerte, somos un fósiles vivientes amenazados con la extinción. Nuestras aguas, que antes reflejaban el cielo con claridad, ahora arrastran desechos domésticos, residuos industriales y venenos. El crecimiento sin control ha afectado nuestra capacidad de regeneración, y la contaminación se ha convertido en una sombra persistente en nuestro cauce. Si el olvido y la indiferencia continúan, nuestra voz se apagará entre el concreto y el ruido de la ciudad.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 17,
    title: "Rio Cali",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Créditos</h6>
      </div>
    ),
    texto:
      "Nazco en las alturas de la Cordillera Central, donde los páramos filtran el agua de la lluvia y la entregan a mi cauce. Mi recorrido de 228 km² atraviesa las tierras del Valle del Cauca, serpenteando entre montañas y valles que han sido testigos de mi furia y mi bondad, como Miranda y El Tamboral. Mis aguas han dado vida a comunidades campesinas y negras que han habitado mis orillas, como los consejos comunitarios de Angel De Luz Chococito, Tarragona Parte Alta, Negritudes Afrodescendientes De Tarragona, Tarragona Baja, Coconata, Vereda Cañas Abajo, Ortulin y La Acequia.Mi corriente se debilita, aunque aún conservo la capacidad de regular mis flujos, las actividades humanas, están consumiendo mis aguas más de lo que les puedo otorgar, la sobreexplotación amenaza con secar mis venas, estoy en estado crítico. Lo que me quitan no retorna a mí cuenca, soy cuerpo inerte. En tiempos de lluvia, mi caudal se desborda sin control y mis ríos convierten mi agonía y furia en avalanchas, por ello llevo el nombre de río desbaratado, mis formas encañonadas y angostas son la evidencia de mi ímpetu y fuerza. Soy muy vulnerable, dicen que en el futuro, durante las estaciones secas me convertiré en un hilo frágil, sin flujo, sin vida. Aunque todo parece gris y ya no soy lo que era, mis cursos aún conservan parte de mi pureza y quienes me consumen usan lo que toman de mí sabiamente. Mi futuro es incierto, la preservación y entendimiento de mi como ser vivo es lo único que permitirá salvarme de quedar como eco de las piedras que alguna vez acaricie.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 18,
    title: "Río Guachal",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "(Bolo - Fraile y Párraga)",
    icono: (
      <div className="icon-info-modal-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#6b6b6b"
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" />
        </svg>
        <h6>Capítulo I</h6>
      </div>
    ),
    texto:
      "Mi curso comienza en los majestuosos Farallones de Cali, en lo más alto de la Cordillera Occidental, donde los frailejones y el bosque andino son el hogar de panteras, tigrillos, zorros y osos de anteojos. Me abro camino a lo largo de 220 km², descendiendo entre bosques y quebradas hasta fundirme con la ciudad que lleva mi nombre, donde soy testigo del pulso urbano. Durante siglos, fui el alma líquida de este territorio, testigo del crecimiento de Cali y guardián de sus fuentes de vida. En las cumbres llevo tres nombres Pichindé, Felidia y Aguacatal, que en el piedemonte se vuelven uno, Cali,  soy el río que le dio el nombre a esta Ciudad, sobre mi, se establecieron los primeros moradores de la urbe. En las montañas corro libre, raudal y ondulante, en el piedemonte soy el salvaje que debía ser encauzado, controlado, linealizado.  Aun mantengo mi espíritu fuerte, el agua siempre corre sobre mi, unas veces hilo otras veces raudal, el concreto no contiene mi fuerza. Mis aguas, abundantes en las montañas, son casi agotadas en el piedemonte. Los que me habitan me toman y me desperdician. Tengo miedo ante el futuro por mi vulnerabilidad, puedo dejar de ser tejido y volverme huella. La contaminación me ha marcado profundamente. La expansión de la ciudad, los vertimientos y la actividad humana han oscurecido mi cauce. Ya no brillo como antes, y mi esencia, antes cristalina, se pierde en el gris de la ciudad. Clamo por cuidado, por respeto, antes de que mi fluir se convierta en un murmullo de agonía​.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  /////////////////////////////////////////////////////////////
  {
    id: 19,
    title: "Laboratorio de Cartografías ",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "críticas y codiseño territorial",
    icono: (
      <div className="icon-info-modal-container">
        <img
          className="logoModal"
          src="/assets/svg/inicio/credits.svg"
          alt="Créditos"
        />
      </div>
    ),
    texto:
      "Alexander Alvarez, Álvaro Pedroza, Ana Maria Banguero, Ana Yerli Nazarit, Andrea Melenje, Ángela Patricia Aragón, Armando Vargas, Belen Labrada, Bryan Ortiz, Catherine Girón, Carolina Mina, Claudia Trujillo, Claudia Victoria, Consuelo Lasso, Cristian Valencia, Cristian David Vanegas, Katherintg Labrada, Deyanira Gonzalias, Diana Marcela Carabalí, Diego Hernández, Dora Infante, Edy Serrano, Eli Cuadros, Eliécer Balanta, Erley Ibarra, Ernesto David Cortes, Fallola Ibarguen, Gerson Castro, Gian Marlon Cifuentes, Juan David Macuace, Joan Orobio, Karem Correa, Karen Daniela Martinez, Katherine Girón, Lily Vanesa Hinestrosa, Luis Florez, María Campo, María Orlency Caicedo, Myriam Marín, Natalia Salazar, Natalia Viafara, Nora Lucia Victoria, Ofir Mina, Olga Cecilia Eusse, Patricia Botero, Renata Moreno y Viviana Balanta",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 20,
    title: "Concepción del atlas, ",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: " producción cartografica y textual",
    icono: (
      <div className="icon-info-modal-container">
        <img
          className="logoModal"
          src="/assets/svg/inicio/credits.svg"
          alt="Créditos"
        />
      </div>
    ),
    texto:
      "Álvaro Pedroza, Diego Hernández, Gian Marlon Cifuentes, Karem Correa, Myriam Marín, Olga Cecilia Eusse y Renata Moreno.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 21,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "Diseño gráfico y web",
    icono: (
      <div className="icon-info-modal-container">
        <img
          className="logoModal"
          src="/assets/svg/inicio/credits.svg"
          alt="Créditos"
        />
      </div>
    ),
    texto:
      "Colaboratorio de diseño para la innovación social,  Grupo de investigación Diseño & Sociedad,  Universidad del Cauca. Coordinación: Andrea Melenje y Rafael Enrique Sarmiento López. Ilustración: Mauricio Castro, Diagramación: Neider Yesid Tiafi, Recursos gráficos: Yeri Benavente y Eduar Yondapiz. Desarrolladores: Camilo Sotelo, Jerson Stiv Rojas, Jorge David Echeverry y Santiago José Montaño. Institución Universitaria Colegio Mayor del Cauca.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 22,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tama�o medium para encuadres
    highLight: "Términos y condiciones de uso y política de privacidad",
    icono: (
      <div className="icon-info-modal-container">
        <img
          className="logoModal"
          src="/assets/svg/inicio/credits.svg"
          alt="Créditos"
        />
      </div>
    ),
    texto: (
      <div className="texto-modal-container">
        <p>
          <strong>Atlas sur del valle alto del río Cauca</strong>
          <br />
          Última actualización: <em>Agosto 2025</em>
        </p>
        <ol>
          <li>
            <strong>Propósito del atlas</strong>
            <p>
              El Atlas sur del valle alto del río Cauca. Geopoéticas para las
              transiciones solicita al visitante y usuario de esta página, que
              lea detalladamente estos términos y condiciones de uso, antes de
              iniciar su exploración o utilización.
              <br />
              <br />
              Este atlas es una plataforma interactiva de carácter
              participativo, comunitario y académico. Es el resultado de un
              proceso colectivo orientado a visibilizar los paisajes, prácticas
              organizativas y saberes de las alternativas territoriales que
              conformamos el Tejido de transicionantes por el valle alto del río
              Cauca. Su propósito es apoyar procesos de planificación,
              transformación, reflexión e investigación desde y sobre el
              territorio, desde una perspectiva crítica y solidaria con la
              relacionalidad radical de la vida. Este atlas no persigue fines de
              lucro, ni intereses comerciales, ni adhesiones a movimientos
              políticos particulares. Los contenidos y vínculos de este sitio
              tienen propósitos exclusivamente educativos, culturales,
              académicos y de relevancia para el diseño territorial comunitario.
            </p>
          </li>
          <br />
          <li>
            <strong>Licencia de uso</strong>
            <p>
              Todos los contenidos del atlas —incluyendo mapas, imágenes,
              textos, gráficas, audios e infografías— están protegidos bajo la
              licencia:
              <br />
              <em>
                Creative Commons Atribución-NoComercial-SinDerivadas 4.0
                Internacional (CC BY-NC-ND 4.0)
              </em>
              <br />
              Esto implica que:
            </p>
            <ul>
              <li>
                Se permite la descarga y uso con fines académicos, siempre que
                se cite adecuadamente la fuente.
              </li>
              <li>
                No se permite el uso comercial, publicitario o institucional sin
                autorización previa por escrito.
              </li>
              <li>
                No está permitido modificar, transformar ni generar obras
                derivadas de los materiales.
              </li>
              <li>
                No se permite incorporar los materiales en productos editoriales
                impresos o digitales con fines distintos a los definidos aquí.
              </li>
            </ul>
            <p>
              Más información sobre esta licencia en:&nbsp;
              <a
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0074d9",
                  textDecoration: "underline",
                  position: "relative",
                  fontSize: "0.9em",
                }}
              >
                https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es
              </a>
            </p>
          </li>
          <br />
          <li>
            <strong>Privacidad y protección de datos</strong>
            <ul>
              <li>
                Este atlas no recopila, solicita ni almacena información
                personal como nombres, direcciones, correos electrónicos o
                números de identificación.
              </li>
              <li>
                No se comercializará, compartirá ni utilizará dicha información
                con otros fines a los establecidos aquí.
              </li>
              <li>
                La funcionalidad de interacción del mapa de multiterriolidades
                permite ubicar lugares de procedencia (a diferentes escalas como
                municipios, o regiones, cuencas o veredas), sin requerir datos
                personales. Este mapa es una herramienta de conexión simbólica
                entre lugares de origen del Pacífico colombiano y valle alto del
                río Cauca, como ejercicio de memoria, reconocimiento y
                territorialización. Esta funcionalidad:
                <ul>
                  <li>No requiere ningún dato identificable.</li>
                  <li>
                    Es voluntaria y no tiene implicaciones legales ni
                    institucionales.
                  </li>
                  <li>
                    Tiene fines pedagógicos, simbólicos y de representación
                    cultural.
                  </li>
                  <li>
                    Toda información registrada de manera voluntaria será
                    utilizada exclusivamente para ser visualizada dentro del
                    atlas.
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <br />
          <li>
            <strong>Citación recomendada</strong>
            <p>
              Si utilizas el atlas en publicaciones académicas, trabajos
              educativos o proyectos científicos, investigativos, artísticos y
              culturales, por favor cita de la siguiente forma:
              <br />
              <em>
                Tejido de transicionantes por el valle alto del río Cauca.
                (2025). Atlas del sur del valle alto del río Cauca. Geopoéticas
                para las transiciones.
              </em>
            </p>
          </li>
          <br />
          <li>
            <strong>Comportamiento del usuario</strong>
            <ul>
              <li>
                No realizar acciones que perjudiquen o interfieran con el
                funcionamiento del sitio web o sus servicios.
              </li>
              <li>
                No vulnerar los sistemas de información, la plataforma
                tecnológica, ni alterar su contenido.
              </li>
              <li>
                Abstenerse de incurrir en usurpación de identidad, infracción de
                derechos de autor, falsedad documental o revelación no
                autorizada de información.
              </li>
              <li>
                Respetar los fines académicos y comunitarios de la plataforma.
              </li>
            </ul>
          </li>
          <br />
          <li>
            <strong>Actualizaciones</strong>
            <p>
              Los presentes términos y condiciones podrán modificarse si el
              proyecto incorpora nuevas funciones, tecnologías o políticas de
              uso. Cualquier actualización será notificada en esta misma sección
              del sitio web y entrará en vigencia desde su publicación.
              <br />
              Los administradores del atlas no adquieren compromiso alguno de
              actualización permanente del contenido y no se responsabilizan por
              diferencias entre las versiones impresas y digitales de documentos
              compartidos. Igualmente, no asumen responsabilidad por errores,
              omisiones o inexactitudes en la información, ni por el contenido
              de sitios externos enlazados desde esta plataforma.
            </p>
          </li>
          <br />
          <li>
            <strong>Disponibilidad del servicio</strong>
            <p>
              No se garantiza la disponibilidad continua del portal, ya que el
              acceso puede verse afectado por labores de mantenimiento,
              actualizaciones técnicas o problemas en la red de comunicaciones.
              En caso de fallas, se tomarán medidas para restablecer el servicio
              en el menor tiempo posible. No se asume responsabilidad por daños
              derivados del uso de la plataforma o de la imposibilidad de
              acceder a ella.
            </p>
          </li>
        </ol>
        <img
          src="assets\img\entramados\privacidad.webp"
          alt=""
          style={{
            display: "block",
            maxWidth: "280px",
            marginTop: "8%",
            marginLeft: "5%",
            width: "20%",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        />
        <br />
        <br />
      </div>
    ),
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 23,
    title: " Capítulo I: El valle alto del río Cauca, su cuenca y sus mundos",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Cuenca alta: bajando del páramo al valle",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "Nazco gota a gota entre nieblas y frailejones, en el entorno de la laguna del Buey, un territorio ancestral habitado por los pueblos Kokonuko, Yanakona, Pijao, Nasa Yube y Misak. A unos 3.200 m s.n. m. inicio mi recorrido por la parte alta de mi cuenca y la de otros hermanos más pequeños que arropamos con nuestras aguas 22.900 km² de bosques amenazados. Desde mis primeros kilómetros de recorrido transito por un paisaje montañoso, mis aguas son frías y contundentes y con paso presuroso abro camino para descender a los valles. Paso primero por el valle de Pubenza y luego a uno extenso y amplio que lleva mi nombre. Antes de llegar a éste, la  contundencia de mis aguas es retenida por el embalse “La Salvajada”, como llaman en Suárez a La Salvajina. En ella se estancan mis aguas para producir energía y entregarme “más tranquilo” a los suelos fértiles del valle. \n\nTanto mis aguas, como las aguas de otros ríos hermanos que llegan a mí, son de gran beneficio para las ciudades, pero no nos cuidan con dedicación. Talan los bosques creadores de agua y a la voz del oro destruyen el suelo, la vegetación y envenenan nuestros cauces. Aun así, quienes me conocen desde estas alturas hasto lo más plano, quienes siembran conmigo en terrazas de montaña y celebran mis crecidas como presagios de vida, me siguen honrando y cuidando porque saben de la gravedad de mis heridas, porque saben que no solo llevo agua, llevo vida, llevo historia.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 24,
    title: " Capítulo I: El valle alto del río Cauca, su cuenca y sus mundos",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Valle alto del río Cauca: tierra de fertilidad",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "Dejando atrás mis primeras montañas, me expando en los suelos fértiles del valle alto. Estos suelos, como yo, estamos atrapados por la agroindustria de la caña. A ellos los están degradando, hasta el punto que los visionarios del progreso ya saben que lo único que se podrá sembrar en pocos años será cemento y a mí, me han mutilado al destruir el bosque seco tropical, desecar mis humedales, separarme de mis lagunas, aislarme de mis madres viejas. Quieren que vaya solo, por un cauce estrecho bordeado de caña.      \n\nEn esta tierra plana, muy plana de mi recorrido, se tejen diferentes relaciones entre los pueblos indígenas y afrodescendientes y las comunidades mestizas que han coexistido históricamente conmigo. Ellas han construido formas de vida profundamente ligadas a mis ciclos; aquí me alimento de los cauces provenientes de las altas cumbres de las cordilleras que forman este hermoso valle, donde se unen unos líquidos hilos con otros y con mis grandes meandros. Voy esquivando el contacto inmediato con lo urbano, mientras veo cosas que alimentan mis temores como el crecimiento urbano mal planificado, la poca o nula sensibilidad de los humanos al cuidado del agua.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 25,
    title: " Capítulo I: El valle alto del río Cauca, su cuenca y sus mundos",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Cuenca media: corriendo entre montañas",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "Dejando el valle, un poco más adelante de recibir a contracorriente las aguas del río Risaralda, dejo la planicie que se hace cada vez más angosta e inicia mi aventura entre cañones, colinas y puntiagudas crestas montañosas, en las que aun puedo sentir todavía la presencia de los milenarios glaciares de Cumanday (Ruiz),  Poleka Kasua (Santa Isabel) y Tolima. En esta parte de mi recorrido ya voy bastante cargado de azúcares, pesticidas, residuos industriales y urbanos y súmenle mis sedimentos; puertos secos, ciudades grandes y pequeñas me cruzan sin mirarme. Aquí, mi cuerpo sigue siendo útil, medido y partido, siguen canalizándome, drenando mis humedales para sembrar ganancias, y poco a poco voy acercándome a lo tenebroso… llego a Hidroituango. Y de esto prefiero no hablar ahora. \n\nEn mi montañosa cuenca media, donde mis abuelas cordilleras empiezan a descender, aún hay quienes rezan a mis orillas, quienes pescan con devoción y quienes me escuchan. En estos valles angostos de terrazas fértiles, los campesinos me acompañan, a veces en silencio, a veces con impotencia. Y aunque mis brazos aún se contaminan con desechos industriales y se secan los afluentes que antes eran mi compañía, hay quienes aún luchan por la vida que soy; las voces de defensa acá se unen con las de arriba y continúa la minga y la resistencia en medio de bosques que aún me cantan.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
    {
    id: 26,
    title: " Capítulo I: El valle alto del río Cauca, su cuenca y sus mundos",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Cuenca baja: llegando a La Mojana",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "Y cuando dejo atrás las últimas montañas de la parte media de mi cuenca, de la mano de la serranía de Ayapel, entro a la parte baja y empiezo a transformarme. Vuelvo a ser lento y amplio, y en estas bajezas - 150 m s. n. m.- soy un poco más sabio. Esto talvez, es lo que me da fuerza para soportar la ganadería y la minería atroz que destruye mi cauce y los mundos del agua en esta zona, capturada por el relato del desarrollo y el progreso que rectifica mi cauce con jarillones, canales y diques poco planificados y que ha olvidado que somos camino, vida y alimento. A todo lo que he mencionado,  le hacen frente muchas comunidades valientes, guardianas de mi existencia que con cariño me llaman el Mono. Junto a ellos, me extiendo en brazos, me desbordo, me vuelvo ciénaga, laguna, mil espejos del cielo. Aquí no soy un solo cauce, soy miles. Me bifurco en la Mojana, el Nechi me acompaña, el San Jorge nos alcanza y me enredo con el Magdalena. Ninguno se siente más grande, más importante, más estratégico, solo estamos felices de llegar a La Mojana. \n\nSigo fluyendo lentamente en la inmensidad pulsante de La Mojana, cargado de sedimentos, pero también de perdones y aprendizajes. En Bolívar, en Sucre, en Córdoba, en Antioquia, me acompañan pueblos zenúes, palenqueros, afrodescendientes que han aprendido a vivir conmigo, no contra mí. Las casas se levantan sobre pilotes porque yo crezco cuando quiero, las canoas son parte de las familias, los peces son sustento, símbolo y canción. Las mujeres que curan con plantas, los niños que se bañan entre mis remansos, los pescadores que conocen cada corriente de memoria, me recuerdan y saben que cuando yo crezco, ese es mi ciclo y que cuando me desbordo, no destruyo, estoy renovando, voy fecundando. Soy el río Cauca y soy muchos ríos, he sido frontera, pero también abrazo, he sido herido, pero aún fluyo. En mis meandros viajan los ecos de las resistencias, en mis encañonamientos resisten las montañas, en mis planicies late la sabiduría acuática de los pueblos del agua. Soy agua, soy el territorio y mientras haya quien me escuche, seguiremos cantando.",
    boton: false,
    link: "",
    image: "",
    description: "",
  },

  //Modales capII
  {
    id: 27,
    title: " Capítulo II",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto: (
      <span>
        <strong
          style={{
            display: "block",
            fontSize: "1.2em",
            fontWeight: "bold",
            color: "#0599B7",
            marginBottom: "1.5em",
            lineHeight: "1.4",
          }}
        >
          Redes nodo y entramados territoriales: portadores de capacidades y
          saberes para las transiciones regionales sistémicas
        </strong>
        Las transiciones regionales sistémicas justas surgen como una respuesta
        integral a las crisis ecológicas y sociales generadas por el modelo de
        desarrollo desigual dominante centrado en la ocupación física y
        mono-ontológica de los territorios. Este modelo refuerza una visión
        unificada del mundo que desmantela los mundos relacionales. En
        contraposición, las transiciones promueven una transformación cultural,
        económica y política que reconoce la interdependencia de todos los
        seres, defendiendo la idea de un pluriverso, es decir, “un mundo donde
        quepan muchos mundos”, fomentando una reconexión de la vida
        toda.\n\nEstas transiciones, que ya ocurren en cientos de casos en el
        planeta, visibilizan los efectos destructivos de las sociedades
        globalizadas contemporáneas y plantean un llamado decidido a un sentir,
        pensar y actuar basado en la defensa y permanencia en los territorios
        desde una perspectiva material, epistémica, cultural y ontológica que
        pone la vida en el centro. Esto implica fortalecer los proyectos de vida
        comunitaria, asegurar la soberanía alimentaria y establecer redes de
        solidaridad entre organizaciones étnico-territoriales. Así, estas
        estrategias representan un cambio radical hacia relaciones más justas,
        equitativas y sostenibles con la naturaleza y entre las personas, como
        parte de una resistencia activa al paradigma dominante.n\nEn el valle
        alto del río Cauca, estamos conformando un tejido entre transiciones se
        están materializando en tres nodos o entramados territoriales situados
        en Suárez y Villa Rica en el Cauca y en el oriente de Cali, en el Valle
        del Cauca. Estos nodos conforman unos entramados territoriales de
        alternativas transformadoras que contrarrestan los efectos del sistema
        dominante, priorizando la reconstrucción del relacionalidad de la vida.
        A través de mapas y modelos elaborados en el Diagnóstico de Paz
        Territorial Pluriversal y los talleres del Colaboratorio de Cartografías
        Críticas y Codiseño Territorial presentamos nuestros territorios en
        términos de su localización en la cuenca del río Cauca y nuestros
        empeños y retos.
      </span>
    ),

    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 28,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Modelo territorial Oriente de Cali - distrito de Aguablanca",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "Para el caso del Oriente de Cali la síntesis la construimos entre dos grupos. En el primero concebimos este  territorio desde el río Cauca y el océano Pacífico entre Tumaco y Nuquí. Destacamos las casas sobre pilotes, los tenderos de ropa y las palmeras como parte de la vida en las poblaciones costeras y ribereñas y  presentamos las tradiciones, saberes y prácticas culturales y artísticas que han llegado a Cali desde nuestros territorios y los de nuestros ancestros a partir de los procesos de migradestierro. Esta primera parte de la síntesis territorial expone también cómo la visión de desarrollo predominante en el modelo de desarrollo regional construido desde Cali y el valle alto del río Cauca ha producido en parte el desplazamiento a Cali de muchas comunidades pobladoras de la región Pacífica. Estas llegan a Cali en condiciones de vulnerabilidad que se agudiza con la segregación espacial y el racismo estructural presente en la ciudad. \n\nLa segunda parte de la síntesis surge del Oriente de Cali y enlaza otros sectores de la ciudad a través de elementos significativos del paisaje urbano y de los vínculos afectivos con estos. Se localizaron la Casa Cultural El Chontaduro y la Biblioteca Rigeberta Menchú como espacios seguros e importantes y las universidades como espacios a los que aspiran a llegar las personas más jóvenes del grupo. Se plasmó la avenida Ciudad de Cali como una línea de conexión con el resto de la ciudad, el lago de Charco Azul como un lugar bonito a resaltar en el oriente y la vista de los Farallones de Cali al atardecer como algo de gran belleza. También se reconoció que en el oriente de Cali hay mucha confrontación e inseguridad en las calles y que desplazarse hacia otras partes en el transporte público tiene muchos problemas como largos tiempos de espera, horarios y buses insuficientes y escasa cobertura. Esta parte de la síntesis completa a escala urbana los relatos de muchas personas que tienen que abandonar sus territorios en el Pacífico colombiano y llegan a Cali y otras ciudades cercanas a buscar y construir oportunidades escasas presentes en un entorno de injusticias ambientales, epistémicas, sociales y culturales. ",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  {
    id: 29,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight: "Modelo territorial Villa Rica",
    icono: (
      <div className="icon-info-modal-container">
        <img
          src={fichaTecnica}
          alt="icono ficha tecnica"
          style={{ width: 48, height: 48 }}
        />
      </div>
    ),

    texto:
      "Esta síntesis la construimos entre varios integrantes de las alternativas transformadoras de Villa Rica y Puerto Tejada y acogemos en nuestro entorno cercano a los municipios de Caloto, Candelaria, Guachené, Padilla y Santander de Quilichao. Nuestro territorio está inmerso en las dinámicas de implantación y permanencia de diferentes formas de extractivismo en el valle alto del río Cauca y en las resistencias a las versiones de este modelo económico que ha configurado esta zona de la cuenca. Los tres siglos de esclavitud para la explotación del oro y la producción agrícola que soportaba la intensa actividad minera de la colonia, se traslaparon con la consolidación de la agroindustria de la caña de azúcar y al incremento de la extracción de arcillas y otros insumos fundamentales para la fabricación de materiales de construcción.\n\nActualmente la minería de arcilla y el monocultivo de caña de azúcar son actividades lesivas con la biodiversidad local y con nuestros suelos por las siguientes causas: las excavaciones para la extracción de arcillas deforestan y alteran severamente la configuración de terreno y los cursos del agua y el monocultivo de la caña de azúcar es ya un hecho de agotamiento de la biodiversidad. Además para el sostenimiento y el incremento de su productividad se abusa de los acuíferos de la zona y se contaminan con químicos como el glifosato las aguas profundas y superficiales y los cultivos diversos cercanos.\n\nLos rastros de las actividades extractivas que datan de la colonia están presentes en las haciendas y en el monocultivo de la caña de azúcar que cubre casi el 80% de los suelos fértiles de esta parte del valle alto del río Cauca. Las haciendas, entre las que se destaca La Bolsa, hacen parte de las materialidades de la opresión de la esclavitud y sobre este símbolo se construye gran parte de la memoria y las acciones de resistencia y lucha insistente por la vida digna. Estas se hacen concretas en los proyectos de los consejos comunitarios con tierras tituladas o no y en la disminuida, pero aun potente, presencia de fincas tradicionales y coberturas boscosas protegidas que caracterizan esta zona, conocida también como norte del Cauca.\n\nEn los referentes culturales de los integrantes de las alternativas transformadoras de Villa Rica están presentes los espacios cotidianos de la vida campesina: el aljibe, los caminos vecinales, el parque, la iglesia, la institución educativa, las quebradas, destacando La Tabla, y las conexiones con su entorno: la vía Panamericana y el puente Valencia que cruza el río Cauca y comunica a Villa Rica con Jamundí. Este entorno agrícola productivo, garantía de la alimentación diversificada, sana y suficiente para la región, está sintetizado en las fincas tradicionales de este territorio, acompañadas de varios bosques, juntos interrumpen el monótono tapiz del monocultivo y son una posibilidad de sanar, reencantar y reencarnar las cicatrices profundas de la minería de arcillas. ",
    boton: false,
    link: "",
    image: "",
    description: "",
  },
  /////////////////////////////////////////////7//////////////////Alternativas oriente de cali
  {
    id: 30,
    title: "",
    layaut: "Luyaut2",
    size: "medium", // Tamaño medium para capítulos
    highLight:
      "Alternativa Transformadora Afro Yoga",
    icono: "",
    texto: (
      <div className="texto-modal-container">
        <div>
          <img className="imgEntramadosModal" src="/assets/img/entramados/Afroyoga.webp" alt="" />
          <p>
            <strong>Localización:</strong> Encuentros en diferentes lugares
          </p>
          <p>
            <strong>Incidencia:</strong> Santiago de Cali
          </p>
          <p>
            <strong>Influencia:</strong> Pacífico Colombiano
          </p>
        </div>
        <div>
          <p>
            Surge en el 2018, como parte de un proceso afrofeminista, para la
            sanación de las mujeres negras, donde se realizan encuentros de
            bienestar enfocados en la práctica del Yoga kemético y del Kundalini
            yoga.
          </p>
        </div>

        <div>
          <h4>Problemáticas que afronta:</h4>
          <ul>
            <li>Violencia de género</li>
            <li>Desigualdad social</li>
            <li>Racismo estructural</li>
          </ul>
        </div>

        <div>
          <h4>Acciones:</h4>
          <ul>
            <li>
              Proceso Repalpitar del útero donde propiciamos espacios de
              sanación de la violencia sexual con mujeres negras.
            </li>
            <li>
              Trabajo con niñas y jóvenes para sanar y reconocer la violencia de
              género y cómo se vive.
            </li>
            <li>Escuelas afro feministas y antirracistas.</li>
            <li>
              Encuentros de bienestar, sanación, yoga, autocuidado y espacios de
              escucha.
            </li>
          </ul>
        </div>
      </div>
    ),
    link: "",
    image: "",
    description: "",
  },
  {
    id: 31,
    title: "",
    layaut: "Luyaut2",
    size: "medium",
    highLight:
      "Alternativa Transformadora Asociación Casa cultural El Chontaduro",
    icono: "",
    texto: (
      <div className="texto-modal-container">
        <div>
          <img className="imgEntramadosModal" src="assets\img\entramados\El chontaduro.webp" alt="" />
          <p>
            <strong>Localización:</strong> Barrio Marroquín III Dg. 26g 9 #72s
            32
          </p>
          <p>
            <strong>Incidencia:</strong> Oriente de Cali
          </p>
          <p>
            <strong>Influencia:</strong> Pacífico colombiano y sur del valle
            alto del río Cauca
          </p>
        </div>

        <div>
          <p>
            Empezamos a gestarnos en 1983, aunque nos constituimos legalmente en
            1986. Trabajamos por la defensa de los derechos humanos, el cuidado
            eco-ambiental, a través de la promoción y animación a la lectura y
            la formación artística de niños, niñas, jóvenes y adultos tomando el
            arte como estrategia para la formación de personas críticas,
            autocríticas y comprometidas en la búsquedas de soluciones
            colectivas a la problemática de su país.
          </p>
        </div>

        <div>
          <h4>Problemáticas que afronta:</h4>
          <ul>
            <li>Desesperanza aprendida</li>
            <li>Desmembramiento del tejido social</li>
            <li>Oficinas delincuenciales</li>
            <li>Fronteras invisibles</li>
            <li>Muerte prematura de la juventud</li>
            <li>Borramiento de los afrofeminismos</li>
            <li>Segregación, marginalización y hacinamiento</li>
            <li>Microtráfico</li>
            <li>Falta de espacios públicos</li>
            <li>Deterioro de los humedales</li>
          </ul>
        </div>

        <div>
          <h4>Acciones:</h4>
          <ul>
            <li>
              Niñez: fortalecimiento de la identidad, la memoria ancestral, la
              resignificación de prácticas culturales para sembrar esperanza en
              el territorio y continuidad en el tejido comunitario. Espacios:
              Biblioteca, Chonta Mandinga -Capoeira Angola y Laboratorio de
              audiovisuales.
            </li>
            <li>
              Género: resistencia y reexistencia de las mujeres negras y
              empobrecidas del oriente de Cali desde apuestas pedagógicas y
              metodológicas transversalizadas por el afecto, el amor, el cuidado
              desde un enfoque de género, étnico racial y territorial. Procesos:
              Escuela Socio-Política Entre Mujeres y el Grupo de Mujeres.
            </li>
            <li>
              Juventudes: dignificación y transformación de realidades de vida
              en las y los jóvenes negras y diversas social y sexualmente del
              territorio. Desde la educación y la comunicación populares y
              alternativas buscamos incentivar la incidencia política. Procesos:
              Pre-Ices Comunitario Popular Paulo Freire.
            </li>
          </ul>
        </div>
      </div>
    ),
    boton: false,
    link: "",
    image: "",
    description: "",
  },
   {
  id: 32,
  title: "",
  layaut: "Luyaut2", 
  size: "medium",
  highLight: "Alternativa Transformadora Red de Mujeres y Organizaciones del Oriente",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\mujeresDelOriente.webp" alt="" />
        <p><strong>Localización:</strong> Diferentes casas</p>
        <p><strong>Incidencia:</strong> Oriente de Cali</p>
        <p><strong>Influencia:</strong> Pacífico Colombiano</p>
      </div>

      <div>
        <p>
          Surgimos en el 2000 como iniciativa de mujeres provenientes del litoral Pacífico que 
          nos fuimos encontrando en la Casa Cultural El Chontaduro para desarrollar las 
          juntanzas de territorio y tratar aspectos relacionados con las dinámicas del contexto 
          caminando hacia los propios procesos, los oficios varios y con el tiempo creamos 
          procesos de economías solidarias.
        </p>
      </div>
      
      <div>
        <h4>Procesos que conforman la red:</h4>
        <ul>
          <li>Asociación Lila Mujer</li>
          <li>Escuela Taller Amauta</li>
          <li>Fondo Solidario Oriente</li>
          <li>AESDA</li>
          <li>Fundación Legado Ancestral del Pacífico</li> 
          <li>Asociación Matamba Tierra</li>
          <li>Fundación Nectar</li>
          <li>Fundación Girasoles</li>
          <li>Fundación Integración Pacífica</li>
          <li>Mujeres Vencedoras del Pacífico</li>
          <li>Asociación Casa Cultural El Chontaduro</li>
        </ul>
      </div>

      <div>
        <h4>Los problemas que afrontamos:</h4>
        <ul>
          <li>Desigualdad</li>
          <li>Exclusión</li>
          <li>Injusticias</li>
          <li>Marginalización</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Creación de procesos de economías solidarias</li>
          <li>Fondo comunitario María Fenix</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 33,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Chicas Comunicativas",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\chicasComunicativas.webp" alt="" />
        <p><strong>Localización:</strong> Biblioteca Rigoberta Menchú</p>
        <p><strong>Incidencia:</strong> Comuna 15</p>
        <p><strong>Influencia:</strong> Oriente de Cali</p>
      </div>

      <div>
        <p>
          Nacemos en el 2018 como un proceso conformado por jóvenes mujeres que tenemos 
          entre 14 y 15 años y habitamos en la comuna 15, en el barrio Brisas de Las Palmas en 
          Cali. Nos juntamos con la necesidad de encontrar espacios seguros para el diálogo y el 
          encuentro de las niñas, adolescentes y jóvenes. Al principio éramos un club de lectura, 
          ubicado en la biblioteca Rigoberta Menchú, luego nos trasladamos a la emisora y 
          desde ahí empezamos a realizar radio, para comunicar las diferentes problemáticas 
          que atraviesan a las niñas en su comunidad sobre todo el acoso callejero y los piropos.
        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Desigualdad entre hombres y mujeres</li>
          <li>Violencia de género</li>
          <li>Falta de oportunidades para las mujeres, para el fortalecimiento de su autonomía económica</li>
          <li>Falta de representatividad de las mujeres en lugares de incidencia política y de toma de decisiones</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Comunicación asertiva con base en los derechos, los valores, temas de actualidad y las situaciones de violencia de género que nos atraviesan siempre</li>
          <li>Contextualización de las diferentes problemáticas del sector, como el acoso callejero, a partir de diferentes espacios y escenarios, entre ellos, mesas de radio</li>
          <li>Murales con mensajes para la comunidad</li>
          <li>Jornadas informativas - en los lugares donde otras niñas no tienen la posibilidad de enterarse de muchas cosas, como los asentamientos</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 34,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Matamba fundación ",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\matamba.webp" alt="" />
        <p><strong>Localización:</strong> Comuna 3</p>
        <p><strong>Incidencia:</strong> Barrio San Cayetano</p>
        <p><strong>Influencia:</strong> Comunas 3, 4 y 9 de Cali</p>
      </div>

      <div>
        <p>
          Surgimos en el 2017, como una idea después de un encuentro internacional  de personas negras hablando de sus aportes a la sociedad, así que los co-fundadores se sentaron a pensar ¿qué podemos hacer por los jóvenes negros y diversos del Distrito de Aguablanca.
        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Violencia estructural</li>
          <li>Impedimento de la libre expresión de género y/o orientación sexual</li>
          <li>Racismo estructural </li>
          <li>Avance generacional y movilidad social casi nulo en Colombia que mantiene a las personas empobrecidas en el mismo lugar</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Proyectos y publicaciones en pro de educar a la sociedad en términos de diversidad étnico-racial y sexogenéricos. </li>
          <li>Visibilización de creaciones y creadores negrxs con el fin de apoyar lo que tienen para decir, entre lo que destacan sus denuncias y sentires frente a sí mismos y otrxs.</li>
          <li>Exponemos a través del proyecto -Cali, Capital de la resistencia- las motivaciones y acciones de jóvenes negrxs en el marco del paro 2021</li>
          <li>Proyectos que impactan personas negras diversas del litoral.</li>
          <li>Creación de espacios seguros para la expresión sexogenérica, de ahí nace Negras, Maricas y Disidentes.</li>
          <li>Producción de la revista Matamba.</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 35,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Red Nativos - Huerta Madre La Laguna",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\la laguna.webp" alt="" />
        <p><strong>Localización:</strong> Dg. 26g 4, Barrio Marroquín III</p>
        <p><strong>Incidencia:</strong> Oriente de Cali</p>
        <p><strong>Influencia:</strong> Santiago de Cali</p>
      </div>

      <div>
        <p>
          Surgimos desde 1990, a raíz de varios desafíos dentro del territorio. Entre ellos, los 
          asentamientos de casas informales, las zonas verdes usadas como basureros y 
          escombreras y la transformación de estos en espacios productivos, la niñez vulnerable 
          en condición de abandono, la juventud con adicciones, sin orientación, el acceso a los 
          alimentos, regeneración de la tierra, aporte desde nuestro alcance al calentamiento 
          global, atención de conciencia hacia el cuidado y la conservación de nuestros recursos 
          naturales y vitales flora, fauna, agua y aire.
        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Asentamientos de casas informales</li>
          <li>Zonas verdes afectadas como basureros y escombreras</li>
          <li>Niñez vulnerable en condición de abandono</li>
          <li>Juventud adicta sin orientación</li>
          <li>Necesidad de acceso a alimentos sanos y regeneración de la tierra</li>
          <li>Necesidad de aportar desde nuestro alcance al calentamiento global</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Educación en la vivencia sobre residuos y la transformación de recursos naturales y vitales: flora, fauna, suelo, agua y aire</li>
          <li>Educación basada en acciones correctivas con principios agroecológicos</li>
          <li>Semilleros con los niños y siembra de árboles</li>
          <li>Alianza con SENA agroecológico de Tuluá</li>
          <li>Creación de huerta</li>
          <li>Taller inteligencia ambiental en instituciones educativas</li>
          <li>Prácticas agroecológicas de cultivo de alimentos sanos</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
/////////////////////////////////////////////////////////////////////////Alternativas villa rica
{
  id: 36,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Asociación cultural Casa del Niño y de la Niña",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\ACCN.webp" alt="" />
        <p><strong>Localización:</strong> Villa Rica, vía Puerto Tejada. Vereda Agua Azul</p>
        <p><strong>Incidencia:</strong> Centro, norte Tejada y Guachené</p>
        <p><strong>Influencia:</strong> Norte del Cauca</p>
      </div>

      <div>
        <p>
          La asociación surgió en el año 1970, motivada a plantear una solución a la desintegración 
          familiar que permeaba el territorio y que afectaba directamente a la niñez, quienes no tenían 
          quién cuidara de ellos. Por otra parte, para dicha época no había procesos organizativos 
          que lucharan por los derechos humanos y el territorio. Por tanto, nuestra alternativa, se ha 
          propuesto la realización de trabajo comunitario en el norte del Cauca, por medio de la 
          ejecución de proyectos y programas enfocados en la niñez, la juventud, los adultos 
          mayores, el cuidado del ambiente y la soberanía alimentaria. Todo esto enfocado en la 
          mejora de las condiciones de vida de las poblaciones más vulnerables.
        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Monocultivo de la caña</li>
          <li>Desintegración familiar y social</li>
          <li>Pandillas</li>
          <li>Tráfico y consumo de drogas ilícitos</li>
          <li>Pocas redes de cuidado para la niñez</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>
            Creamos procesos organizativos que luchan por garantizar los derechos humanos de 
            manera intergeneracional como lo son: Corporación Colombia Joven y Casa del Adulto 
            Mayor
          </li>
          <li>Defendemos las semillas tradicionales en todo el norte del Cauca por la reivindicación de los derechos de las comunidades afro</li>
          <li>Ejecutamos proyectos con diferentes poblaciones: niñez, juventud y adulto mayor</li>
          <li>Consolidamos escuelas de paz e interactivas</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 37,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora UOAFROC-Unidad de organizaciones afrocaucanas",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\Uoafroc.webp" alt="" />
        <p><strong>Localización:</strong> Cra. 26 #9-18, Puerto Tejada, Barrio Santa Elena</p>
        <p><strong>Incidencia:</strong> Departamento del Cauca</p>
        <p><strong>Influencia:</strong> Departamento del Cauca</p>
      </div>

      <div>
        <p>
          Surgimos en 2003, con la finalidad de resignificar los proyectos educativos desde la 
          educación y la etnografía para la generación de autonomía territorial en el tema de la 
          seguridad alimentaria. Por ello, en la actualidad realizamos procesos de formación y 
          potencialización de productos de alimentación de fincas tradicionales.
        </p>
      </div>

      <div>
        <h4>Problemas que afrontamos:</h4>
        <ul>
          <li>Fortalecimiento de la finca tradicional para la soberanía alimentaria</li>
          <li>Conflicto Armado</li>
          <li>Contaminación por fumigación con glifosato en el monocultivo de caña de azúcar</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Compañías de formación en el tema de resolución de conflictos</li>
          <li>Acompañamiento a los pequeños agricultores en la transformación de la tierra</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 38,
  title: "",
  layaut: "Luyaut2",
  size: "medium", 
  highLight: "Alternativa Transformadora Consejo comunitario territorio y paz",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\Consejo comunitario territorio y.webp" alt="" />
        <p><strong>Localización:</strong> Vereda Chalo, Villa Rica</p>
        <p><strong>Incidencia:</strong> Vereda Chalo, Villa Rica</p>
        <p><strong>Influencia:</strong> Villa Rica</p>
      </div>

      <div>
        <p>
          Surgimos en 2007, a partir de la necesidad de conformar el primer consejo comunitario en 
          Villa Rica, con la finalidad de defender los intereses de la comunidad afro, de acuerdo a la 
          Ley 70 de 1993. Actualmente nuestra alternativa realiza capacitaciones a la comunidad 
          para defender el territorio y la conservación del mismo, de acuerdo a las normas, leyes y 
          decretos de la comunidad, las cuales permiten que la comunidad conozca sus deberes y 
          sus derechos.
        </p>
      </div>

      <div>
        <h4>Problemas que afrontamos:</h4>
        <ul>
          <li>Grupos armados al margen de la ley</li>
          <li>Documentación no consultada antes de hacer consultas previas con la comunidad</li>
          <li>Venta para la extracción de grandes cantidades de arcillas</li>
          <li>Poco reconocimiento de la existencia del territorio por parte de los empresarios</li>
        </ul>
      </div>

      <div>
        <h4>Acciones:</h4>
        <ul>
          <li>Capacitación a la comunidad sobre la Ley 70 de 1993, el Decreto 1745 de 1995, la Ley 21 de 1991, entre otras para proteger el territorio</li>
          <li>Exigir a las empresas de la zona franca para que hagan consulta previa</li>
          <li>Acompañamiento a la Mesa Municipal de Tierra</li>
          <li>Potenciar los proyectos etnoeducativos y la etno granja como alternativa de seguridad alimentaria</li>
          <li>Capacitaciones a la comunidad para defender el territorio y la conservación del mismo, de acuerdo a las normas, leyes y decretos de la comunidad</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 39,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Escuela Itinerante Casilda Cundumi",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img  className="imgEntramadosModal" src="assets\img\entramados\Casilda candumi.webp" alt="" />
        <p><strong>Localización:</strong> Villa Rica, Puerto Tejada, Padilla, Miranda, Guachené y Santander de Quilichao</p>
        <p><strong>Incidencia:</strong> Zona plana del norte del Cauca</p>
        <p><strong>Influencia:</strong> Norte del Cauca</p>
      </div>

      <div>
        <p>
          La escuela surge en 2011, con el fin de defender y crear estrategias para persistir en el 
          territorio, a causa del deterioro constante que se estaba generando por los negocios 
          extractivistas del monocultivo de la caña de azúcar y la minería de arcilla.
        </p>
      </div>

      <div>
        <h4>Problemas que afrontamos:</h4>
        <ul>
          <li>Descomposición del tejido social</li>
          <li>Grupos al margen de la ley</li>
          <li>Monopolio de la caña</li>
          <li>Contaminación del medio ambiente y deterioro del territorio</li>
          <li>Presencia de la delincuencia común</li>
          <li>Contaminación de los ríos</li>
          <li>Acaparamiento de la tierra</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Recuperación de semillas</li>
          <li>Recuperación de la finca tradicional por medio de capacitaciones y ejecución de proyectos</li>
          <li>Alianza y juntanza con otras organizaciones</li>
          <li>Construcción de organizaciones y exigibilidad del derecho</li>
          <li>Reconocimiento de la cultura defendida</li>
          <li>Creación de comité por la defensa del territorio</li>
          <li>Establecer un corredor afro-alimentario, como estrategia de desarrollo territorial para promover la soberanía alimentaria, autonomía territorial alimentaria, la conservación de la biodiversidad y los derechos de las comunidades</li>
          <li>Creando estrategias para persistir en el territorio</li>
          <li>Investigaciones sobre el territorio</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 40,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa transformadora Palenques juveniles (Colectivo socio-juvenil huellas)",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\fundacionHuellas.webp" alt="" />
        <p><strong>Localización:</strong> Villa Rica, Cauca, Barrio San Fernando</p>
        <p><strong>Incidencia:</strong> Villa Rica y Puerto Tejada</p>
        <p><strong>Influencia:</strong> Norte del Cauca</p>
      </div>

      <div>
        <p>
          Somos una organización juvenil que transforma, con una visión inclusiva, el liderazgo, la 
          innovación y el trabajo comunitario en el norte de Cauca.
        </p>
      </div>

      <div>
        <h4>Problemas que afrontamos:</h4>
        <ul>
          <li>Falta de oportunidades para la juventud</li>
          <li>Múltiples violencias contra la niñez y la juventud</li>
          <li>Debilitamiento de los vínculos en el territorio</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Promovemos el arte, el deporte y el acceso a oportunidades para la niñez, la juventud y la comunidad</li>
          <li>Fortalecemos liderazgos en Derechos Humanos, género y diversidad cultural</li>
          <li>Promovemos un ambiente sostenible desde el ambiente, la paz, la tecnología y la economía</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
/////////////////////////////////////////////////////////////////////////Alternativas suarez
{
  id: 41,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora ASOCOMS - Asociación de Consejos Comunitarios de Suárez",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\asocoms.webp" alt="" />
        <p><strong>Localización:</strong> Suárez, Cauca, Barrio Las Brisas</p>
        <p><strong>Incidencia:</strong> Consejos comunitarios de La Toma, Asnazú, Benavista, Meseta, Pureto, Mindala, Brisas, Portugal y Cuenca Río Ovejas</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
      </div>

      <div>
        <p>
          Somos una organización que reune varios consejos de las comunidades negras de Suárez. 
          Nos enfocamos en defender nuestros derechos étnico territoriales, implementamos el 
          seguimiento y la ejecución del Plan de manejo ambiental de la represa La Salvajina y 
          luchamos por el cuidado los ríos Cauca y Ovejas y de los daños causados a estos por los 
          proyectos mineros y energéticos extractivistas.
        </p>
      </div>

      <div>
        <h4>Problemas que afrontamos:</h4>
        <ul>
          <li>Impactos adversos a los pobladores y al territorio derivados de la construcción, operación y mantenimiento de la represa La Salvajina</li>
          <li>Intereses de los sectores mineros</li>
          <li>Presencia de grupos armados al margen de la ley</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Cuidado y defensa de los ríos Cauca y Ovejas y de lo público: el rio, el aire y madre tierra</li>
          <li>Participación en el diseño, implementación y seguimiento del Plan de manejo de la represa La Salvajina</li>
          <li>Impulso a transformaciones económicas productivas</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 42,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Consejo comunitario de comunidades negras cuenca río Ovejas",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\Logo_Consejo_río_Ovejas.webp" alt="" />
        <p><strong>Localización:</strong> Corregimiento de La Toma, Suárez, Cauca</p>
        <p><strong>Incidencia:</strong> Veredas de Yolombó, Gelima y Dos Aguas</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
      </div>

      <div>
        <p>
          La asociación surge en el año 1970, motivada a plantear una solución a la desintegración 
          familiar que permeaba el territorio y que afectaba directamente a la niñez. Por otra parte, para dicha época no había procesos organizativos 
          que lucharan por los derechos humanos y el territorio. Por tanto, nuestra alternativa, se ha 
          propuesto la realización de trabajo comunitario en el norte del Cauca por medio de la 
          ejecución de proyectos y programas enfocados en la niñez, la juventud, los adultos 
          mayores, el cuidado del ambiente y la soberanía alimentaria. Todo esto enfocado en la 
          mejora de las condiciones de vida de las poblaciones más vulnerables.
        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>La siembra de coca para la producción de drogas ilícitas</li>
          <li>La poca inversión social en los territorios</li>
          <li>Aspectos de la operación y mantenimiento de la represa Salvajina que afectan a la población</li>
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>La construcción de la agenda de juventud para la participación e incidencia en los planes de desarrollo</li>
          <li>La formulación de proyectos que buscan mitigar las necesidades de la población juvenil asambleas de juventud</li>
          <li>La rendición de cuentas acerca de las temas que nos afectan como jóvenes</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 43,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Consejo Municipal de Juventudes Suárez, Cauca",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\Logo_Consejo_río_Ovejas.webp" alt="" />
        <p><strong>Localización:</strong> Corregimiento de La Toma, Suárez, Cauca</p>
        <p><strong>Incidencia:</strong> Veredas de Yolombó, Gelima y Dos Aguas</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
      </div>

      <div>
        <p>
          Surgimos por las manifestaciones del 2021. A partir de ese momento los jóvenes de cada territorio nos propusimos marchar, participar, hacer incidencia para lograr un impacto social y veeduría a los entes administrativos del municipio. Estamos interesados en fortalecer espacios de participación recogiendo a toda la población juvenil del territorio.
        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>La siembra de coca para la producción de drogas ilícitas</li>
          <li>La poca inversión social en los territorios</li>
          <li>Aspectos de la operación y mantenimiento de la represa Salvajina que afectan a la población</li>
          <li>Poca participación de los jóvenes en los espacios de toma de decisiones.</li>
          
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Construcción de la agenda de juventud para la participación e incidencia en los planes de desarrollo.</li>
          <li>Formulación de proyectos que buscan mitigar las necesidades de la población juvenil asamblea de juventud.</li>
          <li>Seguimiento a la rendición de cuentas acerca de los temas que nos afectan como jóvenes. </li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 44,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Asociación de Mujeres afrodescendientes de la vereda de Yolombó",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\asomuafroyo.webp" alt="" />
        <p><strong>Localización:</strong>Vereda Yolombó. Suárez, Cauca.</p>
        <p><strong>Incidencia:</strong> Vereda Yolombó. Suárez, Cauca.</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
      </div>

      <div>
        <p>
          La asociación nace en el 2010 ante el sentimiento cotidiano de exclusión y discriminación, reisgo de desplazamiento forzado por motivos de violencia y no oportunidades laborales y la violación de los derechos ancestrales, étnicos territoriales, social, político y culturales que las comunidades negras han vivido desde la trata transatlantica hasta hoy. 

        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Acción violenta de grupos armados</li>
          <li>El cultivo de coca para la producción de drogas ilícitos</li>
          <li>El abandonó estatal.</li>
          
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Diálogos con la comunidad.</li>
          <li>Encuentros con la Guardia Cimarrona.</li>
          <li>Talleres de autoprotección y autocuidado.</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 45,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Alternativa Transformadora Guardia Cimarrona Suárez, Cauca",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img  className="imgEntramadosModal" src="assets\img\entramados\Guardia cimarrona.webp" alt="" />
        <p><strong>Localización:</strong> Monte Redondo. Suárez, Cauca.</p>
        <p><strong>Incidencia:</strong> Consejo Comunitario Río Ovejas. Suárez, Cauca.</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
        
      </div>

      <div>
        <p>
          La Guardia Cimarrona se conformó en 2014 para garantizar la defensa, el cuidado y la protección del territorio.

        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>La siembra de coca para producción de drogas ilícitas.</li>
          <li>Grupos al margen de la ley en el territorio.</li>
          <li>Abandono estatal o intervenciones estatales lesivas en el territorio.</li>
          
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Capacitar a jóvenes que están consumiendo sustancias psicoactivas. </li>
          <li>Evitar la presencia de la minería ilegal en el territorio</li>
          <li>Evitar la implementación de cultivo de coca en el territorio.</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 46,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Asociación de agroindustrial de productos agropecuarios y mineros afrodescendientes de Yolombó y Gelima - Asoyogé",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal"  src="assets\img\entramados\Asoyoge.webp" alt="" />
        <p><strong>Localización:</strong> Monte Redondo. Suárez, Cauca.</p>
        <p><strong>Incidencia:</strong>Veredas Yolombó y Gelima.</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
        
      </div>

      <div>
        <p>
          Nos juntamos el 10 de enero del 2020 para reivindicar y promover el respeto a los derechos humanos, territoriales, sociales, económicos, culturales, ambientales, políticos y por serr víctimas del conflicto armado. Esto lo hacemos procurando la equidad de género en las comunidades negras, afrocolombianas, raizales o palenqueras e incentivando la producción, transformación y comercialización de productos agroalimentarios.

        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Cultivos de coca para la producción de drogas de uso ilícito.</li>
          <li>Presencia de grupos armados al margen de la ley en el territorio.</li>
          <li>Títulos mineros no consultados.</li>
          
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Implementación  de alternativas para la producción de familias del territorio. </li>
          <li>Gestión de formación académicas para jóvenes y adultos.</li>
          <li>Gestión de proyectos de fortalecimiento de tradiciones culturales en el territorio.</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
{
  id: 47,
  title: "",
  layaut: "Luyaut2",
  size: "medium",
  highLight: "Asociación de Mujeres afrodescendientes de la vereda de Yolombó",
  icono: "",
  texto: (
    <div className="texto-modal-container">
      <div>
        <img className="imgEntramadosModal" src="assets\img\entramados\Plataforma de juventudes.webp" alt="" />
        <p><strong>Localización:</strong>  Barrio Los Almendros. Suárez, Cauca.</p>
        <p><strong>Incidencia:</strong>Zona urbana Suárez, Cauca.</p>
        <p><strong>Influencia:</strong> Suárez, Cauca</p>
        
      </div>

      <div>
        <p>
          Somos jóvenes del municipio de Suárez que desarrollan procesos juveniles basados en la participación por medio del reconocimiento de nuestras diferencias, la creación y seguimiento de agendas, control social y veeduría de recursos públicos locales y promoción de procesos y prácticas organizativas a fin de poder aportar al desarrollo territorial por medio de liderazgos juveniles que impacten de forma positiva a sus comunidades y al municipio. Acogemos los principios orientadores dispuestos en la Constitución Política de Colombia y en el Estatuto de Ciudadanía Juvenil, especialmente los de autonomía, corresponsabilidad, concertación, dignidad, diversidad, interés juvenil, participación, territorialidad, respeto, compromiso, inclusión y autocuidado.

        </p>
      </div>

      <div>
        <h4>Problemáticas que afrontamos:</h4>
        <ul>
          <li>Baja inclusión de los jóvenes en la toma de decisiones y planes del municipio.</li>
          <li>Problemas en la ejecución de los recursos públicos. </li>
          <li>Pocos espacios de expresión y comunicación juvenil.</li>
          
        </ul>
      </div>

      <div>
        <h4>Nuestras acciones:</h4>
        <ul>
          <li>Participamos en el diseño y desarrollo de Agendas Municipales, Distritales, Departamentales y Nacionales de Juventud con base en la agenda concertada al interior del Subsistema de Participación de las Juventudes.</li>
          <li>Ejercemos veeduría y control social a los planes de desarrollo, políticas públicas de juventud, y a la ejecución de las agendas territoriales de las juventudes, así como a los programas y proyectos desarrollados para los jóvenes por parte de las entidades públicas del orden territorial y nacional.</li>
        </ul>
      </div>
    </div>
  ),
  boton: false,
  link: "",
  image: "",
  description: "",
},
  
];

export default modalsData;
