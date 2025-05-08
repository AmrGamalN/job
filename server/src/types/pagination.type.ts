import { Model } from "mongoose";
import { ZodObject, ZodRawShape } from "zod";
import { UserRoleType } from "./role.type";
import { GraphQLResolveInfo } from "graphql";
export type ActionType = "getAll" | "update" | "getOne" | "delete";

export type PaginationOptionsType = {
  model: Model<any>;
  userDto: ZodObject<ZodRawShape>;
  adminDto?: ZodObject<ZodRawShape>;
  viewerRole?: UserRoleType;
  totalCount?: number;
  paginationOptions: {
    sort?: any;
    page?: number;
    limit?: number;
    skip?: number;
  };
  graphqlInfo?: GraphQLResolveInfo;
  fieldSearch?: any;
  selectedFields?: any;
  populatePath?: any;
  populateFilter?: any;
};

export type ValidateZodType = {
  data: any;
  userDto: ZodObject<ZodRawShape>;
  adminDto?: ZodObject<ZodRawShape>;
  viewerRole?: UserRoleType;
  actionType?: ActionType;
  populatePath?: any;
};
