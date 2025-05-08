import Address from "../../models/mongodb/client/address.model";
import {
  AddressUserDto,
  AddressAdminDto,
  AddressAddDto,
  AddressUpdateDto,
  AddressAddDtoType,
  AddressUpdateDtoType,
  AddressDtoType,
} from "../../dto/client/address.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { UserRoleType } from "../../types/role.type";
import { ServiceResponseType } from "../../types/response.type";

class AddressService {
  private static instanceService: AddressService;
  public static getInstance(): AddressService {
    if (!AddressService.instanceService) {
      AddressService.instanceService = new AddressService();
    }
    return AddressService.instanceService;
  }

  addAddress = warpAsync(
    async (
      data: AddressAddDtoType,
      userId: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: AddressAddDto,
      });
      if (!validationResult.success) return validationResult;
      const getAddress = await Address.findOne({ userId })
        .select({
          userId: 1,
        })
        .lean();
      if (getAddress) return serviceResponse({ statusText: "Conflict" });
      await Address.create({ ...data, userId, ownerType });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getAddress = warpAsync(
    async (
      data: AddressDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: AddressUserDto,
        adminDto: AddressAdminDto,
        viewerRole,
      });
    }
  );

  updateAddress = warpAsync(
    async (
      data: AddressUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: AddressUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateAddress = await Address.updateOne(
        { _id },
        {
          $set: {
            ...data,
          },
        }
      );
      return serviceResponse({
        data: updateAddress.modifiedCount,
      });
    }
  );

  deleteAddress = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        deletedCount: (await Address.deleteOne({ _id })).deletedCount,
      });
    }
  );
}
export default AddressService;
