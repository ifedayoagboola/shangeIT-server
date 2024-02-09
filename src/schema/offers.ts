import { z } from "zod";

export const CreateOfferSchema = z.object({
  fromCurrency: z.string(),
  toCurrency: z.string(),
  rate: z.number(),
  amount: z.number(),
});
