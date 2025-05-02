import { query } from "express-validator";
import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
export const validateQueryInterviewGetAll = () => {
  return [
    ...validatorPagination(),
    ...validatorCreatedAt(),
    ...validatorCustomQuery(),
    query("createdAt").isIn([1, -1]).withMessage("salary must be 1 or -1"),
  ];
};

export const validateQueryInterviewCount = () => {
  return [...validatorCustomQuery()];
};

const validatorFields = (fields: string[]) => {
  return fields.map((field) =>
    query(field)
      .optional({ checkFalsy: true })
      .isString()
      .withMessage(`${field} must be a string`)
  );
};

const validatorCustomQuery = () => [
  ...validatorFields([
    "interviewStatus",
    "interviewPlatform",
    "interviewResult",
  ]),
];
