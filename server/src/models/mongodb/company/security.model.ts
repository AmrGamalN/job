import { CompanySecurityDtoType } from "../../../dto/company/security.dto";
import { Schema, model, Types } from "mongoose";

const CompanySecuritySchema = new Schema(
  {
    companyId: {
      type: Types.ObjectId,
      ref: "company_companies",
      required: true,
    },
    prefixS3: { type: String, default: "" },
    legalInfo: {
      registrationNumber: { type: String },
      taxId: { type: String },
      legalName: { type: String },
      countryOfIncorporation: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected", "banned"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const CompanySecurity = model<CompanySecurityDtoType>(
  "company_securities",
  CompanySecuritySchema
);
export default CompanySecurity;
