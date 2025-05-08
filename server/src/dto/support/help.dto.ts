import { z } from "zod";
import { ObjectId } from "mongodb";

export const HelpDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  subject: z.string(),
  message: z.string(),
  status: z.enum(["pending", "reviewed", "resolved"]),
  reviewedBy: z.string().optional(),
  reviewMessage: z.string().optional(),
  reviewedAt: z.union([z.string(), z.coerce.date()]).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const HelpAddDto = HelpDto.pick({
  subject: true,
  message: true,
});

export const HelpUpdateDto = HelpDto.pick({
  status: true,
  reviewMessage: true,
}).partial();

export type HelpDtoType = z.infer<typeof HelpDto>;
export type HelpAddDtoType = z.infer<typeof HelpAddDto>;
export type HelpUpdateDtoType = z.infer<typeof HelpUpdateDto>;
