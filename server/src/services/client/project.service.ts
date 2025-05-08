import Project from "../../models/mongodb/client/project.model";
import {
  ProjectAdminDto,
  ProjectUserDto,
  ProjectAddDto,
  ProjectUpdateDto,
  ProjectAddDtoType,
  ProjectUpdateDtoType,
  ProjectDtoType,
} from "../../dto/client/project.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { UserRoleType } from "../../types/role.type";
import { ServiceResponseType } from "../../types/response.type";

class ProjectService {
  private static instanceService: ProjectService;
  public static getInstance(): ProjectService {
    if (!ProjectService.instanceService) {
      ProjectService.instanceService = new ProjectService();
    }
    return ProjectService.instanceService;
  }

  addProject = warpAsync(
    async (
      data: ProjectAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ProjectAddDto,
      });
      if (!validationResult.success) return validationResult;
      await Project.create({ ...data, userId });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getProject = warpAsync(
    async (
      data: ProjectDtoType,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      return validateAndFormatData({
        data,
        userDto: ProjectUserDto,
        adminDto: ProjectAdminDto,
        viewerRole,
      });
    }
  );

  getAllProjects = warpAsync(
    async (
      userId: string,
      viewerRole: UserRoleType
    ): Promise<ServiceResponseType> => {
      const getProjects = await Project.find({ userId }).lean();
      return validateAndFormatData({
        data: getProjects,
        userDto: ProjectUserDto,
        adminDto: ProjectAdminDto,
        viewerRole,
        actionType: "getAll",
      });
    }
  );

  updateProject = warpAsync(
    async (
      data: ProjectUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: ProjectUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateProject = await Project.updateOne(
        { _id },
        {
          $set: {
            ...data,
          },
        }
      );
      return serviceResponse({
        data: updateProject,
      });
    }
  );

  deleteProject = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        deletedCount: (await Project.deleteOne({ _id })).deletedCount,
      });
    }
  );
}

export default ProjectService;
