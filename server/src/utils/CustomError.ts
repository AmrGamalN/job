export class CustomError extends Error {
  statusCode: number;
  success: boolean;
  constructor(message: string, success: boolean, statusCode: number = 500) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.success = success;
    Error.captureStackTrace(this, this.constructor);
  }
}
