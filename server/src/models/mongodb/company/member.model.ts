import { Schema, model } from "mongoose";

const CompanyMemberSchema = new Schema(
  {
    companyId: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["owner", "founder", "admin", "member", "viewer"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected", "banned"],
      default: "pending",
    },
    position: { type: String, default: "" },
    department: { type: String, default: "" },
    addedBy: { type: String, default: "" },
  },
  { timestamps: true }
);
const Member = model("company_members", CompanyMemberSchema);
export default Member;
