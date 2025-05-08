import { Request, Response, NextFunction } from "express";
import { GraphQLResolveInfo } from "graphql";

export type FuncExpressType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any | Response> | void;

export type GraphqlType = {
  parent: any;
  args: any;
  context: { req: Request; res: Response; next: NextFunction };
  info: GraphQLResolveInfo;
};

export type FuncGraphqlType = (
  parent: any,
  args: any,
  context: { req: Request; res: Response; next: NextFunction },
  info: GraphQLResolveInfo
) => Promise<any>;

export type GraphqlArrayType = [
  parent: any,
  args: any,
  context: { req: Request; res: Response; next: NextFunction },
  info: GraphQLResolveInfo
];

export type ExpressArrayType = [
  req: Request,
  res: Response,
  next: NextFunction
];
