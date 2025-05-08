import Interest from "../../models/mongodb/client/interest.model";
import {
  InterestAddDtoType,
  InterestAddDto,
  InterestUserDto,
  InterestAdminDto,
  InterestDtoType,
} from "../../dto/client/interest.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { UserRoleType } from "../../types/role.type";
import { InterestType } from "../../types/client.type";
import { ServiceResponseType } from "../../types/response.type";

class InterestService {
  private static instanceService: InterestService;
  public static getInstance(): InterestService {
    if (!InterestService.instanceService) {
      InterestService.instanceService = new InterestService();
    }
    return InterestService.instanceService;
  }

  getInterest = warpAsync(
    async (
      data: InterestDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: InterestUserDto,
        adminDto: InterestAdminDto,
        viewerRole,
      });
    }
  );

  updateInterest = warpAsync(
    async (
      data: InterestAddDtoType,
      interestId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: InterestAddDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const keys = Object.keys(validationResult.data) as InterestType[];
      if (keys.length !== 1 || !keys[0])
        return serviceResponse({
          statusText: "BadRequest",
          message: "Invalid interest data",
        });

      const updateInterest = await Interest.updateOne(
        { _id: interestId },
        {
          $addToSet: {
            [keys[0]]: {
              $each: data[keys[0]],
            },
          },
        }
      );
      return serviceResponse({
        data: updateInterest.modifiedCount,
      });
    }
  );

  deleteInterest = warpAsync(
    async (
      data: InterestAddDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: InterestAddDto,
        actionType: "delete",
      });
      if (!validationResult.success) return validationResult;

      const keys = Object.keys(validationResult.data) as InterestType[];
      if (keys.length !== 1 || !keys[0])
        return serviceResponse({
          statusText: "BadRequest",
        });

      const deleteInterest = await Interest.updateOne(
        { _id },
        {
          $pull: {
            [keys[0]]: {
              $in: data[keys[0]],
            },
          },
        }
      );
      return serviceResponse({
        data: deleteInterest.modifiedCount,
      });
    }
  );
}

export default InterestService;
