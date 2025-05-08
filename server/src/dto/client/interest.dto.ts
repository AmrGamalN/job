import { z } from "zod";
import { ObjectId } from "mongodb";

export const InterestAdminDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string().min(1, "User ID is required"),
  industries: z.array(z.string()).default([]).optional(),
  hobbies: z.array(z.string()).default([]).optional(),
  influencers: z.array(z.string()).default([]).optional(),
  companies: z.array(z.string()).default([]).optional(),
  groups: z.array(z.string()).default([]).optional(),
});

export const InterestUserDto = InterestAdminDto.omit({
  userId: true,
});

export const InterestAddDto = InterestUserDto.omit({
  _id: true,
});

export type InterestDtoType = z.infer<typeof InterestAdminDto>;
export type InterestAddDtoType = z.infer<typeof InterestAddDto>;
