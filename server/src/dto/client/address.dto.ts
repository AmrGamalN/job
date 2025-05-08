import { z } from "zod";
import { ObjectId } from "mongodb";

export const AddressAdminDto = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  userId: z.string().min(1, "User ID is required"),
  ownerType: z.enum(["user", "company", "school"], {
    errorMap: () => ({
      message: "Owner type must be either 'user','company', or 'school'",
    }),
  }),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(1, "Address is required"),
  timeZone: z.string().min(1, "Time zone is required"),
});
export const AddressUserDto = AddressAdminDto.omit({
  userId: true,
  ownerType: true,
});

export const AddressAddDto = AddressUserDto.omit({
  _id: true,
});
export const AddressUpdateDto = AddressAddDto.partial();

export type AddressDtoType = z.infer<typeof AddressAdminDto>;
export type AddressAddDtoType = z.infer<typeof AddressAddDto>;
export type AddressUpdateDtoType = z.infer<typeof AddressUpdateDto>;
