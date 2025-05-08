import { validatorPagination } from "../pagination.validator";
import { validateNumber, validateString } from "../../helperFunction.validator";

export const validateQueryJobAppGetAll = () => [
  ...validatorPagination(),
  ...validatorCustomQuery(),
];
export const validateQueryJobAppCount = () => [...validatorCustomQuery()];

const validatorCustomQuery = () => [
  ...validatorFields([
    "currentAddress",
    "jobExperience",
    "applicantTypes",
    "jobType",
    "workplaceType",
    "jobTitle",
  ]),
  validateNumber("createdAt", true, {
    location: "query",
    isIn: [1, -1],
  }),
];

// Helper for validating multiple string fields
const validatorFields = (fields: string[]) => {
  return fields.map((field) =>
    validateString(field, true, {
      location: "query",
      min: 1,
      max: 100,
    })
  );
};
