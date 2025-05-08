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
  deletedCount?: number;
  paginateOptions?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    remainPages: number;
    itemsPerPage: number;
  };
};

export type ResponseType =
  | "Created"
  | "OK"
  | "BadRequest"
  | "NotFound"
  | "Conflict"
  | "Unauthorized"
  | "Forbidden"
  | "InternalServerError";

export type ResponseOptions = {
  statusText?: ResponseType;
  message?: string;
  data?: any;
  error?: any;
  count?: number;
  deletedCount?: number;
};
