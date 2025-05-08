import { Request, Response } from "express";
import SaveService from "../../services/support/save.service";
import { controllerResponse } from "../../utils/response.util";

class SaveController {
  private static instance: SaveController;
  private saveService: SaveService;

  constructor() {
    this.saveService = SaveService.getInstance();
  }

  static getInstance(): SaveController {
    if (!SaveController.instance) {
      SaveController.instance = new SaveController();
    }
    return SaveController.instance;
  }

  addSave = async (req: Request, res: Response) => {
    const result = await this.saveService.addSave(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  };

  getSave = async (req: Request, res: Response) => {
    const result = await this.saveService.getSave(req.params.id);
    return controllerResponse(res, result);
  };

  getAllSaves = async (req: Request, res: Response) => {
    const result = await this.saveService.getAllSaves(
      req.query,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  };

  countSave = async (req: Request, res: Response) => {
    const result = await this.saveService.countSave(
      req.query,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  };

  deleteSave = async (req: Request, res: Response) => {
    const result = await this.saveService.deleteSave(
      req.params.id,
      req.curUser.userId
    );
    return controllerResponse(res, result);
  };
}
export default SaveController;
