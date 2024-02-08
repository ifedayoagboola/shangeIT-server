import { Request, Response } from "express";
import { prismaClient } from "..";
import { CreateOfferSchema } from "../schema/offers";

export const createOffer = async (req: Request, res: Response) => {
  CreateOfferSchema.parse(req.body);
  const offer = await prismaClient.offer.create({
    data: {
      ...req.body,
    },
  });
  res.json(offer);
};
