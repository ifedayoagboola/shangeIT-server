/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException } from "./root";

export class Unauthorized extends HttpException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
