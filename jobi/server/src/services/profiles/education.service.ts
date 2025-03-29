import Education from "../../models/mongodb/profiles/education.model";
import {
  EducationDto,
  EducationAddDto,
  EducationUpdateDto,
  EducationAddDtoType,
  EducationUpdateDtoType,
} from "../../dto/profiles/education.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

class EducationService {
  private static instanceService: EducationService;
  public static getInstance(): EducationService {
    if (!EducationService.instanceService) {
      EducationService.instanceService = new EducationService();
    }
    return EducationService.instanceService;
  }

  // Add Education
  addEducation = warpAsync(
    async (
      EducationData: EducationAddDtoType,
      userId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(EducationData, EducationAddDto);
      if (!parseSafe.success) return parseSafe;
      await Education.create({ userId, ...EducationData });
      return {
        ...parseSafe,
        message: "Add education successfully",
      };
    }
  );

  // Update Education
  updateEducation = warpAsync(
    async (
      EducationData: EducationUpdateDtoType,
      educationId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(
        EducationData,
        EducationUpdateDto
      );
      if (!parseSafe.success) return parseSafe;

      const updateEducation = await Education.findOneAndUpdate(
        { educationId },
        {
          $set: {
            ...EducationData,
          },
        },
        {
          new: true,
        }
      ).lean();

      if (!updateEducation) {
        return {
          success: false,
          status: 404,
          message: "Education not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update Education successfully",
        data: updateEducation,
      };
    }
  );

  // Get education
  getEducation = warpAsync(
    async (educationId: string): Promise<responseHandler> => {
      const getEducation = await Education.findOne({ _id: educationId }).lean();

      if (!getEducation) {
        return {
          success: false,
          status: 404,
          message: "Education not found",
        };
      }

      const parseSafeEducation = validateAndFormatData(
        getEducation,
        EducationDto
      );
      if (!parseSafeEducation.success) return parseSafeEducation;

      return {
        message: "Get education successfully",
        ...parseSafeEducation,
      };
    }
  );
}

export default EducationService;
