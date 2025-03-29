import { z } from "zod";
import { ObjectId } from "mongodb";

export const UserSecurityDto = z
  .object({
    _id: z.union([z.string(), z.instanceof(ObjectId)]),
    userId: z.string(),
    email: z.string().email(),
    mobile: z.string().optional(),
    role: z.enum(["user", "admin", "manager"]).default("user"),
    status: z.enum(["active", "inactive"]).default("inactive"),
    isEmailVerified: z.boolean().default(false),
    isPasswordReset: z.boolean().default(false),
    isAccountBlocked: z.boolean().default(false),
    isAccountDeleted: z.boolean().default(false),
    isTwoFactorAuth: z.boolean().default(false),
    twoFactorCode: z.string().default(""),
    numberLogin: z.number().default(0),
    lastFailedLoginTime: z.union([z.date(), z.literal(null)]).optional(),
    dateToJoin: z.union([z.date(), z.literal(null)]),
  })
  .partial();

export const UserSecurityAddDto = UserSecurityDto.pick({
  email: true,
  mobile: true,
}).extend({
  password: z.string(),
  confirmPassword: z.string(),
});

export const UserSecurityUpdateDto = UserSecurityDto.pick({
  mobile: true,
}).extend({
  password: z.string(),
});

export type UserSecurityDtoType = z.infer<typeof UserSecurityDto>;
export type UserSecurityAddDtoType = z.infer<typeof UserSecurityAddDto>;
export type UserSecurityUpdateDtoType = z.infer<typeof UserSecurityUpdateDto>;
