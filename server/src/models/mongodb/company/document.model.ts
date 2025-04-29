import { Schema, model } from "mongoose";
import { DocumentDtoType } from "../../../dto/company/document.dto";

const DocumentSchema: Schema = new Schema(
  {
    companyId: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    documentFile: {
      documentUrl: { type: String, default: "" },
      documentType: {
        type: String,
        enum: [
          "pdf",
          "word",
          "excel",
          "powerpoint",
          "presentation",
          "spreadsheet",
          "document",
          "",
        ],
        default: "",
      },
    },
    uploadBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Document = model<DocumentDtoType>("company_documents", DocumentSchema);
export default Document;
