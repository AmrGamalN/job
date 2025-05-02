import { Request, Response } from "express";
import InterviewService from "../../services/job/interview.service";
import { controllerResponse } from "../../utils/response.util";

class InterviewController {
  private static instance: InterviewController;
  private InterviewService: InterviewService;
  constructor() {
    this.InterviewService = InterviewService.getInstance();
  }

  static getInstance(): InterviewController {
    if (!InterviewController.instance) {
      InterviewController.instance = new InterviewController();
    }
    return InterviewController.instance;
  }

  addInterview= async (req: Request, res: Response) => {
    const result = await this.InterviewService.addInterview(req.body, req.curUser);
    return controllerResponse(res, result);
  };

  getInterview= async (req: Request, res: Response) => {
    const result = await this.InterviewService.getInterview(req.params.id);
    return controllerResponse(res, result);
  };

  getAllInterviews = async (req: Request, res: Response) => {
    const { createdAt, ...filters } = req.query;
    const sort = { createdAt };
    const result = await this.InterviewService.getAllInterviews(
      filters,
      sort,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  async getInterviewByLink(req: Request, res: Response): Promise<Response> {
    console.log( process.env.BACKEND_URL + req.originalUrl)
    const result = await this.InterviewService.getInterviewByLink(
      process.env.BACKEND_URL + req.originalUrl
    );
    return controllerResponse(res, result);
  }

  countInterview= async (req: Request, res: Response) => {
    const result = await this.InterviewService.countInterview(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  updateInterview= async (req: Request, res: Response) => {
    const result = await this.InterviewService.updateInterview(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  deleteInterview= async (req: Request, res: Response) => {
    const result = await this.InterviewService.deleteInterview(req.params.id);
    return controllerResponse(res, result);
  };
}
export default InterviewController;
