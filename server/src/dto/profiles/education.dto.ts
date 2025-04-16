import { z } from "zod";
import { ObjectId } from "mongodb";

export const EducationDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string(),
  university: z.string(),
  description: z
    .string()
    .min(5, "Description must have at least 5")
    .max(100, "Description must have at must 100"),
  degree: z.string(),
  major: z.string(),
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]),
  gpa: z.number().min(1, "Gpa is required").max(5),
});

export const EducationAddDto = EducationDto.pick({
  university: true,
  description: true,
  degree: true,
  major: true,
  startDate: true,
  endDate: true,
  gpa: true,
}).refine((data: any) => data.startDate <= data.endDate, {
  message: "Start date must be before or equal to end date",
  path: ["startDate", "endDate"],
});

export const EducationUpdateDto = EducationDto.pick({
  university: true,
  description: true,
  degree: true,
  major: true,
  startDate: true,
  endDate: true,
  gpa: true,
})
  .partial()
  .refine((data: any) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date",
    path: ["startDate", "endDate"],
  });

export type EducationDtoType = z.infer<typeof EducationDto>;
export type EducationAddDtoType = z.infer<typeof EducationAddDto>;
export type EducationUpdateDtoType = z.infer<typeof EducationUpdateDto>;
