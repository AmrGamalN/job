import { z } from "zod";
import { ObjectId } from "mongodb";
import { ApplicantTypes, JobTypes, WorkplaceTypes } from "../../types/job.type";

export const JobAppDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  jobId: z.string(),
  companyId: z.string(),
  applicantName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  jobTitle: z.string(),
  currentAddress: z.string(),
  applicantTypes: z.enum(ApplicantTypes),
  jobType: z.enum(JobTypes),
  workplaceType: z.enum(WorkplaceTypes),
  cv: z.union([
    z.string(),
    z
      .object({
        url: z.string().default(""),
        key: z.string().default(""),
        type: z.string().default(""),
      })
      .optional(),
  ]),
  idImage: z.union([
    z.string(),
    z
      .object({
        url: z.string().default(""),
        key: z.string().default(""),
        type: z.string().default(""),
      })
      .optional(),
  ]),
  profileLink: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const JobAppAddDto = JobAppDto.omit({
  _id: true,
  userId: true,
  applicantName: true,
  profileLink: true,
  createdAt: true,
  updatedAt: true,
});

export const JobAppUpdateDto = JobAppDto.partial();
export type JobAppDtoType = z.infer<typeof JobAppDto>;
export type JobAppAddDtoType = z.infer<typeof JobAppAddDto>;
export type JobAppUpdateDtoType = z.infer<typeof JobAppUpdateDto>;
