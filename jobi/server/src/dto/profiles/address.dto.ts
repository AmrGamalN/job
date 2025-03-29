import { z } from "zod";
export const AddressDto = z.object({
  userId: z.string().min(1, "User ID is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(1, "Address is required"),
  timeZone: z.string().min(1, "Time zone is required"),
});

export const AddressAddDto = AddressDto.pick({
  country: true,
  city: true,
  state: true,
  address: true,
  timeZone: true,
}).partial();

export const AddressUpdateDto = AddressAddDto.pick({
  country: true,
  city: true,
  state: true,
  address: true,
  timeZone: true,
}).partial();

export type AddressDtoType = z.infer<typeof AddressDto>;
export type AddressAddDtoType = z.infer<typeof AddressAddDto>;
export type AddressUpdateDtoType = z.infer<typeof AddressUpdateDto>;
