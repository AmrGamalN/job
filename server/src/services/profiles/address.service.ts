import Address from "../../models/mongodb/profiles/address.model";
import {
  AddressDto,
  AddressAddDto,
  AddressUpdateDto,
  AddressAddDtoType,
  AddressUpdateDtoType,
} from "../../dto/profiles/address.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

class AddressService {
  private static instanceService: AddressService;
  public static getInstance(): AddressService {
    if (!AddressService.instanceService) {
      AddressService.instanceService = new AddressService();
    }
    return AddressService.instanceService;
  }

  // Add Address
  addAddress = warpAsync(
    async (
      AddressData: AddressAddDtoType,
      userId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(AddressData, AddressAddDto);
      if (!parseSafe.success) return parseSafe;
      const getAddress = await Address.findOne({ userId })
        .select({
          userId: 1,
        })
        .lean();

      if (getAddress) {
        return {
          success: false,
          status: 404,
          message: "Address Already found",
        };
      }

      await Address.create({ ...AddressData,userId });
      return {
        ...parseSafe,
        message: "Add address successfully",
      };
    }
  );

  // Update Address
  updateAddress = warpAsync(
    async (
      AddressData: AddressUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(AddressData, AddressUpdateDto);
      if (!parseSafe.success) return parseSafe;

      const updateAddress = await Address.findOneAndUpdate(
        query,
        {
          $set: {
            ...AddressData,
          },
        },
        {
          new: true,
        }
      ).lean();

      if (!updateAddress) {
        return {
          success: false,
          status: 404,
          message: "Address not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update Address successfully",
        data: updateAddress,
      };
    }
  );

  // Get address
  getAddress = warpAsync(
    async (query: object): Promise<responseHandler> => {
      const getAddress = await Address.findOne(query).lean();
      if (!getAddress) {
        return {
          success: false,
          status: 404,
          message: "Address not found",
        };
      }

      const parseSafeAddress = validateAndFormatData(getAddress, AddressDto);
      if (!parseSafeAddress.success) return parseSafeAddress;
      return {
        message: "Get address successfully",
        ...parseSafeAddress,
      };
    }
  );
}

export default AddressService;
