import { serviceResponse } from "./response.util";
import { ServiceResponseType } from "../types/response.type";
type ActionType = "getAll" | "update" | "getOne" | "delete";

export const validateAndFormatData = (
  retrievedData: any,
  dto: any,
  action?: ActionType,
  populateField?: string
): ServiceResponseType => {
  if (!retrievedData)
    return serviceResponse({ statusText: "NotFound", data: [] });

  if (
    Object.keys(retrievedData).length === 0 &&
    (action == "update" || action == "delete")
  )
    return serviceResponse({
      statusText: "BadRequest",
      message: "No data provided for update",
      data: [],
    });

  if (action === "getAll") {
    return validateListOfData(retrievedData, dto, populateField);
  }
  return validateSingleData(retrievedData, dto);
};

const validateListOfData = (
  retrievedData: any[],
  dto: any,
  populateField?: string
) => {
  const validationResultList = retrievedData.map((item: any) => {
    const dataToValidate = populateField
      ? resolvePopulate(populateField, item)
      : item;

    const validationResult = dto.safeParse(dataToValidate);

    if (!validationResult.success) {
      return serviceResponse({
        statusText: "BadRequest",
        error: validationResult.error,
      });
    }

    return validationResult.data;
  });

  return serviceResponse({
    data: validationResultList.length > 0 ? validationResultList : null,
  });
};

const resolvePopulate = (populateField: string, data: any) => {
  if (populateField == "companyId")
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

  if (!validationResult.success) {
    return serviceResponse({
      statusText: "BadRequest",
      error: validationResult.error,
    });
  }

  return serviceResponse({
    data: validationResult.data,
    error: validationResult.error,
    message: "Operation successfully",
  });
};
