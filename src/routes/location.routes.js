import { getLocation, postLocation } from "../controllers/location.controller.js";
import { Router } from "express";

const locationRouter = Router();

locationRouter.post('/', postLocation);
locationRouter.get('/:term', getLocation);

export default locationRouter;



