/* eslint-disable @typescript-eslint/no-explicit-any */
// authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. extract the token from header
  const token = req.headers.authorization;

  // 2. if token is not present, throw unauthorized error
  if (!token) {
    return next(
      new Unauthorized(
        "unauthorized attempt!",
        ErrorCode.UNAUTHORIZED_EXCEPTION
      )
    );
  }

  try {
    // 3. if the token is present, verify token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // 4. to get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(
        new Unauthorized(
          "unauthorized attempt!",
          ErrorCode.UNAUTHORIZED_EXCEPTION
        )
      );
    }

    // 5. to attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    return next(
      new Unauthorized(
        "unauthorized attempt!",
        ErrorCode.UNAUTHORIZED_EXCEPTION
      )
    );
  }
};

export default authMiddleware;
