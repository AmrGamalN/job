import Address from "../../models/mongodb/profiles/address.model";
import {
  AddressDto,
  AddressAddDto,
  AddressUpdateDto,
  AddressAddDtoType,
  AddressUpdateDtoType,
} from "../../dto/profiles/address.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";

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
      AddressData: AddressAddDtoType,
      userId: string,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        AddressData,
        AddressAddDto
      );
      if (!validationResult.success) return validationResult;
      const getAddress = await Address.findOne({ userId })
        .select({
          userId: 1,
        })
        .lean();
      if (getAddress && ownerType == "user")
        return serviceResponse({ statusText: "Conflict" });
      await Address.create({ ...AddressData, userId, ownerType });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getAddress = warpAsync(
    async (query: object, ownerType: string): Promise<ServiceResponseType> => {
      const getAddress = await Address.findOne({ ...query, ownerType }).lean();
      return validateAndFormatData(getAddress, AddressDto);
    }
  );

  updateAddress = warpAsync(
    async (
      AddressData: AddressUpdateDtoType,
      query: object,
      ownerType: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        AddressData,
        AddressUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateAddress = await Address.findOneAndUpdate(
        { ...query, ownerType },
        {
          $set: {
            ...AddressData,
          },
        },
        {
          new: true,
        }
      ).lean();
      return serviceResponse({
        data: updateAddress,
      });
    }
  );
}
export default AddressService;
