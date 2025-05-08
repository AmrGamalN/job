import { validateDate, validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 30 };
const certificateValidate = (isOptional: boolean) => [
  validateString("title", isOptional, stringLength),
  validateString("issuer", isOptional, stringLength),
  validateString("certificateUrl", isOptional, { isUrl: true }),
  validateString("description", isOptional, { min: 5, max: 100 }),
  validateDate("issuedAt", isOptional),
];
export const validateCertificateAdd = certificateValidate(false);
export const validateCertificateUpdate = certificateValidate(true);
