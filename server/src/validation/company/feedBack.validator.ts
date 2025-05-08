import { validateString } from "../helperFunction.validator";
export const feedBackValidator = [
  validateString("status", false, {
    isIn: ["pending", "active", "inactive", "rejected"],
  }),
  validateString("message", false, { min: 3, max: 1000 }),
];
