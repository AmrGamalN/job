import { validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 30 };
const addressValidator = (isOptional: boolean) => [
  validateString("country", isOptional, stringLength),
  validateString("city", isOptional, stringLength),
  validateString("state", isOptional, stringLength),
  validateString("timeZone", isOptional, stringLength),
  validateString("address", isOptional, { min: 5, max: 100 }),
];

export const validateAddressUpdate = addressValidator(true);
export const validateAddressAdd = addressValidator(false);
