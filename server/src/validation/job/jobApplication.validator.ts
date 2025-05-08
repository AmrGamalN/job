import {
  ApplicantEnum,
  JobEnum,
  JobExperiencesEnum,
  WorkplaceEnum,
} from "../../types/job.type";
import {
  validateArray,
  validateObject,
  validateString,
} from "../helperFunction.validator";

const stringLength = { min: 1, max: 50 };
export const jobAppValidator = (isOptional: boolean) => [
  validateString("jobTitle", isOptional, stringLength),
  validateString("currentAddress", isOptional, stringLength),
  validateString("email", isOptional, { isEmail: true }),
  validateString("phone", isOptional, { isPhone: true }),

  ...validateArray("department", isOptional, {
    minLength: 1,
    elementType: "string",
  }),
  ...validateArray("applicantTypes", isOptional, {
    minLength: 1,
    elementType: "string",
    isIn: ApplicantEnum,
  }),
  ...validateArray("jobType", isOptional, {
    minLength: 1,
    elementType: "string",
    isIn: JobEnum,
  }),
  ...validateArray("jobExperience", isOptional, {
    minLength: 1,
    elementType: "string",
    isIn: JobExperiencesEnum,
  }),
  ...validateArray("workplaceType", isOptional, {
    minLength: 1,
    elementType: "string",
    isIn: WorkplaceEnum,
  }),
  ...validateArray("skills", isOptional, {
    minLength: 1,
    elementType: "string",
  }),

  validateObject("cv", isOptional),
  validateString("cv.url", true, { isUrl: true }),
  validateString("cv.key", true),
  validateString("cv.type", true),

  validateObject("idImage", isOptional),
  validateString("idImage.url", true, { isUrl: true }),
  validateString("idImage.key", true),
  validateString("idImage.type", true),
];

export const validateJobAppAdd = jobAppValidator(false);
export const validateJobAppUpdate = jobAppValidator(true);
