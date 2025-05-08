import { Schema, model, Document } from "mongoose";

export interface IHelp extends Document {
  userId: string;
  subject: string;
  message: string;
  status: "pending" | "reviewed" | "resolved";
  reviewedBy?: string | null;
  reviewMessage?: string;
  reviewedAt?: Date;
}

const HelpSchema = new Schema<IHelp>(
  {
    userId: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    reviewedBy: { type: String, ref: "User", default: null },
    reviewMessage: { type: String, trim: true },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

const Help = model<IHelp>("support_help", HelpSchema);
export default Help;
