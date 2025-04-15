import { Schema, model } from "mongoose";
import { UserSecurityDtoType } from "../../../dto/profiles/security.dto";
import { number } from "zod";

const userSecuritySchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      // enum: ["client", "freelance", "company", "school", "admin", "manager"],
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    isEmailVerified: { type: Boolean, default: false },
    isPasswordReset: { type: Boolean, default: false },
    isAccountBlocked: { type: Boolean, default: false },
    isAccountDeleted: { type: Boolean, default: false },
    isTwoFactorAuth: { type: Boolean, default: false },
    twoFactorCode: { type: String, default: "" },
    numberLogin: { type: Number, default: 0 },
    lastFailedLoginTime: { type: Date, default: null },
    sign_up_provider: { type: String, default: "" },
    sign_in_provider: { type: String, default: "" },
    terms: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Security = model<UserSecurityDtoType>("Securities", userSecuritySchema);
export default Security;
