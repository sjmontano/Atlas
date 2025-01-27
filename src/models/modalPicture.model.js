import mongoose, { model, Schema } from 'mongoose';

const ModalPictureSchema = new Schema({

    modal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModalInfo'
    },

    url: {
        type: String,
    },

});

// Método para eliminar __v en la respuesta
ModalPictureSchema.methods.toJSON = function () {
    const { __v, ...rest } = this.toObject();
    return rest;
};

export default model('ModalPicture', ModalPictureSchema);
