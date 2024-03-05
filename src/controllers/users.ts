import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { KycSchema } from "../schema/users";
import { UnprocessableEntity } from "../exceptions/validation";
import { createWalletsForUser } from "../utils/walletUtils";

export const submitKYC = async (req: Request, res: Response) => {
  KycSchema.parse(req.body);
  try {
    const user = req.user?.id;
    const kyc = req.body;
    const updateUser = await prismaClient.user.update({
      where: { id: user },
      data: {
        ...kyc,
        verificationStatus: "VERIFIED",
      },
    });
    // Introduce a small delay before checking walletsCreated
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Retrieve the most recent user data
    const updatedUser = await prismaClient.user.findUnique({
      where: { id: user },
      select: { walletsCreated: true, verificationStatus: true },
    });

    // Check if wallets have been created for the user
    if (
      updatedUser &&
      !updatedUser.walletsCreated &&
      updatedUser.verificationStatus
    ) {
      // Create wallets for the user
      await createWalletsForUser(user);
    }
    const userWallets = await prismaClient.wallet.findMany({
      where: { userId: user },
    });
    res.json({ updateUser, kyc, userWallets });
  } catch (err) {
    throw new UnprocessableEntity(
      err,
      "Unprocessable entity!",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const count = await prismaClient.user.count();
    const skip = req.query?.skip ? +req.query?.skip : 0;
    const take = 5;
    const users = await prismaClient.user.findMany({
      skip,
      take,
    });
    res.json({ count, data: users });
  } catch (err) {
    throw new UnprocessableEntity(
      err,
      "Unprocessable entity!",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
};
