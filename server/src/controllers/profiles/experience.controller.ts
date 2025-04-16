import { Request, Response } from "express";
import ExperienceService from "../../services/profiles/experience.service";
import { handleApiResponse } from "../../utils/responseHandler";

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
    return handleApiResponse(res, result);
  }

  // Get experience
  async getExperience(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.getExperience(userId);
    return handleApiResponse(res, result);
  }

  // Get all experience
  async getAllExperiences(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.getAllExperiences(userId);
    return handleApiResponse(res, result);
  }

  // Update experience
  async updateExperience(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.updateExperience(
      req.body,
      userId
    );
    return handleApiResponse(res, result);
  }
}

export default ExperienceController;
