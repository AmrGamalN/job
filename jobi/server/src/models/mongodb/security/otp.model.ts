import { Schema, model } from "mongoose";

// opt schema
const otpSchema: Schema = new Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Otp = model("otps", otpSchema);
