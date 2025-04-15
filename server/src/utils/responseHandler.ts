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
