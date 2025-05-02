import { Request, Response } from "express";
import JobService from "../../services/job/job.service";
import { controllerResponse } from "../../utils/response.util";

class JobController {
  private static instance: JobController;
  private jobService: JobService;
  constructor() {
    this.jobService = JobService.getInstance();
  }

  static getInstance(): JobController {
    if (!JobController.instance) {
      JobController.instance = new JobController();
    }
    return JobController.instance;
  }

  addJob = async (req: Request, res: Response) => {
    const result = await this.jobService.addJob(
      req.body,
      req.curUser.company.companyId,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  };

  getJob = async (req: Request, res: Response) => {
    const result = await this.jobService.getJob(req.params.id);
    return controllerResponse(res, result);
  };

  getAllJobs = async (req: Request, res: Response) => {
    const { salary, views, createdAt, ...filters } = req.query;
    const sort = { salary, views, createdAt };
    const result = await this.jobService.getAllJobs(
      filters,
      sort,
      req.curUser.company.companyId
    );
    return controllerResponse(res, result);
  };

  countJob = async (req: Request, res: Response) => {
    const result = await this.jobService.countJob(
      req.curUser.company.companyId,
      req.query
    );
    return controllerResponse(res, result);
  };

  updateJob = async (req: Request, res: Response) => {
    const result = await this.jobService.updateJob(
      req.body,
      req.params.id,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  };

  deleteJob = async (req: Request, res: Response) => {
    const result = await this.jobService.deleteJob(req.params.id);
    return controllerResponse(res, result);
  };
}
export default JobController;
