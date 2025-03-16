import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    account: {
      type: String,
      enum: ["company", "freelance", "school"],
      default: "client",
    },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "only_jobi_user",
    },
    profileLink: { type: String, unique: true, default: "" },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
