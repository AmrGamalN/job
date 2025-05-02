import { query } from "express-validator";
import { validatorPagination } from "../pagination.validator";
export const validateQueryJobGetAll = () => {
  return [
    ...validatorPagination(),
    ...validatorCustomQuery(),
    query("salary").isIn([1, -1]).withMessage("salary must be 1 or -1"),
    query("createdAt").isIn([1, -1]).withMessage("salary must be 1 or -1"),
    query("views").isIn([1, -1]).withMessage("salary must be 1 or -1"),
  ];
};

export const validateQueryJobCount = () => {
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
    "department",
    "location",
    "location",
    "skills",
    "jobExperience",
    "applicantTypes",
    "jobType",
    "workplaceType",
    "jobTitle",
  ]),
  query("salaryMin")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("salary min must be a number")
    .custom((value, { req }) => {
      if (req.query?.salaryMin > req.query?.salaryMax) {
        throw new Error("salary min must be less than salary max");
      }
      return true;
    })
    .toInt(),
  query("salaryMax")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("salary min must be a number")
    .toInt(),
];
