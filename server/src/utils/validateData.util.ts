import { serviceResponse } from "./response.util";
import { ServiceResponseType } from "../types/response.type";
import { filterDataByRole } from "./filterDataByRole.util";
import { ZodObject, ZodRawShape } from "zod";
import { ValidateZodType } from "../types/pagination.type";

export const validateAndFormatData = ({
  data,
  userDto,
  adminDto,
  viewerRole,
  actionType,
  populatePath,
}: ValidateZodType): ServiceResponseType => {
  if (!data)
    return serviceResponse({ statusText: "NotFound", data: [] });

  if (
    Object.keys(data).length === 0 &&
    (actionType == "update" || actionType == "delete")
  )
    return serviceResponse({
      statusText: "BadRequest",
      message: "No data provided for update",
      data: [],
    });

  // Filter data by role & get dto based on role
  let dto: ZodObject<ZodRawShape>;
  if (viewerRole) {
    dto = filterDataByRole(viewerRole, userDto, adminDto);
  } else {
    dto = userDto;
  }

  // Validate List Of Data [getAll]
  if (actionType === "getAll") {
    return validateListOfData(data, dto, populatePath);
  }

  // Validate Single Data [getOne]
  return validateSingleData(data, dto);
};

const validateListOfData = (
  retrievedData: any[],
  dto: ZodObject<ZodRawShape>,
  populatePath?: string
) => {
  const validationResultList = retrievedData.map((item: any) => {
    const dataToValidate = populatePath
      ? resolvePopulate(populatePath, item)
      : item;

    const validationResult = dto.safeParse(dataToValidate);
    if (!validationResult.success)
      return serviceResponse({
        statusText: "BadRequest",
        error: validationResult.error,
      });
    return validationResult.data;
  });

  return serviceResponse({
    data: validationResultList.length > 0 ? validationResultList : null,
  });
};

const resolvePopulate = (populatePath: string, data: any) => {
  if (populatePath == "companyId")
    return {
      ...data?.companyId,
      companyId: data?.companyId?._id,
      prefixS3: data?.prefixS3,
      legalInfo: data?.legalInfo,
      status: data?.status,
      createdAt: data?.createdAt,
      updatedAt: data?.updatedAt,
    };
};

const validateSingleData = (retrievedData: any, dto: any) => {
  const validationResult = dto.safeParse(retrievedData);
  if (!validationResult.success)
    return serviceResponse({
      statusText: "BadRequest",
      error: validationResult.error,
    });
  return serviceResponse({
    data: validationResult.data,
  });
};
