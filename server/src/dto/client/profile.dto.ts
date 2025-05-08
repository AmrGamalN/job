import { z } from "zod";
import { ObjectId } from "mongodb";

export const ProfileAdminDto = z
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

export const ProfileUserDto = ProfileAdminDto.omit({
  userId: true,
});

export const ProfileAddDto = ProfileUserDto.omit({ _id: true }).partial();
export const ProfileUpdateDto = ProfileAddDto.partial().extend({
  userId: z.string(),
});

export type ProfileDtoType = z.infer<typeof ProfileAdminDto>;
export type ProfileAddDtoType = z.infer<typeof ProfileAddDto>;
export type ProfileUpdateDtoType = z.infer<typeof ProfileUpdateDto>;
