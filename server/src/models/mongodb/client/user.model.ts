import { Schema, model } from "mongoose";
import { UserDtoType } from "../../../dto/client/user.dto";

const UserSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true, unique: true },
    actorType: { type: String, default: "user" },
    userName: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: {
      url: {
        type: String,
        default: "",
      },
      key: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "",
      },
    },
    coverImage: {
      url: {
        type: String,
        default: "",
      },
      key: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "",
      },
    },
    prefixS3: { type: String, default: "" },
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
  },
  { timestamps: true }
);

const User = model<UserDtoType>("user_users", UserSchema);
export default User;
