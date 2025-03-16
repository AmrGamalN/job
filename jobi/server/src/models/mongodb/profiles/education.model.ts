import { Schema, model } from "mongoose";
const EducationSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true, unique: true },
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

const Education = model("education", EducationSchema);
export default Education;
