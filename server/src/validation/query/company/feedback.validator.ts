import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";

export const validateQueryFeedbackGetAll = () => [
  ...validatorPagination(),
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

export const validateQueryFeedbackCount = () => [
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

const validatorCustomQuery = () => [
  validateString("companyName", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("status", true, {
    location: "query",
    isIn: ["active", "inactive", "pending", "rejected", "banned"],
  }),
];
