import { body } from "express-validator";

const allowedVisibilities = ["public", "connections", "private"];
const allowedMediaTypes = ["image", "video"];

const postValidate = (isOptional: boolean = false) => [
  body("content")
    .if(() => !isOptional)
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
    .isIn(allowedMediaTypes)
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

  body("visibility")
    .optional()
    .isIn(allowedVisibilities)
    .withMessage("Visibility must be one of: public, connections, private"),

  body("hashtags")
    .optional()
    .isArray()
    .withMessage("Hashtags must be an array"),
  body("hashtags.*")
    .isString()
    .withMessage("Each hashtag must be a string")
    .trim(),

  body("mentions")
    .optional()
    .isArray()
    .withMessage("Mentions must be an array"),
  body("mentions.*")
    .isString()
    .withMessage("Each mention must be a string (e.g., user ID)"),
];

export const validatePostAdd = postValidate(false);
export const validatePostUpdate = postValidate(true);
