import { z } from "zod";
import { ObjectId } from "mongodb";

export const SaveDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  userId: z.string(),
  targetId: z.union([z.string(), z.instanceof(ObjectId)]),
  targetType: z.enum(["user", "company", "school", "group", "post", "job"]),
  redirectUrl: z.string().url({ message: "Must be a valid URL" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const SaveAddDto = SaveDto.pick({
  targetId: true,
  targetType: true,
  redirectUrl: true,
});
export type SaveDtoType = z.infer<typeof SaveDto>;
export type SaveAddDtoType = z.infer<typeof SaveAddDto>;
