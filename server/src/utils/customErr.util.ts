export class CustomError extends Error {
  statusCode: number;
  success: boolean;
  statusText: string;
  constructor(
    message: string,
    statusText: string,
    success: boolean,
    statusCode: number = 500
  ) {
    super(message);
    this.statusText = statusText;
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.success = success;
    Error.captureStackTrace(this, this.constructor);
  }
}
