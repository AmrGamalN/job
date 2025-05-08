import { Request, Response } from "express";
import CommentService from "../../services/post/comment.service";
import { controllerResponse } from "../../utils/response.util";
import { ServiceResponseType } from "../../types/response.type";
import { GraphQLResolveInfo } from "graphql";

class CommentController {
  private static instance: CommentController;
  private commentService: CommentService;
  constructor() {
    this.commentService = CommentService.getInstance();
  }
  static getInstance(): CommentController {
    if (!CommentController.instance) {
      CommentController.instance = new CommentController();
    }
    return CommentController.instance;
  }

  async addComment(req: Request, res: Response): Promise<Response> {
    const result = await this.commentService.addComment(
      req.body,
      req.params.id,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getComment(req: Request, res: Response): Promise<Response> {
    const result = await this.commentService.getComment(req.params.id);
    return controllerResponse(res, result);
  }

  async getAllComments(
    parent: any,
    args: {
      page: number;
      limit: number;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<ServiceResponseType> {
    const result = await this.commentService.getAllComments(args, info);
    if (!result.success) result;
    return result;
  }

  async updateComment(req: Request, res: Response): Promise<Response> {
    const result = await this.commentService.updateComment(
      req.body,
      req.params.id
    );
    return controllerResponse(res, result);
  }

  async countComment(req: Request, res: Response): Promise<Response> {
    const result = await this.commentService.countComment(req.params.id);
    return controllerResponse(res, result);
  }

  async deleteComment(req: Request, res: Response): Promise<Response> {
    const result = await this.commentService.deleteComment(req.params.id);
    return controllerResponse(res, result);
  }
}

export default CommentController;
