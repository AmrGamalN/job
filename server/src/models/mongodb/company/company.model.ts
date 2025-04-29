import { Schema, model } from "mongoose";
import { CompanyDtoType } from "../../../dto/company/company.dto";

const basicInfo = {
  ownerId: { type: String, required: true },
  companyName: { type: String, required: true },
  companyType: { type: String, required: true },
  companyIndustry: { type: String, required: true },
  description: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyPhone: { type: String, default: "" },
  companySize: { type: Number, default: 0 },
  department: {
    type: Array,
    default: [],
  },
};

const media = {
  companyLogo: {
    imageUrl: { type: String, default: "" },
    imageKey: { type: String, default: "" },
  },
  profileImage: {
    imageUrl: { type: String, default: "" },
    imageKey: { type: String, default: "" },
  },
  coverImage: {
    imageUrl: { type: String, default: "" },
    imageKey: { type: String, default: "" },
  },
  introVideoUrl: { type: String, default: "" },
};

const socialLinks = {
  website: { type: String, required: true },
  linkedIn: { type: String, default: "" },
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
  github: { type: String, default: "" },
};

const locations = {
  locations: {
    type: Array,
    default: [],
  },
};

const tagsAndTech = {
  tags: [{ type: String, default: [] }],
  technologies: [{ type: String, default: [] }],
};

const CompanySchema = new Schema(
  {
    ...basicInfo,
    ...media,
    ...socialLinks,
    ...locations,
    ...tagsAndTech,
  },
  { timestamps: true }
);

const Company = model<CompanyDtoType>("company_companies", CompanySchema);
export default Company;
