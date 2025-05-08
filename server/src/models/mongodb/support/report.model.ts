import mongoose, { Schema, Document } from "mongoose";

const targetType = [
  "user",
  "post",
  "comment",
  "video",
  "company",
  "group",
  "job",
  "school",
  "other",
];
const statusType = ["pending", "reviewed", "dismissed"];
export interface IReport extends Document {
  userId: string;
  targetId: string;
  targetType: (typeof targetType)[number];
  subject: string;
  message: string;
  status: (typeof statusType)[number];
  reviewedBy?: string;
  reviewMessage?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema<IReport>(
  {
    userId: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: targetType,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: statusType,
      default: "pending",
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewMessage: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("support_reports", ReportSchema);
