import { Request, Response } from "express";
import { prismaClient } from "..";
import { CreateOfferSchema } from "../schema/offers";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOffer = async (req: Request, res: Response) => {
  CreateOfferSchema.parse(req.body);
  const offer = await prismaClient.offer.create({
    data: {
      ...req.body,
    },
  });
  res.json(offer);
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