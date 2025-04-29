import { GraphQLResolveInfo } from "graphql";
import Post from "../../models/mongodb/post/post.model";
import {
  postDto,
  postAddDto,
  postUpdateDto,
  postAddDtoType,
  postUpdateDtoType,
} from "../../dto/post/post.dto";
import { warpAsync } from "../../utils/warpAsync.util";
import { paginate } from "../../utils/pagination.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";

class PostService {
  private static instanceService: PostService;
  public static getInstance(): PostService {
    if (!PostService.instanceService) {
      PostService.instanceService = new PostService();
    }
    return PostService.instanceService;
  }

  addPost = warpAsync(
    async (
      data: postAddDtoType,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(data, postAddDto);
      await Post.create({ ...validationResult.data, userId });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getPost = warpAsync(async (query: object): Promise<ServiceResponseType> => {
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
    ): Promise<ServiceResponseType> => {
      const count = await this.countPost();
      return await paginate(Post, postDto, count.count ?? 0, args, info);
    }
  );

  updatePost = warpAsync(
    async (
      data: postUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        data,
        postUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updatePost = await Post.updateOne(
        query,
        {
          $set: {
            ...validationResult.data,
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

  countPost = warpAsync(
    async (userId: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Post.countDocuments({ userId }),
      });
    }
  );

  deletePost = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      return serviceResponse({
        deleteCount: (await Post.deleteOne(query)).deletedCount,
      });
    }
  );

  searchWithHashtag = warpAsync(
    async (args: {
      page: number;
      limit: number;
      hashtag: string;
    }): Promise<ServiceResponseType> => {
      const search = {
        hashtags: { $regex: args.hashtag, $options: "i" },
      };
      return await paginate(
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
