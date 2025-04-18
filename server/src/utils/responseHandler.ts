import { Response } from "express";
export interface responseHandler {
  success: boolean;
  status?: number;
  message?: string;
  error?: any;
  data?: any;
  count?: number;
  accessToken?: string;
  refreshToken?: string;
  tempToken?: string;
  userId?: string;
}

export const controllerResponse = (
  res: Response,
  response: responseHandler
) => {
  if (!response.success) return res.status(response.status!).json(response);
  return res.status(response.status!).json(response);
};

export const NotFound = (type: string) => {
  return {
    success: false,
    status: 404,
    message: `${type} not found`,
  };
};

export const BadRequest = () => {
  return {
    success: false,
    status: 400,
    message: "Bad request",
  };
};
export const Conflict = (message: string) => {
  return {
    success: false,
    status: 409,
    message: `${message} already exist`,
  };
};

export const OK = (message: string, data?: any, count?: number) => {
  return {
    success: true,
    status: 200,
    message: `${message} successfully`,
    data: data,
    count: count,
  };
};
