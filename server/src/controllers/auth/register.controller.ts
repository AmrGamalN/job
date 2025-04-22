import { Request, Response } from "express";
import RegisterService from "../../services/auth/register.service";
import { RegisterDtoType } from "../../dto/auth/register.dto";
import { GraphQLResolveInfo } from "graphql";
import {
  controllerResponse,
  responseHandler,
} from "../../utils/responseHandler";

class RegisterController {
  private static instance: RegisterController;
  private registerService: RegisterService;
  constructor() {
    this.registerService = RegisterService.getInstance();
  }
  static getInstance(): RegisterController {
    if (!RegisterController.instance) {
      RegisterController.instance = new RegisterController();
    }
    return RegisterController.instance;
  }

  // Main register
  async register(
    parent: any,
    args: { input: RegisterDtoType },
    context: {
      req: Request;
      res: Response;
    },
    info: GraphQLResolveInfo
  ): Promise<responseHandler> {
    const result = await this.registerService.register(args.input);
    if (!result.success) result;
    return result;
  }

  async verifyEmail(req: Request, res: Response): Promise<Response> {
    const result = await this.registerService.verifyEmail(req.params.token);
    return controllerResponse(res, result);
  }
}

export default RegisterController;
