
const CheckboxList = () => {



    return (

        <div id="layer-control">
            <label>
                <input type="checkbox" id="toggle-bajo-cauca" checked={true} />
                Capa Bajo Cauca
            </label><br />

            <label>
                <input type="checkbox" id="toggle-geoimage" checked={true} />
                Capa Imagen Georreferenciada
            </label><br />

            <label>
                <input type="checkbox" id="toggle-basemap" checked={true} />
                Mapa Base
            </label>
        </div>

    )
}

export default CheckboxList