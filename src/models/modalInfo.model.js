import { model, Schema } from 'mongoose';

const ModalInfoSchema = new Schema({

    idCss: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imgUrl: {
        type: Schema.Types.ObjectId,
        ref: 'ModalPicture' // Referencia a ModalPicture
    },

    type: {
        type: String,
        enum: ['DESC', 'DINAMYC'],
        default: 'DESC',
    }
});

// Método para eliminar __v y _id en la respuesta
ModalInfoSchema.methods.toJSON = function () {
    const { __v, _id, ...rest } = this.toObject();
    return rest;
};

export default model('ModalInfo', ModalInfoSchema);
