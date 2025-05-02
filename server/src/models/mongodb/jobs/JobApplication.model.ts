import { Schema, model } from "mongoose";
import { JobAppDtoType } from "../../../dto/job/jobApplication.dto";
import {
  ApplicantTypes,
  JobTypes,
  WorkplaceTypes,
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
      enum: ApplicantTypes,
      required: true,
    },
    jobType: {
      type: String,
      enum: JobTypes,
      required: true,
    },
    workplaceType: {
      type: String,
      enum: WorkplaceTypes,
      required: true,
    },
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
