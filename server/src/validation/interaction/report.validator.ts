import { validateString } from "../helperFunction.validator";

export const validateReportAdd = () => [
  validateString("subject", false, {
    min: 3,
    max: 50,
  }),
  validateString("message", false, {
    min: 3,
    max: 1000,
  }),
  validateString("targetType", false, {
    isIn: [
      "user",
      "post",
      "comment",
      "video",
      "company",
      "group",
      "school",
      "job",
      "other",
    ],
  }),
];

export const validateReportUpdate = () => [
  validateString("reviewMessage", false, {
    min: 3,
    max: 1000,
  }),
  validateString("status", false, {
    isIn: ["pending", "reviewed", "dismissed"],
  }),
];
