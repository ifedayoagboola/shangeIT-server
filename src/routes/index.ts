import { Router } from "express";
import authRoutes from "./auth";
import offerRoutes from "./offers";
import userRoutes from "./users";

const rootRouter: Router = Router();
rootRouter.use("/auth", authRoutes);
rootRouter.use("/users", userRoutes);
rootRouter.use("/offers", offerRoutes);

export default rootRouter;
