import { Schema, model } from "mongoose";
import { SecurityDtoType } from "../../../dto/client/security.dto";

const userSecuritySchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    company: {
      companyId: { type: String, ref: "company_companies", default: "" },
      memberId: { type: String, ref: "company_members", default: "" },
      status: {
        type: String,
        enum: [
          "active",
          "inactive",
          "pending",
          "rejected",
          "banned",
          "no_company",
        ],
        default: "no_company",
      },
      companyRole: {
        type: String,
        enum: ["owner", "founder", "admin", "member", "viewer"],
        default: "viewer",
      },
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

const Security = model<SecurityDtoType>("user_securities", userSecuritySchema);
export default Security;
