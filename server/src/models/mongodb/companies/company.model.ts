import mongoose, { Schema } from "mongoose";

const basicInfo = {
  userId: { type: String, required: true },
  companyName: { type: String, required: true },
  companyType: { type: String, required: true },
  companyIndustry: { type: String, required: true },
  companySize: { type: String, required: true },
  companyDescription: { type: String, required: true },
  companyPhone: { type: String, required: true },
  companyEmail: { type: String, required: true },
  prefixS3: { type: String, default: "" },
};

const media = {
  companyLogo: { type: String, required: true },
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
  socialLinks: {
    website: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    github: { type: String, default: "" },
  },
};

const founders = {
  founders: [
    {
      name: String,
      title: String,
      linkedIn: String,
      imageUrl: String,
    },
  ],
};

const locations = {
  locations: [],
};

const documents = {
  documents: [
    {
      name: String,
      fileUrl: String,
      uploadedAt: Date,
      documentType: { type: String, default: "" },
    },
  ],
};

const tagsAndTech = {
  tags: [{ type: String }],
  technologies: [{ type: String }],
};

const certificates = {
  certificates: [
    {
      title: String,
      issuer: String,
      date: Date,
      certificateUrl: String,
    },
  ],
};

const faqs = {
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
};

const CompanySchema = new Schema(
  {
    ...basicInfo,
    ...media,
    ...socialLinks,
    ...founders,
    ...locations,
    ...documents,
    ...tagsAndTech,
    ...certificates,
    ...faqs,
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
export default Company;
