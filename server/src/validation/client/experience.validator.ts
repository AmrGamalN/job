import {
  validateBoolean,
  validateDate,
  validateString,
} from "../helperFunction.validator";

const stringLength = { min: 1, max: 30 };
const experienceValidator = (isOptional: boolean) => [
  validateString("companyName", isOptional, stringLength),
  validateString("jobTitle", isOptional, stringLength),
  validateString("location", isOptional, stringLength),
  validateString("employmentType", isOptional, {
    isIn: [
      "full_time",
      "part_time",
      "internship",
      "freelance",
      "seasonal",
      "apprenticeship",
      "contract",
    ],
  }),
  validateString("locationType", isOptional, {
    isIn: ["remote", "on-site", "hybrid"],
  }),
  validateString("description", isOptional, { min: 5, max: 100 }),
  validateDate("startDate", isOptional),
  validateDate("endDate", isOptional),
  validateBoolean("currentlyWorking", isOptional),
];
export const validateExperienceUpdate = experienceValidator(true);
export const validateExperienceAdd = experienceValidator(false);
