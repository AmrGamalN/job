import { body } from "express-validator";
const reactionTypes = ["like", "love", "haha", "wow", "sad", "angry"];
export const validateReaction = [
  body("post")
    .isString()
    .withMessage("Reaction type must be a string")
    .notEmpty()
    .withMessage("Reaction type is required")
    .isIn(reactionTypes)
    .withMessage(`Reaction type must be one of: ${reactionTypes.join(", ")}`)
    .optional(),
  body("comment_reaction")
    .isString()
    .withMessage("Reaction type must be a string")
    .notEmpty()
    .withMessage("Reaction type is required")
    .isIn(reactionTypes)
    .withMessage(`Reaction type must be one of: ${reactionTypes.join(", ")}`)
    .optional(),
];
