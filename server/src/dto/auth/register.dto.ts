import { z } from "zod";
import { UserAddDto } from "../client/user.dto";
import { UserSecurityAddDto } from "../client/security.dto";

export const RegisterDto = UserAddDto.merge(UserSecurityAddDto);
export type RegisterDtoType = z.infer<typeof RegisterDto>;
