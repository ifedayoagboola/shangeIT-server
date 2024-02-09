// offerRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import {
  createOffer,
  deleteOffer,
  getOfferById,
  listOffers,
  updateOffer,
} from "../controllers/offers";
import authMiddleware from "../middlewares/auth";

const offerRoutes: Router = Router();

offerRoutes.post("/", [authMiddleware], errorHandler(createOffer));
offerRoutes.put("/:id", [authMiddleware], errorHandler(updateOffer));
offerRoutes.delete("/:id", [authMiddleware], errorHandler(deleteOffer));
offerRoutes.get("/:id", [authMiddleware], errorHandler(getOfferById));
offerRoutes.get("/", [authMiddleware], errorHandler(listOffers));

export default offerRoutes;
