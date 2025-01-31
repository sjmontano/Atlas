import mongoose, { model, Schema } from 'mongoose';

const GeoImageSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique:true
    },



    fileName: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    }


});

GeoImageSchema.methods.toJSON = function () {
    const { __v, ...rest } = this.toObject();
    return rest;
}

export default model('GeoImage', GeoImageSchema);