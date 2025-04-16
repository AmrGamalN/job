import { z } from "zod";
import { ObjectId } from "mongodb";

export const ProjectDto = z.object({
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
});

export const ProjectAddDto = ProjectDto.pick({
  userId: true,
  projectName: true,
  companyName: true,
  description: true,
  status: true,
  technologies: true,
  startDate: true,
  endDate: true,
  projectUrl: true,
  repositoryUrl: true,
}).refine((data: any) => data.startDate <= data.endDate, {
  message: "Start date must be before or equal to end date",
  path: ["startDate", "endDate"],
});

export const ProjectUpdateDto = ProjectDto.pick({
  userId: true,
  projectName: true,
  companyName: true,
  description: true,
  status: true,
  technologies: true,
  startDate: true,
  endDate: true,
  projectUrl: true,
  repositoryUrl: true,
})
  .partial()
  .refine((data: any) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date",
    path: ["startDate", "endDate"],
  });

export type ProjectDtoType = z.infer<typeof ProjectDto>;
export type ProjectAddDtoType = z.infer<typeof ProjectAddDto>;
export type ProjectUpdateDtoType = z.infer<typeof ProjectUpdateDto>;
