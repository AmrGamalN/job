import { validateAndFormatData } from "./validateData.util";
import { serviceResponse } from "./response.util";
import { ServiceResponseType } from "../types/response.type";
import graphqlFields from "graphql-fields";
import {
  PaginationOptionsType,
  ValidateZodType,
} from "../types/pagination.type";
// Pagination
export const generatePagination = async ({
  model,
  userDto,
  adminDto,
  viewerRole,
  totalCount,
  paginationOptions,
  graphqlInfo,
  fieldSearch,
  populatePath,
  populateFilter,
}: PaginationOptionsType): Promise<ServiceResponseType> => {
  const page = Math.max(paginationOptions?.page || 1, 1);
  const limit = Math.max(paginationOptions?.limit || 10, 10);
  const skip = (page - 1) * limit;
  const selectedFields = graphqlInfo
    ? Object.keys(graphqlFields(graphqlInfo).data || {}).join(" ")
    : {};

  // Initialize model
  const documents = await initializeModel({
    model,
    userDto,
    adminDto,
    paginationOptions: {
      sort: paginationOptions?.sort,
      page,
      limit,
      skip,
    },
    fieldSearch,
    selectedFields,
    populatePath,
    populateFilter,
  });

  // Filter undefined from populate
  const data = populatePath
    ? documents.filter((doc) => !!doc[populatePath])
    : documents;

  // Validate and format data
  const validatedData = validateDataByZod({
    data,
    userDto,
    adminDto,
    viewerRole,
    actionType: "getAll",
    populatePath,
  });

  // Calculate pagination and return data
  const totalPages = Math.ceil(totalCount ?? 0 / limit);
  const remainPages = totalPages - page;
  return {
    paginateOptions: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount ?? 0,
      remainPages: remainPages > 0 ? remainPages : 0,
      itemsPerPage: limit,
    },
    ...validatedData,
  };
};

// Initialize model
const initializeModel = async ({
  model,
  paginationOptions,
  fieldSearch,
  selectedFields,
  populatePath,
  populateFilter,
}: PaginationOptionsType) => {
  // Query
  let query = model
    .find(fieldSearch ?? {})
    .skip(paginationOptions?.skip!)
    .limit(paginationOptions?.limit!)
    .select(selectedFields);

  // Populate
  if (populatePath) {
    query = query.populate({
      path: populatePath,
      match: populateFilter,
    });
  }

  // Sort
  if (paginationOptions?.sort) {
    query = query.sort(paginationOptions?.sort);
  }

  return await query.lean();
};

// Validate & format data by Zod
const validateDataByZod = (options: ValidateZodType): ServiceResponseType => {
  const validatedData = validateAndFormatData(options);
  if (!validatedData.data)
    return serviceResponse({
      statusText: "NotFound",
      data: [],
    });
  return validatedData;
};
