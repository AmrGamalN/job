import { query } from "express-validator";

export const validatorPagination = () => [
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
];


export const validatorCreatedAt = () => [
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
];