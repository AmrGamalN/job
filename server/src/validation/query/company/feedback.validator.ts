import { query } from "express-validator";
import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";

export const validateQueryFeedbackGetAll = () => {
  return [
    ...validatorPagination(),
    ...validatorCreatedAt(),
    ...validatorCustomQuery(),
  ];
};

export const validateQueryFeedbackCount = () => {
  return [...validatorCreatedAt(), ...validatorCustomQuery()];
};

const validatorCustomQuery = () => [
  query("companyName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("company name must be a string"),
  query("status")
    .optional({ checkFalsy: true })
    .isIn(["active", "inactive", "pending", "rejected", "banned"])
    .withMessage(
      "Status must be one of active, inactive, pending, rejected, banned"
    ),
];
