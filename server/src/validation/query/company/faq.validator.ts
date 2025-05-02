import { query } from "express-validator";
import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
export const validateQueryFaqGetAll = () => {
  return [
    ...validatorPagination(),
    ...validatorCreatedAt(),
    ...validatorCustomQuery(),
  ];
};

export const validateQueryFaqCount = () => {
  return [...validatorCreatedAt(), ...validatorCustomQuery()];
};

const validatorCustomQuery = () => [
  query("questionType")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Question type must be a string"),
  query("department")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Question type must be a string"),
  query("userType")
    .optional({ checkFalsy: true })
    .isIn(["user", "member", "other"])
    .withMessage("User type must be one of user, member, other"),
  query("status")
    .optional({ checkFalsy: true })
    .isIn(["active", "inactive", "pending", "rejected", "banned"])
    .withMessage(
      "Status must be one of active, inactive, pending, rejected, banned"
    ),
];
