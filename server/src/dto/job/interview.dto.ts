import { z } from "zod";
import { ObjectId } from "mongodb";

const statusEnum = ["pending", "shortlisted", "rejected", "passed"] as const;
const interviewPlatformEnum = [
  "zoom",
  "google_meet",
  "microsoftTeams",
  "on_site",
] as const;
const interviewResultEnum = ["failed", "on_hold", "hired"] as const;

export const InterviewDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  companyId: z.string(),
  jobId: z.string(),
  jobApplicationId: z.string(),
  interviewStatus: z.enum(statusEnum).default("pending"),
  hrNotes: z.string().optional().default(""),
  interviewResult: z.enum(interviewResultEnum).default("on_hold"),
  interviewDate: z.date(),
  interviewPlatform: z.enum(interviewPlatformEnum),
  address: z.string().optional(),
  interviewLink: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const InterviewAddDto = InterviewDto.omit({
  _id: true,
  companyId: true,
  jobId: true,
  interviewLink: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  interviewResult: z.enum(interviewResultEnum).optional().default("on_hold"),
});

export const InterviewUpdateDto = InterviewAddDto.partial().extend({
  status: z.enum(statusEnum).default("pending"),
  interviewResult: z.enum(interviewResultEnum).default("on_hold"),
});
export type InterviewDtoType = z.infer<typeof InterviewDto>;
export type InterviewAddDtoType = z.infer<typeof InterviewAddDto>;
export type InterviewUpdateDtoType = z.infer<typeof InterviewUpdateDto>;
