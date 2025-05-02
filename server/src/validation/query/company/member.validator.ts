import { query } from "express-validator";
import {
  validatorPagination,
} from "../pagination.validator";
export const validateQueryMemberGetAll = () => {
  return [...validatorPagination(), ...validatorCustomQuery()];
};

export const validateQueryMemberCount = () => {
  return [...validatorCustomQuery()];
};

const validatorCustomQuery = () => [
  query("name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Question type must be a string"),
  query("department")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Question type must be a string"),
  query("position")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Question type must be a string"),
  query("role")
    .optional({ checkFalsy: true })
    .isIn(["owner", "founder", "admin", "member"])
    .withMessage("Role must be one of owner, founder, admin, member"),
  query("status")
    .optional({ checkFalsy: true })
    .isIn(["active", "inactive", "pending", "rejected", "banned"])
    .withMessage(
      "Status must be one of active, inactive, pending, rejected, banned"
    ),
];
