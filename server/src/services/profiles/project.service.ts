import Project from "../../models/mongodb/profiles/project.model";
import {
  ProjectDto,
  ProjectAddDto,
  ProjectUpdateDto,
  ProjectAddDtoType,
  ProjectUpdateDtoType,
} from "../../dto/profiles/project.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { validateAndFormatData } from "../../utils/validateData.util";

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
      ProjectData: ProjectAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        ProjectData,
        ProjectAddDto
      );
      if (!validationResult.success) return validationResult;
      await Project.create({ ...ProjectData, userId });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  updateProject = warpAsync(
    async (
      ProjectData: ProjectUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        ProjectData,
        ProjectUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateProject = await Project.findOneAndUpdate(
        query,
        {
          $set: {
            ...ProjectData,
          },
        },
        {
          new: true,
        }
      ).lean();
      return serviceResponse({
        data: updateProject,
      });
    }
  );

  getProject = warpAsync(async (query): Promise<ServiceResponseType> => {
    const getProject = await Project.findOne(query).lean();
    return validateAndFormatData(getProject, ProjectDto);
  });

  getAllProjects = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      const getProjects = await Project.find(query).lean();
      return validateAndFormatData(getProjects, ProjectDto, "getAll");
    }
  );

  deleteProject = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      return serviceResponse({
        deletedCount: (await Project.deleteOne(query)).deletedCount,
      });
    }
  );
}

export default ProjectService;
