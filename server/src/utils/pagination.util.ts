import { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { Model } from "mongoose";
import { validateAndFormatData } from "./validateData.util";
import { serviceResponse } from "./response.util";

export const paginate = async (
  model: Model<any>,
  dto: any,
  totalCount: number,
  paginationOptions?: { page: number; limit: number },
  graphqlInfo?: GraphQLResolveInfo | null,
  fieldSearch?: any,
  populatePath?: any,
  populateFilter?: any
) => {
  const page = Math.max(paginationOptions?.page || 1, 1);
  const limit = Math.max(paginationOptions?.limit || 10, 10);
  const skip = (page - 1) * limit;
  const selectedFields = graphqlInfo
    ? Object.keys(graphqlFields(graphqlInfo).data || {}).join(" ")
    : {};

  let query = model
    .find(fieldSearch ?? {})
    .skip(skip)
    .limit(limit)
    .select(selectedFields);
  if (populatePath) {
    query = query.populate({
      path: populatePath,
      match: populateFilter,
    });
  }
  const documents = await query.lean();

  const filteredDocuments = populatePath
    ? documents.filter((doc) => !!doc[populatePath])
    : documents;

  const validatedData = validateAndFormatData(
    filteredDocuments,
    dto,
    "getAll",
    populatePath
  );
  if (!validatedData.data)
    return serviceResponse({
      statusText: "NotFound",
      data: [],
    });

  const totalPages = Math.ceil(totalCount / limit);
  const remainPages = totalPages - page;
  return {
    paginate: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
      remainPages: remainPages > 0 ? remainPages : 0,
      itemsPerPage: limit,
    },
    ...validatedData,
  };
};
