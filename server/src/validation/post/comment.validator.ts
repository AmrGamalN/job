import { validateArray, validateString } from "../helperFunction.validator";
const commentValidator = (isOptional: boolean) => [
  validateString("content", isOptional, { max: 1000 }),
  ...validateArray("media", isOptional),
  validateString("media.*.type", true, { isIn: ["image", "video"] }),
  validateString("media.*.url", true, { isUrl: true }),
  validateString("media.*.key", true),
];
export const validateCommentUpdate = commentValidator(true);
export const validateCommentAdd = commentValidator(false);
