import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { Model } from "mongoose";

export const PaginationGraphQl = async (
  page: number,
  limit: number,
  info: GraphQLResolveInfo,
  model: Model<any>
) => {
  const pageNum = Math.max(page, 1);
  const limitNum = Math.max(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const selectedFields = Object.keys(graphqlFields(info).data || {}).join(" ");
  return await model
    .find({})
    .skip(skip)
    .limit(limit)
    .select(selectedFields)
    .lean();
};
