import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";

export const validateQueryDocumentGetAll = () => [
  ...validatorPagination(),
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

export const validateQueryDocumentCount = () => [
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

const validatorCustomQuery = () => [
  validateString("name", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("type", true, {
    location: "query",
    isIn: [
      "pdf",
      "word",
      "excel",
      "powerpoint",
      "presentation",
      "spreadsheet",
      "document",
    ],
  }),
];
