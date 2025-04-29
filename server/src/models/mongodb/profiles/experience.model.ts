import { Schema, model } from "mongoose";
import { ExperienceDtoType } from "../../../dto/profiles/experience.dto";
const employmentType = [
  "full-time",
  "part-time",
  "internship",
  "freelance",
  "self-employed",
  "seasonal",
  "apprenticeship",
  "contract",
];
const locationType = ["remote", "on-site", "hybrid"];
const ExperienceSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    employmentType: { type: String, enum: employmentType, required: true },
    location: { type: String, required: true },
    locationType: { type: String, enum: locationType, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    currentlyWorking: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Experience = model<ExperienceDtoType>("user_experiences", ExperienceSchema);
export default Experience;
