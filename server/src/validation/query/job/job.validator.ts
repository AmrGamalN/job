import { validatorPagination } from "../pagination.validator";
import { validateNumber, validateString } from "../../helperFunction.validator";

export const validateQueryJobGetAll = () => [
  ...validatorPagination(),
  ...validatorCustomQuery(),
  validateNumber("salary", true, {
    location: "query",
    isIn: [1, -1],
  }),
  validateNumber("createdAt", true, {
    location: "query",
    isIn: [1, -1],
  }),
  validateNumber("views", true, {
    location: "query",
    isIn: [1, -1],
  }),
];
export const validateQueryJobCount = () => [...validatorCustomQuery()];
const validatorCustomQuery = () => [
  ...validatorFields([
    "department",
    "location",
    "skills",
    "jobExperience",
    "applicantTypes",
    "jobType",
    "workplaceType",
    "jobTitle",
  ]),
  validateNumber("salaryMin", true, {
    location: "query",
  }).custom((value, { req }) => {
    if (req.query?.salaryMin > req.query?.salaryMax) {
      throw new Error("salary min must be less than salary max");
    }
    return true;
  }),
  validateNumber("salaryMax", true, {
    location: "query",
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
