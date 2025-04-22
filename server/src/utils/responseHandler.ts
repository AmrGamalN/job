import { Response } from "express";
export interface responseHandler {
  statusText?: string;
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

type ResponseType =
  | "Created"
  | "OK"
  | "BadRequest"
  | "NotFound"
  | "Conflict"
  | "Unauthorized";

interface ResponseOptions {
  statusText?: ResponseType;
  message?: string;
  data?: any;
  error?: any;
  count?: number;
}

export const controllerResponse = (res: Response, response: any) => {
  if (!response.success) return res.status(response.status!).json(response);
  return res.status(response.status!).json(response);
};

export const serviceResponse = ({
  statusText,
  message,
  data,
  error,
  count,
}: ResponseOptions): responseHandler => {
  switch (statusText) {
    case "BadRequest":
      return response({ statusText, message, error });

    case "Conflict":
    case "Created":
    case "NotFound":
    case "Unauthorized":
      return response({ statusText, message, data });

    case "OK":
    default:
      if (statusText == "OK" || data || count)
        return response({ statusText: "OK", message, data, count });
      return response({ statusText: "NotFound", message });
  }
};

const response = ({
  statusText,
  message,
  data,
  error,
  count,
}: ResponseOptions): responseHandler => {
  const defaultMessages = {
    OK: "Operation successfully",
    Created: "Resource created successfully",
    BadRequest: "Bad request",
    NotFound: "Item not found",
    Conflict: "Item already exists",
    Unauthorized: "Unauthorized",
  };

  switch (statusText) {
    case "Created":
      return {
        statusText: "Created",
        success: true,
        status: 201,
        message: message ?? defaultMessages.Created,
        data,
      };

    case "OK":
      return {
        statusText: "OK",
        success: true,
        status: 200,
        message: message ?? defaultMessages.OK,
        data,
        count,
      };

    case "BadRequest":
      return {
        statusText: "BadRequest",
        success: false,
        status: 400,
        message: defaultMessages.BadRequest,
        error,
      };

    case "NotFound":
      return {
        statusText: "NotFound",
        success: false,
        status: 404,
        message: message ?? defaultMessages.NotFound,
      };

    case "Conflict":
      return {
        statusText: "Conflict",
        success: false,
        status: 409,
        message: message ?? defaultMessages.Conflict,
      };
    
    case "Unauthorized":
      return {
        statusText: "Unauthorized",
        success: false,
        status: 401,
        message: message ?? defaultMessages.Conflict,
      };

    default:
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
  }
};
