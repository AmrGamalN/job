import { check } from "express-validator";
import { validateBoolean, validateString } from "../helperFunction.validator";

export const validateUserSecurityUpdate = [
  validateString("phoneNumber", true, { isPhone: true }),
];

export const validateSecurityStatus = [
  validateString("userId", false, { pattern: /^[a-zA-Z0-9]{28}$/ }),
  validateBoolean("block", true),
  validateBoolean("delete", true),
];

export const validateSecurityEmail = [
  validateString("email", false, { isEmail: true }),
];

export const validateSecurityUpdatePass = [
  check("oldPassword").trim().notEmpty().withMessage("oldPassword is required"),
  check("newPassword")
    .trim()
    .notEmpty()
    .withMessage("newPassword is required")
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
];

export const validateCode2AF = [
  check("twoFactorCode")
    .trim()
    .isInt()
    .withMessage("INVALID OTP NUMBER")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP MUST BE 6 DIGITS."),
];
