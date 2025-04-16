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
      query: object
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(
        EducationData,
        EducationUpdateDto
      );
      if (!parseSafe.success) return parseSafe;

      const updateEducation = await Education.findOneAndUpdate(
        query,
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
  getEducation = warpAsync(async (query: object): Promise<responseHandler> => {
    const getEducation = await Education.findOne(query).lean();

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
  });

  deleteEducation = warpAsync(
    async (query: object): Promise<responseHandler> => {
      const deleteEducation = await Education.findOneAndDelete(query).lean();
      if (!deleteEducation) {
        return {
          success: false,
          status: 404,
          message: "Education not found",
        };
      }
      return {
        success: true,
        status: 200,
        message: "Delete education successfully",
      };
    }
  );
}

export default EducationService;
