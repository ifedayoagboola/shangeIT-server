// transactionRoutes.ts

import { Router } from "express";
import { errorHandler } from "../schema/error-handler";
import authMiddleware from "../middlewares/auth";
import kycVerificationMiddleware from "../middlewares/kycVerification";
import {
  depositFunds,
  getAllUserTransactions,
  transferFunds,
} from "../controllers/transactions";

const transactionRoutes: Router = Router();

transactionRoutes.post(
  "/deposit-funds",
  [authMiddleware, kycVerificationMiddleware],
  errorHandler(depositFunds)
);
transactionRoutes.put(
  "/transfer-funds",
  [authMiddleware, kycVerificationMiddleware],
  errorHandler(transferFunds)
);
transactionRoutes.get(
  "/:id",
  [authMiddleware, kycVerificationMiddleware],
  errorHandler(getAllUserTransactions)
);

export default transactionRoutes;
