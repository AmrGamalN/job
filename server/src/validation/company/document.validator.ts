import { body } from "express-validator";

const documentValidate = (isUpdate: boolean) => {
  const Field = (field: string) => {
    const validator = body(field)
      .trim()
      .isString()
      .withMessage(`${field} must be string`);

    return !isUpdate
      ? validator.notEmpty().withMessage(`${field} is required`)
      : validator.optional({ checkFalsy: true });
  };
  return [
    body("documentFile").optional({ checkFalsy: true }).isObject(),
    Field("name").optional({ checkFalsy: true }),
    Field("description").optional({ checkFalsy: true }),
    Field("documentFile.url").optional({ checkFalsy: true }),
    Field("documentFile.type").optional({ checkFalsy: true }),
    Field("documentFile.key").optional({ checkFalsy: true }),
  ];
};

export const validateDocumentAdd = documentValidate(false);
export const validateDocumentUpdate = documentValidate(true);
