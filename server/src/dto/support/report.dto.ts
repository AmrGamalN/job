import { z } from "zod";
import { ObjectId } from "mongodb";

export const ReportDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  targetId: z.string(),
  targetType: z.enum([
    "user",
    "post",
    "comment",
    "video",
    "company",
    "group",
      "school",
    "job",
    "other",
  ]),
  subject: z.string().min(1).trim(),
  message: z.string().min(1).trim(),
  status: z.enum(["pending", "reviewed", "dismissed"]).default("pending"),
  reviewedBy: z.union([z.string(), z.null()]).optional(),
  reviewMessage: z.union([z.string(), z.null()]).optional(),
  reviewedAt: z.union([z.string(), z.coerce.date()]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ReportAddDto = ReportDto.omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  reviewMessage: true,
  reviewedAt: true,
});

export const ReportUpdateDto = ReportDto.pick({
  reviewMessage: true,
  status: true,
}).partial();

export type ReportDtoType = z.infer<typeof ReportDto>;
export type ReportAddDtoType = z.infer<typeof ReportAddDto>;
export type ReportUpdateDtoType = z.infer<typeof ReportUpdateDto>;
