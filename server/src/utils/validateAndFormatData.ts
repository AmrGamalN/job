import { responseHandler } from "./responseHandler";
export const validateAndFormatData = (
  retrievedData: any,
  dto: any,
  typeProcess?: "getAll"
): responseHandler => {
  if (typeProcess === "getAll") {
    const parsed = retrievedData.map((data: any) => {
      const parsed = dto.safeParse(data);
      console.log(parsed.error);
      if (!parsed.success) {
        return {
          success: false,
          status: 400,
          message: "Invalid data format",
          error: parsed.error,
        };
      }
      return parsed.data;
    });
    return {
      success: true,
      status: 200,
      data: parsed,
    };
  }

  const parsed = dto.safeParse(retrievedData);
  console.log(parsed.error);
  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid data format",
      error: parsed.error,
    };
  }
  return {
    success: true,
    status: 200,
    data: parsed.data,
  };
};
