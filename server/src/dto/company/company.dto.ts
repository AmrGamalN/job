import { z } from "zod";
import { ObjectId } from "mongodb";

const basicInfoDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  actorId: z.string(),
  actorType: z.string().default("company"),
  companyName: z.string(),
  companyType: z.string(),
  companyIndustry: z.string(),
  companySize: z.number().optional().default(0),
  description: z.string(),
  companyPhone: z.string().optional().default(""),
  companyEmail: z.string(),
  department: z.array(z.string()).optional().default([]),
});

const mediaDto = z.object({
  companyLogo: z.union([
    z.string(),
    z
      .object({
        url: z.string().default(""),
        key: z.string().default(""),
        type: z.string().default(""),
      })
      .optional(),
  ]),
  profileImage: z.union([
    z.string(),
    z
      .object({
        url: z.string().default(""),
        key: z.string().default(""),
        type: z.string().default(""),
      })
      .optional(),
  ]),
  coverImage: z.union([
    z.string(),
    z
      .object({
        url: z.string().default(""),
        key: z.string().default(""),
        type: z.string().default(""),
      })
      .optional(),
  ]),
  introVideoUrl: z.string().default("").optional(),
});

const socialLinksDto = z.object({
  website: z.string(),
  linkedIn: z.string().default("").optional(),
  facebook: z.string().default("").optional(),
  twitter: z.string().default("").optional(),
  github: z.string().default("").optional(),
  companyLink: z.string().default("").optional(),
});

const tagsAndTechDto = z.object({
  tags: z.array(z.string()).default([]).optional(),
  technologies: z.array(z.string()).default([]).optional(),
});

export const companyDto = z.object({
  ...basicInfoDto.shape,
  ...mediaDto.shape,
  ...socialLinksDto.shape,
  ...tagsAndTechDto.shape,
  locations: z.array(z.string()).default([]).optional(),
});

export type CompanyDtoType = z.infer<typeof companyDto>;
