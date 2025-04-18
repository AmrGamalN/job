import { Request, Response } from "express";
import ProjectService from "../../services/profiles/project.service";
import { controllerResponse } from "../../utils/responseHandler";

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
    const result = await this.projectService.addProject(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  // Get project
  async getProject(req: Request, res: Response): Promise<Response> {
    const query = req.params.projectId
      ? { _id: req.params.projectId }
      : { userId: req.curUser?.userId };
    const result = await this.projectService.getProject(query);
    return controllerResponse(res, result);
  }

  // Get all project
  async getAllProjects(req: Request, res: Response): Promise<Response> {
    const query = req.params.userId
      ? { userId: req.params.userId }
      : { userId: req.curUser?.userId };
    const result = await this.projectService.getAllProjects(query);
    return controllerResponse(res, result);
  }

  // Update project
  async updateProject(req: Request, res: Response): Promise<Response> {
    const query = req.params.projectId
      ? { _id: req.params.projectId }
      : { userId: req.curUser?.userId };
    const result = await this.projectService.updateProject(req.body, query);
    return controllerResponse(res, result);
  }

  // Delete project
  async deleteProject(req: Request, res: Response): Promise<Response> {
    const query = req.params.projectId
      ? { _id: req.params.projectId }
      : { userId: req.curUser?.userId };
    const result = await this.projectService.deleteProject(query);
    return controllerResponse(res, result);
  }
}

export default ProjectController;
