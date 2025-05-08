import { GraphQLResolveInfo } from "graphql";
import Post from "../../models/mongodb/post/post.model";
import Comment from "../../models/mongodb/post/comment.model";
import {
  commentDto,
  commentAddDto,
  commentUpdateDto,
  commentAddDtoType,
  commentUpdateDtoType,
} from "../../dto/post/comment.dto";
import { generatePagination } from "../../utils/generatePagination.util";
import { warpAsync } from "../../utils/warpAsync.util";
import { serviceResponse } from "../../utils/response.util";
import { validateAndFormatData } from "../../utils/validateData.util";
import { ServiceResponseType } from "../../types/response.type";

class CommentService {
  private static instanceService: CommentService;
  public static getInstance(): CommentService {
    if (!CommentService.instanceService) {
      CommentService.instanceService = new CommentService();
    }
    return CommentService.instanceService;
  }

  addComment = warpAsync(
    async (
      data: commentAddDtoType,
      postId: string,
      userId: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: commentAddDto,
      });

      const comment = await Comment.create({
        ...validationResult.data,
        postId,
        userId,
      });
      await Post.updateOne(
        { _id: postId },
        {
          $addToSet: {
            commentId: comment._id,
          },
          $inc: {
            commentCount: 1,
          },
        }
      );
      return serviceResponse({
        statusText: "Created",
      });
    }
  );

  getComment = warpAsync(async (_id: string): Promise<ServiceResponseType> => {
    return validateAndFormatData({
      data: await Comment.findOne({ _id }).lean(),
      userDto: commentDto,
    });
  });

  getAllComments = warpAsync(
    async (
      queries: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<ServiceResponseType> => {
      return await generatePagination({
        model: Comment,
        userDto: commentDto,
        totalCount: (await this.countComment()).count,
        paginationOptions: {
          page: queries.page,
          limit: queries.limit,
        },
        graphqlInfo: info,
      });
    }
  );

  updateComment = warpAsync(
    async (
      data: commentUpdateDtoType,
      _id: string
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData({
        data,
        userDto: commentUpdateDto,
        actionType: "update",
      });
      if (!validationResult.success) return validationResult;

      const updateComment = await Comment.updateOne(
        { _id },
        {
          $set: {
            ...validationResult.data,
            isEdited: true,
          },
        },
      );
      return serviceResponse({
        data: updateComment.matchedCount,
      });
    }
  );

  countComment = warpAsync(
    async (postId: string): Promise<ServiceResponseType> => {
      return serviceResponse({
        count: await Comment.countDocuments({ postId }),
      });
    }
  );

  deleteComment = warpAsync(
    async (_id: string): Promise<ServiceResponseType> => {
      const deleteComment = await Comment.findOneAndDelete({ _id })
        .lean()
        .select({ _id: 1, postId: 1 });
      if (!deleteComment)
        return serviceResponse({
          data: deleteComment,
        });

      await Post.updateOne(
        { _id: deleteComment.postId },
        {
          $pull: {
            commentId: deleteComment._id,
          },
          $inc: {
            commentCount: -1,
          },
        }
      );
      return serviceResponse({
        statusText: "OK",
      });
    }
  );
}

export default CommentService;
