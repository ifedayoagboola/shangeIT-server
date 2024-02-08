import { Router } from "express";
import authRoutes from "./auth";
import offerRoutes from "./offers";

const rootRouter: Router = Router();
rootRouter.use("/auth", authRoutes);
rootRouter.use("/offers", offerRoutes);

export default rootRouter;
