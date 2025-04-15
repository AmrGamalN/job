import { z } from "zod";
import { ObjectId } from "mongodb";

export const ExperienceDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string().min(1, "User ID is required"),
  companyName: z
    .string()
    .min(2, "Company name must have at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must have at least 2 characters"),
  description: z.string().min(5, "Description must have at least 5 characters"),
  employmentType: z.enum(
    [
      "full-time",
      "part-time",
      "internship",
      "freelance",
      "self-employed",
      "seasonal",
      "apprenticeship",
      "contract",
    ],
    {
      errorMap: () => ({ message: "Invalid employment type" }),
    }
  ),
  location: z.string(),
  locationType: z.enum(["remote", "on-site", "hybrid"], {
    errorMap: () => ({ message: "Invalid location type" }),
  }),
  startDate: z.date(),
  endDate: z.date(),
  currentlyWorking: z.boolean(),
});

export const ExperienceAddDto = ExperienceDto.pick({
  companyName: true,
  jobTitle: true,
  description: true,
  employmentType: true,
  location: true,
  locationType: true,
  startDate: true,
  endDate: true,
  currentlyWorking: true,
}).refine((data: any) => data.startDate <= data.endDate, {
  message: "Start date must be before or equal to end date",
  path: ["startDate", "endDate"],
});

export const ExperienceUpdateDto = ExperienceDto.pick({
  companyName: true,
  jobTitle: true,
  description: true,
  employmentType: true,
  location: true,
  locationType: true,
  startDate: true,
  endDate: true,
  currentlyWorking: true,
})
  .partial()
  .refine((data: any) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date",
    path: ["startDate", "endDate"],
  });

export type ExperienceDtoType = z.infer<typeof ExperienceDto>;
export type ExperienceAddDtoType = z.infer<typeof ExperienceAddDto>;
export type ExperienceUpdateDtoType = z.infer<typeof ExperienceUpdateDto>;
