import { Request, Response } from "express";
import ExperienceService from "../../services/client/experience.service";
import { controllerResponse } from "../../utils/response.util";

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
    const result = await this.experienceService.getExperience(
      req.body.data,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async getAllExperiences(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.getAllExperiences(
      req.params.userId,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async updateExperience(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.updateExperience(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async deleteExperience(req: Request, res: Response): Promise<Response> {
    const result = await this.experienceService.deleteExperience(req.params.id);
    return controllerResponse(res, result);
  }
}

export default ExperienceController;
