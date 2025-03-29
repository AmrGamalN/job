import { Schema, model } from "mongoose";
const ProjectSchema = new Schema(
  {
    userId: { type: String, ref: "users", required: true, unique: true },
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    degree: { type: String, required: true },
    major: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    gpa: { type: Number, required: true },
  },
  { timestamps: true }
);

const Education = model("education", ProjectSchema);
export default Education;
