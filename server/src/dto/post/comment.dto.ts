import { z } from "zod";
import { ObjectId } from "mongodb";

export const commentDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  postId: z.union([z.string(), z.instanceof(ObjectId)]),
  reactionId: z.array(z.union([z.string(), z.instanceof(ObjectId)])).optional(),
  commentId: z.array(z.union([z.string(), z.instanceof(ObjectId)])).optional(),
  content: z.string().trim().max(1000),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video", "document"]),
        url: z.string(),
        key: z.string(),
      })
    )
    .optional(),
  reactionCount: z.array(z.number()).length(6).default([0, 0, 0, 0, 0, 0]),
  isEdited: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const commentAddDto = commentDto.pick({
  content: true,
  media: true,
});

export const commentUpdateDto = commentDto.partial().pick({
  content: true,
  media: true,
});

export type commentDtoType = z.infer<typeof commentDto>;
export type commentAddDtoType = z.infer<typeof commentAddDto>;
export type commentUpdateDtoType = z.infer<typeof commentUpdateDto>;
