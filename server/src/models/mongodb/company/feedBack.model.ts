import { Schema, model } from "mongoose";
import { FeedBackDtoType } from "../../../dto/company/feedBack.dto";

const FeedBackSchema: Schema = new Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "pending",
    },
    message: { type: String, required: true },
    updateBy: { type: String, default: "" },
    feedBackLink: { type: String, required: true },
  },
  { timestamps: true }
);

const FeedBack = model<FeedBackDtoType>("company_feedbacks", FeedBackSchema);
export default FeedBack;
