import { request, response } from "express"
import GeoCollection from "../models/location.model.js";
import { isValidObjectId } from "mongoose";


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


const getLocation = async (req = request, res = response) => {

    const { term } = req.params;
    const regex = new RegExp(term, 'i');

    try {

        let geoCollection;
        // const geoCollection = await GeoCollection.findById(id);
        if (isValidObjectId(term)) {
            geoCollection = await GeoCollection.findById(term);
        } else {
            geoCollection = await GeoCollection.find({
                $or: [{ name: regex }]
            })
        }

        const isArray = Array.isArray(geoCollection);

        console.log({ isArray });

        if( isArray ) {
            geoCollection = geoCollection[0];
        }


        res.json({ geoCollection });

    } catch (error) {

        console.error({ error });

        res.status(500).json({
            msg: 'Algo salio mal.'
        });
    }
}


export {
    postLocation,
    getLocation
}