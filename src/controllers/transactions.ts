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
    const { token, amount, userId } = req.body;
    //create a customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    //create a charge
    const charge = await stripe.charges.create(
      {
        amount: amount,
        currency: "USD",
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
          amount: amount,
          reference: "stripe deposit",
          type: "deposit",
          status: "Success",
        },
      });
      //Increase the user's balance
      await prismaClient.user.update({
        where: { id: userId },
        data: { ...{ walletBalance: +amount } },
      });
      res.json({
        message: "transaction successful",
        newTransaction,
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
      ErrorCode.OFFER_NOT_FOUND
    );
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  try {
    const { sender, receiver, amount } = req.body;
    const newTransaction = await prismaClient.transaction.create({
      data: {
        sender: sender,
        receiver: receiver,
        amount: amount,
        reference: "No reference",
        type: "transfer",
        status: "Success",
      },
    });
    await prismaClient.user.update({
      where: { id: sender },
      data: { ...{ walletBalance: -amount } },
    });
    await prismaClient.user.update({
      where: { id: receiver },
      data: { ...{ walletBalance: +amount } },
    });

    res.json(newTransaction);
  } catch (error) {
    throw new NotFoundException("Offer not found!", ErrorCode.OFFER_NOT_FOUND);
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const deleteOffer = await prismaClient.offer.delete({
      where: { id: +req.params.id },
    });
    res.json(deleteOffer);
  } catch (error) {
    throw new NotFoundException("Offer not found!", ErrorCode.OFFER_NOT_FOUND);
  }
};

export const listOffers = async (req: Request, res: Response) => {
  // {
  //   count: 100,
  //    data: []
  // }
  const count = await prismaClient.offer.count();
  const skip = req.query?.skip ? +req.query?.skip : 0;
  const take = 5;
  const offers = await prismaClient.offer.findMany({
    skip,
    take,
  });
  res.json({ count, data: offers });
};

export const getOfferById = async (req: Request, res: Response) => {
  try {
    const offer = await prismaClient.offer.findFirstOrThrow({
      where: { id: +req.params.id },
    });
    res.json(offer);
  } catch (err) {
    throw new NotFoundException("Offer not found!", ErrorCode.OFFER_NOT_FOUND);
  }
};
