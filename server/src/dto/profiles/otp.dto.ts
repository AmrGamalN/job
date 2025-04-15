import { z } from "zod";

export const OtpDto = z.object({
  email: z.string().email(),
  token: z.string(),
  expiresAt: z.date(),
});

export type OtpDtoType = z.infer<typeof OtpDto>;
