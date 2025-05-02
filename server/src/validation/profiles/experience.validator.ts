import { check } from "express-validator";
const experienceValidator = (isOptional: boolean = false) => [
  check("companyName")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 4, max: 50 })
    .withMessage("Company name must have at least 4 and must 50")
    .optional({ nullable: true }),

  check("jobTitle")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 4, max: 50 })
    .withMessage("Job title must have at least 4 and must 50")
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

  check("employmentType")
    .if(() => !isOptional)
    .bail()
    .isString()
    .isIn([
      "full_time",
      "part_time",
      "internship",
      "freelance",
      "seasonal",
      "apprenticeship",
      "contract",
    ])
    .withMessage(
      "Employment type must be one of the following: full_time, part_time, internship, freelance, seasonal, apprenticeship, contract"
    )
    .notEmpty()
    .withMessage("Employment type is required")
    .optional({ nullable: true }),

  check("location")
    .if(() => !isOptional)
    .bail()
    .isString()
    .notEmpty()
    .withMessage("Location is required")
    .optional({ nullable: true }),

  check("locationType")
    .if(() => !isOptional)
    .bail()
    .isString()
    .isIn(["remote", "on-site", "hybrid"])
    .withMessage(
      "Location type must be one of the following: remote, on-site, hybrid"
    )
    .notEmpty()
    .withMessage("Location type is required")
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

  check("currentlyWorking")
    .if(() => !isOptional)
    .bail()
    .isBoolean()
    .notEmpty()
    .withMessage("Currently working is required")
    .optional({ nullable: true })
    .toBoolean(),
];

export const validateExperienceUpdate = experienceValidator(true);
export const validateExperienceAdd = experienceValidator(false);
