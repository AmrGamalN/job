import { z } from "zod";
import { ObjectId } from "mongodb";

export const ExperienceAdminDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string().min(1, "User ID is required"),
  companyName: z
    .string()
    .min(2, "Company name must have at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must have at least 2 characters"),
  description: z.string().min(5, "Description must have at least 5 characters"),
  employmentType: z.enum(
    [
      "full_time",
      "part_time",
      "internship",
      "freelance",
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
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]),
  currentlyWorking: z.boolean(),
});

export const ExperienceUserDto = ExperienceAdminDto.omit({
  userId: true,
});

export const ExperienceAddDto = ExperienceUserDto.omit({
  _id: true,
})

export const ExperienceUpdateDto = ExperienceUserDto.omit({
  _id: true,
}).partial();

export type ExperienceDtoType = z.infer<typeof ExperienceAdminDto>;
export type ExperienceAddDtoType = z.infer<typeof ExperienceAddDto>;
export type ExperienceUpdateDtoType = z.infer<typeof ExperienceUpdateDto>;
