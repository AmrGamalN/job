import Comment from "../../models/mongodb/post/comment.model";
import {
  commentDto,
  commentAddDto,
  commentUpdateDto,
  commentAddDtoType,
  commentUpdateDtoType,
} from "../../dto/post/comment.dto";
import { responseHandler, serviceResponse } from "../../utils/responseHandler";
import { warpAsync } from "../../utils/warpAsync";
import { validateAndFormatData } from "../../utils/validateAndFormatData";
import { GraphQLResolveInfo } from "graphql";
import Post from "../../models/mongodb/post/post.model";
import { PaginationGraphQl } from "../../utils/pagination";

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
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(data, commentAddDto);
      const comment = await Comment.create({
        ...parsed.data,
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

  getComment = warpAsync(async (query: object): Promise<responseHandler> => {
    const getComment = await Comment.findOne(query).lean();
    return validateAndFormatData(getComment, commentDto);
  });

  getAllComments = warpAsync(
    async (
      args: {
        page: number;
        limit: number;
      },
      info: GraphQLResolveInfo
    ): Promise<responseHandler> => {
      const count = await this.countComment();
      return await PaginationGraphQl(
        Post,
        commentDto,
        count.count ?? 0,
        args,
        info
      );
    }
  );

  updateComment = warpAsync(
    async (
      data: commentUpdateDtoType,
      query: object
    ): Promise<responseHandler> => {
      const parsed = validateAndFormatData(data, commentUpdateDto, "update");
      if (!parsed.success) return parsed;

      const updateComment = await Comment.updateOne(
        query,
        {
          $set: {
            ...parsed.data,
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

  countComment = warpAsync(async (postId: string): Promise<responseHandler> => {
    return serviceResponse({
      count: await Comment.countDocuments({ postId }),
    });
  });

  deleteComment = warpAsync(async (query: object): Promise<responseHandler> => {
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
  });
}

export default CommentService;
