import { Schema, model } from "mongoose";
import { EducationDtoType } from "../../../dto/profiles/education.dto";
const EducationSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true },
    university: { type: String, required: true },
    description: { type: String, required: true },
    degree: { type: String, required: true },
    major: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    gpa: { type: Number, required: true },
  },
  { timestamps: true }
);

const Education = model<EducationDtoType>("educations", EducationSchema);
export default Education;
