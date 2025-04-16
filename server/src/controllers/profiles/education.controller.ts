import { Request, Response } from "express";
import EducationService from "../../services/profiles/education.service";
import { handleApiResponse } from "../../utils/responseHandler";

class EducationController {
  private static instance: EducationController;
  private educationService: EducationService;
  constructor() {
    this.educationService = EducationService.getInstance();
  }
  static getInstance(): EducationController {
    if (!EducationController.instance) {
      EducationController.instance = new EducationController();
    }
    return EducationController.instance;
  }

  // Add education
  async addEducation(req: Request, res: Response): Promise<Response> {
    const result = await this.educationService.addEducation(
      req.body,
      req.curUser?.userId
    );
    return handleApiResponse(res, result);
  }

  // Get education
  async getEducation(req: Request, res: Response): Promise<Response> {
    const query = req.params.EducationId
      ? { _id: req.params.EducationId }
      : { userId: req.curUser?.userId };
    const result = await this.educationService.getEducation(query);
    return handleApiResponse(res, result);
  }

  // Update education
  async updateEducation(req: Request, res: Response): Promise<Response> {
    const query = req.params.EducationId
      ? { _id: req.params.EducationId }
      : { userId: req.curUser?.userId };
    const result = await this.educationService.updateEducation(req.body, query);
    return handleApiResponse(res, result);
  }

  // Delete education
  async deleteEducation(req: Request, res: Response): Promise<Response> {
    const query = req.params.EducationId
     ? { _id: req.params.EducationId }
      : { userId: req.curUser?.userId };
    const result = await this.educationService.deleteEducation(query);
    return handleApiResponse(res, result);
  }

}

export default EducationController;
