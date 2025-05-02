import { check } from "express-validator";

const validateInterview = (isUpdate: boolean = false) => {
  const fieldString = (field: string) => {
    const validator = check(field)
      .trim()
      .isString()
      .withMessage(`${field} must be string`);

    return isUpdate
      ? validator.optional({ checkFalsy: true })
      : validator.notEmpty().withMessage(`${field} is required`);
  };

  return [
    fieldString("hrNotes")
      .isLength({ min: 3, max: 500 })
      .withMessage("HR notes must be string"),

    fieldString("address")
      .optional({ checkFalsy: true })
      .isLength({ min: 3, max: 50 }),

    check("interviewStatus")
      .isIn(["pending", "rejected", "shortlisted", "passed"])
      .withMessage(
        "status must be read, pending, rejected, shortlisted, passed"
      ),

    check("interviewResult")
      .optional({ checkFalsy: true })
      .isIn(["hired", "failed", "on_hold"])
      .withMessage("interviewResult must be hired, failed, on_hold"),

    check("interviewPlatform")
      .isIn(["zoom", "google_meet", "microsoftTeams", "on_site"])
      .withMessage(
        "interviewPlatform must be zoom, google_meet, microsoftTeams, on_site"
      ),

    check("interviewDate")
      .isISO8601()
      .withMessage("interviewDate must be formatted yyyy-mm-dd")
      .toDate(),
  ];
};

export const validateInterviewAdd = validateInterview(false);
export const validateInterviewUpdate = validateInterview(true);
