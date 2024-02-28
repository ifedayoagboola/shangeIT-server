// offerRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import authMiddleware from "../middlewares/auth";
import kycVerificationMiddleware from "../middlewares/kycVerification";
import { depositFunds } from "../controllers/transactions";

const transactionRoutes: Router = Router();

transactionRoutes.post(
  "/deposit-funds",
  // [authMiddleware, kycVerificationMiddleware],
  errorHandler(depositFunds)
);

export default transactionRoutes;
