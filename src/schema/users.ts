import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const KycSchema = z.object({
  name: z.string().optional(),
  country: z.string(),
  address: z.string(),
  postcode: z.string(),
  dob: z.string(),
  phone: z.number().min(10).max(11),
  documentType: z.string(),
  documentNumber: z.string(),
});
