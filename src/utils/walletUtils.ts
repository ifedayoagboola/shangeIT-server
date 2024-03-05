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

  try {
    await prismaClient.$transaction([
      // Create wallets for each currency
      prismaClient.wallet.createMany({
        data: currencies.map((currency) => ({
          userId,
          currency,
          balance: 0, // Initial balance
        })),
      }),
      // Update the user to indicate that wallets have been created
      prismaClient.user.update({
        where: { id: userId },
        data: {
          walletsCreated: true,
        },
      }),
    ]);
  } catch (error) {
    // Handle the error, log, or throw as needed
    console.error("Error creating wallets for user:", error);
    throw error;
  }
};
