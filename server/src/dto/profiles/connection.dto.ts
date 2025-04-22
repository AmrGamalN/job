import { z } from "zod";
import { ObjectId } from "mongodb";

export const ConnectionDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string().min(1, "userId is required"),
  connectorId: z.string().min(1, "connectorId is required"),
  status: z.enum(["pending", "accepted", "blocked", "unBlocked"]).optional(),
  acceptedAt: z.date().nullable().optional(),
  blockedAt: z.date().nullable().optional(),
  unBlockedAt: z.date().nullable().optional(),
  history: z
    .object({
      action: z.enum(["blocked", "unBlocked", "accepted"]).nullable(),
      actionBy: z.string().nullable(),
      actionAt: z.date().nullable(),
    })
    .optional(),
});

export const ConnectionAddDto = ConnectionDto.pick({
  userId: true,
});

export const ConnectionUpdateDto = z.object({
  status: z.enum(["accepted", "blocked", "unBlocked"]),
  userId: z.string().min(1, "userId is required"),
});

export type ConnectionDtoType = z.infer<typeof ConnectionDto>;
export type ConnectionAddDtoType = z.infer<typeof ConnectionAddDto>;
export type ConnectionUpdateDtoType = z.infer<typeof ConnectionUpdateDto>;
