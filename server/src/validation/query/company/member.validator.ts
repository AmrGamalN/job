import { validatorPagination } from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";
export const validateQueryMemberGetAll = () => [
  ...validatorPagination(),
  ...validatorCustomQuery(),
];
export const validateQueryMemberCount = () => [...validatorCustomQuery()];
const validatorCustomQuery = () => [
  validateString("name", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("department", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("position", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("role", true, {
    location: "query",
    isIn: ["owner", "founder", "admin", "member"],
  }),
  validateString("status", true, {
    location: "query",
    isIn: ["active", "inactive", "pending", "rejected", "banned"],
  }),
];
