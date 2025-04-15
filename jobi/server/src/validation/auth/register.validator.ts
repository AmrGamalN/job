import { check } from "express-validator";

export const registerValidator = [
  check("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email")
  .matches(/^[a-zA-Z0-9._-]+@(gmail|yahoo|outlook|hotmail|icloud|example)\.com$/)
  .withMessage("Email provider not supported"),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 2,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 10 characters long, contain at least two uppercase letters, two lowercase letters, two numbers, and two symbols."
    ),

  check("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .whitelist("+0-9")
    .isMobilePhone("ar-EG")
    .isLength({ min: 13, max: 13 })
    .withMessage("Phone number number must be 13 digits like +201200512463."),

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
];
