import { z } from "zod";
import { ObjectId } from "mongodb";

export const CertificateDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string(),
  title: z.string(),
  issuer: z.string(),
  issuedAt: z.date(),
  certificateUrl: z.string().url(),
  description: z.string(),
  uploadBy: z.string(),
  updateBy: z.string().default(""),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CertificateAddDto = CertificateDto.pick({
  title: true,
  issuer: true,
  issuedAt: true,
  certificateUrl: true,
  description: true,
});

export const CertificateUpdateDto = CertificateDto.pick({
  title: true,
  issuer: true,
  issuedAt: true,
  certificateUrl: true,
  description: true,
}).partial();

export type CertificateDtoType = z.infer<typeof CertificateDto>;
export type CertificateAddDtoType = z.infer<typeof CertificateAddDto>;
export type CertificateUpdateDtoType = z.infer<typeof CertificateUpdateDto>;
