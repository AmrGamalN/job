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
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
    visibility: {
      type: String,
      enum: ["connection", "public", "private"],
      default: "connection",
    },
    profileLink: { type: String, unique: true, default: "" },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
