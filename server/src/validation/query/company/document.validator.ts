import { query } from "express-validator";
import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";

export const validateQueryDocumentGetAll = () => {
  return [
    ...validatorPagination(),
    ...validatorCreatedAt(),
    ...validatorCustomQuery(),
  ];
};

export const validateQueryDocumentCount = () => {
  return [...validatorCreatedAt(), ...validatorCustomQuery()];
};

const validatorCustomQuery = () => [
  query("name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("company name must be a string"),
  query("type")
    .optional({ checkFalsy: true })
    .isIn([
      "pdf",
      "word",
      "excel",
      "powerpoint",
      "presentation",
      "spreadsheet",
      "document",
    ])
    .withMessage(
      "Document type must be one of pdf, word, excel, powerpoint, presentation, spreadsheet, document"
    ),
];
