import { ServiceResponseType } from "../types/response.type";
type func = (...args: any[]) => Promise<ServiceResponseType>;

export const warpAsync = (func: func) => {
  return async (...args: any[]): Promise<ServiceResponseType> => {
    try {
      return await func(...args);
    } catch (error: any) {
      return {
        success: false,
        status: error.status || 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      };
    }
  };
};
