import { check } from "express-validator";
const educationValidator = (isOptional: boolean = false) => [
  check("university")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("University is required")
    .optional({ nullable: true }),

  check("description")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Description must have at least 5 and must 100")
    .optional({ nullable: true }),

  check("degree")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Degree is required")
    .optional({ nullable: true }),

  check("major")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Major is required")
    .optional({ nullable: true }),

  check("startDate")
    .if(() => !isOptional)
    .bail()
    .isDate()
    .notEmpty()
    .withMessage("Start date is required")
    .optional({ nullable: true })
    .toDate(),

  check("endDate")
    .if(() => !isOptional)
    .bail()
    .isDate()
    .notEmpty()
    .withMessage("End date is required")
    .optional({ nullable: true })
    .toDate(),

  check("gpa")
    .if(() => !isOptional)
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage("GPA is required")
    .optional({ nullable: true }),
];

export const validateEducationUpdate = educationValidator(true);
export const validateEducationAdd = educationValidator(false);
