import Experience from "../../models/mongodb/client/experience.model";
import {
  ExperienceAdminDto,
  ExperienceUserDto,
  ExperienceAddDto,
  ExperienceUpdateDto,
  ExperienceAddDtoType,
  ExperienceUpdateDtoType,
  ExperienceDtoType,
} from "../../dto/client/experience.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { UserRoleType } from "../../types/role.type";
import { ServiceResponseType } from "../../types/response.type";

class ExperienceService {
  private static instanceService: ExperienceService;
  public static getInstance(): ExperienceService {
    if (!ExperienceService.instanceService) {
      ExperienceService.instanceService = new ExperienceService();
    }
    return ExperienceService.instanceService;
  }

  addExperience = warpAsync(
    async (
      data: ExperienceAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ExperienceAddDto,
      });
      if (!validationResult.success) return validationResult;
      await Experience.create({ userId, ...data });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getExperience = warpAsync(
    async (
      data: ExperienceDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: ExperienceUserDto,
        adminDto: ExperienceAdminDto,
        viewerRole,
      });
    }
  );

  getAllExperiences = warpAsync(
    async (
      userId: string,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      const getExperiences = await Experience.find({
        userId,
      }).lean();
      return validateAndFormatData({
        data: getExperiences,
        userDto: ExperienceUserDto,
        adminDto: ExperienceAdminDto,
        viewerRole,
        actionType: "getAll",
      });
    }
  );

  updateExperience = warpAsync(
    async (
      data: ExperienceUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ExperienceUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateExperience = await Experience.updateOne(
        { _id },
        {
          $set: {
            ...data,
          },
        }
      );
      return serviceResponse({
        data: updateExperience,
      });
    }
  );

  deleteExperience = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Experience.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default ExperienceService;
