import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { KycSchema } from "../schema/users";
import { UnprocessableEntity } from "../exceptions/validation";

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
    res.json(updateUser);
  } catch (err) {
    throw new UnprocessableEntity(
      err,
      "Unprocessable entity!",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
};

export const getKYCStatus = async (req: Request, res: Response) => {
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
