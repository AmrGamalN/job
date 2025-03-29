import { check } from "express-validator";

export const validateProfileUpdate = [
  check("about")
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("About must be between 1 to 200 char")
    .optional(),

  check("jobTitle")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Job title must be between 1 to 50 char")
    .optional(),
  check("jobDescription")
    .isString()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Job description must be between 1 to 300 char")
    .optional(),

  check("jobLocation")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Job location Location must be between 1 to 50 char")
    .optional(),

  check("jobCompany")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Job company must be between 1 to 50 char")
    .optional(),

  check("jobType")
    .isString()
    .trim()
    .isIn(["full-time", "part-time", "freelance", ""])
    .withMessage(
      "Job type must be one of the value  `full-time`, `part-time`, `freelance` , empty "
    )
    .optional(),

  check("projectPreference")
    .isString()
    .trim()
    .isIn(["Long-term", "Short-term", "both", ""])
    .withMessage(
      "Project preference must be one of the value  `Long-term`, `Short-term`, `both` , empty "
    )
    .optional(),

  check("experienceLevel")
    .isString()
    .trim()
    .isIn(["entry-level", "Intermediate", "expert", ""])
    .withMessage(
      "Experience level must be one of the value  `entry-level`, `Intermediate`, `expert` , empty  "
    )
    .optional(),

  check("categories")
    .trim()
    .isArray({ min: 1 })
    .custom((value) => {
      if (value.some((item: any) => typeof item !== "string")) {
        throw new Error("Categories must be an string");
      }
      return true;
    })
    .optional(),

  check("skills")
    .trim()
    .isArray({ min: 1 })
    .custom((value) => {
      if (value.some((item: any) => typeof item !== "string")) {
        throw new Error("Categories must be an string");
      }
      return true;
    })
    .optional(),

  check("languages").trim().isArray().optional(),

  check("languages.*.language")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Each language must be a non-empty string"),

  check("languages.*.proficiency")
    .trim()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage(
      "Proficiency must be 'beginner', 'intermediate', or 'advanced'"
    ),
];
