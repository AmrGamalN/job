import { validatorPagination } from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";
export const validateQueryCertificateGetAll = () => [
  ...validatorPagination(),
  validateString("title", true, { location: "query" }),
];

export const validateQueryCertificateCount = () => [
  validateString("title", true, { location: "query" }),
];
