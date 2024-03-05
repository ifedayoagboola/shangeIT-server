// offerRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import authMiddleware from "../middlewares/auth";
import { getUsers, submitKYC } from "../controllers/users";

const userRoutes: Router = Router();

userRoutes.put("/submit-kyc", [authMiddleware], errorHandler(submitKYC));
userRoutes.get("/get-users", [authMiddleware], errorHandler(getUsers));

export default userRoutes;
