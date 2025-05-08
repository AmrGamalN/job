import { Request, Response, NextFunction } from "express";
import { GraphQLResolveInfo } from "graphql";
type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

type Resolver = (
  parent: any,
  args: any,
  context: { req: Request; res: Response; next: NextFunction },
  info: GraphQLResolveInfo
) => any;

export const applyMiddleware = (
  resolve: Resolver,
  middlewares: Middleware[]
): Resolver => {
  return async ({ parent, args, context, info }) => {
    for (const middleware of middlewares) {
      await new Promise<void>((resolve, reject) => {
        try {
          middleware(context.req, context.res, (err) => {
            if (err) reject(err);
            resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    return await resolve(parent, args, context, info);
  };
};
