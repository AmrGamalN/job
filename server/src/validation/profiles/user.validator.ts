import { check } from "express-validator";

const validateUser = (isOptional: boolean = false) => [
  check("firstName")
    .if(() => !isOptional)
    .bail()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("FirstName is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("FirstName must be between 1 to 20 char")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("FirstName must be only char")
    .optional({ nullable: true }),

  check("lastName")
    .if(() => !isOptional)
    .bail()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("lastName is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("lastName must be between 1 to 20 char")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("lastName must be only char")
    .optional({ nullable: true }),

  check("visibility")
    .if(() => !isOptional)
    .bail()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Visibility is required")
    .isIn(["connection", "public", "private"])
    .withMessage(
      "Visibility must be one of the value  `connection`, `public`, `private` "
    )
    .optional({ nullable: true }),

  check("profileImage").trim().isObject().optional(),
  check("profileImage.url").trim().isURL().isString(),
  check("profileImage.key").trim().isString(),
  check("profileImage.type").trim().isString(),

  check("coverImage").trim().isObject().optional(),
  check("coverImage.url").trim().isURL().isString(),
  check("coverImage.key").trim().isString(),
  check("coverImage.type").trim().isString(),

  check("linkedIn")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Invalid linkedIn URL"),

  check("github")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Invalid github URL"),

  check("website")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Invalid website URL"),
];

export const validateUserUpdate = validateUser(true);
export const validateUserAdd = validateUser(false);
