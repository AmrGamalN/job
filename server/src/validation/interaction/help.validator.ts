import { validateString } from "../helperFunction.validator";

export const validateHelpAdd = () => [
  validateString("subject", false, {
    min: 3,
    max: 50,
  }),
  validateString("message", false, {
    min: 3,
    max: 1000,
  }),
];

export const validateHelpUpdate = () => [
  validateString("reviewMessage", false, {
    min: 3,
    max: 1000,
  }),
  validateString("status", false, {
    isIn: ["pending", "reviewed", "dismissed"],
  }),
];
