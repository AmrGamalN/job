import Experience from "../../models/mongodb/profiles/experience.model";
import {
  ExperienceDto,
  ExperienceAddDto,
  ExperienceUpdateDto,
  ExperienceAddDtoType,
  ExperienceUpdateDtoType,
} from "../../dto/profiles/experience.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";

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
      ExperienceData: ExperienceAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        ExperienceData,
        ExperienceAddDto
      );
      if (!validationResult.success) return validationResult;
      await Experience.create({ userId, ...ExperienceData });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  updateExperience = warpAsync(
    async (
      ExperienceData: ExperienceUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        ExperienceData,
        ExperienceUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateExperience = await Experience.findOneAndUpdate(
        query,
        {
          $set: {
            ...ExperienceData,
          },
        },
        {
          new: true,
        }
      ).lean();
      return serviceResponse({
        data: updateExperience,
      });
    }
  );

  getExperience = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      const getExperience = await Experience.findOne(query).lean();
      return validateAndFormatData(getExperience, ExperienceDto);
    }
  );

  getAllExperiences = warpAsync(
    async (userId: string): Promise<ServiceResponseType> => {
      const getExperiences = await Experience.find({
        userId,
      }).lean();
      return validateAndFormatData(getExperiences, ExperienceDto, "getAll");
    }
  );

  deleteExperience = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Experience.deleteOne(query)).deletedCount,
      });
    }
  );
}

export default ExperienceService;
