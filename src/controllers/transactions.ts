import { STRIPE_KEY } from "./../secrets";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import Stripe from "stripe";
import { uuid } from "uuidv4";

export const depositFunds = async (req: Request, res: Response) => {
  const stripe = new Stripe(STRIPE_KEY);

  try {
    const { token, amount } = req.body;
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
      const newTransaction = {
        sender: req.body.userId,
        receiver: req.body.userid,
        amount: amount,
        type: "deposit",
        status: "Success",
      };
      await newTransaction.save();
    }
  } catch (err) {}
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
