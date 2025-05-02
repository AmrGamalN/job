import { query } from "express-validator";
import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";

export const validateQueryCompanyGetAll = () => {
  return [
    ...validatorPagination(),
    ...validatorCreatedAt(),
    ...validatorCustomQuery(),
  ];
};

export const validateQueryCompanyCount = () => {
  return [...validatorCreatedAt(), ...validatorCustomQuery()];
};

const validatorCustomQuery = () => [
  query("companyName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("company name must be a string"),
  query("tags")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Tags must be an array of strings"),
  query("status")
    .optional({ checkFalsy: true })
    .isIn(["active", "inactive", "pending", "rejected", "banned"])
    .withMessage(
      "Status must be one of active, inactive, pending, rejected, banned"
    ),
];
