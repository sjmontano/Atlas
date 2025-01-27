import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';

const uploadsRouter = Router();

uploadsRouter.get('/', (req, res) => {
 
    res.json({
        msg: 'Hello world'
    })
    
});

uploadsRouter.post('/:modalId', uploadImage);

export default uploadsRouter;