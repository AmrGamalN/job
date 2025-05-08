import {
  ApplicantEnum,
  JobEnum,
  WorkplaceEnum,
  JobExperiencesEnum,
} from "../../types/job.type";
import {
  validateArray,
  validateDate,
  validateNumber,
  validateObject,
  validateString,
} from "../helperFunction.validator";
const stringLength = { min: 1, max: 50 };
export const jobValidator = (isOptional: boolean) => [
  validateString("jobTitle", isOptional, stringLength),
  validateString("location", isOptional, stringLength),
  validateString("email", isOptional, { isEmail: true }),
  validateString("jobDescription", isOptional, { min: 10, max: 1000 }),
  validateString("jobRequirements", isOptional, { min: 10, max: 1000 }),
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

  validateObject("salary", true),
  validateNumber("salary.min", true).custom((value, { req }) => {
    if (req.body.salary.min >= req.body.salary.max) {
      throw new Error("salary min must be less than salary max");
    }
    return true;
  }),
  validateNumber("salary.max", true),
  validateDate("expireAt", true),
];
export const validateJobAdd = jobValidator(false);
export const validateJobUpdate = jobValidator(true);
