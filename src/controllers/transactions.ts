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
    const { token, amount, userID } = req.body;
    //create a customer
    console.log(token, amount);
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // res.json({
    //   message: "transaction successful",
    //   customer,
    //   success: true,
    // });

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
          sender: req.body.userId,
          receiver: req.body.userid,
          amount: amount,
          reference: "stripe deposit",
          type: "deposit",
          status: "Success",
        },
      });
      //Increase the user's balance
      const wallet = await prismaClient.wallet.update({
        where: { id: userID },
        data: { ...{ balance: amount } },
      });
      res.json({
        message: "transaction successful",
        newTransaction,
        wallet,
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

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const offer = req.body;
    const updateOffer = await prismaClient.offer.update({
      where: { id: +req.params.id },
      data: offer,
    });
    res.json(updateOffer);
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
