import { body, query, param, check, ValidationChain } from "express-validator";
const phonePattern = /^\+[1-9]\d{10,15}$/;
const emailPattern =
  /^[a-zA-Z0-9._-]+@(gmail|yahoo|outlook|hotmail|icloud|example)\.com$/;
type LocationType = "body" | "query" | "check" | "param";
type DateFieldType =
  | "startDate"
  | "endDate"
  | "issuedAt"
  | "interviewDate"
  | "expireAt"
  | "start"
  | "end";

export const validateString = (
  field: string,
  isOptional: boolean,
  options?: {
    location?: LocationType;
    min?: number;
    max?: number;
    isIn?: string[] | readonly string[];
    pattern?: RegExp;
    customMessage?: string;
    isUrl?: boolean;
    isEmail?: boolean;
    isPhone?: boolean;
  }
): ValidationChain => {
  let validator = buildValidator(field, isOptional, options?.location);
  validator = validator
    .trim()
    .isString()
    .withMessage(`${field} must be string`)
    .bail();

  if (options?.min !== undefined || options?.max !== undefined) {
    validator = validator
      .isLength({
        min: options?.min,
        max: options?.max,
      })
      .withMessage(
        `${field} must be between ${options.min ?? 0} and ${
          options.max ?? "∞"
        } characters`
      )
      .bail();
  }

  if (options?.pattern) {
    validator = validator
      .matches(options.pattern)
      .withMessage(options.customMessage || `${field} is in invalid format`)
      .bail();
  }

  if (options?.isIn && options?.isIn?.length >= 0) {
    validator = validator
      .isIn(options?.isIn)
      .withMessage(
        `${field} must be one of the following: ${options?.isIn.join(", ")}`
      )
      .bail();
  }

  if (options?.isUrl) {
    validator = validator.isURL().withMessage("Invalid URL").bail();
  }

  if (options?.isEmail) {
    validator = validator
      .matches(emailPattern)
      .withMessage("Email provider not supported")
      .bail();
  }

  if (options?.isPhone) {
    validator = validator
      .customSanitizer((val) => val.replace(/[\s\-()]/g, ""))
      .matches(phonePattern)
      .withMessage("Invalid format")
      .bail();
  }
  return validator;
};

export const validateBoolean = (
  field: string,
  isOptional: boolean,
  location?: LocationType
): ValidationChain => {
  let validator = buildValidator(field, isOptional, location);
  validator = validator
    .trim()
    .isBoolean()
    .withMessage(`${field} must be string`)
    .bail()
    .toBoolean();
  return validator;
};

export const validateNumber = (
  field: string,
  isOptional: boolean,
  options?: {
    location?: LocationType;
    isIn?: number[] | readonly number[];
  }
): ValidationChain => {
  let validator = buildValidator(field, isOptional, options?.location);
  validator = validator
    .trim()
    .isNumeric()
    .withMessage(`${field} must be number`)
    .bail()
    .toInt();

  if (options?.isIn && options?.isIn?.length >= 0) {
    validator = validator
      .isIn(options?.isIn)
      .withMessage(
        `${field} must be one of the following: ${options?.isIn.join(", ")}`
      )
      .bail();
  }

  return validator;
};

export const validateArray = (
  field: string,
  isOptional: boolean,
  options?: {
    location?: LocationType;
    minLength?: number;
    maxLength?: number;
    elementType?: "string" | "number";
    elementMessage?: string;
    isIn?: string[] | readonly string[];
  }
): ValidationChain[] => {
  const chains: ValidationChain[] = [];
  let main = buildValidator(field, isOptional, options?.location);
  main = main.isArray().withMessage(`${field} must be an array`).bail();

  if (options?.minLength !== undefined || options?.maxLength !== undefined) {
    main = main
      .isLength({
        min: options.minLength,
        max: options.maxLength,
      })
      .withMessage(
        `${field} must have between ${options.minLength ?? 0} and ${
          options.maxLength ?? "∞"
        } items`
      )
      .bail();
  }

  chains.push(main);

  if (options?.elementType) {
    const element = body(`${field}.*`)
      [options.elementType === "string" ? "isString" : "isNumeric"]()
      .withMessage(
        options.elementMessage || `${field}.* must be ${options.elementType}`
      );
    chains.push(element);
  }

  if (options?.isIn && options?.isIn.length > 0) {
    const inValidator = body(`${field}`)
      .custom((arr: string[]) => {
        if (!Array.isArray(arr)) return false;
        return arr.every((val: string) => options.isIn!.includes(val));
      })
      .withMessage(
        `${field} contains invalid values. Allowed: ${options.isIn.join(", ")}`
      );
    chains.push(inValidator);
  }

  return chains;
};

export const validateObject = (
  field: string,
  isOptional: boolean
): ValidationChain => {
  let validator = body(field)
    .isObject()
    .withMessage(`${field} must be an object`);
  return !isOptional
    ? validator.notEmpty().withMessage(`${field} is required`)
    : validator.optional({ checkFalsy: true });
};

export const validateDate = (
  field: DateFieldType,
  isOptional: boolean,
  location?: LocationType
): ValidationChain => {
  let validator = buildValidator(field, isOptional, location);
  validator = validator
    .isISO8601()
    .withMessage(`${field} must be a valid format YYYY-MM-DD`)
    .custom((value, { req }) => {
      const start = req.query?.start || req.body?.startDate;
      const end = req.query?.end || req.body?.endDate;

      if (field === "startDate") {
        if (value && !end)
          throw new Error("If start is provided, end must also be provided");
        if (start && end && new Date(start) > new Date(end))
          throw new Error("Start date must be before or equal to end date");
      }

      if (field === "endDate")
        if (value && !start)
          throw new Error("If end is provided, start must also be provided");

      return true;
    })
    .toDate();
  return isOptional ? validator.optional({ checkFalsy: true }) : validator;
};

const buildValidator = (
  field: string,
  isOptional: boolean,
  location?: LocationType
): ValidationChain => {
  let validator =
    location == "query"
      ? query(field)
      : location == "param"
      ? param(field)
      : location == "check"
      ? check(field)
      : body(field);

  if (!isOptional)
    validator = validator.notEmpty().withMessage(`${field} is required`).bail();
  validator = validator.optional({ checkFalsy: true });
  return validator;
};
