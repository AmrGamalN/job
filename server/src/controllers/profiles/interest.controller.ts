import { Request, Response } from "express";
import InterestService from "../../services/profiles/interest.service";
import { controllerResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
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
    args: { id: string; ownerType: string },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const query = args.id
      ? { _id: args.id, ownerType: args.ownerType }
      : { userId: context.req.curUser?.userId, ownerType: args.ownerType };
    const result = await this.interestService.getInterest(query, info);
    if (!result.success) return result;
    return result;
  }

  async updateInterest(req: Request, res: Response): Promise<Response> {
    const result = await this.interestService.updateInterest(
      req.body,
      req.body.id,
      req.query.ownerType
    );
    return controllerResponse(res, result);
  }

  async deleteInterest(req: Request, res: Response): Promise<Response> {
    const result = await this.interestService.deleteInterest(
      req.body,
      req.body.id,
      req.query.ownerType
    );
    return controllerResponse(res, result);
  }
}

export default InterestController;
