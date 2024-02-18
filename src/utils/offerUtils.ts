/* eslint-disable @typescript-eslint/no-explicit-any */
import { prismaClient } from "..";

export const calculateCloseness = (
  createdOffer: any,
  closestMatchingOffers: any
) => {
  const closeness = {
    fromCurrency:
      createdOffer.fromCurrency === closestMatchingOffers.toCurrency,
    toCurrency: createdOffer.toCurrency === closestMatchingOffers.fromCurrency,
    rate: Math.abs(createdOffer.rate - closestMatchingOffers.rate),
    amount: Math.abs(createdOffer.amount - closestMatchingOffers.amount),
  };

  return closeness;
};

export const getClosestMatchingOffers = async (createdOffer: any) => {
  const allOffers = await prismaClient.offer.findMany();

  const closenessArray = allOffers.map((closestMatchingOffers) => ({
    offer: closestMatchingOffers,
    closeness: calculateCloseness(createdOffer, closestMatchingOffers),
  }));

  closenessArray.sort((a, b) => {
    if (a.closeness.fromCurrency !== b.closeness.fromCurrency) {
      return a.closeness.fromCurrency ? -1 : 1;
    }
    if (a.closeness.toCurrency !== b.closeness.toCurrency) {
      return a.closeness.toCurrency ? -1 : 1;
    }
    if (a.closeness.rate !== b.closeness.rate) {
      return a.closeness.rate - b.closeness.rate;
    }
    return a.closeness.amount - b.closeness.amount;
  });

  return closenessArray.map((item) => item.offer);
};
