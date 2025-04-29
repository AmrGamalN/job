import { Schema, model } from "mongoose";
import { JobDtoType } from "../../../dto/job/job.dto";
const JobSchema = new Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    actorType: { type: String, default: "job" },
    title: {
      type: String,
      required: true,
    },
    department: {
      type: [String],
      required: true,
    },
    applicantTypes: {
      type: [String],
      enum: [
        "student",
        "graduate",
        "entry-level",
        "mid-level",
        "senior",
        "manager",
        "executive",
        "freelancer",
        "intern",
        "career-shifter",
      ],
      required: true,
    },
    jobType: {
      type: [String],
      enum: [
        "full-time",
        "part-time",
        "internship",
        "freelance",
        "self-employed",
        "seasonal",
        "apprenticeship",
        "contract",
      ],
      required: true,
    },
    workplaceType: {
      type: [String],
      enum: ["remote", "on-site", "hybrid"],
      required: true,
    },
    requirementsText: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
    createdByUserId: {
      type: String,
      required: true,
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    expireAt: { type: Date },
    viewsCount: { type: Number, default: 0 },
    jobLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Job = model<JobDtoType>("job_jobs", JobSchema);
export default Job;
