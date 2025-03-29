import { check } from "express-validator";

export const validateUserAdd = [
  check("firstName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("FirstName is required")
    .isLength({ min: 1, max: 25 })
    .withMessage("FirstName must be between 1 to 20 char")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("FirstName must be only char"),

  check("lastName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("FirstName is required")
    .isLength({ min: 1, max: 25 })
    .withMessage("FirstName must be between 1 to 20 char")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("FirstName must be only char"),

  check("visibility")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Visibility is required")
    .isIn(["connection", "public", "private"])
    .withMessage(
      "Visibility must be one of the value  `connection`, `public`, `private` "
    ),

  check("profileImage")
    .optional()
    .isURL()
    .withMessage("Invalid profile image URL"),

  check("coverImage").optional().isURL().withMessage("Invalid cover image URL"),

  check("linkedIn").optional().isURL().withMessage("Invalid linkedIn URL"),

  check("github").optional().isURL().withMessage("Invalid github URL"),

  check("website").optional().isURL().withMessage("Invalid website URL"),
];
