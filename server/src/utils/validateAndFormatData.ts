import { responseHandler, serviceResponse } from "./responseHandler";
type actionType = "getAll" | "update" | "getOne" | "delete";
export const validateAndFormatData = (
  retrievedData: any,
  dto: any,
  action?: actionType
): responseHandler => {
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
    const parsed = retrievedData.map((data: any) => {
      const parsed = dto.safeParse(data);
      if (!parsed.success)
        return serviceResponse({
          statusText: "BadRequest",
          error: parsed.error.errors,
        });
      return parsed.data;
    });
    return serviceResponse({
      data: parsed,
      message: "Get data successfully",
    });
  }

  const parsed = dto.safeParse(retrievedData);
  return serviceResponse({
    data: parsed.data,
    error: parsed.error.errors,
    message: "Get data successfully",
  });
};
