import { z } from "zod";
import { ObjectId } from "mongodb";
import { companyDto } from "./company.dto";

export const companySecurityDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.union([z.string(), z.instanceof(ObjectId)]),
  legalInfo: z.object({
    registrationNumber: z.string(),
    taxId: z.string(),
    legalName: z.string(),
    countryOfIncorporation: z.string(),
  }),
  status: z
    .enum(["active", "inactive", "pending", "rejected", "banned"])
    .default("pending"),
  prefixS3: z.string().default(""),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CompanyBaseDto = companyDto.merge(companySecurityDto);

export const CompanyAddDto = companyDto
  .merge(
    companySecurityDto.pick({
      legalInfo: true,
    })
  )
  .omit({
    _id: true,
    ownerId: true,
  });

export const CompanyUpdateDto = companyDto
  .merge(
    companySecurityDto.partial().pick({
      legalInfo: true,
    })
  )
  .partial();

export type CompanySecurityDtoType = z.infer<typeof companySecurityDto>;
export type CompanyDtoType = z.infer<typeof CompanyBaseDto>;
export type CompanyAddDtoType = z.infer<typeof CompanyAddDto>;
export type CompanyUpdateDtoType = z.infer<typeof CompanyUpdateDto>;
