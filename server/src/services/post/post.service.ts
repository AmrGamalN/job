import Post from "../../models/mongodb/post/post.model";
import {
  postDto,
  postAddDto,
  postUpdateDto,
  postAddDtoType,
  postUpdateDtoType,
} from "../../dto/post/post.dto";
import { warpAsync } from "../../utils/warpAsync";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
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
      const parsed = validateAndFormatData(data, postAddDto);
      await Post.create({ ...parsed.data, userId });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getPost = warpAsync(async (query: object): Promise<responseHandler> => {
    const getPost = await Post.findOne(query).lean();
    return validateAndFormatData(getPost, postDto);
  });

  getAllPosts = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const count = await this.countPost();
      return await PaginationGraphQl(
        Post,
        postDto,
        count.count ?? 0,
        args,
        info
      );
    }
  );

  updatePost = warpAsync(
    async (
      data: postUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(data, postUpdateDto, "update");
      if (!parsed.success) return parsed;

      const updatePost = await Post.updateOne(
        query,
        {
          $set: {
            ...parsed.data,
          },
        },
        {
          new: true,
        }
      );
      return serviceResponse({
        data: updatePost.matchedCount,
      });
    }
  );

  countPost = warpAsync(async (userId: string): Promise<responseHandler> => {
    return serviceResponse({
      count: await Post.countDocuments({ userId }),
    });
  });

  deletePost = warpAsync(async (query: object): Promise<responseHandler> => {
    return serviceResponse({
      deleteCount: (await Post.deleteOne(query)).deletedCount,
    });
  });

  searchWithHashtag = warpAsync(
    async (args: {
      page: number;
      limit: number;
      hashtag: string;
    }): Promise<responseHandler> => {
      const search = {
        hashtags: { $regex: args.hashtag, $options: "i" },
      };
      return await PaginationGraphQl(
        Post,
        postDto,
        0,
        { page: args.page, limit: args.limit },
        null,
        search
      );
    }
  );
}
export default PostService;
