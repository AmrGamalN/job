import { Request, Response } from "express";
import ReactionService from "../../services/post/reaction.service";
import { controllerResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { GraphQLResolveInfo } from "graphql";

class ReactionController {
  private static instance: ReactionController;
  private reactionService: ReactionService;
  constructor() {
    this.reactionService = ReactionService.getInstance();
  }
  static getInstance(): ReactionController {
    if (!ReactionController.instance) {
      ReactionController.instance = new ReactionController();
    }
    return ReactionController.instance;
  }

  async addReaction(req: Request, res: Response): Promise<Response> {
    const result = await this.reactionService.addReaction(
      req.query,
      req.params.id,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getReaction(req: Request, res: Response): Promise<Response> {
    const result = await this.reactionService.getReaction(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async getAllReactions(
    parent: any,
    args: {
      page: number;
      limit: number;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<Response> {
    const result = await this.reactionService.getAllReactions(args, info);
    return controllerResponse(context.res, result);
  }

  async updateReaction(req: Request, res: Response): Promise<Response> {
    const result = await this.reactionService.updateReaction(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async countReaction(req: Request, res: Response): Promise<Response> {
    const result = await this.reactionService.countReaction(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async deleteReaction(req: Request, res: Response): Promise<Response> {
    const result = await this.reactionService.deleteReaction(
      req.query,
      req.params.id
    );
    return controllerResponse(res, result);
  }
}

export default ReactionController;
