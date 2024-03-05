import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const getUserWallets = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const wallets = await prismaClient.wallet.findMany({
    where: { userId: userId },
  });
  if (!wallets) {
    throw new NotFoundException(
      `Wallets not found for user ${userId}`,
      ErrorCode.WALLET_NOT_FOUND
    );
  }
  res.json({
    message: "success!",
    wallets,
    success: true,
  });
};
