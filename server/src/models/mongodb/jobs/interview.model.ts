import { Schema, model } from "mongoose";
import { InterviewDtoType } from "../../../dto/job/interview.dto";

const InterviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    companyId: { type: String, required: true },
    jobId: { type: String, required: true },
    jobApplicationId: { type: String, required: true },
    interviewStatus: {
      type: String,
      enum: ["pending", "rejected", "shortlisted", "passed"],
      default: "pending",
    },
    interviewDate: { type: Date, required: true },
    interviewPlatform: {
      type: String,
      enum: ["zoom", "google_meet", "on_site", "microsoftTeams"],
      required: true,
    },
    hrNotes: { type: String, default: "" },
    address: { type: String, default: "" },
    interviewResult: {
      type: String,
      enum: ["failed", "on_hold", "hired"],
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
