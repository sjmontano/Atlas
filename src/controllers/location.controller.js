import { request, response } from "express"
import GeoCollection from "../models/location.model.js";


//Subir localización
const postLocation = async (req = request, res = response) => {

    try {

        const { type, name, crs, features } = req.body;

        if (!(type || name || crs || features)) {
            return res.status(400).json({
                msg: 'Faltan parametros'
            });

        }

        const geoCollection = GeoCollection.create(req.body);

        res.status(201).json({
            ok: true,
            geoCollection
        });

    } catch (error) {

        console.error({ error });

        res.status(500).json({
            msg: 'Algo salio mal.'
        });
    }

}


const getLocation = async (req, res) => {

    const id = req.params.id;

    try {

        const geoCollection = await GeoCollection.findById(id);
        res.json({ geoCollection });

    } catch (error) {
        
        console.error({ error });
        res.status(500).json({
            msg:'Algo salio mal.'
        });
    }
}


export {
    postLocation,
    getLocation
}