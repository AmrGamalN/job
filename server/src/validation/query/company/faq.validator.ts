import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";
export const validateQueryFaqGetAll = () => [
  ...validatorPagination(),
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

export const validateQueryFaqCount = () => [
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

const validatorCustomQuery = () => [
  validateString("questionType", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("department", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("userType", true, {
    location: "query",
    isIn: ["user", "member", "other"],
  }),
  validateString("status", true, {
    location: "query",
    isIn: ["active", "inactive", "pending", "rejected", "banned"],
  }),
];
