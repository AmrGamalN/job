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
import { generatePagination } from "../../utils/generatePagination.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";
import { generateLink } from "../../utils/generateUniqueLink.util";
import { PostFiltersType } from "../../types/post.types";
import { generateFilters } from "../../utils/generateFilters&Sort.util";

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
      const validationResult = validateAndFormatData({
        data,
        userDto: postAddDto,
      });
      const postLink = await generateLink("post/get-by-link");
      await Post.create({ ...validationResult.data, userId, postLink });
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getPost = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Post.findOne({ _id }).lean(),
      userDto: postDto,
    });
  });

  getAllPosts = warpAsync(
    async (
      queries: PostFiltersType,
      info: GraphQLResolveInfo,
      userId: string
    ): Promise<ServiceResponseType> => {
      const filters = generateFilters<PostFiltersType>(queries);
      const count = await this.countPost(userId, filters, true);
      return await generatePagination({
        model: Post,
        userDto: postDto,
        totalCount: count.count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        graphqlInfo: info,
      });
    }
  );

  countPost = warpAsync(
    async (
      userId: string,
      queries: PostFiltersType,
      filtered?: boolean
    ): Promise<ServiceResponseType> => {
      const filters = filtered
        ? queries
        : generateFilters<PostFiltersType>(queries);
      return serviceResponse({
        count: await Post.countDocuments({ userId, ...filters }),
      });
    }
  );

  updatePost = warpAsync(
    async (
      data: postUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: postUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updatePost = await Post.updateOne(
        query,
        {
          $set: {
            ...validationResult.data,
          },
        },
      );
      return serviceResponse({
        data: updatePost.matchedCount,
      });
    }
  );

  deletePost = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      return serviceResponse({
        deletedCount: (await Post.deleteOne(query)).deletedCount,
      });
    }
  );
}
export default PostService;
