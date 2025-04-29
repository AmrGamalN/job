import { body } from "express-validator";

export const feedBackValidate = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .withMessage(`Status is required`)
      .bail()
      .isIn(["pending", "active","inactive", "rejected"])
      .withMessage(`Status must be "pending","inactive", "active", "rejected"`),

    body("message")
      .trim()
      .notEmpty()
      .withMessage(`message is required`)
      .bail()
      .isString()
      .withMessage(`message must be string`)
      .isLength({ min: 5, max: 1000 })
      .withMessage(`message must be 5 - 1000 char`),
  ];
};
