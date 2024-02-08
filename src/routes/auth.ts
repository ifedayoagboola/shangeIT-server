// authRoutes.ts

import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../schema/error-handler";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(signup));
authRoutes.post("/login", errorHandler(login));

// Use authMiddleware for routes that require authentication
authRoutes.get("/me", [authMiddleware], errorHandler(me));

export default authRoutes;
