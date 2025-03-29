import { Request, Response } from "express";
import ExperienceService from "../../services/profiles/experience.service";

class ExperienceController {
  private static instance: ExperienceController;
  private experienceService: ExperienceService;
  constructor() {
    this.experienceService = ExperienceService.getInstance();
  }
  static getInstance(): ExperienceController {
    if (!ExperienceController.instance) {
      ExperienceController.instance = new ExperienceController();
    }
    return ExperienceController.instance;
  }

  // Add experience
  async addExperience(req: Request, res: Response): Promise<Response> {
    const userId = req.curUser?.userId;
    const result = await this.experienceService.addExperience(req.body, userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Get experience
  async getExperience(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.getExperience(userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Get all experience
  async getAllExperiences(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.getAllExperiences(userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Update experience
  async updateExperience(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.updateExperience(
      req.body,
      userId
    );
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }
}

export default ExperienceController;
