import { z } from "zod";
import { ObjectId } from "mongodb";

export const FeedBackDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string(),
  companyName: z.string(),
  status: z
    .enum(["pending", "active", "inactive", "rejected"])
    .default("pending"),
  message: z.string(),
  updateBy: z.string(),
  feedBackLink: z.string(),
});

export const FeedBackUpdateDto = FeedBackDto.pick({
  status: true,
  message: true,
});

export type FeedBackDtoType = z.infer<typeof FeedBackDto>;
export type FeedBackUpdateDtoType = z.infer<typeof FeedBackUpdateDto>;
