import { Request, Response } from "express";
import InterestService from "../../services/client/interest.service";
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
    args: { id: string },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const result = await this.interestService.getInterest(
      context.req.body.data,
      context.req.curUser.role
    );
    if (!result.success) return result;
    return result;
  }

  async updateInterest(req: Request, res: Response): Promise<Response> {
    const result = await this.interestService.updateInterest(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async deleteInterest(req: Request, res: Response): Promise<Response> {
    const result = await this.interestService.deleteInterest(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  }
}

export default InterestController;
