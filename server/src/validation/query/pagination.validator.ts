import { validateDate, validateNumber } from "../helperFunction.validator";

export const validatorPagination = () => [
  validateNumber("page", true, { location: "query" }).default(1),
  validateNumber("limit", true, { location: "query" }).default(10),
];

export const validatorCreatedAt = () => [
  validateDate("start", true, "query"),
  validateDate("end", true, "query"),
];
