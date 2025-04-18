import { Request, Response } from "express";
import CommentService from "../../services/post/comment.service";
import {
  controllerResponse,
  responseHandler,
} from "../../utils/responseHandler";
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
      req.params.postId,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getComment(req: Request, res: Response): Promise<Response> {
    const query = req.params.commentId
      ? { _id: req.params.commentId }
      : { userId: req.curUser?.userId };
    const result = await this.commentService.getComment(query);
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
  ): Promise<responseHandler> {
    const result = await this.commentService.getAllComments(args, info);
    if (!result.success) result;
    return result;
  }

  async updateComment(req: Request, res: Response): Promise<Response> {
    const query = req.params.commentId
      ? { _id: req.params.commentId }
      : { userId: req.curUser?.userId };
    const result = await this.commentService.updateComment(req.body, query);
    return controllerResponse(res, result);
  }

  async countComment(req: Request, res: Response): Promise<Response> {
    const result = await this.commentService.countComment(req.params.postId);
    return controllerResponse(res, result);
  }

  async deleteComment(req: Request, res: Response): Promise<Response> {
    const query = req.params.commentId
      ? { _id: req.params.commentId }
      : { userId: req.curUser?.userId };
    const result = await this.commentService.deleteComment(query);
    return controllerResponse(res, result);
  }
}

export default CommentController;
