import { validateObject, validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 50 };
export const userValidate = (isOptional: boolean) => [
  validateString("firstName", isOptional, stringLength),
  validateString("lastName", isOptional, stringLength),
  validateString("visibility", isOptional, {
    isIn: ["connection", "public", "private"],
  }),
  validateObject("profileImage", true),
  validateString("profileImage.key", true),
  validateString("profileImage.type", true),
  validateString("profileImage.url", true, { isUrl: true }),
  validateObject("coverImage", true),
  validateString("coverImage.key", true),
  validateString("coverImage.type", true),
  validateString("coverImage.url", true, { isUrl: true }),
  validateString("linkedIn", true, { isUrl: true }),
  validateString("github", true, { isUrl: true }),
  validateString("website", true, { isUrl: true }),
];

export const validateUserUpdate = userValidate(true);
export const validateUserAdd = userValidate(false);
