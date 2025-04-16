import { check } from "express-validator";

const profileValidator = (isOptional: boolean = false) => [
  check("projectName")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Project name is required")
    .optional({ nullable: true }),

  check("companyName")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Company name is required")
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

  check("status")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "completed", "pending", "archived"])
    .withMessage("Status must be one of active, completed, pending, archived")
    .optional({ nullable: true }),

  check("technologies")
    .if(() => !isOptional)
    .bail()
    .isArray()
    .notEmpty()
    .withMessage("Technologies is required")
    .optional({ nullable: true }),

  check("technologies.*")
    .isString()
    .withMessage("Technologies must be string")
    .optional({ nullable: true }),

  check("attachment")
    .isString()
    .withMessage("Technologies must be string")
    .optional(),

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

  check("projectUrl")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Project name is required")
    .optional({ nullable: true }),

  check("repositoryUrl")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Project name is required")
    .optional({ nullable: true }),
];

export const validateProjectUpdate = profileValidator(true);
export const validateProjectAdd = profileValidator(false);
