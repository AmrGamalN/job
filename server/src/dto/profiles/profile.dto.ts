import { z } from "zod";
import { ObjectId } from "mongodb";

export const profileDto = z
  .object({
    _id: z.union([z.string(), z.instanceof(ObjectId)]),
    userId: z.string(),
    about: z.string(),
    jobTitle: z.string(),
    jobDescription: z.string(),
    jobLocation: z.string(),
    jobCompany: z.string(),
    jobType: z.enum(["full_time", "part_time", "freelance", ""]).default(""),
    projectPreference: z
      .enum(["Long-term", "Short-term", "both", ""])
      .default(""),
    experienceLevel: z
      .enum(["entry_level", "Intermediate", "expert", ""])
      .default(""),
    categories: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    languages: z
      .array(
        z.object({
          language: z.string(),
          level: z
            .enum(["beginner", "intermediate", "advanced", "fluent"])
            .default("fluent"),
        })
      )
      .default([]),
    profileLink: z.string(),
  })
  .partial();

export const profileAddDto = profileDto.omit({ userId: true }).partial();
export const profileUpdateDto = profileDto.omit({ userId: true }).partial();

export type ProfileDtoType = z.infer<typeof profileDto>;
export type ProfileAddDtoType = z.infer<typeof profileAddDto>;
export type ProfileUpdateDtoType = z.infer<typeof profileUpdateDto>;
