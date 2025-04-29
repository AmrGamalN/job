import Education from "../../models/mongodb/profiles/education.model";
import {
  EducationDto,
  EducationAddDto,
  EducationUpdateDto,
  EducationAddDtoType,
  EducationUpdateDtoType,
} from "../../dto/profiles/education.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";

class EducationService {
  private static instanceService: EducationService;
  public static getInstance(): EducationService {
    if (!EducationService.instanceService) {
      EducationService.instanceService = new EducationService();
    }
    return EducationService.instanceService;
  }

  addEducation = warpAsync(
    async (
      EducationData: EducationAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        EducationData,
        EducationAddDto
      );
      if (!validationResult.success) return validationResult;
      await Education.create({ userId, ...EducationData });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  updateEducation = warpAsync(
    async (
      EducationData: EducationUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        EducationData,
        EducationUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

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
      return serviceResponse({
        data: updateEducation,
      });
    }
  );

  getEducation = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      const getEducation = await Education.findOne(query).lean();
      return validateAndFormatData(getEducation, EducationDto);
    }
  );

  getAllEducations = warpAsync(
    async (userId: string): Promise<ServiceResponseType> => {
      const getEducations = await Education.find({
        userId,
      }).lean();
      return validateAndFormatData(getEducations, EducationDto, "getAll");
    }
  );

  deleteEducation = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Education.deleteOne(query)).deletedCount,
      });
    }
  );
}

export default EducationService;
