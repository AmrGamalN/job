import { z } from "zod";
import { ObjectId } from "mongodb";

export const AdminDto = z
  .object({
    _id: z.union([z.string(), z.instanceof(ObjectId)]),
    userId: z.string(),
    actorType: z.string().default("user"),
    prefixS3: z.string().default(""),
    userName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profileImage: z.object({
      url: z.string(),
      key: z.string(),
      type: z.string(),
    }),
    coverImage: z.object({
      url: z.string(),
      key: z.string(),
      type: z.string(),
    }),
    account: z.enum(["user", "admin", "manager"]).default("user"),
    visibility: z
      .enum(["connection", "public", "private"])
      .default("connection"),
    linkedIn: z.string(),
    github: z.string(),
    website: z.string(),
  })
  .partial();

export const UserDto = AdminDto.omit({
  userId: true,
  prefixS3: true,
});

export const UserAddDto = UserDto.omit({
  _id: true,
}).extend({
  userId: z.string(),
});

export const UserUpdateDto = UserAddDto.partial();

export type UserDtoType = z.infer<typeof AdminDto>;
export type UserAddDtoType = z.infer<typeof UserAddDto>;
export type UserUpdateDtoType = z.infer<typeof UserUpdateDto>;
