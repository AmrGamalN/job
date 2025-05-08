import {
  validatorCreatedAt,
  validatorPagination,
} from "../pagination.validator";
import { validateString } from "../../helperFunction.validator";

export const validateQueryReportGetAll = () => [
  ...validatorPagination(),
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

export const validateQueryReportCount = () => [
  ...validatorCreatedAt(),
  ...validatorCustomQuery(),
];

const validatorCustomQuery = () => [
  validateString("subject", true, {
    location: "query",
    min: 1,
    max: 100,
  }),
  validateString("targetType", true, {
    location: "query",
    isIn: [
      "user",
      "post",
      "comment",
      "video",
      "company",
      "group",
      "school",
      "job",
      "other",
    ],
  }),
  validateString("status", true, {
    location: "query",
    isIn: ["pending", "reviewed", "dismissed"],
  }),
];
