import { Request, Response } from "express";
import FollowService from "../../services/client/follow.service";
import { controllerResponse } from "../../utils/response.util";

class FollowController {
  private static instance: FollowController;
  private followService: FollowService;
  constructor() {
    this.followService = FollowService.getInstance();
  }
  static getInstance(): FollowController {
    if (!FollowController.instance) {
      FollowController.instance = new FollowController();
    }
    return FollowController.instance;
  }

  async addFollow(req: Request, res: Response): Promise<Response> {
    const result = await this.followService.addFollow(req.body, req.curUser);
    return controllerResponse(res, result);
  }

  async getFollow(req: Request, res: Response): Promise<Response> {
    const result = await this.followService.getFollow(
      req.params.id,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async getAllFollows(req: Request, res: Response): Promise<Response> {
    const result = await this.followService.getAllFollows(
      req.query,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  }

  async countFollow(req: Request, res: Response): Promise<Response> {
    const result = await this.followService.countFollow(
      req.curUser?.userId,
      req.query
    );
    return controllerResponse(res, result);
  }

  async deleteFollow(req: Request, res: Response): Promise<Response> {
    const result = await this.followService.deleteFollow(req.params.id);
    return controllerResponse(res, result);
  }
}

export default FollowController;
