import { z } from "zod";
import { UserAddDto } from "../profiles/user.dto";
import { UserSecurityAddDto } from "../security/security.dto";

export const RegisterDto = UserAddDto.merge(UserSecurityAddDto);
export type RegisterDtoType = z.infer<typeof RegisterDto>;
