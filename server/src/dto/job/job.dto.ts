import { z } from "zod";
import { ObjectId } from "mongodb";

export const JobDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string(),
  actorType: z.string().default("job"),
  title: z.string(),
  department: z.array(z.string()),
  applicantTypes: z.array(
    z.enum([
      "student",
      "graduate",
      "entry-level",
      "mid-level",
      "senior",
      "manager",
      "executive",
      "freelancer",
      "intern",
      "career-shifter",
    ])
  ),
  jobType: z.array(
    z.enum([
      "full-time",
      "part-time",
      "internship",
      "freelance",
      "self-employed",
      "seasonal",
      "apprenticeship",
      "contract",
    ])
  ),
  workplaceType: z.array(z.enum(["remote", "on-site", "hybrid"])),
  requirementsText: z.string(),
  skills: z.array(z.string()),
  location: z.string().default(""),
  email: z.string().email(),
  status: z.enum(["active", "inactive"]),
  createdByUserId: z.string(),
  salaryRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  expireAt: z.date().optional(),
  viewsCount: z.number().default(0),
  jobLink: z.string().optional().default(""),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const JobAddDto = JobDto.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  viewsCount: true,
  jobLink: true,
  createdByUserId: true,
  companyId: true,
  actorType: true,
});
export const JobUpdateDto = JobAddDto.partial();

export type JobDtoType = z.infer<typeof JobDto>;
export type JobAddDtoType = z.infer<typeof JobAddDto>;
export type JobUpdateDtoType = z.infer<typeof JobUpdateDto>;
