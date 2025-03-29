import { Schema, model } from "mongoose";

const userSecuritySchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["client", "freelance", "company", "school", "admin", "manager"],
      default: "client",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isEmailVerified: { type: Boolean, default: false },
    isPasswordReset: { type: Boolean, default: false },
    isAccountLocked: { type: Boolean, default: false },
    isAccountDeleted: { type: Boolean, default: false },
    isAccountClosed: { type: Boolean, default: false },
    isTwoFactorAuth: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: "" },
    numberLogin: { type: Number, default: 0 },
    lastFailedLoginTime: { type: Date, default: null },
  },
  { timestamps: true }
);

const Security = model("Securities", userSecuritySchema);
export default Security;
