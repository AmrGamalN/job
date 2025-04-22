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

  async addExperience(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.addExperience(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getExperience(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.getExperience(req.body.id);
    return controllerResponse(res, result);
  }

  async getAllExperiences(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.getAllExperiences(req.body.id);
    return controllerResponse(res, result);
  }

  async updateExperience(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.updateExperience(
      req.body,
      req.body.id
    );
    return controllerResponse(res, result);
  }

  async deleteExperience(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.deleteExperience(req.body.id);
    return controllerResponse(res, result);
  }
}

export default ExperienceController;
