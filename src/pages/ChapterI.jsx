import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import CheckboxList from "../components/CheckboxList";
import "../styles/Capitulo1.css";

const ChapterI = () => {
  
  const [bajoCaucaData, setbajoCaucaData] = useState({});
  const [cuencaAltaData, setCuencaAltaData] = useState({});

  const fetchGeoJson = async (url, storageKey) => {
    try {
      // Verificar si los datos ya están en el localStorage
      const cachedData = localStorage.getItem(storageKey);
      if (cachedData) {
        return JSON.parse(cachedData); // Retornar datos desde el localStorage
      }

      // Si no hay datos en el localStorage, hacer la solicitud a la API
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const geoCollection = data.geoCollection;

      // Guardar los datos en el localStorage
      localStorage.setItem(storageKey, JSON.stringify(geoCollection));

      return geoCollection;
    } catch (error) {
      console.error("Error fetching GeoJSON:", error);
      return null;
    }
  };

  const handleToggleLayer = (layerId, isChecked) => {
    const visibility = isChecked ? 'visible' : 'none';

    if (layerId === 'basemap') {
      map.getStyle().layers.forEach((layer) => {
        if (layer.type === 'background' || layer.id.includes('maplibre')) {
          map.setLayoutProperty(layer.id, 'visibility', visibility);
        }
      });
    } else {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-75.5000, 6.2000],
      zoom: 7,
      maxZoom: 7.0,
      minZoom: 6.5,
      bearing: -90,
    });

    const loadData = async () => {
      const bajoCauca = await fetchGeoJson(
        'http://localhost:4000/api/v1/location/679d2800c7c9d2574cdd8274',
        'bajoCauca'
      );
      const cuencaAlta = await fetchGeoJson(
        'http://localhost:4000/api/v1/location/679d2825c7c9d2574cdd8277',
        'cuencaAlta'
      );

      if (bajoCauca && cuencaAlta) {
        console.log("Bajo Cauca Data:", bajoCauca);
        console.log("Cuenca Alta Data:", cuencaAlta);

        setbajoCaucaData(bajoCauca);
        setCuencaAltaData(cuencaAlta);

        if (map.getSource('bajoCauca')) {
          map.getSource('bajoCauca').setData(bajoCauca);
        } else {
          map.addSource('bajoCauca', {
            type: 'geojson',
            data: bajoCauca,
          });

          map.addLayer({
            id: 'bajoCauca-layer',
            type: 'fill',
            source: 'bajoCauca',
            paint: {
              'fill-color': '#FF0000',
              'fill-opacity': 0.5,
            },
          });
        }

        if (map.getSource('cuencaAlta')) {
          map.getSource('cuencaAlta').setData(cuencaAlta);
        } else {
          map.addSource('cuencaAlta', {
            type: 'geojson',
            data: cuencaAlta,
          });

          map.addLayer({
            id: 'cuencaAlta-layer',
            type: 'fill',
            source: 'cuencaAlta',
            paint: {
              'fill-color': '#00FF00',
              'fill-opacity': 0.5,
            },
          });
        }
      } else {
        console.error("No se pudieron cargar los datos GeoJSON.");
      }
    };

    map.on('load', () => {
      const imageBounds = [
        [-79.438011528289, 1.633123501103],
        [-79.438011528289 + (0.001957482060 * 3507), 1.633123501103 + (0.001957242876 * 4960)],
      ];

      map.addSource('geoImage', {
        type: 'image',
        url: '/assets/mapaBase.webp',
        coordinates: [
          [imageBounds[0][0], imageBounds[1][1]],
          [imageBounds[1][0], imageBounds[1][1]],
          [imageBounds[1][0], imageBounds[0][1]],
          [imageBounds[0][0], imageBounds[0][1]],
        ],
      });

      map.addLayer({
        id: 'geoImage-layer',
        type: 'raster',
        source: 'geoImage',
        paint: {
          'raster-opacity': 0.8,
        },
      });

      loadData(); // Llamar a loadData después de que el mapa se haya cargado
    });

    const nav = new maplibregl.NavigationControl();
    map.addControl(nav, 'top-right');

    return () => map.remove();
  }, []);

  return (
    <div>
      <div id="map"></div>
      <CheckboxList onToggleLayer={handleToggleLayer} />
    </div>
  );
};

export default ChapterI;