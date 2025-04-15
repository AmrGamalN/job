import { Request, Response } from "express";
import ProjectService from "../../services/profiles/project.service";
import { handleApiResponse } from "../../utils/responseHandler";

class ProjectController {
  private static instance: ProjectController;
  private projectService: ProjectService;
  constructor() {
    this.projectService = ProjectService.getInstance();
  }
  static getInstance(): ProjectController {
    if (!ProjectController.instance) {
      ProjectController.instance = new ProjectController();
    }
    return ProjectController.instance;
  }

  // Add project
  async addProject(req: Request, res: Response): Promise<Response> {
    const userId = req.curUser?.userId;
    const result = await this.projectService.addProject(req.body, userId);
    return handleApiResponse(res, result);
  }

  // Get project
  async getProject(req: Request, res: Response): Promise<Response> {
    const projectId = req.params.projectId;
    const userId = req.curUser?.userId;
    const result = await this.projectService.getProject(projectId, userId);
    return handleApiResponse(res, result);
  }

  // Get all project
  async getAllProjects(req: Request, res: Response): Promise<Response> {
    const userId = req.curUser?.userId;
    const result = await this.projectService.getAllProjects(userId);
    return handleApiResponse(res, result);
  }

  // Update project
  async updateProject(req: Request, res: Response): Promise<Response> {
    const projectId = req.params.projectId;
    const result = await this.projectService.updateProject(req.body, projectId);
    return handleApiResponse(res, result);
  }
}

export default ProjectController;
