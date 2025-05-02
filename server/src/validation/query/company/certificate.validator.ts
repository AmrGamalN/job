import { query } from "express-validator";
import { validatorPagination } from "../pagination.validator";
export const validateQueryCertificateGetAll = () => {
  return [
    ...validatorPagination(),
    query("title")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Question type must be a string"),
  ];
};

export const validateQueryCertificateCount = () => {
  return [
    query("title")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("Question type must be a string"),
  ];
};
