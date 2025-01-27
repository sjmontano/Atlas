import modalInfo from '../models/modalInfo.model.js'


const submitModalInfo = async (req, res) => {

    try {

        const modal = await modalInfo.create(req.body);

        res.status(201).json({
            modal
        });

    } catch (error) {
        console.error({ error });
        res.status(500).json({
            msg: 'Algo salio mal.'
        })
    }
}


const getModals = async (req, res) => {

    try {
        const modals = await modalInfo.find()
            .populate('imgUrl', 'url');

        res.status(200).json({
            modals
        });

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            msg: `Algo salio mal.`
        })
    }


}



const getModal = async (req, res) => {

    const { id } = req.params;
    console.log({ id });

    try {

        const modal = await modalInfo.findOne({ _id: id })
            .populate('imgUrl', 'url')

        if (!modal) return res.status(404).json({
            msg: `Modal ${id} no existe.`
        })

        res.json({
            modal
        });

    } catch (error) {
        console.error({ error });
        res.status(500).json({
            msg: 'Algo salío mal.'
        })

    }

}


export {
    submitModalInfo,
    getModal,
    getModals
}