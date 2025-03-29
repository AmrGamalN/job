import { responseHandler } from "./responseHandler";
type func = (...args: any[]) => Promise<responseHandler>;

export const warpAsync = (func: func) => {
  return async (...args: any[]): Promise<responseHandler> => {
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
