import { query } from "express-validator";
export const validateQueryParams = () => {
  const fields = (field: string) => {
    return query(field)
      .optional({ checkFalsy: true })
      .isString()
      .withMessage(`${field} must be a string`);
  };

  return [
    query("page")
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .default(1),

    query("limit")
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer")
      .default(10),

    query("type")
      .optional({ checkFalsy: true })
      .isIn(["user", "company", "school"])
      .withMessage("Type must be one of user, company, school"),

    query("role")
      .optional({ checkFalsy: true })
      .isIn(["owner", "founder", "admin", "member"])
      .withMessage("Role must be one of owner, founder, admin, member"),

    query("targetType")
      .optional({ checkFalsy: true })
      .isIn(["user", "company", "school", "group", "post", "job"])
      .withMessage(
        "target type save must be one of , company, school, group, post, job"
      ),

    query("status")
      .optional({ checkFalsy: true })
      .isIn(["active", "inactive", "pending", "rejected", "banned"])
      .withMessage(
        "Status must be one of active, inactive, pending, rejected, banned"
      ),

    query("userType")
      .optional({ checkFalsy: true })
      .isIn(["user", "member", "other"])
      .withMessage("User type must be one of user, member, other"),

    query("type")
      .optional({ checkFalsy: true })
      .isIn([
        "pdf",
        "word",
        "excel",
        "powerpoint",
        "presentation",
        "spreadsheet",
        "document",
      ])
      .withMessage(
        "Document type must be one of pdf, word, excel, powerpoint, presentation, spreadsheet, document"
      ),

    query("start")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage(
        "Start date must be a valid format (e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)"
      )
      .custom((value, { req }) => {
        if (value && !req.query?.end) {
          throw new Error("If start is provided, start must also be provided");
        }

        if (new Date(req.query?.start) > new Date(req.query?.end)) {
          throw new Error("Start date must be before or equal to end date");
        }

        return true;
      }),

    query("end")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage(
        "Start date must be a valid format (e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)"
      )
      .custom((value, { req }) => {
        if (value && !req.query?.start) {
          throw new Error("If end is provided, start must also be provided");
        }
        return true;
      }),

    fields("currentAddress"),
    fields("title"),
    fields("name"),
    fields("position"),
    fields("questionType"),
    fields("companyName"),
    fields("tags.*"),

    fields("salary").isIn([1, -1]).withMessage("salary must be 1 or -1"),
    fields("createdAt").isIn([1, -1]).withMessage("salary must be 1 or -1"),
    fields("views").isIn([1, -1]).withMessage("salary must be 1 or -1"),
    fields("department"),
    fields("location"),
    fields("skills"),
    fields("jobExperience"),
    fields("applicantTypes"),
    fields("jobType"),
    fields("workplaceType"),
    fields("jobTitle"),
    query("salaryMin")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("salary min must be a number")
      .custom((value, { req }) => {
        if (req.query?.salaryMin > req.query?.salaryMax) {
          throw new Error("salary min must be less than salary max");
        }
        return true;
      })
      .toInt(),

    query("salaryMax")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("salary min must be a number")
      .toInt(),
  ];
};
