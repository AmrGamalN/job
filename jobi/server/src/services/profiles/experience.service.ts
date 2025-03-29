import Experience from "../../models/mongodb/profiles/experience.model";
import {
  ExperienceDto,
  ExperienceAddDto,
  ExperienceUpdateDto,
  ExperienceAddDtoType,
  ExperienceUpdateDtoType,
} from "../../dto/profiles/experience.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

class ExperienceService {
  private static instanceService: ExperienceService;
  public static getInstance(): ExperienceService {
    if (!ExperienceService.instanceService) {
      ExperienceService.instanceService = new ExperienceService();
    }
    return ExperienceService.instanceService;
  }

  // Add experience
  addExperience = warpAsync(
    async (
      ExperienceData: ExperienceAddDtoType,
      userId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(ExperienceData, ExperienceAddDto);
      if (!parseSafe.success) return parseSafe;
      await Experience.create({ ...ExperienceData });
      return {
        ...parseSafe,
        message: "Add experience successfully",
      };
    }
  );

  // Update experience
  updateExperience = warpAsync(
    async (
      ExperienceData: ExperienceUpdateDtoType,
      experienceId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(
        ExperienceData,
        ExperienceUpdateDto
      );
      if (!parseSafe.success) return parseSafe;

      const updateExperience = await Experience.findOneAndUpdate(
        { experienceId },
        {
          $set: {
            ...ExperienceData,
          },
        },
        {
          new: true,
        }
      ).lean();

      if (!updateExperience) {
        return {
          success: false,
          status: 404,
          message: "Experience not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update experience successfully",
        data: updateExperience,
      };
    }
  );

  // Get experience
  getExperience = warpAsync(
    async (experienceId: string): Promise<responseHandler> => {
      const getExperience = await Experience.findOne({
        _id: experienceId,
      }).lean();

      if (!getExperience) {
        return {
          success: false,
          status: 404,
          message: "Experience not found",
        };
      }

      const parseSafeExperience = validateAndFormatData(
        getExperience,
        ExperienceDto
      );
      if (!parseSafeExperience.success) return parseSafeExperience;

      return {
        message: "Get experience successfully",
        ...parseSafeExperience,
      };
    }
  );

  // Get all experience
  getAllExperiences = warpAsync(
    async (userId: string): Promise<responseHandler> => {
      const getExperiences = await Experience.find({
        userId,
      }).lean();

      if (!getExperiences) {
        return {
          success: false,
          status: 404,
          message: "Experience not found",
        };
      }

      const parseSafeExperiences = validateAndFormatData(
        getExperiences,
        ExperienceDto,
        "getAll"
      );
      if (!parseSafeExperiences.success) return parseSafeExperiences;

      return {
        message: "Get experience successfully",
        ...parseSafeExperiences,
      };
    }
  );
}

export default ExperienceService;
