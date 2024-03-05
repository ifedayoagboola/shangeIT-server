import { STRIPE_KEY } from "./../secrets";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import Stripe from "stripe";
import { uuid } from "uuidv4";
import { InternalException } from "../exceptions/internal-exception";

export const depositFunds = async (req: Request, res: Response) => {
  const stripe = new Stripe(STRIPE_KEY);
  try {
    const { token, amount, userId, currency } = req.body;

    // Fetch user's wallet for the specified currency
    const userWallet = await prismaClient.wallet.findFirst({
      where: {
        userId: userId,
        currency: currency,
      },
    });

    if (!userWallet) {
      throw new NotFoundException(
        `Wallet not found for user ${userId} and currency ${currency}`,
        ErrorCode.WALLET_NOT_FOUND
      );
    }
    //create a customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    //create a charge
    const charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency,
        customer: customer.id,
        receipt_email: token.email,
        description: "Deposited to Shange-it wallet",
      },
      {
        idempotencyKey: uuid(),
      }
    );
    //Save the transaction
    if (charge.status === "succeeded") {
      const newTransaction = await prismaClient.transaction.create({
        data: {
          sender: userId,
          receiver: userId,
          amount,
          reference: "stripe deposit",
          type: "deposit",
          status: "Success",
        },
      });
      // Update the user's wallet balance
      const updatedWallet = await prismaClient.wallet.update({
        where: {
          id: userWallet.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      res.json({
        message: "Transaction successful",
        newTransaction,
        updatedWallet,
        success: true,
      });
    } else {
      throw new NotFoundException(
        "transaction failed!",
        ErrorCode.OFFER_NOT_FOUND
      );
    }
  } catch (err) {
    throw new InternalException(
      "transaction failed!",
      err,
      ErrorCode.INTERNAL_EXCEPTION
    );
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, amount, currency } = req.body;
    // Fetch source and destination wallets
    const sourceWallet = await prismaClient.wallet.findFirst({
      where: {
        userId: sender,
        currency: currency,
      },
    });

    const destinationWallet = await prismaClient.wallet.findFirst({
      where: {
        userId: receiver,
        currency: currency,
      },
    });
    if (!sourceWallet || !destinationWallet) {
      if (!sourceWallet) {
        throw new NotFoundException(
          `Source wallet not found for user ${sender} and currency ${currency}`,
          ErrorCode.WALLET_NOT_FOUND
        );
      } else {
        throw new NotFoundException(
          `Destination wallet not found for user ${receiver} and currency ${currency}`,
          ErrorCode.WALLET_NOT_FOUND
        );
      }
    }
    // Perform the transaction
    await prismaClient.wallet.update({
      where: { id: sourceWallet.id },
      data: { balance: { decrement: amount } },
    });

    await prismaClient.wallet.update({
      where: { id: destinationWallet.id },
      data: { balance: { increment: amount } },
    });
    const newTransaction = await prismaClient.transaction.create({
      data: {
        sender: sender,
        receiver: receiver,
        amount: amount,
        reference: "No reference",
        type: "debit",
        status: "Success",
      },
    });

    res.json(newTransaction);
  } catch (error) {
    if (error instanceof NotFoundException) {
      // Handle the specific case of wallet not found
      res.status(404).json({
        message: error.message,
        errorCode: error.statusCode,
      });
    } else {
      // Handle other errors
      throw new InternalException(
        "Transaction failed!",
        error,
        ErrorCode.INTERNAL_EXCEPTION
      );
    }
  }
};

export const getAllUserTransactions = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const skip = req.query?.skip ? +req.query?.skip : 0;
    const take = 5;

    const [userTransactions, totalTransactions] = await Promise.all([
      prismaClient.transaction.findMany({
        where: {
          OR: [{ sender: userId }, { receiver: userId }],
        },
        skip,
        take,
      }),
      prismaClient.transaction.count({
        where: {
          OR: [{ sender: userId }, { receiver: userId }],
        },
      }),
    ]);

    res.json({ data: userTransactions, count: totalTransactions });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
