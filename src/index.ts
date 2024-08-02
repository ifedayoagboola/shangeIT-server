import express, { Express, Request, Response } from "express";
import cors from "cors";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(cors());

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("API is perfect!");
});
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
