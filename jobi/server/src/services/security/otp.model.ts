import { Schema, model } from "mongoose";

// opt schema
const otpSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const Otp = model("otp", otpSchema);
export default Otp;
