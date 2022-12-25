import { Result, ValidationError } from "express-validator";

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}


export const createValidationException = (errors: Result<ValidationError>) => {
  return new HttpException(400, errors.array().map(f => `${f.param}: ${f.msg}`).join('|'));
}