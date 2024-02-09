/* eslint-disable @typescript-eslint/no-explicit-any */
// authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user?.role === "ADMIN") {
    return next();
  } else {
    return next(
      new Unauthorized(
        "unauthorized attempt!",
        ErrorCode.UNAUTHORIZED_EXCEPTION
      )
    );
  }
};

export default adminMiddleware;
