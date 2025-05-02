import { check } from "express-validator";
import {
  ApplicantTypes,
  JobExperiences,
  JobTypes,
  WorkplaceTypes,
} from "../../types/job.type";

const validateJob = (isUpdate: boolean = false) => {
  const field = (field: string) => {
    return isUpdate
      ? check(field).optional({ checkFalsy: true })
      : check(field).notEmpty().withMessage(`${field} is required`);
  };

  return [
    field("jobTitle").isString().withMessage("job Title must be a string"),

    field("department")
      .isArray({ min: 1 })
      .withMessage("department must be a non-empty array of strings"),

    field("applicantTypes")
      .isArray({ min: 1 })
      .withMessage("applicantTypes must be a non-empty array")
      .custom((arr: string[]) =>
        arr.every((v: any) => ApplicantTypes.includes(v))
      )
      .withMessage("Invalid applicantTypes"),

    field("jobType")
      .isArray({ min: 1 })
      .withMessage("jobType must be a non-empty array")
      .custom((arr: string[]) => arr.every((v: any) => JobTypes.includes(v)))
      .withMessage("Invalid jobType"),

    field("jobExperience")
      .isIn(JobExperiences)
      .withMessage("Invalid jobExperience"),

    field("workplaceType")
      .isArray({ min: 1 })
      .withMessage("workplaceType must be a non-empty array")
      .custom((arr: string[]) =>
        arr.every((v: any) => WorkplaceTypes.includes(v))
      )
      .withMessage("Invalid workplaceType"),

    field("jobDescription")
      .isString()
      .withMessage("jobDescription must be a string")
      .isLength({ min: 10, max: 1000 })
      .withMessage("jobDescription must be between 10 and 1000 characters"),

    field("jobRequirements")
      .isString()
      .withMessage("jobRequirements must be a string")
      .isLength({ min: 10, max: 1000 })
      .withMessage("jobRequirements must be between 10 and 1000 characters"),

    field("location").isString().withMessage("location must be a string"),

    field("skills")
      .isArray({ min: 1 })
      .withMessage("skills must be a non-empty array of strings"),

    field("email").isEmail().withMessage("email must be a valid email"),

    check("salary")
      .optional({ checkFalsy: true })
      .isObject()
      .withMessage("salary must be an object"),
    check("salary.min")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("salary min must be a number")
      .custom((value, { req }) => {
        if (req.body.salary.min >= req.body.salary.max) {
          throw new Error("salary min must be less than salary max");
        }
        return true;
      }),
    check("salary.max")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("salary max must be a number"),

    check("expireAt")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("expireAt must be a valid date")
      .toDate(),
  ];
};

export const validateJobAdd = validateJob(false);
export const validateJobUpdate = validateJob(true);
