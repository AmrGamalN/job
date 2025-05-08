import { validateArray, validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 30 };
export const profileValidator = [
  validateString("about", true, { min: 5, max: 500 }),
  validateString("jobTitle", true, stringLength),
  validateString("jobLocation", true, stringLength),
  validateString("jobCompany", true, stringLength),
  validateString("jobType", true, {
    isIn: ["full_time", "part_time", "freelance", ""],
  }),
  validateString("projectPreference", true, {
    isIn: ["Long-term", "Short-term", "both", ""],
  }),
  validateString("experienceLevel", true, {
    isIn: ["entry_level", "Intermediate", "expert", ""],
  }),
  validateString("gpa", true, stringLength),
  validateString("jobDescription", true, { min: 5, max: 100 }),
  ...validateArray("categories", true, { elementType: "string" }),
  ...validateArray("skills", true, { elementType: "string" }),
  ...validateArray("languages", true),
  validateString("languages.*.language", true, stringLength),
  validateString("languages.*.level", true, {
    isIn: ["beginner", "intermediate", "advanced", "fluent"],
  }),
];
