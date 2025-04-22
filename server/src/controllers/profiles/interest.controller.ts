import { Request, Response } from "express";
import InterestService from "../../services/profiles/interest.service";
import {
  controllerResponse,
  responseHandler,
} from "../../utils/responseHandler";
import { GraphQLResolveInfo } from "graphql";

class InterestController {
  private static instance: InterestController;
  private interestService: InterestService;
  constructor() {
    this.interestService = InterestService.getInstance();
  }
  static getInstance(): InterestController {
    if (!InterestController.instance) {
      InterestController.instance = new InterestController();
    }
    return InterestController.instance;
  }

  async getInterest(
    parent: any,
    args: { id: string },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<responseHandler> {
    const query = args.id
      ? { _id: args.id }
      : { userId: context.req.curUser?.userId };
    const result = await this.interestService.getInterest(query, info);
    if (!result.success) return result;
    return result;
  }

  async updateInterest(req: Request, res: Response): Promise<Response> {
    const result = await this.interestService.updateInterest(
      req.body,
      req.body.id
    );
    return controllerResponse(res, result);
  }

  async deleteInterest(req: Request, res: Response): Promise<Response> {
    const result = await this.interestService.deleteInterest(
      req.body,
      req.body.id
    );
    return controllerResponse(res, result);
  }
}

export default InterestController;
