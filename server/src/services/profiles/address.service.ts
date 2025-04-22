import Address from "../../models/mongodb/profiles/address.model";
import {
  AddressDto,
  AddressAddDto,
  AddressUpdateDto,
  AddressAddDtoType,
  AddressUpdateDtoType,
} from "../../dto/profiles/address.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

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
      userId: string
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(AddressData, AddressAddDto);
      if (!parsed.success) return parsed;
      const getAddress = await Address.findOne({ userId })
        .select({
          userId: 1,
        })
        .lean();
      if (getAddress) return serviceResponse({ statusText: "Conflict" });
      await Address.create({ ...AddressData, userId });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getAddress = warpAsync(async (query: object): Promise<responseHandler> => {
    const getAddress = await Address.findOne(query).lean();
    return validateAndFormatData(getAddress, AddressDto);
  });

  updateAddress = warpAsync(
    async (
      AddressData: AddressUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(
        AddressData,
        AddressUpdateDto,
        "update"
      );
      if (!parsed.success) return parsed;

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
      return serviceResponse({
        data: updateAddress,
      });
    }
  );
}
export default AddressService;
