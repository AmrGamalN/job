import { body } from "express-validator";

const certificateValidate = (isUpdate: boolean) => {
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
    Field("title").optional({ checkFalsy: true }),
    Field("description").optional({ checkFalsy: true }),
    Field("issuer").optional({ checkFalsy: true }),
    Field("issuedAt").optional({ checkFalsy: true }).isDate().toDate(),
    Field("certificateUrl").optional({ checkFalsy: true }).isURL(),
  ];
};

export const validateCertificateAdd = certificateValidate(false);
export const validateCertificateUpdate = certificateValidate(true);
