import { Router } from 'express';
import { uploadGeoImage, uploadImage } from '../controllers/upload.controller.js';

const uploadsRouter = Router();


uploadsRouter.post('modal/:modalId', uploadImage);
uploadsRouter.post('/geoImage', uploadGeoImage)


export default uploadsRouter;