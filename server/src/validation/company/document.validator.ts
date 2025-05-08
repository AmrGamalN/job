import { validateObject, validateString } from "../helperFunction.validator";
const documentValidator = (isOptional: boolean) => [
  validateString("name", isOptional, { min: 3, max: 30 }),
  validateString("description", isOptional, { min: 3, max: 200 }),
  validateObject("documentFile", true),
  validateString("documentFile.url", true),
  validateString("documentFile.type", true),
  validateString("documentFile.key", true),
];
export const validateDocumentAdd = documentValidator(false);
export const validateDocumentUpdate = documentValidator(true);
