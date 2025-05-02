import { check } from "express-validator";
import { ApplicantTypes, JobTypes, WorkplaceTypes } from "../../types/job.type";

const validateJobAppToUser = (isUpdate: boolean = false) => {
  const fieldString = (field: string) => {
    const validator = check(field)
      .trim()
      .isString()
      .withMessage(`${field} must be string`)
      .bail();

    return isUpdate
      ? validator.optional({ checkFalsy: true }).toLowerCase()
      : validator.notEmpty().withMessage(`${field} is required`).toLowerCase();
  };

  return [
    fieldString("email").isEmail().normalizeEmail(),
    fieldString("phone").isMobilePhone("any"),
    fieldString("jobTitle").isLength({ min: 3, max: 50 }),
    fieldString("currentAddress").isLength({ min: 3, max: 50 }),

    fieldString("applicantTypes")
      .isIn(ApplicantTypes)
      .withMessage(
        "student, graduate, joiner, senior, manager, executive, entry_level, mid_level, freelancer, intern, career_shifter"
      ),

    fieldString("jobType")
      .isIn(JobTypes)
      .withMessage(
        "full_time, part-full, internship, freelance, seasonal, apprenticeship, contract"
      ),

    fieldString("workplaceType")
      .isIn(WorkplaceTypes)
      .withMessage("workplaceType must be remote, on-site, hybrid"),

    fieldString("cv.url"),
    fieldString("cv.key"),
    fieldString("cv.type"),

    fieldString("idImage.url"),
    fieldString("idImage.key"),
    fieldString("idImage.type"),
  ];
};

export const validateJobAppAdd = validateJobAppToUser(false);
export const validateJobAppUpdate = validateJobAppToUser(true);
