import { Schema, model } from "mongoose";
import { CompanyDtoType } from "../../../dto/company/company.dto";

const FAQSchema: Schema = new Schema(
  {
    companyId: { type: String, required: true },
    userId: { type: String, required: true },
    question: { type: String, required: true },
    department: { type: String, required: true },
    questionType: { type: String, required: true },
    userType: {
      type: String,
      enum: ["member", "user", "other"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "answered", "rejected"],
      default: "pending",
    },
    answer: { type: String, default: "" },
    answerBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Faq = model<CompanyDtoType>("company_faqs", FAQSchema);
export default Faq;
