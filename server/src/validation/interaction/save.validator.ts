import { body } from "express-validator";
import { validateString } from "../helperFunction.validator";

export const saveValidate = () => [
  body("targetId")
    .notEmpty()
    .withMessage("targetId is required")
    .custom((value) => {
      if (/^[a-fA-F0-9]{24}$/.test(value) || /^[a-zA-Z0-9]{28}$/.test(value)) {
        return true;
      }
      throw new Error("targetId must be a valid ObjectId");
    }),
  validateString("targetType", false, {
    isIn: ["user", "company", "school", "group", "post", "job"],
  }),
  validateString("redirectUrl", false, {
    isUrl: true,
    isIn: ["user", "company", "school", "group", "post", "job"],
  }),
];
