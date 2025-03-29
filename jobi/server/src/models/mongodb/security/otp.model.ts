import { Schema, model } from "mongoose";
import { OtpDtoType } from "../../../dto/security/otp.dto";

// Opt schema
const otpSchema: Schema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const Otp = model<OtpDtoType>("otps", otpSchema);
export default Otp;
