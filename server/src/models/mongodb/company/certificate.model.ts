import { Schema, model } from "mongoose";
import { CompanyDtoType } from "../../../dto/company/company.dto";

const CertificateSchema: Schema = new Schema(
  {
    companyId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    issuer: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    certificateUrl: { type: String, required: true },
    uploadBy: { type: String, required: true },
    updateBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const CertificateModel = model<CompanyDtoType>(
  "company_certificates",
  CertificateSchema
);
export default CertificateModel;
