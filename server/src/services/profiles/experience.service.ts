import Experience from "../../models/mongodb/profiles/experience.model";
import {
  ExperienceDto,
  ExperienceAddDto,
  ExperienceUpdateDto,
  ExperienceAddDtoType,
  ExperienceUpdateDtoType,
} from "../../dto/profiles/experience.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(ExperienceData, ExperienceAddDto);
      if (!parsed.success) return parsed;
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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(
        ExperienceData,
        ExperienceUpdateDto,
        "update"
      );
      if (!parsed.success) return parsed;

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

  getExperience = warpAsync(async (query: object): Promise<responseHandler> => {
    const getExperience = await Experience.findOne(query).lean();
    return validateAndFormatData(getExperience, ExperienceDto);
  });

  getAllExperiences = warpAsync(
    async (userId: string): Promise<responseHandler> => {
      const getExperiences = await Experience.find({
        userId,
      }).lean();
      return validateAndFormatData(getExperiences, ExperienceDto, "getAll");
    }
  );

  deleteExperience = warpAsync(
    async (query: object): Promise<responseHandler> => {
      return serviceResponse({
        data: (await Experience.deleteOne(query)).deletedCount,
      });
    }
  );
}

export default ExperienceService;
