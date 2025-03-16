import { Schema, model } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    about: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    jobDescription: { type: String, default: "" },
    jobLocation: { type: String, default: "" },
    jobCompany: { type: String, default: "" },
    jobType: { type: String, enum: ["full-time", "part-time", "freelance"] },
    projectPreference: {
      type: String,
      enum: ["Long-term", "Short-term", "both"],
      default: "",
    },
    experienceLevel: {
      type: String,
      enum: ["entry-level", "Intermediate", "expert"],
      default: "",
    },
    categories: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    languages: [
      {
        language: { type: String, required: true },
        proficiency: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("Profile", ProfileSchema);
