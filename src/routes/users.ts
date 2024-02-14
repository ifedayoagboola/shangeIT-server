// offerRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import authMiddleware from "../middlewares/auth";
import { createKyc, updateKyc } from "../controllers/users";
import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router();

userRoutes.post("/", [authMiddleware], errorHandler(createKyc));
userRoutes.put("/:id", [authMiddleware], errorHandler(updateKyc));
userRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateKyc)
);
userRoutes.get("/:id", [authMiddleware], errorHandler(updateKyc));
userRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(updateKyc));
export default userRoutes;
