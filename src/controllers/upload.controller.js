import cloudinary from "../config/cloudinary.config.js";
import modalPicture from '../models/modalPicture.model.js';
import GeoImage from '../models/geoImage.model.js'
import modalInfo from '../models/modalInfo.model.js';
import { removeExtension } from "../helpers/removeExtension.js";


const uploadImage = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ msg: 'No se encontraron imágenes' });
        }

        const { tempFilePath } = req.files.image;
        const { modalId } = req.params;

        // Subir imagen a Cloudinary
        const { url } = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'assets'
        });

        // Crear el registro de la imagen en modalPicture
        const pictureData = modalId ? { modal: modalId, url } : { url };
        const picture = await modalPicture.create(pictureData);

        // Si modalId existe, actualizar modalInfo
        if (modalId) {
            await modalInfo.findByIdAndUpdate(modalId, {
                imgUrl: picture._id,
            });
        }

        res.json({ picture });
    } catch (error) {
        console.error({ error });
        res.status(500).json({ msg: 'Algo salió mal.' });
    }
};


const uploadGeoImage = async (req, res) => {
   
    try {

        const { tempFilePath, name } = req.files.image;

        const { url } = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'geoImages'
        });

        const fileName = removeExtension(name);
        const image = await GeoImage.create({ url, name, fileName });

        res.status(201).json({ image })

    } catch (error) {
        console.error({ error });
        res.status(500).json({ msg: 'Algo salío mal.' })
    }
}


export {
    uploadImage,
    uploadGeoImage
}