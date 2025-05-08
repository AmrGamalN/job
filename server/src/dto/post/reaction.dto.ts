import { z } from "zod";
import { ObjectId } from "mongodb";
export const ReactionDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  targetId: z.string(),
  targetType: z.enum(["post", "comment"]),
  reactionType: z
    .enum(["like", "love", "haha", "wow", "sad", "angry"])
    .default("like"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ReactionAddDto = ReactionDto.pick({
  targetId:true,
  targetType: true,
  reactionType: true,
});

export const ReactionUpdateDto = ReactionDto.pick({
  targetType: true,
  reactionType: true,
});

export type ReactionDtoType = z.infer<typeof ReactionDto>;
export type ReactionAddDtoType = z.infer<typeof ReactionAddDto>;
export type ReactionUpdateDtoType = z.infer<typeof ReactionUpdateDto>;
