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

  async addProject(req: Request, res: Response): Promise<Response> {
    const result = await this.projectService.addProject(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getProject(req: Request, res: Response): Promise<Response> {
    const result = await this.projectService.getProject(req.body.id);
    return controllerResponse(res, result);
  }

  async getAllProjects(req: Request, res: Response): Promise<Response> {
    const result = await this.projectService.getAllProjects(req.body.id);
    return controllerResponse(res, result);
  }

  async updateProject(req: Request, res: Response): Promise<Response> {
    const result = await this.projectService.updateProject(
      req.body,
      req.body.id
    );
    return controllerResponse(res, result);
  }

  async deleteProject(req: Request, res: Response): Promise<Response> {
    const result = await this.projectService.deleteProject(req.body.id);
    return controllerResponse(res, result);
  }
}

export default ProjectController;
