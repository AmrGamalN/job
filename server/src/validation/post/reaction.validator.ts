import { validateString } from "../helperFunction.validator";
const reactionTypes = ["like", "love", "haha", "wow", "sad", "angry"];

export const reactionValidator = [
  validateString("post", true, { isIn: reactionTypes }),
  validateString("comment_reaction", true, { isIn: reactionTypes }),
];
