import { z } from "zod";
import { ObjectId } from "mongodb";
import { blockEnum, connectionEnum } from "../../types/client.type";

export const ConnectionAdminDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  senderId: z.string(),
  recipientId: z.string(),
  recipientName: z.string(),
  status: z.enum(connectionEnum).default("pending"),
  blockStatus: z.enum(blockEnum).default("unBlocked"),
  history: z.object({
    blockStatus: z.union([z.enum(blockEnum), z.null()]),
    actionBy: z.union([z.string(), z.null()]),
    actionAt: z.union([z.date(), z.null()]),
  }),
});
export const ConnectionUserDto = ConnectionAdminDto.omit({
  senderId: true,
  recipientId: true,
  history: true,
});

export const ConnectionAddDto = ConnectionAdminDto.pick({
  recipientId: true,
  recipientName: true,
  blockStatus: true,
});

export const ConnectionUpdateDto = ConnectionAdminDto.pick({
  status: true,
  blockStatus: true,
}).partial();

export type ConnectionDtoType = z.infer<typeof ConnectionAdminDto>;
export type ConnectionAddDtoType = z.infer<typeof ConnectionAddDto>;
export type ConnectionUpdateDtoType = z.infer<typeof ConnectionUpdateDto>;
