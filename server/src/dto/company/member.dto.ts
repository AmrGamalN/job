import { z } from "zod";
import { ObjectId } from "mongodb";

export const MemberDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string(),
  userId: z.string(),
  name: z.string(),
  role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
  status: z
    .enum(["active", "inactive", "pending", "rejected","banned"])
    .default("pending"),
  email: z.string().email(),
  position: z.string(),
  addedBy: z.string(),
  department: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const MemberAddDto = MemberDto.pick({
  userId: true,
  role: true,
  status: true,
  position: true,
  email: true,
  name: true,
  department: true,
});

export const MemberUpdateDto = MemberDto.pick({
  role: true,
  status: true,
  position: true,
  email: true,
  name: true,
  department: true,
}).partial();

export type MemberDtoType = z.infer<typeof MemberDto>;
export type MemberAddDtoType = z.infer<typeof MemberAddDto>;
export type MemberUpdateDtoType = z.infer<typeof MemberUpdateDto>;
