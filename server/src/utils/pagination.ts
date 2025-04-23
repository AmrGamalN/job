import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { Model } from "mongoose";
import { validateAndFormatData } from "./validateAndFormatData";
import { serviceResponse } from "./responseHandler";

export const PaginationGraphQl = async (
  model: Model<any>,
  Dto: any,
  count: number,
  args: { page: number; limit: number },
  info: GraphQLResolveInfo | null,
  fieldSearch?: any
) => {
  const pageNum = Math.max(args.page, 1);
  const limitNum = Math.max(args.limit, 10);
  const skip = (pageNum - 1) * limitNum;
  const selectedFields = info
    ? Object.keys(graphqlFields(info).data || {}).join(" ")
    : {};
  const retrievedModel = await model
    .find(fieldSearch ?? {})
    .skip(skip)
    .limit(limitNum)
    .select(selectedFields)
    .lean();

  const pareSafe = validateAndFormatData(retrievedModel, Dto, "getAll");
  if (!retrievedModel || !pareSafe.data || retrievedModel.length === 0)
    return serviceResponse({
      statusText: "NotFound",
      data: [],
    });
  const totalPages = Math.ceil(count / limitNum);
  const remainPages = totalPages - pageNum;
  return {
    pagination: {
      currentPage: args.page,
      totalPages: totalPages,
      totalItems: count,
      remainPages: remainPages > 0 ? remainPages : 0,
      itemsPerPage: limitNum,
    },
    ...pareSafe,
  };
};
