import { Schema, model } from "mongoose";
import { CompanyDtoType } from "../../../dto/company/company.dto";

const basicInfo = {
  actorId: { type: String, required: true },
  actorType: { type: String, default: "company" },
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
    url: { type: String, default: "" },
    key: { type: String, default: "" },
    type: { type: String, default: "" },
  },
  profileImage: {
    url: { type: String, default: "" },
    key: { type: String, default: "" },
    type: { type: String, default: "" },
  },
  coverImage: {
    url: { type: String, default: "" },
    key: { type: String, default: "" },
    type: { type: String, default: "" },
  },
  introVideoUrl: { type: String, default: "" },
};

const socialLinks = {
  website: { type: String, required: true },
  linkedIn: { type: String, default: "" },
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
  github: { type: String, default: "" },
  companyLink: { type: String, default: "" },
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
