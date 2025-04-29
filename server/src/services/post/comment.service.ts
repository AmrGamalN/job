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
import { paginate } from "../../utils/pagination.util";
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
      const validationResult = validateAndFormatData(data, commentAddDto);
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

  getComment = warpAsync(
    async (query: object): Promise<ServiceResponseType> => {
      const getComment = await Comment.findOne(query).lean();
      return validateAndFormatData(getComment, commentDto);
    }
  );

  getAllComments = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<ServiceResponseType> => {
      const count = await this.countComment();
      return await paginate(Post, commentDto, count.count ?? 0, args, info);
    }
  );

  updateComment = warpAsync(
    async (
      data: commentUpdateDtoType,
      query: object
    ): Promise<ServiceResponseType> => {
      const validationResult = validateAndFormatData(
        data,
        commentUpdateDto,
        "update"
      );
      if (!validationResult.success) return validationResult;

      const updateComment = await Comment.updateOne(
        query,
        {
          $set: {
            ...validationResult.data,
            isEdited: true,
          },
        },
        {
          new: true,
        }
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
    async (query: object): Promise<ServiceResponseType> => {
      const deleteComment = await Comment.findOneAndDelete(query)
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
