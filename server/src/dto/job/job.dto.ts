import { z } from "zod";
import { ObjectId } from "mongodb";
import {
  ApplicantEnum,
  JobExperiencesEnum,
  JobEnum,
  WorkplaceEnum,
} from "../../types/job.type";

export const JobDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string(),
  actorType: z.string().default("job"),
  jobTitle: z.string(),
  department: z.array(z.string()),
  applicantTypes: z.array(z.enum(ApplicantEnum)),
  jobType: z.array(z.enum(JobEnum)),
  jobExperience: z.array(z.enum(JobExperiencesEnum)),
  workplaceType: z.array(z.enum(WorkplaceEnum)),
  jobDescription: z.string(),
  jobRequirements: z.string(),
  skills: z.array(z.string()),
  location: z.string(),
  email: z.string().email(),
  createdBy: z.string(),
  updatedBy: z.string(),
  salary: z
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
  createdBy: true,
  updatedBy: true,
  companyId: true,
  actorType: true,
});

export const JobUpdateDto = JobAddDto.partial();
export type JobDtoType = z.infer<typeof JobDto>;
export type JobAddDtoType = z.infer<typeof JobAddDto>;
export type JobUpdateDtoType = z.infer<typeof JobUpdateDto>;
