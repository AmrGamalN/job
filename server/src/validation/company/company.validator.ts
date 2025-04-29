import { body } from "express-validator";

const companyValidate = (isUpdate: boolean) => {
  const requiredFields = [
    "companyName",
    "companyType",
    "description",
    "website",
    "companyIndustry",
    "companyEmail",
    "legalInfo",
  ];

  const FieldString = (field: string) => {
    const validator = body(field)
      .if(() => !isUpdate || requiredFields.includes(field))
      .notEmpty()
      .withMessage(`${field} is required`)
      .bail()
      .isString()
      .withMessage(`${field} must be a string`)
      .bail()
      .isLength({ min: 1, max: 50 })
      .withMessage(`${field} must be between 1 and 50 characters`);

    return requiredFields.includes(field) && !isUpdate
      ? validator
      : validator.optional({ checkFalsy: true });
  };

  const FieldArray = (field: string) => {
    const validator = body(field)
      .isArray()
      .withMessage(`${field} must be an array`);
    return requiredFields.includes(field) && !isUpdate
      ? validator
      : validator.optional({ checkFalsy: true });
  };

  const FieldObject = (field: string) => {
    const validator = body(field)
      .isObject()
      .withMessage(`${field} must be an object`);
    return requiredFields.includes(field) && !isUpdate
      ? validator
      : validator.optional({ checkFalsy: true });
  };

  return [
    // Company Info
    FieldString("companyName"),
    FieldString("companyType"),
    FieldString("companyIndustry"),
    FieldString("companyEmail")
      .isEmail()
      .withMessage("Valid company Email is required"),
    body("description")
      .if(() => !isUpdate)
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 10, max: 250 })
      .withMessage("Description is required")
      .optional({ checkFalsy: true }),
    body("companySize")
      .optional()
      .isNumeric()
      .withMessage("Company size must be a number")
      .toInt(),
    FieldString("companyPhone")
      .customSanitizer((val) => val.replace(/[\s\-()]/g, ""))
      .matches(/^\+[1-9]\d{10,15}$/)
      .withMessage("Invalid format"),

    // Media
    FieldString("introVideoUrl"),
    FieldObject("companyLogo"),
    FieldString("companyLogo.imageUrl"),
    FieldString("companyLogo.imageKey"),
    FieldObject("profileImage"),
    FieldString("profileImage.imageUrl"),
    FieldString("profileImage.imageKey"),
    FieldObject("coverImage"),
    FieldString("coverImage.imageUrl"),
    FieldString("coverImage.imageKey"),

    // Social Links
    FieldString("website").isURL(),
    FieldString("linkedIn").isURL(),
    FieldString("facebook").isURL(),
    FieldString("twitter").isURL(),
    FieldString("github").isURL(),

    // Tags && Technologies && Department
    FieldArray("department"),
    FieldString("department.*"),
    FieldArray("tags"),
    FieldString("tags.*"),
    FieldArray("technologies"),
    FieldString("technologies.*"),

    // Legal Info
    FieldObject("legalInfo"),
    FieldString("legalInfo.taxId"),
    FieldString("legalInfo.registrationNumber"),
    FieldString("legalInfo.legalName"),
    FieldString("legalInfo.countryOfIncorporation"),
  ];
};

export const validateCompanyAdd = companyValidate(false);
export const validateCompanyUpdate = companyValidate(true);
