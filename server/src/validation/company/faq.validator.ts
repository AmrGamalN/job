import { body } from "express-validator";

const requiredFields = ["question", "questionType", "department"];

const faqValidate = (isOptional: boolean) => {
  const Field = (field: string) => {
    const validator = body(field)
      .trim()
      .isString()
      .withMessage(`${field} must be string`);

    return requiredFields.includes(field) && !isOptional
      ? validator.notEmpty().withMessage(`${field} is required`)
      : validator.optional({ checkFalsy: true });
  };

  return [
    Field("question"),
    Field("questionType"),
    Field("department"),
    Field("answer"),
    Field("answerBy"),
    Field("role"),
  ];
};

export const validateFaqAdd = faqValidate(false);
export const validateFaqUpdate = faqValidate(true);
