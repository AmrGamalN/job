import { z } from "zod";
import { ObjectId } from "mongodb";

export const ProjectAdminDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  projectName: z.string(),
  companyName: z.string(),
  description: z
    .string()
    .min(5, "Description must have at least 5")
    .max(100, "Description must have at must 100"),
  status: z
    .enum(["active", "completed", "pending", "archived"])
    .default("active"),
  technologies: z.array(z.string()).default([]),
  startDate: z.date(),
  endDate: z.date(),
  projectUrl: z.string(),
  repositoryUrl: z.string(),
  attachment: z.string().default(""),
});

export const ProjectUserDto = ProjectAdminDto.omit({
  userId: true,
});

export const ProjectAddDto = ProjectUserDto.omit({
  _id: true,
});

export const ProjectUpdateDto = ProjectUserDto.omit({
  _id: true,
}).partial();

export type ProjectDtoType = z.infer<typeof ProjectAdminDto>;
export type ProjectAddDtoType = z.infer<typeof ProjectAddDto>;
export type ProjectUpdateDtoType = z.infer<typeof ProjectUpdateDto>;
