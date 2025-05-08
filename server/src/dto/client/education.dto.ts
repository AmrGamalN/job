import { z } from "zod";
import { ObjectId } from "mongodb";

export const EducationAdminDto = z.object({
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

export const EducationUserDto = EducationAdminDto.omit({
  userId: true,
});

export const EducationAddDto = EducationUserDto.omit({
  _id: true,
});

export const EducationUpdateDto = EducationUserDto.omit({
  _id: true,
}).partial();

export type EducationDtoType = z.infer<typeof EducationAdminDto>;
export type EducationAddDtoType = z.infer<typeof EducationAddDto>;
export type EducationUpdateDtoType = z.infer<typeof EducationUpdateDto>;
