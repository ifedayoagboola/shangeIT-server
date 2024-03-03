/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency } from "@prisma/client";
import { prismaClient } from "..";

export const createWalletsForUser = async (userId: any) => {
  const currencies: Currency[] = [
    Currency.CAD,
    Currency.NIG,
    Currency.GBP,
    Currency.USD,
    Currency.EUR,
  ];

  for (const currency of currencies) {
    await prismaClient.wallet.create({
      data: {
        userId,
        currency,
        balance: 0, // Initial balance
      },
    });
  }
};
