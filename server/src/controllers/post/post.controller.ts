import { Request, Response } from "express";
import PostService from "../../services/post/post.service";
import {
  controllerResponse,
  responseHandler,
} from "../../utils/responseHandler";
import { GraphQLResolveInfo } from "graphql";

class PostController {
  private static instance: PostController;
  private postService: PostService;
  constructor() {
    this.postService = PostService.getInstance();
  }
  static getInstance(): PostController {
    if (!PostController.instance) {
      PostController.instance = new PostController();
    }
    return PostController.instance;
  }

  async addPost(req: Request, res: Response): Promise<Response> {
    const result = await this.postService.addPost(
      req.body,
      req.curUser?.userId
    );
    return controllerResponse(res, result);
  }

  async getPost(req: Request, res: Response): Promise<Response> {
    const query = req.params.postId
      ? { _id: req.params.postId }
      : { userId: req.curUser?.userId };
    const result = await this.postService.getPost(query);
    return controllerResponse(res, result);
  }

  async getAllPosts(
    parent: any,
    args: {
      page: number;
      limit: number;
    },
    context: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ): Promise<responseHandler> {
    const result = await this.postService.getAllPosts(args, info);
    if (!result.success) result;
    return result;
  }

  async updatePost(req: Request, res: Response): Promise<Response> {
    const query = req.params.postId
      ? { _id: req.params.postId }
      : { userId: req.curUser?.userId };
    const result = await this.postService.updatePost(req.body, query);
    return controllerResponse(res, result);
  }

  async countPost(req: Request, res: Response): Promise<Response> {
    const result = await this.postService.countPost(req.curUser?.userId);
    return controllerResponse(res, result);
  }

  async deletePost(req: Request, res: Response): Promise<Response> {
    const query = req.params.postId
      ? { _id: req.params.postId }
      : { userId: req.curUser?.userId };
    const result = await this.postService.deletePost(query);
    return controllerResponse(res, result);
  }
}

export default PostController;
