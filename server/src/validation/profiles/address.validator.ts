import { check } from "express-validator";

const educationValidator = (isOptional: boolean = false) => [
  check("country")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Country is required")
    .optional({ nullable: true }),

  check("city")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("City is required")
    .optional({ nullable: true }),

  check("state")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("State is required")
    .optional({ nullable: true }),

  check("address")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Address is required")
    .optional({ nullable: true }),

  check("timeZone")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Time zone is required")
    .optional({ nullable: true }),
];

export const validateAddressUpdate = educationValidator(true);
export const validateAddressAdd = educationValidator(false);