import { Schema, model } from "mongoose";
import { ProfileDtoType } from "../../../dto/profiles/profile.dto";
import { string } from "zod";

const ProfileSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "users",
      required: true,
      unique: true,
    },
    about: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    jobDescription: { type: String, default: "" },
    jobLocation: { type: String, default: "" },
    jobCompany: { type: String, default: "" },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "freelance", ""],
      default: "",
    },
    projectPreference: {
      type: String,
      enum: ["Long-term", "Short-term", "both", ""],
      default: "",
    },
    experienceLevel: {
      type: String,
      enum: ["entry-level", "Intermediate", "expert", ""],
      default: "",
    },
    categories: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    languages: [
      {
        language: { type: String, required: true },
        proficiency: {
          enum: ["beginner", "intermediate", "advanced"],
        },
      },
    ],
    profileLink: { type: String, unique: true, default: "" },
  },
  { timestamps: true }
);

const Profile = model<ProfileDtoType>("Profile", ProfileSchema);
export default Profile;
