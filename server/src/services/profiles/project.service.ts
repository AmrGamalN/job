import Project from "../../models/mongodb/profiles/project.model";
import {
  ProjectDto,
  ProjectAddDto,
  ProjectUpdateDto,
  ProjectAddDtoType,
  ProjectUpdateDtoType,
} from "../../dto/profiles/project.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(ProjectData, ProjectAddDto);
      if (!parsed.success) return parsed;
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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(
        ProjectData,
        ProjectUpdateDto,
        "update"
      );
      if (!parsed.success) return parsed;

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

  getProject = warpAsync(async (query): Promise<responseHandler> => {
    const getProject = await Project.findOne(query).lean();
    return validateAndFormatData(getProject, ProjectDto);
  });

  getAllProjects = warpAsync(
    async (query: object): Promise<responseHandler> => {
      const getProjects = await Project.find(query).lean();
      return validateAndFormatData(getProjects, ProjectDto, "getAll");
    }
  );

  deleteProject = warpAsync(async (query: object): Promise<responseHandler> => {
    return serviceResponse({
      data: (await Project.deleteOne(query)).deletedCount,
    });
  });
}

export default ProjectService;
