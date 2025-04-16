import { Request, Response, NextFunction } from "express";
import { GraphQLResolveInfo } from "graphql";

type funcExpress = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any | Response> | void;

type funcGraphql = (
  parent: any,
  args: any,
  context: { req: Request; res: Response },
  info: GraphQLResolveInfo
) => Promise<any>;

// It wraps functions that handle requests, whether Express or GraphQL.
export const asyncHandler = (func: funcExpress | funcGraphql) => {
  return async (...args: any[]) => {
    try {
      // Middleware support express
      if (args.length === 3) {
        const [req, res, next] = args as [Request, Response, NextFunction];
        return await (func as funcExpress)(req, res, next);
      }
      // Middleware support graphQl
      const [parent, argsData, context, info] = args as [
        any,
        any,
        { req: Request; res: Response },
        GraphQLResolveInfo
      ];
      return await (func as funcGraphql)(parent, argsData, context, info);
    } catch (err: any) {
      if (args.length === 3) {
        // Express: Pass error to middleware
        (args[2] as NextFunction)(err);
      } else {
        // GraphQL: Re-throw the error until it is caught from Apollo Server and send error to format error
        throw new Error(
          err instanceof Error ? err.message : "Internal Server Error"
        );
      }
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
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};
