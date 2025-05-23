import { Request, Response } from "express";
import ConnectionService from "../../services/client/connection.service";
import { controllerResponse } from "../../utils/response.util";

class ConnectionController {
  private static instance: ConnectionController;
  private connectionService: ConnectionService;
  constructor() {
    this.connectionService = ConnectionService.getInstance();
  }
  static getInstance(): ConnectionController {
    if (!ConnectionController.instance) {
      ConnectionController.instance = new ConnectionController();
    }
    return ConnectionController.instance;
  }

  async addConnection(req: Request, res: Response): Promise<Response> {
    const result = await this.connectionService.addConnection(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getConnection(req: Request, res: Response): Promise<Response> {
    const result = await this.connectionService.getConnection(
      req.body.data,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async getAllConnection(req: Request, res: Response): Promise<Response> {
    const result = await this.connectionService.getAllConnection(
      req.query,
      req.params.userId,
      req.curUser.role
    );
    return controllerResponse(res, result);
  }

  async countConnection(req: Request, res: Response): Promise<Response> {
    const result = await this.connectionService.countConnection(
      req.curUser?.userId,
      req.query
    );
    return controllerResponse(res, result);
  }

  async updateConnection(req: Request, res: Response): Promise<Response> {
    const result = await this.connectionService.updateConnection(
      req.body,
      req.params?.id,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async deleteConnection(req: Request, res: Response): Promise<Response> {
    const result = await this.connectionService.deleteConnection(req.params.id);
    return controllerResponse(res, result);
  }
}

export default ConnectionController;
