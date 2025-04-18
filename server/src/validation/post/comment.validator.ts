import { body } from "express-validator";
const commentValidate = (isOptional: boolean = false) => [
  body("content")
    .if(() => !isOptional)
    .bail()
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 1000 })
    .withMessage("Content can be max 1000 characters")
    .optional({ nullable: true }),

  body("media").optional().isArray().withMessage("Media must be an array"),
  body("media.*.type")
    .isIn(["image", "video"])
    .withMessage("Media type must be either 'image' or 'video'"),
  body("media.*.url")
    .isString()
    .withMessage("Media URL must be a string")
    .notEmpty()
    .withMessage("Media URL is required"),
  body("media.*.key")
    .isString()
    .withMessage("Media key must be a string")
    .notEmpty()
    .withMessage("Media key is required"),
];

export const validateCommentUpdate = commentValidate(true);
export const validateCommentAdd = commentValidate(false);
