import Education from "../../models/mongodb/profiles/education.model";
import {
  EducationDto,
  EducationAddDto,
  EducationUpdateDto,
  EducationAddDtoType,
  EducationUpdateDtoType,
} from "../../dto/profiles/education.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(EducationData, EducationAddDto);
      if (!parsed.success) return parsed;
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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(
        EducationData,
        EducationUpdateDto,
        "update"
      );
      if (!parsed.success) return parsed;

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

  getEducation = warpAsync(async (query: object): Promise<responseHandler> => {
    const getEducation = await Education.findOne(query).lean();
    return validateAndFormatData(getEducation, EducationDto);
  });

  getAllEducations = warpAsync(
    async (userId: string): Promise<responseHandler> => {
      const getEducations = await Education.find({
        userId,
      }).lean();
      return validateAndFormatData(getEducations, EducationDto, "getAll");
    }
  );

  deleteEducation = warpAsync(
    async (query: object): Promise<responseHandler> => {
      return serviceResponse({
        data: (await Education.deleteOne(query)).deletedCount,
      });
    }
  );
}

export default EducationService;
