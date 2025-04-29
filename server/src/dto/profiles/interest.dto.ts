import { z } from "zod";
import { ObjectId } from "mongodb";

export const InterestDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  actorId: z.string().min(1, "User ID is required"),
  ownerType: z.enum(["user", "company", "school"]).default("user"),
  industries: z.array(z.string()).default([]).optional(),
  hobbies: z.array(z.string()).default([]).optional(),
  influencers: z.array(z.string()).default([]).optional(),
  companies: z.array(z.string()).default([]).optional(),
  groups: z.array(z.string()).default([]).optional(),
});

export const InterestAddDto = InterestDto.pick({
  industries: true,
  hobbies: true,
  influencers: true,
  companies: true,
  groups: true,
});

export type InterestDtoType = z.infer<typeof InterestDto>;
export type InterestAddDtoType = z.infer<typeof InterestAddDto>;
