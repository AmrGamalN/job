import {
  validateArray,
  validateDate,
  validateString,
} from "../helperFunction.validator";
const stringLength = { min: 1, max: 30 };
const projectValidator = (isOptional: boolean) => [
  validateString("projectName", isOptional, stringLength),
  validateString("companyName", isOptional, stringLength),
  validateString("attachment", true, stringLength),
  validateString("projectUrl", isOptional, { isUrl: true }),
  validateString("repositoryUrl", isOptional, { isUrl: true }),
  validateString("description", isOptional, { min: 5, max: 100 }),
  validateString("status", isOptional, {
    isIn: ["active", "completed", "pending", "archived"],
  }),
  ...validateArray("technologies", isOptional, { elementType: "string" }),
  validateDate("startDate", isOptional),
  validateDate("endDate", isOptional),
];

export const validateProjectAdd = projectValidator(false);
export const validateProjectUpdate = projectValidator(true);
