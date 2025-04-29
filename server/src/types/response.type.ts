export type ServiceResponseType = {
  statusText?: string;
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
  deleteCount?: number;
};

export type ResponseType =
  | "Created"
  | "OK"
  | "BadRequest"
  | "NotFound"
  | "Conflict"
  | "Unauthorized"
  | "InternalServerError";

export type ResponseOptions = {
  statusText?: ResponseType;
  message?: string;
  data?: any;
  error?: any;
  count?: number;
  deleteCount?: number;
};
