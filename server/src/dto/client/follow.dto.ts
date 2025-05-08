import { z } from "zod";
import { ObjectId } from "mongodb";

export const FollowAdminDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  followerId: z.string(),
  followingId: z.string(),
  nameFollower: z.string(),
  nameFollowing: z.string(),
  followerType: z.enum(["user"]),
  followingType: z.enum(["user", "company", "school"]),
  followStatus: z.enum(["follow", "unfollow"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FollowUserDto = FollowAdminDto.omit({
  followerId: true,
  followingId: true,
});

export const FollowAddDto = FollowAdminDto.pick({
  followingId: true,
  followingType: true,
  nameFollowing: true,
});

export const FollowUpdateDto = z.object({
  followStatus: z.enum(["follow", "unfollow"]),
});

export type FollowDtoType = z.infer<typeof FollowAdminDto>;
export type FollowAddDtoType = z.infer<typeof FollowAddDto>;
export type FollowUpdateDtoType = z.infer<typeof FollowUpdateDto>;
