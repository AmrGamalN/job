import { Request, Response, NextFunction } from "express";
import {
  ExpressArrayType,
  FuncExpressType,
  FuncGraphqlType,
  GraphqlArrayType,
} from "../types/middleware.type";

// It wraps functions that handle requests, whether Express or GraphQL.
export const asyncHandler = (func: FuncExpressType | FuncGraphqlType) => {
  return async (...args: ExpressArrayType | GraphqlArrayType) => {
    try {
      if (args.length === 3) {
        // Middleware support express
        const [req, res, next] = args as ExpressArrayType;
        return await (func as FuncExpressType)(req, res, next);
      }

      // Middleware support graphQl
      const [parent, argsData, context, info] = args as GraphqlArrayType;
      return await (func as FuncGraphqlType)(parent, argsData, context, info);
    } catch (err: any) {
      // Express: Pass error to middleware
      if (args.length === 3) (args[2] as NextFunction)(err);
      // GraphQL: Re-throw the error until it is caught from Apollo Server and send error to format error
      else
        throw new Error(
          err instanceof Error ? err.message : "Internal Server Error"
        );
    }
  };
};

// Error handling middleware for express
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    statusText: err.statusText || "InternalServerError",
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};
