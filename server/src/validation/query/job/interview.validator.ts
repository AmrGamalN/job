import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
import { validateNumber, validateString } from "../../helperFunction.validator";
export const validateQueryInterviewGetAll = () => [
  ...validatorPagination(),
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
  validateNumber("createdAt", true, {
    location: "query",
    isIn: [1, -1],
  }),
];
export const validateQueryInterviewCount = () => [...validatorCustomQuery()];
const validatorCustomQuery = () => [
  validateString("interviewStatus", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("interviewPlatform", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("interviewResult", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
];
