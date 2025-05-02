import { Request, Response } from "express";
import JobAnalyticsService from "../../services/job/companyJobAnalytics.service";
import { controllerResponse } from "../../utils/response.util";

class JobAnalyticsServiceController {
  private static instance: JobAnalyticsServiceController;
  private jobAnalyticsService: JobAnalyticsService;

  constructor() {
    this.jobAnalyticsService = JobAnalyticsService.getInstance();
  }

  static getInstance(): JobAnalyticsServiceController {
    if (!JobAnalyticsServiceController.instance) {
      JobAnalyticsServiceController.instance =
        new JobAnalyticsServiceController();
    }
    return JobAnalyticsServiceController.instance;
  }

  createAnalytics = async (req: Request, res: Response) => {
    const result = await this.jobAnalyticsService.createAnalytics(
      req.params.id
    );
    return controllerResponse(res, result);
  };

  getAnalytics = async (req: Request, res: Response) => {
    const result = await this.jobAnalyticsService.getAnalytics(req.params.id);
    return controllerResponse(res, result);
  };

  resetAnalyticsByName = async (req: Request, res: Response) => {
    const result = await this.jobAnalyticsService.resetAnalyticsByName(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  resetAllAnalytics = async (req: Request, res: Response) => {
    const result = await this.jobAnalyticsService.resetAllAnalytics(
      req.params.id
    );
    return controllerResponse(res, result);
  };

  deleteAnalytics = async (req: Request, res: Response) => {
    const result = await this.jobAnalyticsService.deleteAnalytics(
      req.params.id
    );
    return controllerResponse(res, result);
  };
}
export default JobAnalyticsServiceController;
