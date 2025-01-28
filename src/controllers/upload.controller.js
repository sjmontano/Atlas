import cloudinary from "../config/cloudinary.config.js";
import modalPicture from '../models/modalPicture.model.js';
import modalInfo from '../models/modalInfo.model.js';


const uploadImage = async (req, res) => {

    const { modalId } = req.params;

    try {

        if (!req.files || !req.files.image) {
            return res.status(400).json({
                msg: 'No se encontraron imagenes'
            });

        }
        const { tempFilePath } = req.files.image;

        const { url } = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'assets'
        });

        const picture = await modalPicture.create({ modal: modalId, url });

        await modalInfo.findByIdAndUpdate(modalId, {
            imgUrl: picture._id,
        });

        res.json({ picture });

    } catch (error) {
        console.error({ error });

        res.status(500).json({
            msg: 'Algo salio mal.'
        });
    }
};

export {
    uploadImage
}