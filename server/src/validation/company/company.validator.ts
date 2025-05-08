import {
  validateArray,
  validateNumber,
  validateObject,
  validateString,
} from "../helperFunction.validator";
const stringLength = { min: 1, max: 30 };

const companyValidate = (isOptional: boolean) => [
  validateString("companyName", isOptional, stringLength),
  validateString("companyType", isOptional, stringLength),
  validateString("companyIndustry", isOptional, stringLength),
  validateString("companyEmail", isOptional, { isEmail: true }),
  validateString("description", isOptional, { max: 500 }),
  validateNumber("companySize", isOptional),
  validateString("companyPhone", true, { isPhone: true }),
  validateString("introVideoUrl", true),
  validateObject("companyLogo", true),
  validateString("companyLogo.url", true),
  validateString("companyLogo.key", true),
  validateString("companyLogo.type", true),

  validateObject("profileImage", true),
  validateString("profileImage.url", true),
  validateString("profileImage.key", true),
  validateString("profileImage.type", true),

  validateObject("coverImage", true),
  validateString("coverImage.url", true),
  validateString("coverImage.key", true),
  validateString("coverImage.type", true),

  validateString("website", true, { isUrl: true }),
  validateString("linkedIn", true, { isUrl: true }),
  validateString("facebook", true, { isUrl: true }),
  validateString("twitter", true, { isUrl: true }),
  validateString("github", true, { isUrl: true }),

  ...validateArray("department", true, { elementType: "string" }),
  ...validateArray("tags", true, { elementType: "string" }),
  ...validateArray("technologies", true, { elementType: "string" }),

  validateObject("legalInfo", isOptional),
  validateString("legalInfo.taxId", true, stringLength),
  validateString("legalInfo.registrationNumber", true, stringLength),
  validateString("legalInfo.legalName", true, stringLength),
  validateString("legalInfo.countryOfIncorporation", true, stringLength),
];

export const validateCompanyAdd = companyValidate(false);
export const validateCompanyUpdate = companyValidate(true);
