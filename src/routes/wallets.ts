// walletRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import authMiddleware from "../middlewares/auth";
import kycVerificationMiddleware from "../middlewares/kycVerification";
import { getUserWallets } from "../controllers/wallets";

const walletRoutes: Router = Router();

walletRoutes.get(
  "/:id",
  [authMiddleware, kycVerificationMiddleware],
  errorHandler(getUserWallets)
);

export default walletRoutes;
