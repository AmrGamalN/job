import { validateArray, validateString } from "../helperFunction.validator";
const allowedVisibilities = ["public", "connections", "private"];
const allowedMediaTypes = ["image", "video"];
const postValidator = (isOptional: boolean) => [
  validateString("content", isOptional, { max: 1000 }),
  ...validateArray("media", isOptional),
  validateString("media.*.type", true, { isIn: allowedMediaTypes }),
  validateString("media.*.url", true, { isUrl: true }),
  validateString("media.*.key", true),
  validateString("visibility", true, { isIn: allowedVisibilities }),
  ...validateArray("hashtags", true, { elementType: "string" }),
  ...validateArray("mentions", true, { elementType: "string" }),
];
export const validatePostAdd = postValidator(false);
export const validatePostUpdate = postValidator(true);
