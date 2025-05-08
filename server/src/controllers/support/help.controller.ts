import { Request, Response } from "express";
import HelpService from "../../services/support/help.service";
import { controllerResponse } from "../../utils/response.util";

class HelpController {
  private static instance: HelpController;
  private helpService: HelpService;
  constructor() {
    this.helpService = HelpService.getInstance();
  }
  static getInstance(): HelpController {
    if (!HelpController.instance) {
      HelpController.instance = new HelpController();
    }
    return HelpController.instance;
  }

  async addHelp(req: Request, res: Response): Promise<Response> {
    const result = await this.helpService.addHelp(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getHelp(req: Request, res: Response): Promise<Response> {
    const result = await this.helpService.getHelp(req.params.id);
    return controllerResponse(res, result);
  }

  async getAllHelps(req: Request, res: Response): Promise<Response> {
    const result = await this.helpService.getAllHelps(
      req.query,
      req.curUser?.userId,
      req.curUser?.role
    );
    return controllerResponse(res, result);
  }

  async countHelp(req: Request, res: Response): Promise<Response> {
    const result = await this.helpService.countHelp(req.query);
    return controllerResponse(res, result);
  }

  async updateHelp(req: Request, res: Response): Promise<Response> {
    const result = await this.helpService.updateHelp(
      req.body,
      req.params.id,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  }

  async deleteHelp(req: Request, res: Response): Promise<Response> {
    const result = await this.helpService.deleteHelp(req.params.id);
    return controllerResponse(res, result);
  }
}

export default HelpController;
