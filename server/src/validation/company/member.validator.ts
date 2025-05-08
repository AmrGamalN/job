import { validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 50 };
export const memberValidator = (isOptional: boolean) => [
  validateString("name", isOptional, stringLength),
  validateString("position", isOptional, stringLength),
  validateString("email", isOptional, { isEmail: true }),
  validateString("role", isOptional, {
    isIn: ["owner", "admin", "member", "founder"],
  }),
  validateString("status", isOptional, {
    isIn: ["active", "inactive", "pending", "rejected", "banned"],
  }),
];
export const validateMemberAdd = memberValidator(false);
export const validateMemberUpdate = memberValidator(true);
