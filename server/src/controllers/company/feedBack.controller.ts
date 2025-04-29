import { Request, Response } from "express";
import FeedBackService from "../../services/company/feedBack.service";
import { controllerResponse } from "../../utils/response.util";

class FeedBackController {
  private static instance: FeedBackController;
  private feedBackService: FeedBackService;
  constructor() {
    this.feedBackService = FeedBackService.getInstance();
  }
  static getInstance(): FeedBackController {
    if (!FeedBackController.instance) {
      FeedBackController.instance = new FeedBackController();
    }
    return FeedBackController.instance;
  }

  async updateFeedBackStatus(req: Request, res: Response): Promise<Response> {
    const result = await this.feedBackService.updateCompanyStatus(
      req.body,
      req.params.id,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getFeedBack(req: Request, res: Response): Promise<Response> {
    const result = await this.feedBackService.getFeedBack(req.params.id);
    return controllerResponse(res, result);
  }
  async getFeedBackByLink(req: Request, res: Response): Promise<Response> {
    const result = await this.feedBackService.getFeedBackByLink(
      process.env.BACKEND_URL + req.originalUrl
    );
    return controllerResponse(res, result);
  }

  async getAllFeedBack(req: Request, res: Response): Promise<Response> {
    const result = await this.feedBackService.getAllFeedBack(req.query);
    return controllerResponse(res, result);
  }

  async countFeedBack(req: Request, res: Response): Promise<Response> {
    const result = await this.feedBackService.countFeedBack(req.query);
    return controllerResponse(res, result);
  }

  async deleteFeedBack(req: Request, res: Response): Promise<Response> {
    const result = await this.feedBackService.deleteFeedBack(req.params.id);
    return controllerResponse(res, result);
  }
}

export default FeedBackController;
