import { Request, Response } from "express";
import InterestService from "../../services/profiles/interest.service";
import {
  handleApiResponse,
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

  // Get interest
  async getInterest(
    parent: any,
    args: { interestId: string },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<responseHandler> {
    const query = args.interestId
      ? { _id: args.interestId }
      : { userId: context.req.curUser?.userId };
    const result = await this.interestService.getInterest(query, info);
    if (!result.success) return result;
    return result;
  }

  // Update interest
  async updateInterest(req: Request, res: Response): Promise<Response> {
    const query = req.params.interestId
      ? { _id: req.params.interestId }
      : { userId: req.curUser?.userId };
    const result = await this.interestService.updateInterest(req.body, query);
    return handleApiResponse(res, result);
  }

  // Delete interest
  async deleteInterest(req: Request, res: Response): Promise<Response> {
    const query = req.params.interestId
      ? { _id: req.params.interestId }
      : { userId: req.curUser?.userId };
    const result = await this.interestService.deleteInterest(req.body, query);
    return handleApiResponse(res, result);
  }
}

export default InterestController;
