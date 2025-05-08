import { Schema, model } from "mongoose";
import { JobAppDtoType } from "../../../dto/job/jobApplication.dto";
import {
  ApplicantEnum,
  JobEnum,
  JobExperiencesEnum,
  WorkplaceEnum,
} from "../../../types/job.type";

const JobApplicationSchema = new Schema(
  {
    userId: { type: String, required: true },
    companyId: { type: String, required: true },
    jobId: { type: String, required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobTitle: { type: String, required: true },
    currentAddress: { type: String, required: true },
    profileLink: { type: String, required: true },
    applicantTypes: {
      type: String,
      enum: ApplicantEnum,
      required: true,
    },
    jobType: {
      type: String,
      enum: JobEnum,
      required: true,
    },
    workplaceType: {
      type: String,
      enum: WorkplaceEnum,
      required: true,
    },
    jobExperiences: { type: String, enum: JobExperiencesEnum, required: true },
    cv: {
      url: { type: String, default: "" },
      key: { type: String, required: true },
      type: { type: String, required: true },
    },
    idImage: {
      url: { type: String, required: true },
      key: { type: String, required: true },
      type: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const JobApplication = model<JobAppDtoType>(
  "job_applications",
  JobApplicationSchema
);
export default JobApplication;
