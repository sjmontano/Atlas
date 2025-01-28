import { Schema, model } from 'mongoose';

const LocationSchema = new Schema({
    type: { type: String, required: true }, // Siempre será "Feature"
    properties: {
        name: { type: String, default: null }, // Anteriormente NOMBRE_GEO
        status: { type: Number }, // Anteriormente ESTADO_DRE
        project: { type: String, default: null }, // Anteriormente PROYECTO
        symbol: { type: String, default: null }, // SYMBOL
        date: { type: Date, default: null }, // FECHA
        dispersion: { type: String, default: null }, // DISPERSION
        length: { type: Number }, // Shape_Leng
    },
    geometry: {
        type: { type: String }, // Tipo de geometría, ej. "MultiLineString"
        coordinates: { type: Schema.Types.Mixed } // Arreglo tridimensional de coordenadas
    },
});


const GeoCollectionSchema = new Schema({
    type: { type: String }, // Siempre será "FeatureCollection"
    name: { type: String }, // Nombre de la colección
    crs: {
        type: {
            type: String,
            // Siempre será "name" en este caso
        },
        properties: {
            name: { type: String, }, // Ejemplo: "urn:ogc:def:crs:OGC:1.3:CRS84"
        },
    },
    features: [LocationSchema], // Usamos el esque
});


const GeoCollection = model('GeoCollection', GeoCollectionSchema);

export default GeoCollection;