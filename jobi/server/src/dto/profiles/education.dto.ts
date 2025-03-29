import { z } from "zod";

export const EducationDto = z.object({
  userId: z.string(),
  university: z.string(),
  description: z
    .string()
    .min(5, "Description must have at least 5")
    .max(100, "Description must have at must 100"),
  degree: z.string(),
  major: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  gpa: z.string().min(1, "Time zone is required").max(5),
});

export const EducationAddDto = EducationDto.pick({
  university: true,
  description: true,
  degree: true,
  major: true,
  startDate: true,
  endDate: true,
  gpa: true,
})
  .refine((data: any) => data.startDate <= data.endDate, {
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
