import { validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 50 };
const faqValidator = (isOptional: boolean) => [
  validateString("question", isOptional, { min: 3, max: 500 }),
  validateString("questionType", isOptional, stringLength),
  validateString("department", isOptional, stringLength),
  validateString("answer", true, stringLength),
  validateString("answerBy", true, stringLength),
  validateString("role", true, stringLength),
];

export const validateFaqAdd = faqValidator(false);
export const validateFaqUpdate = faqValidator(true);
