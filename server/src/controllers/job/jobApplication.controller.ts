import { Request, Response } from "express";
import JobAppService from "../../services/job/jobApplication.service";
import { controllerResponse } from "../../utils/response.util";

class JobAppController {
  private static instance: JobAppController;
  private JobAppService: JobAppService;
  constructor() {
    this.JobAppService = JobAppService.getInstance();
  }

  static getInstance(): JobAppController {
    if (!JobAppController.instance) {
      JobAppController.instance = new JobAppController();
    }
    return JobAppController.instance;
  }

  addJobApp = async (req: Request, res: Response) => {
    const result = await this.JobAppService.addJobApp(req.body, req.curUser);
    return controllerResponse(res, result);
  };

  getJobApp = async (req: Request, res: Response) => {
    const result = await this.JobAppService.getJobApp(req.params.id);
    return controllerResponse(res, result);
  };

  getAllJobApps = async (req: Request, res: Response) => {
    const { createdAt, ...filters } = req.query;
    const sort = { createdAt };
    const result = await this.JobAppService.getAllJobApps(
      filters,
      sort,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  countJobApp = async (req: Request, res: Response) => {
    const result = await this.JobAppService.countJobApp(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  updateJobApp = async (req: Request, res: Response) => {
    const result = await this.JobAppService.updateJobApp(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  };

  deleteJobApp = async (req: Request, res: Response) => {
    const result = await this.JobAppService.deleteJobApp(req.params.id);
    return controllerResponse(res, result);
  };
}
export default JobAppController;
