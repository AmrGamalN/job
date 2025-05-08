import { validateDate, validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 30 };
const educationValidator = (isOptional: boolean) => [
  validateString("university", isOptional, stringLength),
  validateString("degree", isOptional, stringLength),
  validateString("major", isOptional, stringLength),
  validateString("gpa", isOptional, stringLength),
  validateString("description", isOptional, { min: 5, max: 100 }),
  validateDate("startDate", isOptional),
  validateDate("endDate", isOptional),
];
export const validateEducationUpdate = educationValidator(true);
export const validateEducationAdd = educationValidator(false);
