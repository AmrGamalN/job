import {
  InterviewPlatformEnum,
  InterviewResultEnum,
  InterviewStatusEnum,
} from "../../types/job.type";
import { validateDate, validateString } from "../helperFunction.validator";
const stringLength = { min: 1, max: 50 };
export const interviewValidator = (isOptional: boolean) => [
  validateString("hrNotes", true, { min: 3, max: 500 }),
  validateString("address", isOptional, stringLength),
  validateString("email", isOptional, { isEmail: true }),
  validateString("interviewStatus", isOptional, {
    isIn: InterviewResultEnum,
  }),
  validateString("interviewResult", true, {
    isIn: InterviewStatusEnum,
  }),
  validateString("interviewPlatform", isOptional, {
    isIn: InterviewPlatformEnum,
  }),
  validateDate("interviewDate", isOptional),
];
export const interviewValidatorAdd = interviewValidator(false);
export const interviewValidatorUpdate = interviewValidator(true);
