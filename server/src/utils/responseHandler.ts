import { Response } from "express";
export interface responseHandler {
  success: boolean;
  status?: number;
  message?: string;
  error?: any;
  data?: any;
  count?: number;
  accessToken?: string;
  refreshToken?: string;
  tempToken?: string;
  userId?: string;
}

export const handleApiResponse = (res: Response, response: responseHandler) => {
  if (!response.success) return res.status(response.status!).json(response);
  return res.status(response.status!).json(response);
};
