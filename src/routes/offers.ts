// offerRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import { createOffer } from "../controllers/offers";
import authMiddleware from "../middlewares/auth";

const offerRoutes: Router = Router();

offerRoutes.post("/", [authMiddleware], errorHandler(createOffer));

export default offerRoutes;
