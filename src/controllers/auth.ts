import { BadRequestsException } from "./../exceptions/bad-requests";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { LoginSchema, SignupSchema } from "../schema/users";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SignupSchema.parse(req.body);
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      return next(
        new BadRequestsException(
          "User already exists!",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: { name, email, password: hashSync(password, 10) },
    });

    res.json(user);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.issues,
        "Unprocessable entity!",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    LoginSchema.parse(req.body);
    const { email, password } = req.body;

    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      return next(
        new BadRequestsException(
          "User does not exists!",
          ErrorCode.USER_NOT_FOUND
        )
      );
    }
    if (!compareSync(password, user.password)) {
      return next(
        new BadRequestsException(
          "Incorrect password!",
          ErrorCode.INCORRECT_PASSWORD
        )
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({ user, token });
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.status,
        "Unprocessable entity!",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
