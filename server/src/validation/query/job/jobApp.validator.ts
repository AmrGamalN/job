import { query } from "express-validator";
import { validatorPagination } from "../pagination.validator";
export const validateQueryJobAppGetAll = () => {
  return [...validatorPagination(), ...validatorCustomQuery()];
};

export const validateQueryJobAppCount = () => {
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
    "currentAddress",
    "jobExperience",
    "applicantTypes",
    "jobType",
    "workplaceType",
    "jobTitle",
  ]),
  query("createdAt").isIn([1, -1]).withMessage("salary must be 1 or -1"),
];
