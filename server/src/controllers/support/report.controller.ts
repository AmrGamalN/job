import { Request, Response } from "express";
import ReportService from "../../services/support/report.service";
import { controllerResponse } from "../../utils/response.util";

class ReportController {
  private static instance: ReportController;
  private reportService: ReportService;
  constructor() {
    this.reportService = ReportService.getInstance();
  }
  static getInstance(): ReportController {
    if (!ReportController.instance) {
      ReportController.instance = new ReportController();
    }
    return ReportController.instance;
  }

  async addReport(req: Request, res: Response): Promise<Response> {
    const result = await this.reportService.addReport(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getReport(req: Request, res: Response): Promise<Response> {
    const result = await this.reportService.getReport(req.params.id);
    return controllerResponse(res, result);
  }

  async getAllReports(req: Request, res: Response): Promise<Response> {
    const result = await this.reportService.getAllReports(
      req.query,
      req.curUser?.userId,
      req.curUser?.role
    );
    return controllerResponse(res, result);
  }

  async countReport(req: Request, res: Response): Promise<Response> {
    const result = await this.reportService.countReport(req.query);
    return controllerResponse(res, result);
  }

  async updateReport(req: Request, res: Response): Promise<Response> {
    const result = await this.reportService.updateReport(
      req.body,
      req.params.id,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  }

  async deleteReport(req: Request, res: Response): Promise<Response> {
    const result = await this.reportService.deleteReport(req.params.id);
    return controllerResponse(res, result);
  }
}

export default ReportController;
