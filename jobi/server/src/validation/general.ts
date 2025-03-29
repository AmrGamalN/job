import { check } from "express-validator";

export const validateUserId = [
  check("userId")
    .trim()
    .notEmpty()
    .withMessage("User id is required")
    .matches(/^[a-zA-Z0-9]{28}$/)
    .withMessage("Invalid user id"),
];
