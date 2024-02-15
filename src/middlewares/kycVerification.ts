/* eslint-disable @typescript-eslint/no-explicit-any */
// authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

const kycVerificationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user?.verificationStatus === "VERIFIED") {
    return next();
  } else {
    return next(
      new Unauthorized("Check KYC status!", ErrorCode.UNAUTHORIZED_EXCEPTION)
    );
  }
};

export default kycVerificationMiddleware;
