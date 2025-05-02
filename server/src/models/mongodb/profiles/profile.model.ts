import { Schema, model } from "mongoose";
import { ProfileDtoType } from "../../../dto/profiles/profile.dto";

const ProfileSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "user_users",
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
      enum: ["full_time", "part_time", "freelance", ""],
      default: "",
    },
    projectPreference: {
      type: String,
      enum: ["Long-term", "Short-term", "both", ""],
      default: "",
    },
    experienceLevel: {
      type: String,
      enum: ["entry_level", "Intermediate", "expert", ""],
      default: "",
    },
    categories: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    languages: [
      {
        language: { type: String, required: true },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "fluent"],
          default: "fluent",
        },
      },
    ],
    profileLink: { type: String, unique: true, default: "" },
  },
  { timestamps: true }
);

const Profile = model<ProfileDtoType>("user_Profiles", ProfileSchema);
export default Profile;
