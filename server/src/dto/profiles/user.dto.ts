import { z } from "zod";
import { ObjectId } from "mongodb";

export const UserDto = z
  .object({
    _id: z.union([z.string(), z.instanceof(ObjectId)]),
    userId: z.string(),
    userName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profileImage: z.string(),
    coverImage: z.string(),
    account: z.enum(["user", "admin", "manager"]).default("user"),
    visibility: z
      .enum(["connection", "public", "private"])
      .default("connection"),
    linkedIn: z.string(),
    github: z.string(),
    website: z.string(),
  })
  .partial();

export const UserAddDto = UserDto.pick({
  firstName: true,
  lastName: true,
  profileImage: true,
  coverImage: true,
  visibility: true,
  linkedIn: true,
  github: true,
  website: true,
});

export const UserUpdateDto = UserAddDto.extend({});

export type UserDtoType = z.infer<typeof UserDto>;
export type UserAddDtoType = z.infer<typeof UserAddDto>;
export type UserUpdateDtoType = z.infer<typeof UserUpdateDto>;
