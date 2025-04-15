import { Request, Response } from "express";
import ProjectService from "../../services/profiles/project.service";

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
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Get project
  async getProject(req: Request, res: Response): Promise<Response> {
    const projectId = req.params.projectId;
    const userId = req.curUser?.userId;
    const result = await this.projectService.getProject(projectId, userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Get all project
  async getAllProjects(req: Request, res: Response): Promise<Response> {
    const userId = req.curUser?.userId;
    const result = await this.projectService.getAllProjects(userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Update project
  async updateProject(req: Request, res: Response): Promise<Response> {
    const projectId = req.params.projectId;
    const result = await this.projectService.updateProject(req.body, projectId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }
}

export default ProjectController;
