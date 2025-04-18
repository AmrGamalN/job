import { Request, Response } from "express";
import ExperienceService from "../../services/profiles/experience.service";
import { controllerResponse } from "../../utils/responseHandler";

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
    const result = await this.experienceService.addExperience(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  // Get experience
  async getExperience(req: Request, res: Response): Promise<Response> {
    const query = req.params.experienceId
      ? { _id: req.params.experienceId }
      : { userId: req.curUser?.userId };
    const result = await this.experienceService.getExperience(query);
    return controllerResponse(res, result);
  }

  // Get all experience
  async getAllExperiences(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.experienceService.getAllExperiences(userId);
    return controllerResponse(res, result);
  }

  // Update experience
  async updateExperience(req: Request, res: Response): Promise<Response> {
    const query = req.params.experienceId
      ? { _id: req.params.experienceId }
      : { userId: req.curUser?.userId };
    const result = await this.experienceService.updateExperience(
      req.body,
      query
    );
    return controllerResponse(res, result);
  }

  // Delete experience
  async deleteExperience(req: Request, res: Response): Promise<Response> {
    const query = req.params.experienceId
      ? { _id: req.params.experienceId }
      : { userId: req.curUser?.userId };
    const result = await this.experienceService.deleteExperience(query);
    return controllerResponse(res, result);
  }
}

export default ExperienceController;
