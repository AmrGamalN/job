import { check } from "express-validator";
const fields = ["industries", "hobbies", "influencers", "companies", "groups"];
export const InterestValidator = fields.map((field) =>
  check(field)
    .optional()
    .isArray()
    .withMessage(`${field} must be an array`)
    .custom((value) => {
      if (value.length > 0) {
        return value.every((item: any) => typeof item === "string");
      }
    })
    .withMessage(`All ${field} items must be strings`)
    .isMongoId()
    .withMessage(`All ${field} items must be valid mongo ids`)
);
