import Project from "../../models/mongodb/profiles/project.model";
import {
  ProjectDto,
  ProjectAddDto,
  ProjectUpdateDto,
  ProjectAddDtoType,
  ProjectUpdateDtoType,
} from "../../dto/profiles/project.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler } from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";

class ProjectService {
  private static instanceService: ProjectService;
  public static getInstance(): ProjectService {
    if (!ProjectService.instanceService) {
      ProjectService.instanceService = new ProjectService();
    }
    return ProjectService.instanceService;
  }

  // Add project
  addProject = warpAsync(
    async (
      ProjectData: ProjectAddDtoType,
      userId: string
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(ProjectData, ProjectAddDto);
      if (!parseSafe.success) return parseSafe;
      await Project.create({ ...ProjectData, userId });
      return {
        ...parseSafe,
        message: "Add project successfully",
      };
    }
  );

  // Update project
  updateProject = warpAsync(
    async (
      ProjectData: ProjectUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(ProjectData, ProjectUpdateDto);
      if (!parseSafe.success) return parseSafe;

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

      if (!updateProject) {
        return {
          success: false,
          status: 404,
          message: "Project not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Update project successfully",
        data: updateProject,
      };
    }
  );

  // Get project
  getProject = warpAsync(async (query): Promise<responseHandler> => {
    const getProject = await Project.findOne(query).lean();
    if (!getProject) {
      return {
        success: false,
        status: 404,
        message: "Project not found",
      };
    }

    const parseSafeProject = validateAndFormatData(getProject, ProjectDto);
    if (!parseSafeProject.success) return parseSafeProject;

    return {
      message: "Get project successfully",
      ...parseSafeProject,
    };
  });

  // Get all project
  getAllProjects = warpAsync(
    async (query: object): Promise<responseHandler> => {
      const getProjects = await Project.find(query).lean();

      if (!getProjects) {
        return {
          success: false,
          status: 404,
          message: "Project not found",
        };
      }

      const parseSafeProjects = validateAndFormatData(
        getProjects,
        ProjectDto,
        "getAll"
      );
      if (!parseSafeProjects.success) return parseSafeProjects;

      return {
        message: "Get project successfully",
        count: getProjects.length,
        ...parseSafeProjects,
      };
    }
  );

  // Delete project
  deleteProject = warpAsync(async (query: object): Promise<responseHandler> => {
    const deleteProject = await Project.deleteOne(query);
    if (!deleteProject.deletedCount) {
      return {
        success: false,
        status: 404,
        message: "Project not found",
      };
    }
    return {
      success: true,
      status: 200,
      message: "Delete project successfully",
    };
  });
}

export default ProjectService;
