import { getModal, getModals, submitModalInfo } from "../controllers/modalInfo.controller.js";
import { Router } from "express";


const modalInfoRouter = Router();

modalInfoRouter.post('/', submitModalInfo);
modalInfoRouter.get('/:id', getModal);
modalInfoRouter.get('/', getModals);



export default modalInfoRouter;