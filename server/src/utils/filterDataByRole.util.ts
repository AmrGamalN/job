import { ZodObject, ZodRawShape } from "zod";
import { UserRoleType } from "../types/role.type";

export const filterDataByRole = (
  viewerRole: UserRoleType,
  userDto: ZodObject<ZodRawShape>,
  adminDto?: ZodObject<ZodRawShape>,
  managerDto?: ZodObject<ZodRawShape>
): ZodObject<ZodRawShape> => {
  let dto: ZodObject<ZodRawShape>;
  if (viewerRole === "manager" && managerDto) dto = managerDto;
  else if (viewerRole === "admin" && adminDto) dto = adminDto;
  else dto = userDto;
  return dto;
};
