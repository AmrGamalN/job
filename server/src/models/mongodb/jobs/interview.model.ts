import { Schema, model } from "mongoose";
import { InterviewDtoType } from "../../../dto/job/interview.dto";
import {
  InterviewPlatformEnum,
  InterviewResultEnum,
  InterviewStatusEnum,
} from "../../../types/job.type";

const InterviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    companyId: { type: String, required: true },
    jobId: { type: String, required: true },
    jobApplicationId: { type: String, required: true },
    interviewStatus: {
      type: String,
      enum: InterviewStatusEnum,
      default: "pending",
    },
    interviewDate: { type: Date, required: true },
    interviewPlatform: {
      type: String,
      enum: InterviewPlatformEnum,
      required: true,
    },
    hrNotes: { type: String, default: "" },
    address: { type: String, default: "" },
    interviewResult: {
      type: String,
      enum: InterviewResultEnum,
      default: "on_hold",
    },
    interviewLink: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Interview = model<InterviewDtoType>("job_interviews", InterviewSchema);
export default Interview;
