// express.d.ts

import { User } from "@prisma/client";
// import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: User; // Make sure it matches your authMiddleware expectations
  }
}
