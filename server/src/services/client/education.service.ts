import Education from "../../models/mongodb/client/education.model";
import {
  EducationAdminDto,
  EducationUserDto,
  EducationAddDto,
  EducationUpdateDto,
  EducationAddDtoType,
  EducationUpdateDtoType,
  EducationDtoType,
} from "../../dto/client/education.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { UserRoleType } from "../../types/role.type";
import { ServiceResponseType } from "../../types/response.type";

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
      data: EducationAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: EducationAddDto,
      });
      if (!validationResult.success) return validationResult;
      await Education.create({ userId, ...data });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getEducation = warpAsync(
    async (
      data: EducationDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: EducationUserDto,
        adminDto: EducationAdminDto,
        viewerRole,
      });
    }
  );

  getAllEducations = warpAsync(
    async (
      userId: string,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      const getEducations = await Education.find({
        userId,
      }).lean();
      return validateAndFormatData({
        data: getEducations,
        userDto: EducationUserDto,
        adminDto: EducationAdminDto,
        viewerRole,
        actionType: "getAll",
      });
    }
  );

  updateEducation = warpAsync(
    async (
      data: EducationUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: EducationUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateEducation = await Education.updateOne(
        { _id },
        {
          $set: {
            ...data,
          },
        }
      );
      return serviceResponse({
        data: updateEducation,
      });
    }
  );

  deleteEducation = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        data: (await Education.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default EducationService;
