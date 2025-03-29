import { Request, Response } from "express";
import EducationService from "../../services/profiles/education.service";

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
    const userId = req.curUser?.userId;
    const result = await this.educationService.addEducation(req.body, userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Get education
  async getEducation(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.educationService.getEducation(userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }

  // Update education
  async updateEducation(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId ? req.params.userId : req.curUser?.userId;
    const result = await this.educationService.updateEducation(req.body, userId);
    if (!result.success) return res.status(result.status!).json(result);
    return res.status(result.status!).json(result);
  }
}

export default EducationController;
