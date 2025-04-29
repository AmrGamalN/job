import { body } from "express-validator";
import mongoose from "mongoose";

export const saveValidate = [
  body("targetId")
    .notEmpty()
    .withMessage("targetId is required")
    .custom((value) => {
      if (/^[a-fA-F0-9]{24}$/.test(value) || /^[a-zA-Z0-9]{28}$/.test(value)) {
        return true;
      }
      throw new Error("targetId must be a valid ObjectId");
    }),

  body("targetType")
    .notEmpty()
    .withMessage("targetType is required")
    .isIn(["user", "company", "school", "group", "post", "job"])
    .withMessage("Invalid targetType value"),

  body("actorType")
    .notEmpty()
    .withMessage("actorType is required")
    .isIn(["user", "company", "school", "group", "post", "job"])
    .withMessage("Invalid actorType value"),

  body("redirectUrl")
    .notEmpty()
    .withMessage("redirectUrl is required")
    .isString()
    .withMessage("redirectUrl must be a string"),
];
