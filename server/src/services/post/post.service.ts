import Post from "../../models/mongodb/post/post.model";
import {
  postDto,
  postAddDto,
  postUpdateDto,
  postAddDtoType,
  postUpdateDtoType,
} from "../../dto/post/post.dto";
import { warpAsync } from "../../utils/warpAsync";
import {
  OK,
  NotFound,
  BadRequest,
  responseHandler,
} from "../../utils/responseHandler";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import { PaginationGraphQl } from "../../utils/pagination";

class PostService {
  private static instanceService: PostService;
  public static getInstance(): PostService {
    if (!PostService.instanceService) {
      PostService.instanceService = new PostService();
    }
    return PostService.instanceService;
  }

  addPost = warpAsync(
    async (data: postAddDtoType, userId: string): Promise<responseHandler> => {
      const parseSafe = validateAndFormatData(data, postAddDto);
      await Post.create({ ...parseSafe.data, userId });
      return OK("Add post", parseSafe.data);
    }
  );

  getPost = warpAsync(async (query: object): Promise<responseHandler> => {
    const getPost = await Post.findOne(query).lean();
    if (!getPost) return NotFound("Post");
    const parseSafe = validateAndFormatData(getPost, postDto);
    if (!parseSafe.success) return parseSafe;
    return OK("Get post", parseSafe.data);
  });

  getAllPosts = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const getPosts = await PaginationGraphQl(
        args.page,
        args.limit,
        info,
        Post
      );
      if (!getPosts.length) return NotFound("Posts");

      const parseSafe = validateAndFormatData(getPosts, postDto, "getAll");
      if (!parseSafe.success) return parseSafe;

      const countPost = await this.countPost();
      if (!countPost.count) return countPost;
      return OK("Get posts", parseSafe.data, countPost.count);
    }
  );

  updatePost = warpAsync(
    async (
      data: postUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      if (Object.keys(data).length === 0) return BadRequest();

      const parseSafe = validateAndFormatData(data, postUpdateDto);
      if (!parseSafe.success) return parseSafe;

      const updatePost = await Post.updateOne(
        query,
        {
          $set: {
            ...parseSafe.data,
          },
        },
        {
          new: true,
        }
      );

      if (!updatePost.matchedCount) return NotFound("Post");
      return OK("Update post", updatePost);
    }
  );

  countPost = warpAsync(async (userId: string): Promise<responseHandler> => {
    const countPosts = await Post.countDocuments({ userId });
    if (countPosts === 0) return NotFound("Post");
    return OK("Count post", null, countPosts);
  });

  deletePost = warpAsync(async (query: object): Promise<responseHandler> => {
    const deletePost = await Post.deleteOne(query);
    if (!deletePost.deletedCount) return NotFound("Post");
    return OK("Delete post");
  });
}
export default PostService;
