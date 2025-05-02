import { z } from "zod";
import { ObjectId } from "mongodb";

export const DocumentDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  companyId: z.string().default(""),
  name: z.string().default(""),
  description: z.string().default(""),
  documentFile: z.object({
    url: z.string().default(""),
    type: z
      .enum([
        "pdf",
        "word",
        "excel",
        "powerpoint",
        "presentation",
        "spreadsheet",
        "document",
        "",
      ])
      .default(""),
  }),
  uploadBy: z.string().default(""),
  updatedBy: z.string().default(""),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DocumentAddDto = DocumentDto.pick({
  name: true,
  description: true,
  documentFile: true,
});

export const DocumentUpdateDto = DocumentDto.pick({
  name: true,
  description: true,
  documentFile: true,
}).partial();

export type DocumentDtoType = z.infer<typeof DocumentDto>;
export type DocumentAddDtoType = z.infer<typeof DocumentAddDto>;
export type DocumentUpdateDtoType = z.infer<typeof DocumentUpdateDto>;
