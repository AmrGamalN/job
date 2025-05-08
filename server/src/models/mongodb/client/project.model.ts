import { Schema, model } from "mongoose";
import { ProjectDtoType } from "../../../dto/client/project.dto";
const ProjectSchema = new Schema(
  {
    userId: { type: String, ref: "user_users", required: true },
    projectName: { type: String, required: true },
    companyName: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "pending", "archived"],
      default: "active",
    },
    technologies: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    projectUrl: { type: String, required: true },
    repositoryUrl: { type: String },
    attachment: { type: String, optional: true, default: "" },
  },
  { timestamps: true }
);

const Project = model<ProjectDtoType>("user_projects", ProjectSchema);
export default Project;
