import { Response } from "express";
import { ServiceResponseType, ResponseOptions } from "../types/response.type";

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
  deletedCount,
}: ResponseOptions): ServiceResponseType => {
  switch (statusText) {
    case "BadRequest":
      return response({ statusText, message, error });

    case "Conflict":
    case "Created":
    case "NotFound":
    case "Unauthorized":
    case "InternalServerError":
      return response({ statusText, message, data, error });

    case "OK":
    default:
      if (statusText == "OK" || data || count || deletedCount)
        return response({
          statusText: "OK",
          message,
          data,
          count,
          deletedCount,
        });
      return response({ statusText: "NotFound", message });
  }
};

const response = ({
  statusText,
  message,
  data,
  error,
  count,
  deletedCount,
}: ResponseOptions): ServiceResponseType => {
  const defaultMessages = {
    OK: "Operation successfully",
    Created: "Resource created successfully",
    BadRequest: "Invalid data",
    NotFound: "Item not found",
    Conflict: "Item already exists",
    Unauthorized: "Unauthorized",
    InternalServerError: "InternalServerError",
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
        deletedCount,
      };

    case "BadRequest":
      return {
        statusText: "BadRequest",
        success: false,
        status: 400,
        message: message ?? defaultMessages.BadRequest,
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
    case "InternalServerError":
      return {
        statusText: "InternalServerError",
        success: false,
        status: 500,
        message: message ?? defaultMessages.Conflict,
        error,
      };

    default:
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
  }
};
