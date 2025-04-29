import { z } from "zod";
import { ObjectId } from "mongodb";

export const FaqDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string(),
  userId: z.string(),
  department: z.string(),
  question: z.string(),
  questionType: z.string(),
  userType: z.enum(["member", "user", "other"]).default("user"),
  status: z.enum(["pending", "answered", "rejected"]).default("pending"),
  answer: z.string().optional().default(""),
  answerBy: z.string().optional().default(""),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FaqAddDto = FaqDto.pick({
  department: true,
  question: true,
  questionType: true,
  userType: true,
}).extend({
  companyId: z.string(),
});

export const FaqUpdateDto = FaqDto.pick({
  department: true,
  question: true,
  questionType: true,
  userType: true,
  answer:true,
  answerBy:true,
  status:true,
})
  .partial()

export type FaqDtoType = z.infer<typeof FaqDto>;
export type FaqAddDtoType = z.infer<typeof FaqAddDto>;
export type FaqUpdateDtoType = z.infer<typeof FaqUpdateDto>;
