import { z } from "zod";
import { ObjectId } from "mongodb";

export const postDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  actorId: z.string(),
  actorType: z.enum(["user", "company", "school", "group", "post", "job"]),
  commentId: z.array(z.union([z.string(), z.instanceof(ObjectId)])),
  reactionId: z.array(z.union([z.string(), z.instanceof(ObjectId)])),
  prefixS3: z.string().trim(),
  content: z.string().trim(),
  postLink: z.string().trim(),
  media: z.array(
    z.object({
      type: z.enum(["image", "video", "document"]),
      url: z.string(),
      key: z.string(),
    })
  ),
  shares: z.number().default(0),
  watch: z.number().default(0),
  visibility: z.enum(["public", "connections", "private"]).default("public"),
  hashtags: z.array(z.string().trim()),
  mentions: z.array(z.string()),
  reactionCount: z.array(z.number()).length(6).default([0, 0, 0, 0, 0, 0]),
  commentCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const postAddDto = postDto.pick({
  content: true,
  media: true,
  visibility: true,
  hashtags: true,
  mentions: true,
});

export const postUpdateDto = postDto.partial().pick({
  content: true,
  media: true,
  visibility: true,
  hashtags: true,
  mentions: true,
});

export type postDtoType = z.infer<typeof postDto>;
export type postAddDtoType = z.infer<typeof postAddDto>;
export type postUpdateDtoType = z.infer<typeof postUpdateDto>;
